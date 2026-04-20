'use client'

import { FaGithub, FaLinkedinIn, FaRegUser, FaGoogle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TiMessages } from "react-icons/ti";
import Link from "next/link";
import { useState } from "react";
import API from "@/lib/axios";
import { setTokens } from "@/lib/auth"; 
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner"


const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const scaleup = `hover:scale-110 duration-700`

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!username || !password) {
    toast.error("Please enter username and password");
    return;
  }

  setLoading(true);

  try {
    const res = await API.post('/api/auth/login/', { username, password });

    // ✅ Check status code
    if (res.status === 200) {
      if (res.data?.access && res.data?.refresh) {
        setTokens(res.data.access, res.data.refresh);
        toast.success("Login Successfull...")
        router.push('/dashboard');
      } else {
        toast.error("Login failed: Tokens not received");
      }

    } else {
      toast.error("Unexpected response from server");
    }

  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.detail || "Login failed";
      if (status === 401) {
        toast.error("Invalid username or password");
      } else {
        toast.error(message);
      }
    } else {
      toast.error("Network error. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

function Google_Login() {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/accounts/google/login/`
    }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-[#0F0D11] text-white">
      <Toaster position="top-right" />
      {/* Left Side - Visuals */}
      <div className="relative min-h-screen w-full md:w-1/2 overflow-hidden bg-[linear-gradient(135deg,#0F0D11_0%,#150524_25%,#200048_60%,#2A006A_100%)] hidden md:block">
        <div className="absolute top-80 left-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-52 h-52 rounded-full bg-indigo-500/20 blur-3xl "></div>
        <div className="absolute -top-20 -right-5 w-80 h-80 rounded-full bg-[#43237A]/50 blur-3xl"></div>

        <div className="flex gap-3 pt-12 pl-16 items-center">
          <span className="bg-[#BA9EFF] p-2 rounded-xl shadow-[0_0_20px_rgba(186,158,255,0.4)]">
            <TiMessages size={26} color="black" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Linklet</h1>
        </div>

        <div className="text-8xl mt-24 ml-16 font-bold leading-tight">
          <h1>Welcome</h1>
          <h1 className="text-[#BA9EFF]">Back!</h1>
        </div>

        <p className="mt-6 ml-16 text-xl text-white/60 font-light">Connect instantly. Chat effortlessly.</p>

        {/* Social Links */}
        <div className="absolute bottom-16 ml-16 flex flex-col gap-4">
          <h2 className="text-lg font-medium text-white/80">Know about Developer</h2>
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/10 w-fit px-6 py-3 rounded-full">
            <Link href='https://github.com/harshalpatil2809' target="_balnk"><FaGithub size={22} className={`${scaleup} text-white/80 hover:text-white`}/></Link>
            <Link href='https://www.linkedin.com/in/harshal-patil-56a0b2293/' target="_blank"><FaLinkedinIn size={22} className={`${scaleup} text-white/80 hover:text-white`}/></Link>
            <Link href='https://x.com/Patil_Harshal_5' target="_blank"><FaXTwitter size={22} className={`${scaleup} text-white/80 hover:text-white`}/></Link>
            <Link href='https://harshalpatil.vercel.app/' target="_blank"><FaRegUser size={22} className={`${scaleup} text-white/80 hover:text-white`}/></Link>
          </div>
        </div>
      </div>

      {/* Right Side - Login Portal */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center p-8 bg-[#0F0D11]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:hidden mb-8">
            <h1 className="text-4xl font-bold text-[#BA9EFF]">Linklet</h1>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Login Portal</h1>
            <p className="text-white/50">Enter your details to access your account</p>
          </div>

          <form onSubmit={(e)=>{handleSubmit(e)}} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Username</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#BA9EFF] focus:ring-1 focus:ring-[#BA9EFF] transition-all"
                placeholder="Username"
                value={username} 
                onChange={(e)=>setUsername(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#BA9EFF] focus:ring-1 focus:ring-[#BA9EFF] transition-all"
                placeholder="Password"
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#BA9EFF] text-black font-bold py-4 rounded-2xl hover:bg-[#a686ff] transition-colors shadow-[0_0_20px_rgba(186,158,255,0.2)] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </form>

          <div className="relative flex items-center py-4">
            <div className="grow border-t border-white/10"></div>
            <span className="shrink mx-4 text-white/30 text-sm italic">or continue with</span>
            <div className="grow border-t border-white/10"></div>
          </div>

          <button onClick={Google_Login} className="w-full bg-white text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all transform active:scale-95">
            <FaGoogle size={20} />
            Login with Google
          </button>

          <p className="text-center text-white/50 text-sm">
            Don&apos;t have an account? <Link href="/register" className="text-[#BA9EFF] hover:underline font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;