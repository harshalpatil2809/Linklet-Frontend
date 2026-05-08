'use client'
import { TiMessages } from "react-icons/ti";
import Link from 'next/link';
import NotificationBell from "./NotificationBell";

interface LogoProps {
  onChatSelect: (user: any) => void;
}

const Logo = ({ onChatSelect }: LogoProps) => {
    return (

        <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex gap-3 items-center w-fit group">
                {/* Icon Container with Glow Effect */}
                <div className="relative">
                    <div className="absolute inset-0 bg-[#BA9EFF] blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl"></div>
                    <div className="relative bg-[#BA9EFF] p-2 rounded-xl shadow-[0_0_20px_rgba(186,158,255,0.2)] group-hover:scale-110 transition-transform duration-500 ease-in-out">
                        <TiMessages size={28} strokeWidth={3} color="black" />
                    </div>
                </div>

                {/* Brand Name Text */}
                <div className="flex flex-col -gap-1">
                    <h1 className="text-2xl font-black tracking-tighter text-white group-hover:text-[#BA9EFF] transition-colors duration-500">
                        Linklet
                    </h1>
                    <div className="h-1 w-0 group-hover:w-full bg-[#BA9EFF] transition-all duration-500 rounded-full"></div>
                </div>

                
            </Link>

            <div className="flex items-center gap-4">
                    <NotificationBell onChatSelect={onChatSelect} />
                </div>

        </div>

    )
}

export default Logo