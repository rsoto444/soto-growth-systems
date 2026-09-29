// Service schema for the offer pages: what each page sells and its published
// starting price, in the owner's words (CLAUDE.md "My setup"). Prices change
// here and on the page together, never one without the other.
type OfferInfo = { name: string; price?: number; priceNote?: string; alternateName?: string[]; serviceType?: string };

export const offerSchemaByPath: Record<string, OfferInfo> = {
  "/growth-leak-assessment/": { name: "Professional Growth Leak Assessment™", price: 997, priceNote: "Starting price. Credited toward a Growth OS Blueprint™ if bought within 90 days." },
  "/growth-os-blueprint/": { name: "Growth OS Blueprint™", price: 7500, priceNote: "Starting price, one-time, 4 to 6 weeks." },
  "/growth-os-guided-implementation/": { name: "Growth OS Guided Implementation™", price: 18000, priceNote: "Starting at $18,000 setup plus $4,500 per month, 3-month minimum." },
  "/growth-os-managed-implementation/": { name: "Growth OS Managed Implementation™", price: 35000, priceNote: "Starting at $35,000 setup plus $8,500 per month, 6-month minimum." },
  "/fractional-growth-operator/": { name: "Fractional Growth Operator™", price: 5500, priceNote: "Starting at $5,500 per month, 6-month minimum, no setup fee.", alternateName: ["Fractional COO", "Fractional COO services"], serviceType: "Fractional COO services" },
  "/construction-business-consultant/": { name: "Construction business consulting", price: 997, priceNote: "Starts with the Professional Growth Leak Assessment™ from $997.", alternateName: ["Business consultant for contractors", "HVAC business consultant", "Plumbing business consultant"], serviceType: "Construction business consulting" },
  "/business-growth-consultant/": { name: "Business growth consulting", price: 997, priceNote: "Starts with the Professional Growth Leak Assessment™ from $997.", alternateName: ["Growth consultant", "Growth strategy consulting"], serviceType: "Business growth consulting" },
  "/crm-consulting-services/": { name: "CRM consulting services", price: 997, priceNote: "Starts with the Professional Growth Leak Assessment™ from $997.", alternateName: ["CRM system consultant", "CRM cleanup", "CRM setup services", "GoHighLevel setup"], serviceType: "CRM consulting services" },
  "/crm-implementation-services/": { name: "CRM implementation services", price: 18000, priceNote: "Guided Implementation starts at $18,000 setup plus $4,500 per month.", alternateName: ["CRM implementation consultant", "GoHighLevel implementation"], serviceType: "CRM implementation services" },
  "/business-process-improvement-consultant/": { name: "Business process improvement consulting", price: 997, priceNote: "Starts with the Professional Growth Leak Assessment™ from $997.", alternateName: ["Business process management consultant", "Operational efficiency consultant"], serviceType: "Business process improvement consulting" },
  "/growth-os-implementation/": { name: "Growth OS Implementation™" },
  "/implementation-options/": { name: "Growth OS implementation options" },
  "/soto-growth-os/": { name: "Soto Growth OS™" },
};
