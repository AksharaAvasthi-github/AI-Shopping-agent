import { Link } from "react-router-dom";

export default function SignupPage() {

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#171717] border border-gray-800 rounded-3xl p-8">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Create Account
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-[#1f1f1f] rounded-xl px-4 py-4 outline-none"
          />

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
            Sign Up
          </button>

        </div>

        <p className="text-gray-400 text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-white font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}