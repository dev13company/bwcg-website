'use client';
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <main className="flex flex-col items-center justify-center text-center">
        <header className="fixed top-0 left-0 right-0 w-full bg-[#0B4268] text-white shadow-md z-50">
            <div className="bg-primary mx-[100px] flex items-center md:flex-row justify-between py-3">
                <Link href="/" className="md:text-3xl font-inter tracking-wide hover:text-yellow-400 transition text-center">
                    Berachah Ministries Gachibowli
                </Link>
            </div>
            <div>
                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <Link href="/" className="hover:text-yellow-400 transition">Home</Link>
                <Link href="/about" className="hover:text-yellow-400 transition">About Us</Link>
                <Link href="/services" className="hover:text-yellow-400 transition">Services</Link>
                <Link href="/resources" className="hover:text-yellow-400 transition">Resources</Link>
                <Link href="#contact" className="hover:text-yellow-400 transition">Contact</Link>
                </nav>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                <button className="text-white text-2xl focus:outline-none">&#9776;</button>
                </div>
            </div>
            </header>
            <section id="home" className="relative w-full mt-[160px] flex flex-col items-center justify-center text-center">
            {/* Hero Banner */}
            <div  className="relative w-full max-w-screen-xl aspect-[2/3]">
                <div className="relative w-full  h-full">
                <Image
                src="/hero.jpg" // Replace with one of your uploaded images
                alt="Berachah Ministries Gachibowli"
                fill
                className="object-cover"
                priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    మన్నా ఫుల్ గాస్పెల్ చర్చ్, వరంగల్
                </h1>
                <p className="text-lg md:text-2xl max-w-2xl">
                    Sharing the love of Christ with Warangal and beyond.
                </p>
                </div>
            </div>
            </div>
            </section>
    </main>
  );
}
