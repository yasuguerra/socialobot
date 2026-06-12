import { promises as dns } from "dns";
import { load } from "cheerio";

/**
 * Fetches the given URL and extracts a compact brand-summary text block we can
 * feed into Gemini. Skips scripts/styles. SSRF-hardened by rejecting
 * non-http(s) schemes and private/loopback hosts.
 */
export interface ScrapedSite {
  url: string;
  title: string;
  description: string;
  headings: string[];
  bodyText: string; // truncated
}

const MAX_BYTES = 1_500_000; // 1.5 MB
const FETCH_TIMEOUT_MS = 8_000;
const BODY_TEXT_LIMIT = 12_000;

/**
 * Asserts that the given URL is safe to fetch, mitigating SSRF (Server-Side Request Forgery)
 * by verifying the protocol and resolving the hostname via DNS lookup to check if the
 * resolved IP address belongs to any private or loopback IP range.
 *
 * @param {string} raw - The raw URL string to validate.
 * @returns {Promise<{ url: URL; ip: string }>} The parsed and verified URL object with its resolved IP.
 * @throws {Error} If URL is malformed, has unsupported protocol, or resolves to a private address.
 */
async function assertSafeUrl(raw: string): Promise<{ url: URL; ip: string }> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("Invalid URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http(s) URLs are supported");
  }
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    host === "::1"
  ) {
    throw new Error("URL points to a private/loopback address");
  }

  // Resolve hostname DNS records to check for SSRF bypasses like DNS rebinding
  let ip: string;
  try {
    const lookup = await dns.lookup(host);
    ip = lookup.address;
  } catch (err: any) {
    throw new Error(`Failed to resolve site host: ${err.message || err}`);
  }

  // Validate the resolved IP against private IP spaces
  if (
    ip === "127.0.0.1" ||
    ip === "0.0.0.0" ||
    ip === "::1" ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^169\.254\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
    /^fc00:/i.test(ip) ||
    /^fe80:/i.test(ip)
  ) {
    throw new Error("URL resolves to a private/loopback address");
  }

  return { url: u, ip };
}

export async function scrapeWebsite(rawUrl: string): Promise<ScrapedSite> {
  let currentUrl = rawUrl;
  let hops = 0;
  const maxHops = 5;
  let res: Response | null = null;
  let finalUrl: URL | null = null;

  while (hops < maxHops) {
    const { url } = await assertSafeUrl(currentUrl);
    finalUrl = url;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    
    try {
      res = await fetch(url.toString(), {
        headers: {
          "User-Agent": "SocialFlowBot/1.0 (+https://socialobot.app)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: ctrl.signal,
        redirect: "manual", // Prevent automatic redirect following to audit security of each hop
      });
    } catch (err: any) {
      throw new Error(`Fetch failed: ${err.message || err}`);
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) {
        throw new Error(`HTTP ${res.status} redirect missing location header`);
      }
      // Resolve redirect location relative to current URL
      const redirectUrl = new URL(location, url.toString());
      currentUrl = redirectUrl.toString();
      hops++;
    } else {
      break;
    }
  }

  if (!res) {
    throw new Error("Failed to fetch site: no response");
  }

  if (hops >= maxHops) {
    throw new Error("Too many redirects (max 5 hops)");
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${finalUrl!.host}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("html")) {
    throw new Error(`Unsupported content-type: ${contentType}`);
  }

  // Cap response size.
  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) {
    throw new Error(`Page too large: ${buf.byteLength} bytes`);
  }
  const html = new TextDecoder("utf-8").decode(buf);

  const $ = load(html);
  $("script, style, noscript, iframe, svg").remove();

  const title = $("title").first().text().trim().slice(0, 300);
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "";

  const headings: string[] = [];
  $("h1, h2, h3").each((_: number, el) => {
    const t = $(el).text().trim().replace(/\s+/g, " ");
    if (t) headings.push(t.slice(0, 200));
  });

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, BODY_TEXT_LIMIT);

  return {
    url: finalUrl ? finalUrl.toString() : rawUrl,
    title,
    description: description.slice(0, 600),
    headings: headings.slice(0, 40),
    bodyText,
  };
}
