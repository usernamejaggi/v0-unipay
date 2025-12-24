import type React from "react"

export const metadata = {
  title: "Admin Panel - TaskEarner",
  description: "Student verification management",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
