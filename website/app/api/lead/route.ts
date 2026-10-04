import { NextResponse } from "next/server";
import { site } from "@/lib/site.config";
import { SMS_CONSENT_TEXT } from "@/lib/enquiry-form";

// Every form on this site posts here; this forwards the lead to the SGS
// GoHighLevel inbound webhook (LEAD_WEBHOOK_URL). Until the webhook is set,
// submissions return a clear error instead of vanishing.
// The Growth Leak Score posts JSON and waits for a yes/no so it can reveal the
// score; every other form posts normally and lands on /thank-you/.
export async function POST(request: Request) {
  const isJson = (request.headers.get("content-type") ?? "").includes("application/json");
  const payload: Record<string, unknown> = isJson ? await request.json() : Object.fromEntries((await request.formData()).entries());
  const done = () => (isJson ? NextResponse.json({ ok: true }) : NextResponse.redirect(new URL("/thank-you/", request.url), 303));

  // Spam trap: a hidden "fax_number_2" field people never see. Bot posts, and
  // posts with no usable email, get the normal thank-you page but go nowhere.
  const trap = String(payload.fax_number_2 ?? "").trim();
  const email = String(payload.email ?? "").trim();
  if (trap) return done();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return isJson ? NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 }) : done();
  }
  delete payload.fax_number_2;

  // SMS consent proof for forms with the SMS box: an unticked box sends
  // nothing, so record "no". Keep the exact wording and time with every lead.
  if (payload.form === "general_enquiry" || payload.form === "growth_leak_score") {
    const smsConsent = payload.sms_consent === "yes" ? "yes" : "no";
    Object.assign(payload, {
      sms_consent: smsConsent,
      sms_consent_text: smsConsent === "yes" ? SMS_CONSENT_TEXT : "",
      sms_consent_at: smsConsent === "yes" ? new Date().toISOString() : "",
    });
  }

  if (!site.leadWebhook) {
    return NextResponse.json({ ok: false, error: "Lead webhook not connected. Set LEAD_WEBHOOK_URL." }, { status: 503 });
  }

  const res = await fetch(site.leadWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, source: "website", page: request.headers.get("referer") ?? "" }),
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `Webhook responded ${res.status}` }, { status: 502 });
  }
  return done();
}
