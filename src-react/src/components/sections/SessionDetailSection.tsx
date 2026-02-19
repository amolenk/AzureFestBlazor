import { websiteSettings } from "@/src/config/website-settings";
import SpeakerCard from "./SpeakerCard";

interface Speaker {
  Id: string;
  FullName: string;
  ProfilePictureUrl: string;
}

interface Session {
  Id: string;
  Title: string;
  Description?: string;
  Room?: string;
  StartsAt?: string;
  EndsAt?: string;
  Speakers?: Speaker[];
}

function formatTimeLocation(session: Session) {
  if (!websiteSettings.currentEdition.schedule.announced || !session.StartsAt || !session.EndsAt) {
    return "";
  }

  const starts = new Date(session.StartsAt);
  const ends = new Date(session.EndsAt);
  const day = starts.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short"
  });
  const startTime = starts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const endTime = ends.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return `${day} ${startTime} - ${endTime}`;
}

export default function SessionDetailSection({ session, edition }: { session: Session; edition?: string }) {
  return (
    <div className="row">
      <div className="card p-0">
        {session.StartsAt && (
          <div className="card-header">
            <h2>{formatTimeLocation(session)}</h2>
          </div>
        )}
        <div className="card-body">
          <p dangerouslySetInnerHTML={{ __html: (session.Description || "").replace(/\r\n|\n/g, "<br/>") }}></p>
          {websiteSettings.currentEdition.schedule.announced && session.Room && (
            <h6>
              <span className="badge rounded-pill bg-danger">{session.Room}</span>
            </h6>
          )}
        </div>
        <div className="card-footer d-flex justify-content-center">
          {(session.Speakers || []).map((speaker) => (
            <SpeakerCard key={speaker.Id} speaker={speaker} edition={edition} />
          ))}
        </div>
      </div>
    </div>
  );
}
