"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { FormInput, Home } from "lucide-react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import AnimatedLogo from "@/components/ui/animated-logo"

export function DashboardHeader() {
    const { isSignedIn } = useUser()
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <FormInput className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl"><AnimatedLogo className="text-xl" /></span>
                </Link>

                {/* Desktop nav */}
                <nav className="flex items-center space-x-4">
                    <Button asChild variant="ghost">
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/analytics">Analytics</Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/company">Knowledge</Link>
                    </Button>
                    <ModeToggle />
                    <Button asChild variant="outline" size="sm">
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Home
                        </Link>
                    </Button>
                    {isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <SignInButton mode="modal">
                            <Button variant="default" size="sm">Sign In</Button>
                        </SignInButton>
                    )}
                </nav>
            </div>
        </header>
    )
}