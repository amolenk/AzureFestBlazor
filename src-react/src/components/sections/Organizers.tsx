import { websiteSettings } from "@/src/config/website-settings";
import Section from "../layout/Section";
import styles from "./Organizers.module.css";

export default function Organizers() {
  return (
    <Section id="organizers" headerText="Organizers">
      <div className="row justify-content-center g-3">
        {websiteSettings.currentEdition.organizers.map((organizer) => (
          <div className="col-6 col-md-4" key={organizer.name}>
            <div className={styles.organizerItem}>
              <div className={styles.organizerPhoto}>
                <img src={`/${organizer.imageUrl}`} alt={organizer.name} />
              </div>
              <h4>{organizer.name}</h4>
              <p>{organizer.company}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
