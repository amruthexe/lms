'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

const routeList = [
  { href: "/team", label: "Team" },
  { href: "/careers", label: "Careers" },
  { href: "/about-us", label: "About us" },
];
const routeLists = [
  { href: "/support", label: "Support" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
];

const serviceList = [
  { title: "Web Development", href: "/web", icon: "Code" },
  { title: "App Development", href: "/app-dev", icon: "Smartphone" },
  { title: "Cloud Computing", href: "/cloud-comp", icon: "Cloud" },
  { title: "Cyber Security", href: "/cyber-security", icon: "ShieldCheck" },
  { title: "Data Science", href: "/data-science", icon: "Brain" },
  { title: "Full Stack Web Dev", href: "/full-stack", icon: "Layers" },
  { title: "Python Programming", href: "/python", icon: "FileCode" },
];

const programList = [
  { title: "All programs", href: "/programs", icon: "GraduationCap" },
  { title: "Fast Track 45", href: "/programs/fast-track", icon: "GraduationCap" },
  { title: "Skill Boost 2", href: "/programs/skill-boost", icon: "GraduationCap" },
  { title: "Pro Edge 3", href: "/programs/pro-edge", icon: "GraduationCap" },
  { title: "Dual Path 5", href: "/programs/dual-pack", icon: "GraduationCap" },
  { title: "Career Pro 6", href: "/programs/career-pro", icon: "GraduationCap" },
  { title: "Campus+ LearnTrack", href: "/programs/campus-plus", icon: "GraduationCap" },
  { title: "Campus+ ProjectPro", href: "/programs/campus-project-pro", icon: "GraduationCap" },
  { title: "Campus+ CodeStart", href: "/programs/campus-code-start", icon: "GraduationCap" },
];

const Footer = () => {
  return (
    <footer className="rounded-md mx-6 my-6 bg-white dark:bg-black text-black dark:text-white py-6 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          {/* Left Column - About */}
          <div className="flex flex-col items-start space-y-4">
            <span className="text-2xl font-semibold">Talent Trek</span>
            <p className="text-base text-gray-700 dark:text-gray-300">
              We are an edtech startup helping students excel in their careers. Join us and start learning today.
            </p>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/app">Start for free</Link>
            </Button>
          </div>

          {/* Links Column */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 text-sm">
            {/* Company Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Company</h4>
              <ul className="space-y-2">
                {routeList.map((route, index) => (
                  <li key={index} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link href={route.href}>{route.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Services</h4>
              <ul className="space-y-2">
                {serviceList.map((service, index) => (
                  <li key={index} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link href={service.href}>{service.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Programs</h4>
              <ul className="space-y-2">
                {programList.map((program, index) => (
                  <li key={index} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link href={program.href}>{program.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Other</h4>
              <ul className="space-y-2">
                {routeLists.map((route, index) => (
                  <li key={index} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link href={route.href}>{route.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 flex flex-col items-center sm:flex-row justify-between text-sm">
          <p className="text-center sm:text-left text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Talent Trek. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-gray-600 dark:text-gray-400">
            Made with ❤️ by{" "}
            <Link
              href="https://amruthexe.vercel.app"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              amruthexe
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
