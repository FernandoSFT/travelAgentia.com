'use client';

import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre mí', href: '#sobre-mi' },
    { name: 'Metodología', href: '#metodologia' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Casos reales', href: '#casos' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className={cn(styles.navbar, isScrolled && styles.scrolled)}>
      <div className={cn('container', styles.container)}>
        <a href="/" className={styles.logo}>
          <span className="gradient-text">TravelAgentIA</span>
        </a>

        {/* Desktop Nav */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={styles.link}>
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={cn(styles.mobileNav, isMobileMenuOpen && styles.open)}>
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            className={styles.mobileLink}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};
