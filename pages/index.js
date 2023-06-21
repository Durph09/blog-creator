import Image from "next/image";
import HeroImage from "../public/hero.webp";
import { Logo } from "../components/Logo/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-scree h-screen overflow-hidden flex justify-center items-center relative">
      <Image src="../public/hero.webp" alt="Hero" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          The AI-powered SAAS solution to fenerate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link
          href="/post/new"
          className="bg-green-500 tracking-wider w-full text-center text-white cursor-pointer uppercase px-4 py-2 rounded-md hover:bg-green-600 transition-colors block"
        >
          Begin
        </Link>
      </div>
    </div>
  );
}
