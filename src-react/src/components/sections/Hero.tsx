"use client";

import { websiteSettings } from "@/src/config/website-settings";
import styles from "./Hero.module.css";

export default function Hero() {
  const scrollToAbout = () => {
    const about = document.querySelector("#about");
    if (!about) return;

    const headerSize = 70;
    const offsetTop = about.getBoundingClientRect().top + window.scrollY - headerSize;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroContainer}>
        <img
          className={`${styles.logo} pb-10`}
          src={`/img/${websiteSettings.currentEdition.slug}/hero.svg`}
          alt="Azure Fest"
          data-aos="zoom-in"
          data-aos-delay="100"
        />
        <span>
          <button className={styles.linkBtn} onClick={scrollToAbout}>
            About Azure Fest
          </button>
          {websiteSettings.currentEdition.schedule.announced && (
            <a className={styles.linkBtn} href="/agenda">
              Agenda
            </a>
          )}
        </span>
      </div>
    </section>
  );
}
