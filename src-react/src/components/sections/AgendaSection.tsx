"use client";

import useSWR from "swr";
import { websiteSettings } from "@/src/config/website-settings";
import Section from "../layout/Section";
import SessionCard from "./SessionCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface SessionRecord {
  Id: string;
  Title: string;
  StartsAt?: string;
  EndsAt?: string;
  IsServiceSession?: boolean;
  Room?: string;
  speakers?: string[];
  Speakers?: any[];
}

export default function AgendaSection() {
  const edition = websiteSettings.currentEdition;
  const { data, error } = useSWR(`/data/${edition.slug}.json`, fetcher);

  if (error) {
    return (
      <Section headerText="Agenda">
        <div className="row text-center">
          <p>Failed to load agenda.</p>
        </div>
      </Section>
    );
  }

  if (!data) {
    return null;
  }

  const sessions: SessionRecord[] = (data.Sessions || []).map((session: SessionRecord) => ({
    ...session,
    Speakers: (session.speakers || [])
      .map((speakerId) => (data.Speakers || []).find((speaker: any) => speaker.Id === speakerId))
      .filter(Boolean)
  }));

  const slots = new Map<string, SessionRecord[]>();
  sessions
    .filter((session) => session.StartsAt)
    .sort((a, b) => (a.StartsAt || "").localeCompare(b.StartsAt || ""))
    .forEach((session) => {
      const key = session.StartsAt as string;
      if (!slots.has(key)) {
        slots.set(key, []);
      }
      slots.get(key)?.push(session);
    });

  return (
    <Section headerText="Agenda">
      {edition.schedule.announced ? (
        <>
          {!edition.schedule.finalized && (
            <div className="row text-center mb-4">
              <p>The agenda is still being finalized, and session times are subject to change.</p>
            </div>
          )}
          {Array.from(slots.entries()).map(([startAt, slotSessions]) => {
            const firstSession = slotSessions[0];
            const start = new Date(startAt);
            const end = firstSession?.EndsAt ? new Date(firstSession.EndsAt) : null;

            return (
              <div key={startAt}>
                <div className="row text-center">
                  <h2>{`${start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - ${
                    end ? end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : ""
                  }`}</h2>
                </div>

                <div className="row justify-content-center g-3">
                  {slotSessions.map((session) => (
                    <SessionCard key={session.Id} session={session} />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div className="row text-center">
            <p>We are diligently finalizing the event agenda.</p>
            <p>
              Please check back soon for the complete timetable. Meanwhile, explore the exciting sessions
              scheduled for Azure Fest.
            </p>
          </div>

          <div className="row justify-content-center g-3">
            {sessions
              .filter((session) => !session.IsServiceSession)
              .sort((a, b) => (a.Title || "").localeCompare(b.Title || ""))
              .map((session) => (
                <div key={session.Id} className="col-12 col-md-4 d-flex justify-content-center">
                  <SessionCard session={session} />
                </div>
              ))}
          </div>
        </>
      )}
    </Section>
  );
}
