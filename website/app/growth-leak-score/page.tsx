// The free Growth Leak Score. Rebuilt here from growthleak.sotogrowthsystems.com
// on 4 October 2026; that address is served from this page by middleware.ts.
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";
import ScoreApp from "./ScoreApp";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site.config";

export const metadata = pageMeta({
  title: "Free Growth Leak Score: 10 Questions, 5 Minutes | SGS",
  description: "Take the free Growth Leak Score: 10 questions about your lead flow, follow-up, sales process and CRM, then see your score out of 100 and top three repairs.",
  path: "/growth-leak-score/",
});

export default function GrowthLeakScorePage() {
  return (
    <>
      <SiteHeader />
      <main className="sgs">
        <ScoreApp bookingUrl={site.bookingUrl} />
      </main>
      <SiteFooter />
    </>
  );
}
