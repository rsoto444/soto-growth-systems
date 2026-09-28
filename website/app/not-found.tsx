import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";

export const metadata = { title: "Page Not Found | Soto Growth Systems", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="sgs">
        <section className="sgs-sec sgs-sec--hero">
          <div className="sgs-wrap">
            <p className="sgs-eyebrow">404</p>
            <h1>That page is not here.</h1>
            <p className="sgs-lead">The address may have changed. These are the best places to start.</p>
            <div className="sgs-btns">
              <a className="sgs-btn sgs-btn--primary" href="/">Go to the homepage</a>
              <a className="sgs-btn sgs-btn--ghost" href="/implementation-options/">See implementation options</a>
              <a className="sgs-btn sgs-btn--ghost" href="/contact/">Contact</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
