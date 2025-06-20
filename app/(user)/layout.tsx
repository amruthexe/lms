import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/footer";
import {
  SITE_CATEGORY,
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:"Talent Trek LMS",
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  category: SITE_CATEGORY,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: SITE_IMAGE,
      },
    ],
  },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
         <Footer/>
      </ThemeProvider>

      <SanityLive />
    </ClerkProvider>
  );
}
