'use client';
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <main className="flex flex-col items-center justify-center text-center">
        <header className="fixed top-0 left-0 right-0 w-full bg-white text-white z-50">
            <div className="bg-primary mx-[116px] flex items-center md:flex-row justify-center py-3">
                <Link href="/" className="md:text-4xl font-inter tracking-wide hover:text-yellow-400 transition text-center">
                    Berachah Ministries Gachibowli
                </Link>
            </div>
            <div className="bg-primary mx-[116px] flex items-center md:flex-row justify-center py-3">
                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link href="/" className="hover:text-yellow-400 font-inter transition">Home</Link>
                    <Link href="#about" className="hover:text-yellow-400 font-inter transition">About Us</Link>
                    <Link href="#services" className="hover:text-yellow-400 font-inter transition">Services</Link>
                    <Link href="#resources" className="hover:text-yellow-400 font-inter transition">Resources</Link>
                    <Link href="#contact" className="hover:text-yellow-400 font-inter transition">Contact</Link>
                </nav>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    <button className="text-white text-2xl focus:outline-none">&#9776;</button>
                </div>
            </div>
        </header>
        <section id="home" className="hero-section w-full">
            {/* Hero Banner */}
            <div  className="relative w-full max-w-screen-xl h-[70vh] md:h-[80vh] lg:h-[100vh] aspect-[16/9] border-b-2 border-l-2 border-r-2 border-[#0B4268]">
                <div className="relative w-full h-full">
                    <Image
                    src="/hero.jpg" // Replace with one of your uploaded images
                    alt="Berachah Ministries Gachibowli"
                    fill
                    className="object-contain md:object-cover"
                    priority
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                        <h1 className="text-2xl md:text-4xl font-inter mb-4">
                            బెరాకా మినిస్ట్రీస్, గచ్చిబౌలి
                        </h1>
                        <p className="text-lg md:text-2xl max-w-2xl">
                            ఆశీర్వాదం మరియు ఆరాధన స్థలం
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
}
