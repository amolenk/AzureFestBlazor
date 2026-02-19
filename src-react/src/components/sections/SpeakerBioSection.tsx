import Section from "../layout/Section";
import styles from "./SpeakerBioSection.module.css";

interface SpeakerBioSectionProps {
  fullName: string;
  tagLine: string;
  profilePictureUrl: string;
  bio: string;
}

export default function SpeakerBioSection({ fullName, tagLine, profilePictureUrl, bio }: SpeakerBioSectionProps) {
  return (
    <Section headerText={fullName} subText={tagLine}>
      <div className="row">
        <div className="col-md-6 g-0">
          <div className={styles.speakerPhoto}>
            <img src={`/${profilePictureUrl}`} alt={`Photo of speaker ${fullName}`} />
          </div>
        </div>

        <div className="col-md-6">
          <p dangerouslySetInnerHTML={{ __html: (bio || "").replace(/\r\n|\n/g, "<br/>") }}></p>
        </div>
      </div>
    </Section>
  );
}
