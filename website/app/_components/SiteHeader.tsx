// Shared header: logo, the same five menu items as the WordPress site, one button.
// The mobile menu is a plain <details>, so it works with no JavaScript.
import { site } from "@/lib/site.config";

const isExternal = (href: string) => href.startsWith("http");

export default function SiteHeader() {
  const links = site.nav.map((n) => (
    <a key={n.href} href={n.href} {...(isExternal(n.href) ? { target: "_blank", rel: "noopener" } : {})}>{n.label}</a>
  ));
  return (
    <header className="sgsx-header">
      <div className="sgsx-header-inner">
        <a href="/" className="sgsx-logo" aria-label="Soto Growth Systems home">
          <img src="/images/logo.webp" alt="Soto Growth Systems" width={250} height={36} fetchPriority="high" />
        </a>
        <nav className="sgsx-nav" aria-label="Main">{links}</nav>
        <a href="/book-a-strategy-call/" className="sgsx-header-btn">Book a Strategy Call</a>
        <details className="sgsx-menu">
          <summary aria-label="Open menu">Menu</summary>
          <nav aria-label="Mobile">
            {links}
            <a href="/book-a-strategy-call/">Book a Strategy Call</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
