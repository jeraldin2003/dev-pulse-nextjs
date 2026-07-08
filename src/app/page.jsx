"use client";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext"
export default function Home() {
  const {isAuthenticated} = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.replace("/login");
  }
  router.replace("/app/dashboard");
}
