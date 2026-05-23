import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { login } from "../actions";

export const metadata = {
  title: "Login | Kaneera by Aashi",
  description: "Sign in to your Kaneera account.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const params = await searchParams;
  const error = params?.error;
  const message = params?.message;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-2xl border border-charcoal/5">
        <div>
          <h2 className="mt-2 text-center font-serif text-3xl font-bold tracking-tight text-charcoal">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate font-light">
            Sign in to access your orders and saved items.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-rose-gold p-4 mt-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4">
            <p className="text-sm text-green-700">{message}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" action={login}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full appearance-none border-b border-charcoal/20 bg-transparent px-3 py-3 text-charcoal placeholder-slate/40 focus:border-rose-gold focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">
                  Password
                </label>
                <Link href="#" className="text-xs font-medium text-slate hover:text-rose-gold transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full appearance-none border-b border-charcoal/20 bg-transparent px-3 py-3 text-charcoal placeholder-slate/40 focus:border-rose-gold focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative flex w-full justify-center rounded-none bg-charcoal px-3 py-4 text-sm tracking-widest uppercase text-white hover:bg-rose-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal transition-colors duration-300"
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate font-light">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-charcoal hover:text-rose-gold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
