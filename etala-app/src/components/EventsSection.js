export default function EventsSection() {
  const events = [
    {
      title: "Feeding Program",
      img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
      tag: "Health",
      desc: "Supporting child nutrition in the community.",
    },
    {
      title: "Community Clean-Up",
      img: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980",
      tag: "Environment",
      desc: "Keeping Barangay clean and sustainable.",
    },
    {
      title: "Youth Sports",
      img: "https://images.unsplash.com/photo-1548191265-cc70d3d45ba1",
      tag: "Well-being",
      desc: "Engaging the youth for a healthier future.",
    },
  ];

  return (
    <section className="px-10 py-20">
      <h2 className="text-3xl font-bold mb-8 animate-fade">Latest News & Events</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <div
            key={i}
            className="bg-yankees-800/60 rounded-xl p-5 backdrop-blur-xl border border-white/10 shadow-soft hover:scale-105 transition animate-fade"
          >
            <div className="relative">
              <img src={e.img} className="rounded-lg w-full h-48 object-cover" alt="" />
              <span className="absolute top-3 left-3 bg-accent-blue/80 px-3 py-1 text-xs rounded-full">
                {e.tag}
              </span>
            </div>

            <h3 className="text-xl font-bold mt-4">{e.title}</h3>
            <p className="text-white/70 text-sm mt-2">{e.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
