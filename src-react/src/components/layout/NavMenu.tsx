"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./NavMenu.module.css";
import { websiteSettings } from "@/src/config/website-settings";

export default function NavMenu() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(pathname !== "/");

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // On non-home pages the original site keeps the header in "scrolled" mode.
    if (pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const toggleMobileNavigation = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const showTicketsLink = websiteSettings.currentEdition.registration.isOpen();

  return (
    <header className={`${styles.header} d-flex align-items-center ${isScrolled ? styles.headerScrolled : ""}`}>
      <div className="container-fluid container-xxl d-flex align-items-center">
        <div className={`${styles.logo} me-auto`}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/img/logo.svg" alt="Azure Fest" title="Azure Fest" />
          </Link>
        </div>

        <nav className={isMobileMenuOpen ? styles.navbarMobile : styles.navbar}>
          <ul>
            <li>
              <Link
                className={`${styles.navLink} ${isActive("/") ? styles.active : ""}`}
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={`${styles.navLink} ${isActive("/agenda") ? styles.active : ""}`}
                href="/agenda"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agenda
              </Link>
            </li>
            <li>
              <Link
                className={`${styles.navLink} ${isActive("/speakers") ? styles.active : ""}`}
                href="/speakers"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Speakers
              </Link>
            </li>
          </ul>
          <i
            className={`bi ${isMobileMenuOpen ? "bi-x" : "bi-list"} ${styles.mobileNavToggle}`}
            onClick={toggleMobileNavigation}
          ></i>
        </nav>

        {showTicketsLink && (
          <Link className={styles.ticketsButton} href="/tickets">
            Get Ticket
          </Link>
        )}
      </div>
    </header>
  );
}
