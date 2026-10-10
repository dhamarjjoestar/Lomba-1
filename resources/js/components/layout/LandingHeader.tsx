import { ArrowRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import logoUnnes from "../../assets/unnes.png";
import logoGemaste from "../../assets/gemaste.png";
import logoHimpro from "../../assets/himpro.png";

const navigationItems = [
  { title: "Beranda" },
  { title: "Simulasi" },
  { title: "Metopen" },
  { title: "Tim Pengembang" },
];

export function LandingHeader({
  onStart,
  onOpenMetopen,
}: {
  onStart: (mode: "demo" | "actual") => void;
  onOpenMetopen?: () => void;
}) {
  return (
    /* 1. py-2.5 agar tinggi header lebih ramping & compact */
    <header className="landing-header flex items-center justify-between py-2.5 flex-shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 lg:gap-3.5">
        {/* leading-none agar teks tidak meninggalkan sisa ruang vertikal */}
        <div className="text-[18px] lg:text-[20px] font-bold tracking-tight leading-none">
          SILICA<span className="text-[#4ade80]">2</span>CON
        </div>

        {/* 2. Ukuran logo disesuaikan (h-6 sampai h-7) agar tidak mendesak header */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
          <img
            src={logoUnnes}
            alt="UNNES"
            className="h-6 lg:h-7 w-auto object-contain"
          />
          <img
            src={logoGemaste}
            alt="GEMASTE"
            className="h-6 lg:h-7 w-auto object-contain"
          />
          <img
            src={logoHimpro}
            alt="HIMPRO"
            className="h-6 lg:h-7 w-auto object-contain"
          />
        </div>
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2">
          <img
            src={logoUnnes}
            alt="UNNES"
            className="h-5 w-auto object-contain"
          />
        </div>
      </div>

      {/* Desktop Navigation & CTA */}
      <div className="hidden md:flex items-center gap-5 lg:gap-6">
        <nav className="flex items-center gap-4 lg:gap-5">
          {navigationItems.map((item) => (
            <span
              key={item.title}
              className={`text-[12px] lg:text-[13px] font-medium leading-none text-white/90 hover:text-[#4ade80] transition-colors ${item.title === "Metopen" ? "cursor-pointer" : "cursor-default"}`}
              onClick={item.title === "Metopen" ? onOpenMetopen : undefined}
            >
              {item.title}
            </span>
          ))}
        </nav>

        {/* 3. Ukuran tombol disesuaikan: h-8, px-4, py-0 agar seimbang vertikal dengan logo & teks */}
        <Button
          onClick={() => onStart("demo")}
          className="h-8 px-4 text-[12px] font-medium bg-[#4ade80] hover:bg-[#37c46b] border-[#4ade80] text-white rounded-full inline-flex items-center"
        >
          Mulai Simulasi <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Mobile Menu Trigger */}
      <div className="md:hidden flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:text-[#4ade80]"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 bg-[#02130c] border-white/10"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {navigationItems.map((item) => (
                <span
                  key={item.title}
                  className={`text-[14px] font-medium text-white/90 hover:text-[#4ade80] transition-colors ${item.title === "Metopen" ? "cursor-pointer" : "cursor-default"}`}
                  onClick={item.title === "Metopen" ? onOpenMetopen : undefined}
                >
                  {item.title}
                </span>
              ))}
              <Button
                onClick={() => onStart("demo")}
                className="mt-4 bg-[#4ade80] hover:bg-[#37c46b] border-[#4ade80] text-white rounded-full w-full h-9 text-sm"
              >
                Mulai Simulasi <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
