import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
      generator: 'worshix'
    };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            {children}
          </SidebarProvider>
          <Toaster position="bottom-right" richColors/>
        </ThemeProvider>
      </body>
    </html>
  )
}