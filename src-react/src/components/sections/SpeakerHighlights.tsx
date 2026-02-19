"use client";

import useSWR from "swr";
import { websiteSettings } from "@/src/config/website-settings";
import Section from "../layout/Section";
import SpeakerCard from "./SpeakerCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function SpeakerHighlights() {
  const { data, error } = useSWR(`/data/${websiteSettings.currentEdition.slug}.json`, fetcher);

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const speakers = shuffle(data.Speakers || []);

  return (
    <Section id="speakers" headerText="Speakers" fadeUp={true}>
      <div className="row justify-content-center g-3">
        {speakers.slice(0, 3).map((speaker: any) => (
          <div key={speaker.Id} className="col-6 col-md-4 d-flex justify-content-center">
            <SpeakerCard speaker={speaker} />
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col d-flex justify-content-center">
          <a href="/speakers" className="btn btn-primary">
            View all {speakers.length} speakers
          </a>
        </div>
      </div>
    </Section>
  );
}
