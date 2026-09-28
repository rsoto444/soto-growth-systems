// Shared footer, using the footer styles from the WordPress site's CSS.
import { site } from "@/lib/site.config";

export default function SiteFooter() {
  const tel = site.phone.replace(/[^+\d]/g, "");
  return (
    <footer className="sgs-footer sgs-footer--v2">
      <div className="sgs-footer-top">
        <div className="sgs-footer-col">
          <h3>Soto Growth Systems</h3>
          <p className="sgs-footer-tagline">Find and Fix the Growth Leaks Costing Your Business Revenue</p>
          <p>Working alongside <a href="https://provoseopros.com/">Provo SEO Pros</a>, founded by Rich Soto in 2001.</p>
        </div>
        <div className="sgs-footer-col">
          <h3>Offers</h3>
          <ul>{site.offers.map((o) => <li key={o.href}><a href={o.href}>{o.label}</a></li>)}</ul>
        </div>
        <div className="sgs-footer-col">
          <h3>Company</h3>
          <ul>{site.company.map((o) => <li key={o.href}><a href={o.href}>{o.label}</a></li>)}</ul>
        </div>
        <div className="sgs-footer-col sgs-footer-col--cta">
          <h3>Contact</h3>
          <p><a href={`tel:${tel}`}>{site.phone}</a><br /><a href={`mailto:${site.email}`}>{site.email}</a></p>
          <p className="sgs-footer-meta">{site.cityLine}<br />{site.hours}</p>
          <a className="sgs-footer-btn" href="/book-a-strategy-call/">Book a Growth Strategy Call</a>
        </div>
      </div>
      <div className="sgs-footer-bottom">
        <span>© 2026 Soto Growth Systems</span>
        <span><a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms-of-use/">Terms of Use</a></span>
      </div>
    </footer>
  );
}
