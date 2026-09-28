// Where every form lands. Never indexed. Shows the booking calendar.
import Script from "next/script";
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site.config";

export const metadata = pageMeta({ title: "Thank You | Soto Growth Systems", description: "Your message was received.", path: "/thank-you/", noindex: true });

// GoHighLevel's embed script resizes the calendar by this id.
const bookingId = site.bookingUrl.split("/").pop();

export default function ThankYou() {
  return (
    <>
      <SiteHeader />
      <main className="sgs">
        <section className="sgs-sec sgs-sec--hero">
          <div className="sgs-wrap">
            <p className="sgs-eyebrow">Message received</p>
            <h1>Thank you. We have your details.</h1>
            <p className="sgs-lead">Enquiries are reviewed on business days in Mountain Time. If you would like to talk sooner, pick a time for a Growth Strategy Call below.</p>
          </div>
        </section>
        <section className="sgs-sec sgs-sec--alt">
          <div className="sgs-wrap">
            <iframe src={site.bookingUrl} id={`${bookingId}_embed`} title="Book a Growth Strategy Call" scrolling="no" style={{ width: "100%", minHeight: 750, border: "none", overflow: "hidden" }} />
            <div className="sgs-btns"><a className="sgs-btn sgs-btn--primary" target="_blank" rel="noopener" href={site.bookingUrl}>Open Scheduler in a New Tab</a></div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
    </>
  );
}
