// Where every form lands. Never indexed. Shows the booking calendar.
import Script from "next/script";
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site.config";

export const metadata = pageMeta({ title: "Thank You | Soto Growth Systems", description: "Your message was received.", path: "/thank-you/", noindex: true });

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
            <div className="calendly-inline-widget" data-url={site.bookingUrl} style={{ minWidth: 320, height: 750, width: "100%" }} />
            <div className="sgs-btns"><a className="sgs-btn sgs-btn--primary" target="_blank" rel="noopener" href={site.bookingUrl}>Open Scheduler in a New Tab</a></div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
