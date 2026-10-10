import React from 'react';
import { useNavigationController } from './controllers/useNavigationController';
import { NavbarView } from './views/components/NavbarView';
import { FooterView } from './views/components/FooterView';
import { HomeLandingPageView } from './views/pages/HomeLandingPageView';
import { SimulasiPageView } from './views/pages/SimulasiPageView';
import { MetopenPageView } from './views/pages/MetopenPageView';
import { TeamPageView } from './views/pages/TeamPageView';

/**
 * App Root Component (MVC Architecture Coordinator)
 * - Model: Domain entities, state types & calculations in src/models/
 * - View: Presentation layer & layouts in src/views/
 * - Controller: Business logic hooks & navigation management in src/controllers/
 */
export default function App() {
  const {
    currentPage,
    mobileMenuOpen,
    isScrolled,
    navigateTo,
    toggleMobileMenu,
    scrollToTop,
  } = useNavigationController('beranda');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* View: Top Navigation Bar */}
      <NavbarView
        activePage={currentPage}
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        onNavigate={navigateTo}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* View: Active Page Routing */}
      <main className="flex-1 w-full">
        {currentPage === 'beranda' && (
          <HomeLandingPageView onNavigate={navigateTo} />
        )}

        {currentPage === 'simulasi' && (
          <SimulasiPageView onBackToHome={() => navigateTo('beranda')} />
        )}

        {currentPage === 'metopen' && (
          <MetopenPageView onBackToHome={() => navigateTo('beranda')} />
        )}

        {currentPage === 'tim-kami' && (
          <TeamPageView onBackToHome={() => navigateTo('beranda')} />
        )}
      </main>

      {/* View: Footer (hanya ditampilkan pada halaman beranda) */}
      {currentPage === 'beranda' && (
        <FooterView onNavigate={navigateTo} onScrollToTop={scrollToTop} />
      )}
    </div>
  );
}
