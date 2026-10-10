import React from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { PageId } from '../../models/silica.model';

interface NavbarViewProps {
  activePage: PageId;
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  onNavigate: (page: PageId) => void;
  onToggleMobileMenu: () => void;
}

export const NavbarView: React.FC<NavbarViewProps> = ({
  activePage,
  isScrolled,
  mobileMenuOpen,
  onNavigate,
  onToggleMobileMenu,
}) => {
  const navLinks: { label: string; id: PageId }[] = [
    { label: 'Beranda', id: 'beranda' },
    { label: 'Simulasi', id: 'simulasi' },
    { label: 'Metopen', id: 'metopen' },
    { label: 'Tim Kami', id: 'tim-kami' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
          : 'bg-white border-b border-slate-200 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Logo Project GEOCEDS di sebelah kiri */}
          <button
            onClick={() => onNavigate('beranda')}
            className="flex items-center gap-3 text-slate-900 group whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md cursor-pointer"
            aria-label="GEOCEDS Beranda"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-xs bg-slate-100 group-hover:ring-2 group-hover:ring-emerald-500/30 transition-all">
              <img
                src="/images/logo_project.png"
                alt="Logo GEOCEDS"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              GEO<span className="text-emerald-600">CEDS</span>
            </span>
          </button>

          {/* Zone 2: Navbar di header (beranda | simulasi | metopen | tim kami) */}
          <nav
            aria-label="Navigasi Header"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
          >
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded cursor-pointer ${
                    isActive
                      ? 'text-emerald-700 font-semibold'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Tombol Mulai Simulasi di pojok kanan */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('simulasi')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 whitespace-nowrap cursor-pointer active:scale-[0.98]"
            >
              <span>Mulai Simulasi</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-200 mt-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
            <div className="pt-3 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate('simulasi')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
              >
                <span>Mulai Simulasi DSS</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
