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
    const [about, setAbout] = useState(null);
    const [testimonials, setTestimonials] = useState([]);

    
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

        const aboutData = await client.fetch(
            `*[_type == "aboutPage"][0]{
                title,
                intro,
                founders[]{
                name,
                role,
                bio,
                photo
                }
            }`
        );

        const testimonialData = await client.fetch(
            `*[_type == "testimonial"] | order(date desc)[0...6]{
                _id,
                name,
                role,
                message,
                photo
            }`
        );

        // 4️⃣ Set the hero data (may be from fallback)
        setHero(heroData);
        setGallery(galleryData);
        setMeetings(meetingsData);
        setAbout(aboutData);
        setTestimonials(testimonialData);
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
            <div className="bg-primary mx-auto grid grid-cols-2 md:grid-cols-3 gap-[1px] border-t-0 border-b-0">
                {imagesToShow.map((img, index) => (
                    <div key={index} className="relative w-full aspect-[3/3] overflow-hidden">
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
        <section id="meetings" className="relative w-full text-center bg-white py-12 mt-[-1px]">
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
        {/* ABOUT US SECTION */}
        <section id="about" className="relative w-full bg-yellow-50 pb-0 pt-16 px-6 text-center">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-[#0B4268] mb-8">
                    {about?.title || "About Us"}
                </h2>

                {about?.intro && (
                    <p className="text-[#0B4268] text-lg leading-relaxed mb-10">
                        {about.intro}
                    </p>
                )}

                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                    {about?.founders?.length > 0 ? (
                        about?.founders?.map((person: any, index: number) => {
                            const personName = person?.name?.trim() || "Pastor";
                            const role = person?.role || "Church Leader";
                            const bio =
                                person?.bio ||
                                "We are committed to serving the Lord and spreading the Gospel through love and faith.";

                            // ✅ fallback image logic
                            const imageSrc = person?.photo
                                ? urlFor(person.photo).url()
                                : "/sister_shekena.jpg"

                            return (
                                <div key={index} className="text-center">
                                    <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-[#0B4268] mx-auto mb-4">
                                        <Image
                                        src={imageSrc}
                                        alt={personName}
                                        fill
                                        className="object-cover"
                                        priority
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-[#0B4268]">
                                        {personName}
                                    </h3>
                                    <p className="text-sm text-gray-700 italic mb-2">{role}</p>
                                    <p className="text-[#0B4268] text-base leading-relaxed max-w-md mx-auto">
                                        {bio}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                                <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-[#0B4268]">
                                    <Image
                                    src="/pastor_caleb.jpg" // replace with actual image
                                    alt="Pastor Caleb"
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                                <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-[#0B4268]">
                                    <Image
                                    src="/sister_shekena.jpg" // replace with actual image
                                    alt="Sister Shekena Sharon Glory"
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="mt-10 text-[#0B4268] leading-relaxed text-lg text-left md:text-center">
                    <p className="mb-4">
                        <strong>Pastor Caleb</strong> and <strong>Sister Shekena Sharon Glory</strong> are the
                        visionary leaders of <span className="font-semibold">Berachah Ministries, Gachibowli</span> —
                        a vibrant, Spirit-filled church dedicated to proclaiming the Gospel of Jesus Christ and
                        transforming lives through prayer, worship, and the Word of God.
                    </p>
                    <p className="text-lg mt-6 text-[#0B4268] leading-relaxed">
                        <strong>పాస్టర్ కలేబ్ గారు</strong> మరియు <strong>సిస్టర్ శేఖినా శారన్ గ్లోరీ గారు</strong> 
                        దేవుని పిలుపుతో గచ్చిబౌలిలో స్థాపించబడిన <strong>బెరాకా మినిస్ట్రీలు</strong> ద్వారా 
                        ప్రభువుకు మహిమ కలిగించుచున్నారు. ప్రార్థన, ఆరాధన మరియు వాక్యముతో 
                        ప్రజల జీవితములను మారుస్తూ దేవుని ప్రేమను పంచుతున్నారు.
                    </p>

                    <p className="mb-4">
                        With a deep passion for souls and a heart of compassion, Pastor Caleb ministers the Word with
                        divine revelation and grace, leading believers to experience the power of God’s presence and
                        the fullness of His promises.
                    </p>

                    <p className="mb-4">
                        Sister Shekena Sharon Glory stands beside him as a powerful intercessor and worship leader,
                        carrying a prophetic anointing that brings healing and restoration to many. Together, they
                        have been instrumental in nurturing faith, strengthening families, and raising a generation
                        of believers who walk in truth and love.
                    </p>

                <p className="italic text-gray-700 mt-6">
                    “Our mission is to reach the unreached and share the love of Jesus Christ with every heart.”
                </p>
                </div>
            </div>
        </section>
        {/* WHAT PEOPLE SAY SECTION */}
        <section id="testimonials" className="bg-[#0B4268] text-white pt-0 pb-16 px-6 -mt-[1px]">
            <div className="mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-10 text-yellow-400">
                What People Say
                </h2>

                {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                    <div
                        key={t._id}
                        className="bg-white text-[#0B4268] rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-[1.03]"
                    >
                        <div className="relative w-32 h-64 rounded-full overflow-hidden mb-4">
                        <Image
                            src={
                            t.photo
                                ? urlFor(t.photo).url()
                                : "/default_user.jpg" // fallback image
                            }
                            alt={t.name || "Church Member"}
                            fill
                            className="object-cover"
                        />
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{t.name || "Member"}</h3>
                        <p className="text-sm text-gray-500 mb-3">{t.role || "Believer"}</p>
                        <p className="text-gray-700 text-base leading-relaxed italic">
                        “{t.message}”
                        </p>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-gray-200 italic">
                    Testimonials will be updated soon. Praise be to God!
                </p>
                )}
            </div>
        </section>
        {/* CONTACT US SECTION */}
        <section id="contact" className="relative w-full bg-white py-16 px-6 text-[#0B4268]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* LEFT: Contact Info */}
                <div className="space-y-6 text-left">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#0B4268]">
                        Contact Us
                    </h2>
                <p className="text-lg leading-relaxed mb-6">
                    We’d love to hear from you! Whether you need prayer, have questions about
                    our ministry, or want to connect with us — feel free to reach out anytime.
                </p>

                <div className="space-y-4 text-base">
                    <p className="flex items-center space-x-3">
                    <span className="text-yellow-500 text-2xl">📍</span>
                    <span>
                        <strong>Berachah Ministries</strong><br />
                        Gachibowli, Hyderabad, Telangana, India
                    </span>
                    </p>
                    <p className="flex items-center space-x-3">
                    <span className="text-yellow-500 text-2xl">📞</span>
                    <a href="tel:+919876543210" className="hover:text-yellow-600">
                        +91 98765 43210
                    </a>
                    </p>
                    <p className="flex items-center space-x-3">
                    <span className="text-yellow-500 text-2xl">✉️</span>
                    <a
                        href="mailto:info@berachahministries.in"
                        className="hover:text-yellow-600"
                    >
                        info@berachahministries.in
                    </a>
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-6 mt-8">
                    <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B4268] hover:text-yellow-500 text-2xl"
                    >
                    <i className="fab fa-facebook"></i>
                    </a>
                    <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B4268] hover:text-yellow-500 text-2xl"
                    >
                    <i className="fab fa-instagram"></i>
                    </a>
                    <a
                    href="https://www.youtube.com/@ShekenaGlory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B4268] hover:text-yellow-500 text-2xl"
                    >
                    <i className="fab fa-youtube"></i>
                    </a>
                </div>
                </div>

                {/* RIGHT: Contact Form */}
                <div className="bg-yellow-50 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 text-[#0B4268]">
                    Send Us a Message
                </h3>
                <form
                    action="https://formspree.io/f/your_form_id"
                    method="POST"
                    className="space-y-4"
                >
                    <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                    />
                    </div>
                    <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                    />
                    </div>
                    <div>
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows={4}
                        required
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-yellow-500"
                    ></textarea>
                    </div>
                    <button
                    type="submit"
                    className="bg-[#0B4268] text-white font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 hover:text-[#0B4268] transition w-full"
                    >
                    Send Message
                    </button>
                </form>
                </div>
            </div>

            {/* MAP SECTION BELOW */}
            <div className="mt-16 w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border-t-2 border-[#0B4268]">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5132422948924!2d78.34859707494164!3d17.445715083460792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc3916dd7f%3A0x5ad523db4d1c8712!2sGachibowli%2C%20Hyderabad%2C%20Telangana%20500032!5e0!3m2!1sen!2sin!4v1709392456723!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* Decorative Transition to Footer */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-white to-[#0B4268]" />
        </section>
    </main>
  );
}
