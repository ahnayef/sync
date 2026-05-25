"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomeRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as any).role;
      if (role === "admin" || role === "mod") {
        router.push("/dashboard");
      } else {
        router.push("/routine");
      }
    }
  }, [session, status, router]);

  return null;
}
