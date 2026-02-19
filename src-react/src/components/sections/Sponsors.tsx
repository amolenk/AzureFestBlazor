import { websiteSettings } from "@/src/config/website-settings";
import Section from "../layout/Section";
import styles from "./Sponsors.module.css";

function shuffle<T>(items: T[]) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export default function Sponsors() {
  const sponsors = websiteSettings.currentEdition.sponsors;
  const gold = shuffle(sponsors.gold);
  const community = shuffle(sponsors.community);

  return (
    <>
      <Section id="gold-sponsors" headerText="Gold sponsors" sectionBackground={1} fadeUp={true}>
        <div className="row justify-content-center g-3">
          {gold.map((sponsor) => (
            <div className="col-6 col-md-4" key={sponsor.name}>
              <div className={styles.sponsorLogo}>
                <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <img src={`/${sponsor.imageUrl}`} className="img-fluid" alt={sponsor.name} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="community-sponsors" headerText="Community sponsors" fadeUp={true}>
        <div className="row justify-content-center g-3">
          {community.map((sponsor) => (
            <div className="col-4 col-md-3" key={sponsor.name}>
              <div className={`${styles.sponsorLogo} ${styles.community}`}>
                <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <img src={`/${sponsor.imageUrl}`} className="img-fluid" alt={sponsor.name} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
