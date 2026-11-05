
'use client';

import { useEffect, useState } from 'react';
import {
  FaGithub,
  FaLinkedinIn,
  FaRegUser,
} from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from 'react-icons/fa6';
import { TiMessages } from 'react-icons/ti';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';

import API from '@/lib/axios';

interface ErrorList {
  username?: string[];
  email?: string[];
  password?: string[];
  detail?: string;
}

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (Cookies.get('access')) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim() || !username.trim() || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/api/auth/register/', {
        email: email.trim(),
        username: username.trim(),
        password,
      });

      if (res.status === 201 || res.status === 200) {
        toast.success('Account created successfully! Please login.');
        router.push('/login');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as ErrorList | undefined;

        const message =
          data?.username?.[0] ||
          data?.email?.[0] ||
          data?.password?.[0] ||
          data?.detail ||
          'Registration failed';

        toast.error(message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/accounts/google/login/`;
  };

  return (
    <main className="relative isolate min-h-screen w-full overflow-x-hidden overflow-y-auto bg-(--color-bg) text-(--color-text) md:overflow-y-hidden">

      {/* Same forest background as Login page */}
      <Image
        src="/1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover opacity-40"
      />

      {/* Dark forest overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-(--color-overlay)" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#101813]/60 via-transparent to-[#101813]/80" />

      <Toaster position="top-right" richColors closeButton />

      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2">

        {/* Left: Branding */}
        <section className="relative hidden flex-col justify-between p-10 md:flex lg:p-14">

          <Link
            href="/"
            aria-label="Linklet home"
            className="flex w-fit items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-primary) text-(--color-primary-text) shadow-lg">
              <TiMessages size={29} />
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Linklet
            </span>
          </Link>

          <div className="max-w-xl py-10">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-(--color-primary)">
              A better way to connect
            </p>

            <h1 className="text-5xl font-bold leading-[1.12] tracking-tight lg:text-7xl">
              Join the
              <span className="mt-2 block text-(--color-primary)">
                Circle.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base font-light leading-7 text-(--color-text-muted) lg:text-lg">
              Create an account and start connecting.
              Your people are just a message away.
            </p>

            <div className="mt-9 flex items-center gap-3 text-sm text-(--color-text-muted)">
              <span className="h-px w-10 bg-(--color-primary)" />
              Simple conversations. Meaningful connections.
            </div>
          </div>

          {/* Developer links */}
          <div className="flex flex-wrap items-center justify-between gap-5">
            <a
              href="https://harshalpatil.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
            >
              Know about Developer
            </a>

            <nav
              aria-label="Developer social links"
              className="flex items-center gap-1 rounded-full border border-(--color-border) bg-(--color-surface) p-2 backdrop-blur-xl"
            >
              <a
                href="https://github.com/harshalpatil2809"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-full p-3 text-(--color-text-muted) transition-colors hover:bg-white/10 hover:text-(--color-primary)"
              >
                <FaGithub size={19} />
              </a>

              <a
                href="https://www.linkedin.com/in/harshal-patil-56a0b2293/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-full p-3 text-(--color-text-muted) transition-colors hover:bg-white/10 hover:text-(--color-primary)"
              >
                <FaLinkedinIn size={19} />
              </a>

              <a
                href="https://x.com/Patil_Harshal_5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="rounded-full p-3 text-(--color-text-muted) transition-colors hover:bg-white/10 hover:text-(--color-primary)"
              >
                <FaXTwitter size={19} />
              </a>

              <a
                href="https://harshalpatil.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Developer portfolio"
                className="rounded-full p-3 text-(--color-text-muted) transition-colors hover:bg-white/10 hover:text-(--color-primary)"
              >
                <FaRegUser size={19} />
              </a>
            </nav>
          </div>
        </section>

        {/* Right: Registration form */}
        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 md:px-6 lg:px-12">

          <div className="w-full max-w-md rounded-(--radius-card) border border-(--color-border) bg-(color-surface) p-6 shadow-(--shadow-card) backdrop-blur-2xl sm:p-9 lg:p-10">

            {/* Mobile branding */}
            <Link
              href="/"
              aria-label="Linklet home"
              className="mb-7 flex w-fit items-center gap-3 md:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-primary) text-(--color-primary-text)">
                <TiMessages size={27} />
              </span>

              <span className="text-xl font-bold">Linklet</span>
            </Link>

            {/* Heading */}
            <div className="mb-7 space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create Account
              </h2>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-(--color-text-muted)"
                >
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-(--radius-input) border border-(--color-border) bg-(--color-input-bg) px-4 transition-colors focus-within:border-(--color-border-focus) focus-within:ring-2 focus-within:ring-(--color-primary)/15">
                  <Mail
                    size={17}
                    className="shrink-0 text-(--color-text-subtle)"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-(--color-text-subtle)"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-(--color-text-muted)"
                >
                  Username
                </label>

                <div className="flex items-center gap-3 rounded-(--radius-input) border border-(--color-border) bg-(--color-input-bg) px-4 transition-colors focus-within:border-(--color-border-focus) focus-within:ring-2 focus-within:ring-(--color-primary)/15">
                  <FaRegUser
                    size={16}
                    className="shrink-0 text-(--color-text-subtle)"
                  />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    required
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-(--color-text-subtle)"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-(--color-text-muted)"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-(--radius-input) border border-(--color-border) bg-(--color-input-bg) px-4 transition-colors focus-within:border-(--color-border-focus) focus-within:ring-2 focus-within:ring-(--color-primary)/15">
                  <LockKeyhole
                    size={17}
                    className="shrink-0 text-(--color-text-subtle)"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-(--color-text-subtle)"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="shrink-0 rounded-md p-1 text-(--color-text-subtle) transition-colors hover:text-(--color-primary)"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="text-xs text-(--color-text-subtle)">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Create account */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-(--radius-button) bg-(--color-primary) px-5 py-4 font-semibold text-(--color-primary-text) shadow-(--shadow-button) transition-all duration-200 hover:bg-(--color-primary-hover) active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-(--color-border)" />

              <span className="text-xs text-(--color-text-subtle)">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-(--color-border)" />
            </div>

            {/* Google registration */}
            <button
              type="button"
              onClick={googleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-(--radius-button) border border-(--color-border) bg-white px-5 py-4 font-semibold text-[#202520] transition-colors hover:bg-[#EAF0E9] active:scale-[0.99]"
            >
              <FcGoogle size={19} />
              Sign up with Google
            </button>

            {/* Login link */}
            <p className="mt-6 text-center text-sm leading-6 text-(--color-text-muted)">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-(--color-primary) underline-offset-4 transition-colors hover:text-(--color-primary-hover) hover:underline"
              >
                Login here
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
