"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminAuthPage() {
  const router = useRouter()
  useEffect(() => {
    router.push("/auth/login")
  }, [])
  return null
  
}