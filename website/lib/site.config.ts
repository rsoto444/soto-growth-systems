// Business facts for Soto Growth Systems. Every value here was given by the
// owner (see CLAUDE.md "My setup"). Never copy Provo SEO Pros facts in here.
export const site = {
  name: "Soto Growth Systems",
  url: "https://sotogrowthsystems.com",
  phone: "+1 833-854-0901",
  email: "contact@sotogrowthsystems.com",
  cityLine: "Provo, Utah",
  hours: "Business days, Mountain Time",
  founded: "2026",
  // GoHighLevel inbound webhook (SGS sub-account). Never in code: set
  // LEAD_WEBHOOK_URL in website/.env.local and in Vercel.
  leadWebhook: (process.env.LEAD_WEBHOOK_URL ?? null) as string | null,
  // Booking calendar shown on /thank-you/. Calendly until the SGS GoHighLevel
  // calendar exists (owner chose to switch, 28 September 2026).
  bookingUrl: "https://calendly.com/rsoto443/30min",
  scoreUrl: "https://growthleak.sotogrowthsystems.com/",
  nav: [
    { label: "Home", href: "/" },
    { label: "About Rich", href: "/about-rich/" },
    { label: "Free Growth Leak Score", href: "https://growthleak.sotogrowthsystems.com/" },
    { label: "Soto Growth OS™", href: "/soto-growth-os/" },
    { label: "Implementation Options", href: "/implementation-options/" },
  ],
  offers: [
    { label: "Growth Leak Assessment™", href: "/growth-leak-assessment/" },
    { label: "Growth OS Blueprint™", href: "/growth-os-blueprint/" },
    { label: "Guided Implementation™", href: "/growth-os-implementation-draft-v2/" },
    { label: "Managed Implementation™", href: "/growth-os-managed-implementation/" },
    { label: "Fractional Growth Operator™", href: "/fractional-growth-operator/" },
  ],
  company: [
    { label: "About Rich", href: "/about-rich/" },
    { label: "Soto Growth OS™", href: "/soto-growth-os/" },
    { label: "Growth OS Implementation™", href: "/growth-os-implementation/" },
    { label: "Resources", href: "/resources/" },
    { label: "Contact", href: "/contact/" },
  ],
};
