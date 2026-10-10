import { Leaf, Globe, Users } from "lucide-react";

import sdgs9 from "../../assets/sdgs9.png";
import sdgs11 from "../../assets/sdgs11.png";
import sdgs12 from "../../assets/sdgs12.png";
import inovasiImage from "../../assets/inovasi.png";

export function LandingFooter() {
  return (
    <footer className="landing-footer flex-shrink-0 -translate-y-1">
      {/* Col 1: Evidence */}
      <div className="landing-footer-col landing-footer-evidence flex flex-col justify-center w-[28%] pr-8">
        <div className="text-[11px] font-mono tracking-widest text-white mb-2 font-bold uppercase">
          EVIDENCE-FIRST DSS
        </div>
        <div className="w-10 h-[2px] bg-[#4ade80] mb-3"></div>
        <div className="text-[12px] text-white/90 mb-1.5 font-medium">
          Literature <span className="text-gray-500 mx-1">→</span>{" "}
          Experiment <span className="text-gray-500 mx-1">→</span>{" "}
          Validation
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed pr-4">
          Setiap keputusan mempertahankan status evidence, provenance, dan
          data gap.
        </p>
      </div>

      <div className="landing-footer-separator w-[1px] bg-white/10 my-1"></div>

      {/* Col 2: SDGs */}
      <div className="landing-footer-col landing-footer-sdgs flex flex-col items-center justify-center w-[30%] px-8">
        <div className="text-[9px] font-mono tracking-[0.15em] text-gray-400 mb-3 text-center uppercase">
          Mendukung Tujuan Pembangunan Berkelanjutan (SDGs)
        </div>
        <div className="landing-sdg-row flex items-center justify-center gap-4">
          <img
            src={sdgs9}
            alt="SDG 9"
            className="h-[62px] w-auto object-contain rounded-sm"
          />
          <img
            src={sdgs11}
            alt="SDG 11"
            className="h-[62px] w-auto object-contain rounded-sm"
          />
          <img
            src={sdgs12}
            alt="SDG 12"
            className="h-[62px] w-auto object-contain rounded-sm"
          />
        </div>
      </div>

      <div className="landing-footer-separator w-[1px] bg-white/10 my-1"></div>

      {/* Col 3: Gambar Inovasi */}
      <div className="landing-footer-col landing-footer-inovasi flex items-center justify-center w-[20%] px-6">
        <img
          src={inovasiImage}
          alt="Inovasi untuk Indonesia yang Lebih Baik"
          className="max-h-[90px] w-auto object-contain"
        />
      </div>

      <div className="landing-footer-separator w-[1px] bg-white/10 my-1"></div>

      {/* Col 4: List Impact */}
      <div className="landing-footer-col landing-footer-impact flex flex-col justify-center gap-3.5 w-[22%] pl-8">
        <div className="flex items-center gap-3 text-[10px] text-gray-200">
          <Globe size={14} className="text-gray-400" strokeWidth={1.5} />
          Sumber daya lokal
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-200">
          <Leaf size={14} className="text-gray-400" strokeWidth={1.5} />
          Konstruksi berkelanjutan
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-200">
          <Users size={14} className="text-gray-400" strokeWidth={1.5} />
          Dampak nyata bagi masyarakat
        </div>
      </div>
    </footer>
  );
}