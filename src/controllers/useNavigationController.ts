import { useState, useEffect } from 'react';
import { PageId } from '../models/silica.model';

export function useNavigationController(initialPage: PageId = 'beranda') {
  const [currentPage, setCurrentPage] = useState<PageId>(initialPage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentPage,
    mobileMenuOpen,
    isScrolled,
    navigateTo,
    toggleMobileMenu,
    closeMobileMenu,
    scrollToTop,
  };
}
