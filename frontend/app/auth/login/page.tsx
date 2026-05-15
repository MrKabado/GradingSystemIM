"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(process.env.NEXT_PUBLIC_BACKEND_API);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/login`, { email, password });
      
      if (!res) {
        toast.error("Error something went wrong");
        return;
      }

      toast.success(res.data.message);
      setTimeout(() => {
        router.push('/pages/dashboard')
      }, 2000);
        
    } catch (err) {
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <div className="relative gs-primary-bg h-screen flex items-center justify-center">
      
      <div
        className="gs-card rounded-2xl text-white min-w-sm flex flex-col justify-center items-center gap-5 py-5 px-6
        shadow-[0_2px_100px_5px_rgba(0,0,0,0.25)]"
      >
        {/* HEADER */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="bg-[#6366F1] rounded-md w-fit px-3 py-2">
            <h1 className="text-lg font-bold">GS</h1>
          </div>

          <h1 className="text-xl font-semibold">GradeSync</h1>
          <p className="text-[#6B7280] text-sm">Administrator Portal</p>
        </div>

        {/* ERRORS */}
        {errors.length > 0 && (
          <div className="absolute top-4 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <ul>
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-2">
          <div>
            <h1 className="text-xl font-semibold">Sign in</h1>
            <p className="text-[#6B7280] text-sm">
              Access the admin dashboard
            </p>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col text-[#6B7280] gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="juan@email.com"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="gs-primary-text bg-[#22273D] px-4 py-2 rounded-lg placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#545878]"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col text-[#6B7280] gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="******"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="gs-primary-text bg-[#22273D] px-4 py-2 rounded-lg placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#545878]"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-[#6366F1] py-2 rounded-2xl mt-2 mb-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
