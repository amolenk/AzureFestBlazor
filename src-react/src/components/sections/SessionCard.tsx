"use client";

import { websiteSettings } from "@/src/config/website-settings";
import styles from "./SessionCard.module.css";

interface Speaker {
  Id: string;
  FullName: string;
  ProfilePictureUrl: string;
}

interface Session {
  Id: string;
  Title: string;
  Room?: string;
  IsServiceSession?: boolean;
  Speakers?: Speaker[];
}

export default function SessionCard({ session, edition }: { session: Session; edition?: string }) {
  const targetEdition = edition ?? websiteSettings.currentEdition.slug;
  const url = `/${targetEdition}/session/${session.Id}`;

  if (session.IsServiceSession) {
    return (
      <div className={`card m-3 ${styles.card} ${styles.serviceSession}`}>
        <div className="card-body">
          <h6 className={`card-subtitle mb-2 text-muted ${styles.roomLabel}`}>{session.Room}</h6>
          <h5 className={`card-title ${styles.cardTitle}`}>{session.Title}</h5>
        </div>
      </div>
    );
  }

  return (
    <div className={`card m-3 ${styles.card}`} onClick={() => (window.location.href = url)}>
      <div className="card-body">
        <h6 className={`mb-2 text-muted ${styles.roomLabel}`}>{session.Room}</h6>
        <h5 className={`card-title ${styles.cardTitle}`}>{session.Title}</h5>
      </div>
      <div className="card-footer bg-transparent border-0">
        {(session.Speakers || []).map((speaker) => (
          <h6 key={speaker.Id} className="mb-2 text-muted">
            <img
              loading="lazy"
              src={`/${speaker.ProfilePictureUrl}`}
              className={styles.speakerPhoto}
              alt={`Photo of ${speaker.FullName}`}
            />{" "}
            {speaker.FullName}
          </h6>
        ))}
      </div>
    </div>
  );
}
