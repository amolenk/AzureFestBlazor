"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "@/public/aos/aos.js";
import NavMenu from "./NavMenu";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }, []);

  return (
    <>
      <NavMenu />
      <main className={`${styles.main} d-flex flex-column min-vh-100`}>
        {pathname !== "/" && <div className={styles.headerSpacer}></div>}
        {children}
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
