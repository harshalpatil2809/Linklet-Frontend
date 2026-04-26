"use client";
import React from 'react';
import { ShieldCheck, Zap, Users } from 'lucide-react'; // Some cool icons

const Auth_display = () => {
    const features = [
        { icon: ShieldCheck, text: "Secure & Encrypted Chat" },
        { icon: Zap, text: "Real-time Messaging" },
        { icon: Users, text: "Connect Instantly" },
    ];

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0D0B0F] p-6 md:p-12">
            {/* Main Glassy Container with Gradient Border */}
            <div className="relative group w-full max-w-lg aspect-square">
                {/* Animated Gradient Background Glow */}
                <div className="absolute -inset-1 bg-linear-to-r from-[#BA9EFF] to-[#8A63D2] rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                {/* Inner Content Card */}
                <div className="relative h-full w-full bg-[#1A161F]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center shadow-2xl overflow-hidden">

                    {/* Stylized Circle Logo with "A" */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1A161F] border-4 border-[#BA9EFF]/20 overflow-hidden flex items-center justify-center shadow-inner mb-10 group-hover:scale-105 transition-transform duration-500">
                        {/* Inner Glow */}
                        <div className="absolute inset-2 rounded-full bg-linear-to-br from-[#BA9EFF]/10 to-transparent blur-sm"></div>

                        {/* The Letter A - Gradient Text */}
                        <span className="relative text-7xl md:text-8xl font-black bg-linear-to-b from-white to-[#BA9EFF] bg-clip-text text-transparent select-none">
                            A
                        </span>

                        {/* Rotating Outer Ring on Hover */}
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#BA9EFF]/30 opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500"></div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center space-y-3 mb-12">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Welcome to <span className="text-[#BA9EFF]">AuthApp</span>
                        </h1>
                        <p className="text-sm md:text-base text-white/50 max-w-sm mx-auto font-medium leading-relaxed">
                            Experience seamless and secure communication. Your private space, redefined.
                        </p>
                    </div>

                    {/* Small Feature Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                        {features.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#BA9EFF]/30 hover:bg-[#BA9EFF]/5 transition-colors duration-300"
                                >
                                    <Icon className="w-4 h-4 text-[#BA9EFF]" strokeWidth={2.5} />
                                    <span className="text-xs font-semibold text-white/80 tracking-wide">
                                        {item.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Background Decorative Shapes */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#BA9EFF]/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#8A63D2]/10 rounded-full blur-3xl opacity-50"></div>
                </div>
            </div>
        </div>
    );
};

export default Auth_display;