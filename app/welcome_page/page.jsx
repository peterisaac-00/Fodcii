"use client"
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Particles background (canvas-based, lightweight)
function ParticlesBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let w = (canvas.width = Math.floor(window.innerWidth * dpr));
    let h = (canvas.height = Math.floor(window.innerHeight * dpr));
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(dpr, dpr);

    let particles = [];
    const PARTICLE_COUNT = Math.max(20, Math.floor((window.innerWidth * window.innerHeight) / 90000));
    const MAX_DIST = 140;
    let rafId;

    function init() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 0.8 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: 0.3 + Math.random() * 0.7,
        });
      }
    }

    function onResize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      w = (canvas.width = Math.floor(window.innerWidth * dpr));
      h = (canvas.height = Math.floor(window.innerHeight * dpr));
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(120, 100, 255, ${0.08 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // draw particles
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        ctx.beginPath();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, `rgba(255,255,255,${0.9 * p.alpha})`);
        g.addColorStop(0.4, `rgba(180,160,255,${0.2 * p.alpha})`);
        g.addColorStop(1, `rgba(120,100,255,0)`);
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 -z-10" />;
}

// Animated numeric counter (starts when visible)
function AnimatedCounter({ end = 0, suffix = "", label = "", duration = 1200 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            let start = null;
            function step(ts) {
              if (!start) start = ts;
              const progress = Math.min((ts - start) / duration, 1);
              setValue(Math.floor(progress * end));
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [end, duration]);

  function format(n) {
    if (n >= 1000) return `${Math.round(n / 1000)}K`;
    return `${n}`;
  }

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        +{format(value)}{suffix}
      </div>
      <div className="text-sm text-gray-300 mt-2">{label}</div>
    </div>
  );
}

// Roadmap step icons (simple SVGs)
function Icon({ name }) {
  switch (name) {
    case "beginner":
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="none" fill="rgba(255,255,255,0.06)" />
          <path d="M8 12h8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "intermediate":
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="rgba(255,255,255,0.04)" />
          <path d="M8 12h8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "advanced":
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12 3 21 8.5 17 21 7 21 3 8.5" fill="rgba(255,255,255,0.04)" />
          <path d="M12 8v8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mastery":
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3" fill="rgba(255,255,255,0.06)" />
          <path d="M6 20c0-4 6-6 6-6s6 2 6 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function WelcomePage() {
  const roadmap = [
    { key: "beginner", title: "Beginner", subtitle: "Foundations & easy problems" },
    { key: "intermediate", title: "Intermediate", subtitle: "Data structures & algorithms" },
    { key: "advanced", title: "Advanced", subtitle: "Optimization & system design" },
    { key: "mastery", title: "Mastery", subtitle: "Projects & competitions" },
  ];

  const journey = [
    { title: "Sign up", desc: "Create your account in seconds" },
    { title: "Solve", desc: "Attack curated problems with the in-browser editor" },
    { title: "Track", desc: "Monitor progress, streaks and weak topics" },
    { title: "Win Badges", desc: "Earn recognition and climb the leaderboard" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
      <ParticlesBackground />

      {/* Hero */}
      <motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="pt-20 pb-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Fodci
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Master problem solving with structured tracks, instant code feedback, and a competitive community.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="#get-started" className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-bold shadow-xl hover:opacity-95 transition">Get Started</a>
            <a href="#video" className="px-6 py-3 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-800 transition">Watch Intro</a>
          </div>
        </div>
      </motion.header>

      {/* Video Placeholder */}
      <section id="video" className="px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto mt-8">
          <div id="intro-video" className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 shadow-2xl aspect-[16/9] flex items-center justify-center">
            {/* Replace inner div with your video element when ready */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10 opacity-90">
                    <path d="M5 3v18l15-9L5 3z" />
                  </svg>
                </div>
                <div className="text-gray-300">Introductory Video Placeholder</div>
                <div className="text-xs text-gray-500 mt-2">(You can paste your video element inside the #intro-video container)</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Roadmap + Counters Section */}
      <section className="mt-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Roadmap */}
          <div>
            <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold mb-4">
              Learning Roadmap
            </motion.h3>
            <p className="text-gray-300 mb-6">Follow a clear path from basics to mastery — every step is curated and hands-on.</p>

            <div className="relative">
              <div className="hidden lg:block absolute left-8 top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-500/60 to-pink-400/30"></div>

              <div className="flex flex-col gap-8">
                {roadmap.map((r, i) => (
                  <motion.div key={r.key} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }} className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-pink-500/10 border border-gray-700 flex items-center justify-center">
                        <Icon name={r.key} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{r.title}</div>
                      <div className="text-sm text-gray-400 mt-1 max-w-md">{r.subtitle}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Counters */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-gray-800 p-8 rounded-2xl shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <AnimatedCounter end={500} label={"Problems"} />
                <AnimatedCounter end={10000} label={"Submissions"} />
                <AnimatedCounter end={120} label={"Top Coders"} />
              </div>
              <div className="mt-6 text-xs text-gray-400">Live platform stats — updated in real-time for active users.</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Journey (comic-strip style) */}
      <section className="mt-20 px-6 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold mb-4">How it works</motion.h3>
          <p className="text-gray-300 mb-8">A quick visual story of a user's journey on Fodci.</p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {journey.map((j, idx) => (
              <motion.div key={j.title} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.12, duration: 0.6 }} className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white text-xl font-bold">{idx + 1}</div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm text-gray-400">{j.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.button initial={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl font-bold">
            Start Solving on Fodci
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
