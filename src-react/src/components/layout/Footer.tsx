import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footer} mt-auto pt-4 text-center`}>
      <div className="container">
        <div className={styles.links}>
          <a href="mailto:team@azurefest.nl">Contact us</a> | <Link href="/code-of-conduct">Code of conduct</Link> | Powered by{" "}
          <a href="https://www.sessionize.com" target="_blank" rel="noopener noreferrer">
            Sessionize
          </a>
        </div>
      </div>
    </footer>
  );
}
