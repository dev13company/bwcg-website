'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';


const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? '',
  apiVersion: '2023-07-11',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function Header() {
    const [hero, setHero] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [meetings, setMeetings] = useState([]);

    
    useEffect(() => {
        const fetchData = async () => {
    // 1️⃣ Get start of current week (Monday)
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);
        const mondayISO = monday.toISOString().split("T")[0];

        // 2️⃣ Try to fetch hero for this week
        let heroData = await client.fetch(
            `*[_type == "heroSection" && weekOf == $mondayISO][0]{
            title, subtitle, buttonText, buttonLink, backgroundImage
            }`,
            { mondayISO }
        );

        // 3️⃣ If no hero found for this week → fallback to latest available hero
        if (!heroData) {
            heroData = await client.fetch(
            `*[_type == "heroSection"] | order(weekOf desc)[0]{
                title, subtitle, buttonText, buttonLink, backgroundImage
            }`
            );
        }

        // 5️⃣ Fetch gallery for current week with fallback
        let galleryData = await client.fetch(
            `*[_type == "galleryImage" && weekOf == $mondayISO]{
            images[]{ alt, asset}
            }`,
            { mondayISO }
        );

        if (!galleryData || !galleryData.images?.length) {
            galleryData = await client.fetch(
            `*[_type == "galleryImage"] | order(weekOf desc)[0]{
                images[]{ alt, asset }
            }`
        );
        }

        // 3️⃣ Fetch upcoming meetings
        const meetingsData = await client.fetch(
        `*[_type == "meeting" && date >= now()] | order(date asc)[0...4]{
            _id,
            title,
            date,
            description,
            image,
            link
        }`
        );

        // 4️⃣ Set the hero data (may be from fallback)
        setHero(heroData);
        setGallery(galleryData);
        setMeetings(meetingsData);
        };

        fetchData();
    }, []);
    // 3️⃣ Static fallback images
  const fallbackImages = [
    { src: "/gallery1_1.jpg", alt: "Event 1" },
    { src: "/gallery2_2.jpg", alt: "Event 2" },
    { src: "/gallery3_3.jpg", alt: "Event 3" },
  ];

  const imagesToShow = gallery?.images?.length ? gallery.images : fallbackImages;

  return (
    <main className="flex flex-col items-center justify-center text-center">
        <header className="fixed top-0 left-0 right-0 w-full bg-white text-white z-50">
            <div className="bg-primary mx-auto flex items-center md:flex-row justify-center py-3">
                <Link href="/" className="md:text-4xl font-inter tracking-wide hover:text-yellow-400 transition text-center">
                    Berachah Ministries Gachibowli
                </Link>
            </div>
            <div className="bg-primary mx-auto flex items-center md:flex-row justify-center py-3">
                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link href="/" className="hover:text-yellow-400 font-inter transition">Home</Link>
                    <Link href="#about" className="hover:text-yellow-400 font-inter transition">About Us</Link>
                    <Link href="#services" className="hover:text-yellow-400 font-inter transition">Services</Link>
                    <Link href="#resources" className="hover:text-yellow-400 font-inter transition">Gallery</Link>
                    <Link href="#contact" className="hover:text-yellow-400 font-inter transition">Contact</Link>
                </nav>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    <button className="text-white text-2xl focus:outline-none">&#9776;</button>
                </div>
            </div>
        </header>
        <section id="home" className="hero-section w-full m-0 p-0 relative">
            {/* Hero Banner */}
            <div  className="relative w-full mx-auto h-[70vh] md:h-[80vh] lg:h-[140vh] aspect-[16/9] border-b-0 border-l-2 border-r-2 border-[#0B4268] mx-auto overflow-hidden  mb-[-1px]">
                <div className="relative w-full h-full">
                    <Image
                    src={hero?.backgroundImage ? urlFor(hero.backgroundImage).url() : "/hero.jpg"} // Replace with one of your uploaded images
                    alt="Berachah Ministries Gachibowli"
                    fill
                    className="object-contain md:object-cover"
                    priority
                    />
                    <div className="absolute inset-0 px-4 bg-black/50 flex flex-col items-center justify-center text-white">
                        <h2 className="text-4xl md:text-6xl font-inter tracking-wider leading-tight text-white drop-shadow-2xl mb-4">
                            {hero?.title || "Reaching the World with the Gospel of "}
                            <span className="text-yellow-400">JESUS CHRIST</span>
                        </h2>
                        <p className="text-lg md:text-2xl max-w-3xl text-white leading-relaxed drop-shadow-lg">
                            {hero?.subtitle || "Bringing hope, healing, and transformation through Jesus Christ."}
                        </p>
                        <a
                            href={hero?.buttonLink || "#contact"}
                            className="mt-6 inline-block bg-yellow-400 text-[#0B4268] px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-500 transition"
                        >
                            {hero?.buttonText || "Join Us"}
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <section id="gallery" className="relative w-full text-center m-0 p-0">
            <div className="bg-primary mx-auto h-[70vh] md:h-[80vh] lg:h-[100vh] grid grid-cols-2 md:grid-cols-3 gap-2 border-t-2">
                {imagesToShow.map((img, index) => (
                    <div key={index} className="relative w-full h-[60vh] md:h-[60vh]">
                        <Image
                            src={img.asset ? urlFor(img.asset).url() : img.src}
                            alt={img.alt || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover rounded"
                            priority={index === 0}
                        />
                    </div>
                ))}
                {/* {gallery?.images?.length > 0 ? (
                    gallery?.images?.map((img, index) => (
                            <div key={img.image.asset._ref} className="relative w-full aspect-[3/3] overflow-hidden rounded">
                                <Image src={img.asset.url} alt={img.alt || `Gallery image ${index + 1}`} fill className="object-cover" />
                            </div>
                        ))
                    ): [
                        { src: "/gallery1_1.jpg", alt: "Event 1" },
                        { src: "/gallery2_2.jpg", alt: "Event 2" },
                        { src: "/gallery3_3.jpg", alt: "Event 3" },
                    ].map((img) => (
                        <div key={img.src} className="relative w-full aspect-[3/3] overflow-hidden rounded">
                        <Image src={img.src} alt={img.alt} fill className="object-cover" />
                        </div>
                    ))} */}
            </div>
        </section>
        {/* UPCOMING MEETINGS SECTION */}
        <section id="meetings" className="relative w-full text-center bg-white py-12">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B4268] mb-8">
                Upcoming Meetings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {meetings && meetings.length > 0 ? (
                    meetings.map((mtg) => (
                    <div
                        key={mtg._id}
                        className="bg-yellow-50 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                    >
                        <div className="relative w-full h-48">
                        {mtg.image ? (
                            <Image
                            src={urlFor(mtg.image).url()}
                            alt={mtg.title}
                            fill
                            className="object-cover"
                            />
                        ) : (
                            <div className="bg-gray-300 w-full h-full" />
                        )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between text-left">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-[#0B4268]">
                            {mtg.title}
                            </h3>
                            <p className="text-sm text-gray-700 mb-3">
                            {new Date(mtg.date).toLocaleDateString("en-IN", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                            })}
                            </p>
                            <p className="text-gray-600 text-sm mb-4">
                            {mtg.description || "Join us for a special gathering this week!"}
                            </p>
                        </div>
                        {mtg.link && (
                            <a
                            href={mtg.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-block bg-yellow-400 text-[#0B4268] font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                            >
                            Learn More
                            </a>
                        )}
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-600">No upcoming meetings scheduled.</p>
                )}
                </div>
            </div>
        </section>
    </main>
  );
}
