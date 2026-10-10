import { MapPin, Beaker, BookOpen, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

import diengImage from "../../assets/dieng.png";

const titleWords = [
  "Dari",
  "Residu",
  "Geotermal",
  "Menjadi",
  "Kandidat",
  "Paving",
  "Berkelanjutan",
];

const featureLabels = [
  { icon: Beaker, label: "Karakterisasi Terstruktur" },
  { icon: BookOpen, label: "Simulasi Berbasis Literatur" },
  { icon: CheckCircle, label: "Jejak Bukti Lengkap" },
];


export default function LandingPage({
  onStart,
  onOpenMetopen,
}: {
  onStart: (mode: "demo" | "actual") => void;
  onOpenMetopen?: () => void;
}) {
  return (
    <div className="landing-page relative w-full h-screen min-h-[768px] overflow-hidden flex flex-col font-sans text-white bg-[#02130c]">
      {/* 1. BACKGROUND & GRADIENT OVERLAYS (Diperbaiki agar gunung tidak gelap) */}
      <img
        src={diengImage}
        alt="Kawasan panas bumi Dieng"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Gradien dari kiri (membantu teks hero terbaca) */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[55%] bg-gradient-to-r from-[#02130c] via-[#02130c]/90 to-transparent z-10 pointer-events-none"></div>
      {/* Gradien dari bawah (membantu stepper dan footer terbaca) */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#02130c] via-[#02130c]/95 to-transparent z-10 pointer-events-none"></div>

      {/* Main Container */}
      <div className="landing-shell relative z-20 flex flex-col h-full w-full max-w-[1536px] mx-auto px-10 xl:px-16">
        <LandingHeader onStart={onStart} onOpenMetopen={onOpenMetopen} />

        {/* HERO SECTION */}
        <main className="landing-main flex-1 flex flex-col justify-center relative pb-10">
          <div className="landing-hero max-w-2xl -translate-y-12">
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[2rem] xl:text-[3rem] leading-[1.05] font-bold text-white tracking-tight text-center mx-auto"
            >
              {titleWords.map((word, index) => {
                const isLast = index === titleWords.length - 1;
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.6,
                    }}
                    className={`inline-block mx-1 md:mx-2 ${
                      isLast ? "text-[#4ade80]" : ""
                    }`}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-5 text-[12px] xl:text-[12.5px] leading-relaxed text-gray-300 max-w-lg text-center mx-auto"
            >
              SILICA2CON membantu menilai residu panas bumi kaya silika melalui
              karakterisasi, formulasi, simulasi, technical gate, ekonomi &
              lingkungan, hingga keputusan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              {featureLabels.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.2 + index * 0.12,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                >
                  <feature.icon className="h-4 w-4 text-[#4ade80]" />
                  <span className="text-[10px] md:text-[11px] font-medium">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* LOCATION PIN (Responsive positioning) */}
          <div className="landing-location absolute right-0 top-1/2 -translate-y-1/2 flex items-start gap-3">
            <MapPin size={22} className="text-white mt-1" strokeWidth={1.5} />
            <div>
              <div className="text-[13px] font-mono tracking-widest font-bold">
                DIENG, INDONESIA
              </div>
              <div className="text-[12px] text-gray-300 mt-1 leading-relaxed">
                Geothermal silica-rich residue
                <br />
                for a more sustainable construction
              </div>
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
