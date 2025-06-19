"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { BookMarkedIcon } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./SearchInput";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              prefetch={false}
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Talent Trek
              </span>
            </Link>
          </div>

          {/* Right Section: Search, Navigation & Authentication */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Input */}
            <SearchInput />

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-4 items-center">
              <Link
                href="/my-courses"
                prefetch={false}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-all px-4 py-2 rounded-md border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <BookMarkedIcon className="h-4 w-4 mr-2" />
                <span>My Courses</span>
              </Link>
            </nav>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* User Authentication */}
            <div className="flex items-center gap-4">
              <SignedIn>
                <UserButton />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="default">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
