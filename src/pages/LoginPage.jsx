import { Link } from "react-router-dom";

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#171717] border border-gray-800 rounded-3xl p-8">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome Back
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#1f1f1f] rounded-xl px-4 py-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#1f1f1f] rounded-xl px-4 py-4 outline-none"
          />

          <button className="w-full bg-white text-black py-4 rounded-xl font-semibold">
            Login
          </button>

        </div>

        <p className="text-gray-400 text-center mt-6">

          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="text-white font-semibold"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}