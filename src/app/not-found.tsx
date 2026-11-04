
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Home,
    Search,
    MessageCircle,
} from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F0F0F] px-6 py-10 text-[#F5F5F0]">

            {/* Background decorations */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#8FB59A]/10 blur-[120px]" />

            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#8FB59A]/10 blur-[120px]" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">

                {/* Logo */}
                <Link
                    href="/"
                    className="mb-5 flex items-center gap-3 transition-opacity hover:opacity-80"
                >

                    <span className="text-2xl font-bold tracking-tight">
                        Linklet
                    </span>
                </Link>

                {/* 404 */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#8FB59A]/20 blur-3xl" />

                    <h1 className="relative select-none text-[120px] font-black leading-none tracking-tighter text-[#8FB59A] sm:text-[180px]">
                        404
                    </h1>
                </div>

                {/* Status */}
                <div className="mb-6 flex items-center gap-2 rounded-full border border-[#8FB59A]/20 bg-[#8FB59A]/10 px-4 py-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#8FB59A]" />

                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A7C9AE]">
                        Page Not Found
                    </span>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Lost your connection?
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-[#B5C0B8] sm:text-base">
                    Looks like this page has wandered off.
                    The link might be broken, or the page may
                    have been moved to another location.
                </p>

                {/* Buttons */}
                <div className="mt-9 flex w-full justify-center gap-3 sm:w-auto sm:flex-row">

                    <Link
                        href="/"
                        className="group flex items-center justify-center gap-3 rounded-xl bg-[#8FB59A] px-7 py-4 font-semibold text-[#101813] shadow-[0_6px_25px_rgba(143,181,154,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#A7C9AE]"
                    >
                        <Home size={19} />
                        Back to Home
                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>

                    

                </div>

                

                <div className="mt-8 h-px w-20 bg-gradient-to-r from-transparent via-[#8FB59A]/50 to-transparent" />

                <p className="mt-5 text-xs text-[#8F9C92]">
                    © {new Date().getFullYear()} Linklet. All rights reserved.
                </p>

            </div>
        </main>
    );
}
