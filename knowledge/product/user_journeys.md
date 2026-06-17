# Socialobot — Core User Journeys

This document defines the main flows (User Journeys) experienced by end customers when interacting with Socialobot, serving as a guide for Product, Engineering, and Marketing teams.

---

## 1. B2B Wholesale Flow (Physical Products)
**Actor:** B2B Buyer / Distributor
**Channel:** WhatsApp
1. **Intent:** The buyer writes via WhatsApp asking for the catalog or wholesale prices.
2. **Authentication (Passwordless):** Socialobot verifies if the number is registered. If approved, it generates and sends a unique encrypted link (`/catalog?token=xyz`).
3. **Exploration:** The buyer opens the link on their mobile device. The system hides absolute inventory (shows "Available") and applies the "Price B" (Wholesale) rate.
4. **Multi-item Cart:** The buyer adds several boxes/pallets to the cart and confirms.
5. **Quote:** Socialobot calculates shipping cost based on the zone, generates a proforma invoice in PDF (PDFKit), and sends it directly via WhatsApp.
6. **Closing:** Socialobot attaches a Wompi/Stripe payment link or bank transfer instructions.

---

## 2. Private Aviation Flow (Pre-Booking Cascade)
**Actor:** High-value Client (Charter Flight)
**Channel:** Web Widget / WhatsApp
1. **Silent Quote:** The client asks for a flight to Bocas del Toro. Socialobot checks availability on Google Calendar without alerting pilots yet, quotes, and offers the price.
2. **Firm Intent:** The client says "I want to book". Socialobot provisionally blocks the aircraft in "Pre-reservation" status.
3. **Cascade Dispatch:** Socialobot internally notifies Pilot A via WhatsApp. If Pilot A doesn't respond in 15 minutes, the notification jumps to Pilot B.
4. **Approval & Payment:** Pilot A presses "Accept flight". Immediately, Socialobot sends the client a secure payment link for a 50% deposit, with a 30-minute expiration.

---

## 3. E-Commerce Retail Flow (Direct Sales)
**Actor:** Final Consumer
**Channel:** Web Widget
1. **Recommendation:** The client enters the website and asks the chat: *"I'm looking for running shoes under $100"*.
2. **Semantic Search:** Socialobot uses RAG (Vertex AI + pgvector) to find products matching the intent and presents them visually in the chat.
3. **Objection Handling:** The client asks about the return policy. Socialobot answers using the information stored in the Knowledge Base.
4. **Checkout:** The client decides to buy. Socialobot generates the order, asks for the address, and issues a direct payment link (Stripe). After payment, Socialobot updates the status to "Paid" and notifies the store owner.
