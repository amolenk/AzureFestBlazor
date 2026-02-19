import { websiteSettings } from "@/src/config/website-settings";
import Section from "../layout/Section";
import styles from "./About.module.css";

export default function About() {
  const edition = websiteSettings.currentEdition;

  return (
    <Section id="about" sectionBackground={1}>
      <div className={`row pt-4 ${styles.about}`}>
        <div className="col-lg-6">
          <h2>About Azure Fest</h2>
          <p>
            Azure Fest NL is a <strong>100% free</strong>, single day, in-person community event for all
            things Azure. We bring together world-class local and international speakers sharing real
            world experiences, best practices and the latest developments on the Azure platform.
          </p>
        </div>
        <div className="col-lg-3">
          <h3>Where</h3>
          <p>
            Sopra Steria
            <br />
            Ringwade 1
            <br />
            Nieuwegein, NL
          </p>
        </div>
        <div className="col-lg-3">
          <h3>When</h3>
          <p>
            {edition.conferenceDate.toLocaleDateString("en-US", {
              weekday: "long",
              timeZone: "Europe/Amsterdam"
            })}
            <br />
            {edition.conferenceDate.toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
              timeZone: "Europe/Amsterdam"
            })}
          </p>
        </div>
      </div>
    </Section>
  );
}
