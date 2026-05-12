"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ==================== ANIMATION COMPONENTS ====================

function ParallaxSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

function FadeIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 1,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({
  children,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
}

function ImageReveal({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className={`overflow-hidden relative ${className}`}
    >
      <motion.div
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={isInView ? { clipPath: "inset(0 0 0 0)" } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0"
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

function ScrollReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ==================== GALLERY COMPONENTS ====================

function GalleryItem({
  src,
  alt,
  className = "",
  aspect = "tall",
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: "tall" | "square" | "wide";
}) {
  const aspectClasses = {
    tall: "aspect-[3/5]",
    square: "aspect-square",
    wide: "aspect-[16/10]",
  };

  return (
    <div className={`overflow-hidden rounded-xl ${aspectClasses[aspect]} ${className}`}>
      <motion.div
        className="relative w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </motion.div>
    </div>
  );
}

function HorizontalGallery() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex-shrink-0 w-[280px] md:w-[350px]">
          <GalleryItem
            src={`/nature${i > 3 ? (i - 3) : i}.jpg`}
            alt={`Gallery ${i}`}
            aspect="tall"
          />
        </div>
      ))}
    </div>
  );
}

// ==================== MOBILE NAV ====================

function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navItems = ["About", "Nature", "Kashmir", "Weddings", "Business", "Social", "Contact"];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? "0%" : "100%" }}
      transition={{ type: "tween", duration: 0.4 }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-50 flex flex-col items-center justify-center gap-8 md:hidden"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-400"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {navItems.map((item, i) => (
        <motion.a
          key={item}
          href={`#${item.toLowerCase()}`}
          onClick={onClose}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
          transition={{ delay: i * 0.08 }}
          className="text-2xl font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          {item}
        </motion.a>
      ))}
    </motion.div>
  );
}

// ==================== MAIN PAGE ====================

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Form state
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

    try {
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

      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("Submission error:", err);
    }

    setLoading(false);
    setSuccess(true);
    setFormData({ name: "", email: "", projectType: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, []);

  return (
    <main ref={containerRef} className="noise-overlay">
      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* ==================== HERO SECTION ==================== */}
      <section
        ref={heroRef}
        className="relative h-screen h-[100dvh] overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <Image src="/hero.jpg" alt="Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/70 via-[var(--bg-primary)]/30 to-[var(--bg-primary)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)]/50" />
        </motion.div>

        {/* Hero Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="subtitle text-[var(--accent)] mb-6"
          >
            Photography Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-title text-[var(--foreground)]"
          >
            <span className="text-gradient">MOHSIN</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-6 text-lg md:text-xl text-[var(--stone-300)] tracking-wide max-w-lg"
          >
            Capturing moments, crafting stories
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="scroll-indicator"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="scroll-indicator-mouse"
          >
            <div className="scroll-indicator-wheel" />
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section id="about" className="fullscreen-section py-24 md:py-32 px-6 flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeIn direction="right">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-full h-full border border-[var(--accent)]/20 rounded-2xl" />
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <Image src="/about.jpg" alt="Photographer" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <div>
                <h2 className="subtitle text-[var(--accent)] mb-4">About Me</h2>
                <h3 className="section-title mb-8">
                  Behind the <span className="text-gradient">Lens</span>
                </h3>
                <p className="text-lg text-[var(--stone-300)] mb-6 leading-relaxed">
                  I'm a visual storyteller passionate about capturing the raw beauty of nature and the emotional depth of human connections. With over 8 years of experience, I've developed a distinctive style that blends cinematic aesthetics with authentic moments.
                </p>
                <p className="text-lg text-[var(--stone-300)] mb-10 leading-relaxed">
                  My journey has taken me from the majestic mountains of Kashmir to intimate wedding ceremonies, from corporate boardrooms to untouched wilderness. Every frame tells a story, and I'm here to help you tell yours.
                </p>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { number: "500+", label: "Projects" },
                    { number: "8+", label: "Years" },
                    { number: "50K+", label: "Images" },
                  ].map((stat, i) => (
                    <ScrollReveal key={i}>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.number}</div>
                        <div className="text-xs uppercase tracking-wider text-[var(--stone-400)]">{stat.label}</div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ==================== NATURE GALLERY ==================== */}
      <section id="nature" className="fullscreen-section py-24 md:py-32 px-0">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="subtitle text-[var(--accent)] mb-4">Portfolio</h2>
              <h3 className="section-title mb-6">
                Nature <span className="text-gradient">Photography</span>
              </h3>
              <p className="text-[var(--stone-400)] max-w-2xl mx-auto">
                Exploring the raw beauty of our planet through my lens
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Horizontal Scroll Gallery for Mobile */}
        <div className="md:hidden">
          <HorizontalGallery />
        </div>

        {/* Grid Gallery for Desktop */}
        <div className="hidden md:block max-w-7xl mx-auto px-6">
          <StaggerChildren stagger={0.1}>
            <div className="grid grid-cols-3 gap-5">
              <div className="space-y-5">
                <GalleryItem src="/nature1.jpg" alt="Mountain landscape" aspect="tall" />
                <GalleryItem src="/forest.jpg" alt="Forest" aspect="square" />
              </div>
              <div className="space-y-5 pt-12">
                <GalleryItem src="/nature2.jpg" alt="Nature" aspect="square" />
                <GalleryItem src="/nature3.jpg" alt="Waterfall" aspect="tall" />
              </div>
              <div className="space-y-5">
                <GalleryItem src="/mountains.jpg" alt="Mountains" aspect="tall" />
                <GalleryItem src="/hero.jpg" alt="Dark forest" aspect="square" />
              </div>
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* ==================== KASHMIR FEATURE ==================== */}
      <section id="kashmir" className="relative h-screen h-[100dvh] flex items-center">
        {/* Fullscreen Parallax Background */}
        <ParallaxSection className="absolute inset-0 z-0">
          <Image src="/kashmir.jpg" alt="Kashmir Mountains" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/95 via-[var(--bg-primary)]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/30 via-transparent to-transparent" />
        </ParallaxSection>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <FadeIn>
            <div className="max-w-xl">
              <h2 className="subtitle text-[var(--accent)] mb-4">Featured Series</h2>
              <h3 className="section-title mb-6">
                Kashmir
                <br />
                <span className="text-gradient">Paradise Found</span>
              </h3>
              <p className="text-lg text-[var(--stone-300)] mb-8 leading-relaxed">
                The crown jewel of the Himalayas, Kashmir offers breathtaking landscapes that seem otherworldly. From the floating gardens of Dal Lake to the snow-capped peaks, every corner reveals a new masterpiece.
              </p>
              <button className="luxury-button">
                View Full Series
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== WEDDING SECTION ==================== */}
      <section id="weddings" className="fullscreen-section py-24 md:py-32 px-6 flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeIn direction="right">
              <div>
                <h2 className="subtitle text-[var(--accent)] mb-4">Weddings</h2>
                <h3 className="section-title mb-6">
                  Love <span className="text-gradient">Stories</span>
                </h3>
                <p className="text-lg text-[var(--stone-300)] mb-8 leading-relaxed">
                  Every wedding is a unique love story waiting to be told. I capture the intimate moments, the joyful tears, and the celebration that marks the beginning of forever.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["Candid Moments", "Ceremony", "Reception", "Portraits"].map((item, i) => (
                    <div key={i} className="glass-card p-4 rounded-xl text-center">
                      <span className="text-sm text-[var(--stone-300)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <GalleryItem src="/wedding1.jpg" alt="Wedding 1" aspect="tall" />
                </div>
                <div className="space-y-4">
                  <GalleryItem src="/wedding2.jpg" alt="Wedding 2" aspect="tall" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ==================== BUSINESS SECTION ==================== */}
      <section id="business" className="relative h-screen h-[100dvh] flex items-center">
        <ParallaxSection className="absolute inset-0 z-0">
          <Image src="/business.jpg" alt="Business" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--bg-primary)]/95 via-[var(--bg-primary)]/50 to-transparent" />
        </ParallaxSection>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 ml-auto">
          <FadeIn>
            <div className="max-w-xl ml-auto text-right">
              <h2 className="subtitle text-[var(--accent)] mb-4">Business</h2>
              <h3 className="section-title mb-6">
                Elevate Your <span className="text-gradient">Brand</span>
              </h3>
              <p className="text-lg text-[var(--stone-300)] mb-8 leading-relaxed">
                Professional photography that transforms your brand identity. From corporate headshots to product photography, we create visuals that make an impact.
              </p>
              <div className="flex flex-wrap gap-3 justify-end mb-8">
                {["Corporate", "Product", "Events", "Advertising"].map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="accent-button">
                Get a Quote
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== SOCIAL SECTION ==================== */}
      <section id="social" className="fullscreen-section py-24 md:py-32 px-6 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="subtitle text-[var(--accent)] mb-4">Social</h2>
              <h3 className="section-title mb-6">
                Follow the <span className="text-gradient">Journey</span>
              </h3>
              <p className="text-[var(--stone-400)] max-w-xl mx-auto mb-8">
                Behind the scenes, travel vlogs, and daily inspiration
              </p>
              <div className="flex flex-wrap justify-center gap-4">
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
                    <span className="text-xs text-[var(--stone-400)] ml-2">{social.handle}</span>
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
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="relative group cursor-pointer"
                >
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
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section id="contact" className="relative min-h-screen flex items-center py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <Image src="/conclusion.jpg" alt="Contact" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 w-full">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="subtitle text-[var(--accent)] mb-4">Contact</h2>
              <h3 className="section-title mb-6">
                Let's Create <span className="text-gradient">Together</span>
              </h3>
              <p className="text-[var(--stone-400)] max-w-xl mx-auto">
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
                  <label className="block text-sm text-[var(--stone-400)] mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--stone-400)] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[var(--stone-400)] mb-2">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="" className="text-black">Select project type</option>
                  <option value="wedding" className="text-black">Wedding Photography</option>
                  <option value="nature" className="text-black">Nature & Landscape</option>
                  <option value="business" className="text-black">Business & Corporate</option>
                  <option value="other" className="text-black">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--stone-400)] mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="accent-button w-full"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </FadeIn>

          <footer className="mt-20 pt-8 border-t border-[var(--glass-border)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-sm text-[var(--stone-500)]">© 2026 Mohsin Photography. All rights reserved.</span>
              <div className="flex gap-6">
                {["Instagram", "YouTube", "Email"].map((item, i) => (
                  <a key={i} href="#" className="text-sm text-[var(--stone-500)] hover:text-[var(--accent)] transition-colors">
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

// Supabase import at the end to avoid hoisting issues
import { supabase } from "@/lib/supabase";