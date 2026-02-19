import Section from "../layout/Section";
import styles from "./Venue.module.css";

export default function Venue() {
  return (
    <Section id="venue" headerText="Venue" fadeUp={true}>
      <div className="row">
        <div className={`col-lg-6 ${styles.venueMap}`}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2453.203311278285!2d5.108847976966992!3d52.05782157194375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c665c3d22bd00b%3A0x6cd96f61035580ad!2sRingwade%201%2C%203439%20LM%20Nieuwegein!5e0!3m2!1sen!2snl!4v1720070456873!5m2!1sen!2snl"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className={`col-lg-6 ${styles.venueInfo}`}>
          <div className="row justify-content-center">
            <div className="col-11 col-lg-8 position-relative">
              <h3>Sopra Steria</h3>
              <h4>Ringwade 1, Nieuwegein, NL</h4>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
