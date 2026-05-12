"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
}

function ImageCard({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg hover-zoom ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Save to Supabase database
    const { error: supabaseError } = await supabase.from("contacts").insert({
      name: formData.name,
      email: formData.email,
      project_type: formData.projectType,
      message: formData.message,
    });

    if (supabaseError) {
      setLoading(false);
      setError(supabaseError.message);
      return;
    }

    // Send email notification
    try {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message,
        }),
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    setLoading(false);
    setSuccess(true);
    setFormData({ name: "", email: "", projectType: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="flex flex-col">
      {/* Section 1: Hero Landing */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ position: "relative" }}
      >
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image src="/hero.jpg" alt="Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base uppercase tracking-[0.4em] text-[var(--accent)] mb-6"
          >
            Photography Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-9xl font-bold tracking-tight mb-4"
          >
            <span className="text-gradient">MOHSIN</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-300 tracking-wide max-w-xl mx-auto"
          >
            Capturing moments, crafting stories
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border border-gray-400/50 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: About Me */}
      <section id="about" className="min-h-screen py-32 px-6 flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full border border-[var(--accent)]/30 rounded-2xl" />
                <div className="relative h-[500px] rounded-xl overflow-hidden">
                  <Image src="/about.jpg" alt="Photographer" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4">About Me</h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  Behind the <span className="text-gradient">Lens</span>
                </h3>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  I'm a visual storyteller passionate about capturing the raw beauty of nature and the emotional depth of human connections. With over 8 years of experience, I've developed a distinctive style that blends cinematic aesthetics with authentic moments.
                </p>
                <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                  My journey has taken me from the majestic mountains of Kashmir to intimate wedding ceremonies, from corporate boardrooms to untouched wilderness. Every frame tells a story, and I'm here to help you tell yours.
                </p>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { number: "500+", label: "Projects" },
                    { number: "8+", label: "Years" },
                    { number: "50K+", label: "Images" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                      <div className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 3: Nature Photography Gallery */}
      <section id="nature" className="min-h-screen py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4">Portfolio</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Nature <span className="text-gradient">Photography</span>
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Exploring the raw beauty of our planet through my lens
              </p>
            </div>
          </FadeIn>
          <div className="image-gallery-grid">
            <FadeIn delay={0}>
              <ImageCard src="/nature1.jpg" alt="Mountain landscape" className="image-tall" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <ImageCard src="/forest.jpg" alt="Forest" />
            </FadeIn>
            <FadeIn delay={0.2}>
              <ImageCard src="/nature2.jpg" alt="Nature" />
            </FadeIn>
            <FadeIn delay={0.3}>
              <ImageCard src="/nature3.jpg" alt="Waterfall" />
            </FadeIn>
            <FadeIn delay={0.4}>
              <ImageCard src="/mountains.jpg" alt="Mountains" className="image-tall" />
            </FadeIn>
            <FadeIn delay={0.5}>
              <ImageCard src="/hero.jpg" alt="Dark forest" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 4: Kashmir Mountains */}
      <section id="kashmir" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/kashmir.jpg" alt="Kashmir Mountains" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <FadeIn>
            <div className="max-w-xl">
              <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4">Featured</h2>
              <h3 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Kashmir
                <br />
                <span className="text-gradient">Paradise Found</span>
              </h3>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                The crown jewel of the Himalayas, Kashmir offers breathtaking landscapes that seem otherworldly. From the floating gardens of Dal Lake to the snow-capped peaks, every corner reveals a new masterpiece.
              </p>
              <button className="px-8 py-3 border border-[var(--accent)] text-[var(--accent)] rounded-full hover:bg-[var(--accent)] hover:text-black transition-all duration-300">
                View Full Series
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 5: Wedding Photography */}
      <section id="weddings" className="min-h-screen py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div>
                <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4">Weddings</h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Love <span className="text-gradient">Stories</span>
                </h3>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Every wedding is a unique love story waiting to be told. I capture the intimate moments, the joyful tears, and the celebration that marks the beginning of forever.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["Candid Moments", "Ceremony", "Reception", "Portraits"].map((item, i) => (
                    <div key={i} className="glass-card p-4 rounded-lg text-center">
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <ImageCard src="/wedding1.jpg" alt="Wedding 1" className="rounded-xl" />
                <ImageCard src="/wedding2.jpg" alt="Wedding 2" className="rounded-xl mt-12" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 6: Business Promotion */}
      <section id="business" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/business.jpg" alt="Business" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 ml-auto">
          <FadeIn>
            <div className="max-w-xl ml-auto text-right">
              <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4">Business</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Elevate Your <span className="text-gradient">Brand</span>
              </h3>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Professional photography that transforms your brand identity. From corporate headshots to product photography, we create visuals that make an impact.
              </p>
              <div className="flex flex-wrap gap-3 justify-end mb-8">
                {["Corporate", "Product", "Events", "Advertising"].map((tag, i) => (
                  <span key={i} className="px-4 py-2 glass rounded-full text-sm text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="px-8 py-3 bg-[var(--accent)] text-black font-semibold rounded-full hover:bg-[var(--accent-secondary)] transition-colors">
                Get a Quote
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 7: Instagram/Reels */}
      <section id="social" className="min-h-screen py-32 px-6 flex items-center">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4">Social</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Follow the <span className="text-gradient">Journey</span>
              </h3>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Behind the scenes, travel vlogs, and daily inspiration
              </p>
              <div className="flex justify-center gap-6">
                {[
                  { name: "Instagram", handle: "@mohsinphoto" },
                  { name: "YouTube", handle: "@mohsinphoto" },
                  { name: "TikTok", handle: "@mohsinphoto" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="glass-card px-6 py-3 rounded-full hover:border-[var(--accent)] transition-colors"
                  >
                    <span className="text-sm font-medium">{social.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{social.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { views: "2.5M", likes: "180K" },
                { views: "1.8M", likes: "120K" },
                { views: "950K", likes: "65K" },
              ].map((stat, i) => (
                <div key={i} className="relative group cursor-pointer">
                  <div className="aspect-[9/16] rounded-xl overflow-hidden">
                    <Image
                      src="/social.jpg"
                      alt="Reels"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-4 text-white">
                      <span className="flex items-center gap-1 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {stat.likes}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        {stat.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 8: Contact/Booking Form */}
      <section id="contact" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src="/conclusion.jpg" alt="Contact" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 w-full">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-sm uppercase tracking-widest text-[var(--accent)] mb-4">Contact</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Let's Create <span className="text-gradient">Together</span>
              </h3>
              <p className="text-gray-400 max-w-xl mx-auto">
                Ready to capture your story? Get in touch for bookings and inquiries
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 rounded-2xl space-y-6">
              {success && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
                  {error}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none transition-colors"
                >
                  <option value="" className="text-black">Select project type</option>
                  <option value="wedding" className="text-black">Wedding Photography</option>
                  <option value="nature" className="text-black">Nature & Landscape</option>
                  <option value="business" className="text-black">Business & Corporate</option>
                  <option value="other" className="text-black">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </FadeIn>

          <footer className="mt-20 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-500">© 2026 Mohsin Photography. All rights reserved.</span>
              <div className="flex gap-6">
                {["Instagram", "YouTube", "Email"].map((item, i) => (
                  <a key={i} href="#" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}