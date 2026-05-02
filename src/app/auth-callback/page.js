"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Auth_display from '../../components/ui/Auth_display';

// 1. Ek chota internal component banaya jo SearchParams use karega
function AuthLogic() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const access = searchParams.get("access");
        const refresh = searchParams.get("refresh");
        const userid = searchParams.get("userid")

        if (access && refresh) {
            Cookies.set("access", access, { expires: 7, secure: true });
            Cookies.set("refresh", refresh, { expires: 7, secure: true });
            localStorage.setItem("userid", userid)
            window.location.href = "/dashboard";
        } else {
            router.push("/login?error=social-login-failed");
        }
    }, [searchParams, router]);

    return <Auth_display />;
}

// 2. Main Page component jo logic ko Suspense mein wrap karega
export default function AuthCallback() {
    return (
        // Suspense wrap karne se Next.js build error nahi dega
        <Suspense fallback={<Auth_display />}>
            <AuthLogic />
        </Suspense>
    );
}