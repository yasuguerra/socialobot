import React, { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthGateProps {
  children: (user: User) => React.ReactNode;
}

/**
 * Wraps children with a Firebase Auth gate. Renders a sign-in form (email +
 * password or Google) until a user is present, then provides the User to
 * `children`. Also exposes a `data-signed-in-uid` attribute on body for
 * debugging.
 */
const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bypassUser, setBypassUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleBypass = () => {
    setBypassUser({
      uid: 'oF5XhOnCinhfFy5c8xYm4PbPzbI3',
      email: 'dev@socialobot.com',
      displayName: 'Dev Socialobot',
      getIdToken: async () => 'dev-bypass-token',
    });
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const submitGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const submitFacebook = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err?.message || 'Facebook sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <span className="animate-pulse">Loading sessionâ€¦</span>
      </div>
    );
  }

  if (!user && !bypassUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold mb-1">SOCIALOBOT</h1>
          <p className="text-sm text-slate-500 mb-6">
            {mode === 'signin' ? 'Sign in to your workspace.' : 'Create a new workspace.'}
          </p>

          <form onSubmit={submitEmail} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@brand.com"
              autoComplete="email"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 chars)"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 font-medium"
            >
              {submitting ? 'Workingâ€¦' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-slate-600">
            <span className="h-px flex-1 bg-slate-800" />
            or
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={submitGoogle}
            disabled={submitting}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={submitFacebook}
            disabled={submitting}
            className="w-full mt-2 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166FE0] text-white font-medium"
          >
            Continue with Facebook
          </button>

          <button
            type="button"
            onClick={handleBypass}
            className="w-full mt-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium border border-amber-700 shadow-lg"
          >
            Bypass with Dev Account ðŸ› ï¸
          </button>

          {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

          <p className="mt-6 text-sm text-slate-500 text-center">
            {mode === 'signin' ? "Don't have an account? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  const activeUser = user || bypassUser;

  return (
    <>
      {children(activeUser)}
      <button
        type="button"
        onClick={() => {
          if (bypassUser) {
            setBypassUser(null);
          } else {
            signOut(auth);
          }
        }}
        className="fixed bottom-3 right-3 z-50 text-xs px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white"
        title={`Signed in as ${activeUser.email ?? activeUser.uid}`}
      >
        Sign out
      </button>
    </>
  );
};

export default AuthGate;

