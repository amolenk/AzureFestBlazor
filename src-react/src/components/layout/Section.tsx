import styles from "./Section.module.css";

interface SectionProps {
  id?: string;
  headerText?: string;
  subText?: string;
  extraClass?: string;
  sectionBackground?: number;
  fadeUp?: boolean;
  children: React.ReactNode;
}

export default function Section({
  id,
  headerText,
  subText,
  extraClass,
  sectionBackground,
  fadeUp,
  children
}: SectionProps) {
  const sectionClasses = [sectionBackground ? styles.sectionWithBg : "", extraClass || ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={`${sectionClasses} py-4`.trim()} data-aos={fadeUp ? "fade-up" : undefined}>
      <div className="container">
        {headerText && (
          <header className={styles.sectionHeader}>
            <h2>{headerText}</h2>
            {subText && <h4 className="text-center">{subText}</h4>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
