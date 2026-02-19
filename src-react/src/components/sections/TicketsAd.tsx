import { websiteSettings } from "@/src/config/website-settings";
import Section from "../layout/Section";
import styles from "./TicketsAd.module.css";

export default function TicketsAd() {
  const edition = websiteSettings.currentEdition;

  return (
    <Section id="buy-tickets" headerText="Tickets" sectionBackground={1} fadeUp={true}>
      {edition.registration.isOpen() ? (
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className={`card mb-5 mb-lg-0 ${styles.card}`}>
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase text-center">General admission</h5>
                <h6 className={styles.cardPrice}>FREE</h6>
                <hr />
                <div className="text-center">
                  <p>Tickets to Azure Fest are 100% free and include parking &amp; diner.</p>
                </div>
                <hr />
                <div className="text-center">
                  <a href="/tickets" className="btn btn-primary">
                    Get ticket
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <p>Tickets to Azure Fest are 100% free and include parking &amp; diner.</p>
            <p>Available from July 8th for everybody. Members of Dutch Azure Meetup can get a ticket 1 day earlier.</p>
          </div>
        </div>
      )}
    </Section>
  );
}
