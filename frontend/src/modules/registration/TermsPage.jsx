import { Link } from "react-router-dom";
import { CONTACT_PHONES } from "./content";

function TermsPage() {
  return (
    <section className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-4xl font-bold">Terms & Conditions</h1>
        <p>
          By registering for Nakshatra or sending a query, you confirm that the details you submit are yours and are accurate.
        </p>
        <p>
          Nakshatra stores your name, contact details, location, audition information, and uploaded video so the team can review your entry and contact you about the event. Partner and mission messages are stored for the same reason.
        </p>
        <p>
          Do not upload a video you do not have the right to share. Nakshatra may use registration details to organise auditions, competitions, and related communication.
        </p>
        <p>
          For questions, call{" "}
          {CONTACT_PHONES.map((phone, index) => (
            <span key={phone.tel}>
              {index > 0 ? " or " : ""}
              <a className="underline" href={`tel:${phone.tel}`}>{phone.display}</a>
            </span>
          ))}
          .
        </p>
        <Link to="/" className="inline-block underline">Back to home</Link>
      </div>
    </section>
  );
}

export default TermsPage;
