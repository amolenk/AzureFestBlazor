"use client";

import useSWR from "swr";
import { websiteSettings } from "@/src/config/website-settings";
import Section from "../layout/Section";
import SpeakerCard from "./SpeakerCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SpeakersSection({ edition }: { edition?: string }) {
  const selectedEdition = edition ?? websiteSettings.currentEdition.slug;
  const cfp = websiteSettings.currentEdition.cfp;
  const { data, error } = useSWR(`/data/${selectedEdition}.json`, fetcher);

  if (error) {
    return (
      <Section headerText="Speakers">
        <div className="text-center">
          <p>Failed to load speakers.</p>
        </div>
      </Section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Section headerText="Speakers">
      {cfp.isOpen() && (
        <div className="text-center mb-4">
          <p>
            Interested in speaking? Submit your session via{" "}
            <a href={cfp.sessionizeUrl} target="_blank" rel="noopener noreferrer">
              Sessionize
            </a>
            .
          </p>
        </div>
      )}
      <div className="row justify-content-center g-3">
        {(data.Speakers || []).map((speaker: any) => (
          <div key={speaker.Id} className="col-6 col-md-4 d-flex justify-content-center">
            <SpeakerCard speaker={speaker} edition={selectedEdition} />
          </div>
        ))}
      </div>
    </Section>
  );
}
