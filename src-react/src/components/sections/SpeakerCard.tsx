"use client";

import { websiteSettings } from "@/src/config/website-settings";
import styles from "./SpeakerCard.module.css";

interface Speaker {
  Id: string;
  FullName: string;
  ProfilePictureUrl: string;
}

export default function SpeakerCard({ speaker, edition }: { speaker: Speaker; edition?: string }) {
  const targetEdition = edition ?? websiteSettings.currentEdition.slug;
  const url = `/${targetEdition}/speaker/${speaker.Id}`;

  return (
    <div className={`card bg-transparent text-white my-2 ${styles.card}`} onClick={() => (window.location.href = url)}>
      <img src={`/${speaker.ProfilePictureUrl}`} className="card-img" alt={`Photo of ${speaker.FullName}`} />
      <div className="p-0 card-img-overlay d-flex flex-column align-items-start">
        <span className={`mt-auto w-100 p-2 text-center ${styles.speakerName}`}>{speaker.FullName}</span>
      </div>
    </div>
  );
}
