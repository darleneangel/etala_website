export default function Hero() {
  return (
    <section className="pt-28 pb-20 px-10 flex flex-col lg:flex-row justify-between items-center">
      
      {/* LEFT */}
      <div className="max-w-xl animate-fade">
        <p className="text-accent-blue font-semibold tracking-wide mb-3">
          Digital Governance for SDG 11
        </p>

        <h1 className="text-5xl font-extrabold leading-tight mb-4">
          Empowering the Community Through <span className="text-accent-yellow">E-TALA</span>
        </h1>

        <p className="text-white/80 text-lg mb-8">
          Modern, transparent, and accessible Barangay Information System.
        </p>

        <div className="flex gap-4">
          <a href="/services" className="px-6 py-3 bg-accent-blue rounded-lg shadow-soft hover:scale-105 transition">
            Explore Services
          </a>

          <a href="/about" className="px-6 py-3 border border-white/40 rounded-lg hover:bg-white/10 transition">
            Learn More
          </a>
        </div>
      </div>

      {/* RIGHT */}
      <img
        src="/images/barangay_mock.jpg"
        className="rounded-2xl w-[450px] shadow-2xl animate-fade"
        alt=""
      />
    </section>
  );
}
