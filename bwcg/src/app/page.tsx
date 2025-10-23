export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url('/hero.jpg')` }}>
        <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-5xl font-bold mb-4">Berachah Ministries, Gachibowli</h1>
            <p className="text-xl mb-6">A Place of Blessing & Worship</p>
            <a href="#contact" className="bg-yellow-500 px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-600 transition">Join Us</a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="max-w-3xl mx-auto">Berachah Ministries is dedicated to spreading the Gospel and serving the community of Gachibowli and beyond. Our mission is to bring hope, healing, and transformation through Jesus Christ.</p>
      </section>

      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-4">Service Timings</h2>
        <p className="mb-2">Sunday Worship: 10:00 AM - 12:00 PM</p>
        <p>Wednesday Prayer Meeting: 7:00 PM - 8:30 PM</p>
      </section>

      <section id="contact" className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="mb-2">Address: Berachah Ministries, Gachibowli, Hyderabad</p>
        <p className="mb-2">Phone: +91-XXXXXXXXXX</p>
        <p>Email: info@berachahministries.org</p>
      </section>
    </main>
  );
}
