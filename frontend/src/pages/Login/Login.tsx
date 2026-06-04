import { useState } from "react";
import { login } from "../../services/api/api";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      onLogin();
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-teal-800 flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            FOBOH
          </h1>
        </div>
        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Smarter wholesale,
            <br />
            less waste.
          </h2>
          <p className="text-teal-200 text-base leading-relaxed">
            AI-driven pricing profiles that help food and beverage wholesalers
            scale sustainably and get paid faster.
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-white text-2xl font-bold">3,570+</p>
            <p className="text-teal-300 text-sm">Invoices processed</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">99%</p>
            <p className="text-teal-300 text-sm">Uptime</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">12%</p>
            <p className="text-teal-300 text-sm">Revenue growth</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <h1 className="text-teal-700 text-2xl font-bold">FOBOH</h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your FOBOH account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="admin@foboh.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Credentials hint */}
          <div className="mt-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-500 font-medium mb-1">
              Demo credentials:
            </p>
            <p className="text-xs text-gray-500">Email: admin@foboh.com</p>
            <p className="text-xs text-gray-500">Password: foboh2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
