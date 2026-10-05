"use client";

// The Growth Leak Score, rebuilt from the original app (4 October 2026).
// Flow: intro -> 10 questions -> contact details (required) -> results.
// The score is only shown after the details reach GoHighLevel via /api/lead.
import { useEffect, useMemo, useState } from "react";
import { LEAKS, overallScore, rankLeaks, scoreBand } from "@/lib/growth-leak";
import { SMS_CONSENT_TEXT } from "@/lib/enquiry-form";

const STORE = "sgs-growth-leak-answers";
const blank = () => Array(LEAKS.length).fill(-1) as number[];

type Stage = "intro" | "quiz" | "contact" | "results";

export default function ScoreApp({ bookingUrl }: { bookingUrl: string }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<number[]>(blank);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  // A personal link from the prospecting console carries ?p=<token>, so the
  // finished score can be attached to that prospect (see /api/lead).
  const [prospectRef, setProspectRef] = useState("");
  useEffect(() => {
    setProspectRef(new URLSearchParams(window.location.search).get("p") ?? "");
  }, []);

  // Pick up a half-finished assessment from this browser.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORE) ?? "null");
      if (Array.isArray(saved) && saved.length === LEAKS.length && saved.some((v) => v >= 0)) setAnswers(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORE, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  // Each question starts at the top, so the step label is never under the header.
  useEffect(() => {
    if (stage === "quiz") window.scrollTo({ top: 0 });
  }, [step, stage]);

  const ranked = useMemo(() => rankLeaks(answers), [answers]);
  const score = useMemo(() => overallScore(answers), [answers]);
  const band = scoreBand(score);
  const answered = answers.filter((v) => v >= 0).length;
  const started = answered > 0;

  const go = (s: Stage) => {
    setStage(s);
    window.scrollTo({ top: 0 });
  };
  const start = (resume: boolean) => {
    if (resume) {
      const next = answers.findIndex((v) => v < 0);
      setStep(next === -1 ? 0 : next);
    } else {
      setAnswers(blank());
      setStep(0);
    }
    go("quiz");
  };
  const choose = (value: number) => setAnswers((a) => a.map((v, i) => (i === step ? value : v)));
  const next = () => (step === LEAKS.length - 1 ? go("contact") : setStep(step + 1));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const top = ranked.slice(0, 3);
    setStatus("sending");
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          form: "growth_leak_score",
          growth_leak_score: score,
          growth_leak_label: band.label,
          growth_leak_top: top.map((l, i) => `${i + 1}. ${l.name} (${l.label}, ${l.leak}% leak)`).join("\n"),
          growth_leak_answers: LEAKS.map((l, i) => `${l.name}: ${l.answers.find((a) => a.value === answers[i])?.label ?? "No answer"}`).join("\n"),
          ...(prospectRef
            ? { prospect_ref: prospectRef, growth_leak_detail: top.map((l) => ({ name: l.name, label: l.label, leak: l.leak, nextMove: l.nextMove })) }
            : {}),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("idle");
      go("results");
    } catch {
      setStatus("error");
    }
  }

  if (stage === "intro") {
    return (
      <>
        <section className="sgs-sec sgs-sec--hero">
          <div className="sgs-wrap">
            <p className="sgs-eyebrow">Free Growth Leak Score</p>
            <h1>Your business doesn’t need more leads. It needs fewer leaks.</h1>
            <p className="sgs-lead">Find which of the 10 growth leaks is quietly costing you revenue, and see exactly where to focus next.</p>
            <p className="sgs-note">10 questions · About 5 minutes · No login</p>
            <div className="sgs-btns">
              <button type="button" className="sgs-btn sgs-btn--primary" onClick={() => start(false)}>Find my growth leaks →</button>
              {started && <button type="button" className="sgs-btn sgs-btn--ghost" onClick={() => start(true)}>Continue saved assessment →</button>}
            </div>
          </div>
        </section>
        <section className="sgs-sec sgs-sec--alt">
          <div className="sgs-wrap">
            <div className="sgs-sec__head">
              <h2>Ten handoffs. One growth engine.</h2>
              <p>Most businesses do not have a single lead problem. They lose momentum between stages, where ownership, process, and visibility break down.</p>
            </div>
            <ol className="sgsx-leakmap">
              {LEAKS.map((l, i) => (
                <li key={l.name}><span>{String(i + 1).padStart(2, "0")}</span>{l.name}</li>
              ))}
            </ol>
          </div>
        </section>
        <section className="sgs-sec">
          <div className="sgs-wrap">
            <div className="sgs-sec__head">
              <h2>Clarity before complexity.</h2>
              <p>Soto Growth Systems helps businesses replace disconnected marketing and sales activity with a visible, accountable revenue system.</p>
            </div>
            <div className="sgs-btns"><button type="button" className="sgs-btn sgs-btn--primary" onClick={() => start(false)}>Run the diagnostic →</button></div>
          </div>
        </section>
      </>
    );
  }

  if (stage === "quiz") {
    const leak = LEAKS[step];
    return (
      <section className="sgs-sec sgs-sec--hero">
        <div className="sgs-wrap sgsx-quiz">
          <p className="sgs-eyebrow">Leak {step + 1} of {LEAKS.length} · {leak.name}</p>
          <div className="sgsx-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / LEAKS.length) * 100}%` }} /></div>
          <h1 className="sgsx-quiz__q">{leak.prompt}</h1>
          <p className="sgs-lead">{leak.context}</p>
          <fieldset className="sgsx-answers">
            <legend className="sgsx-sr">{leak.prompt}</legend>
            {leak.answers.map((a) => (
              <label key={a.label} className={answers[step] === a.value ? "is-on" : ""}>
                <input type="radio" name={`leak-${step}`} checked={answers[step] === a.value} onChange={() => choose(a.value)} />
                <strong>{a.label}</strong>
                <span>{a.detail}</span>
              </label>
            ))}
          </fieldset>
          <div className="sgs-btns">
            {step > 0 && <button type="button" className="sgs-btn sgs-btn--ghost" onClick={() => setStep(step - 1)}>← Back</button>}
            <button type="button" className="sgs-btn sgs-btn--primary" disabled={answers[step] < 0} onClick={next}>
              {step === LEAKS.length - 1 ? "See my score →" : "Next →"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (stage === "contact") {
    return (
      <section className="sgs-sec sgs-sec--hero">
        <div className="sgs-wrap">
          <p className="sgs-eyebrow">All 10 answered</p>
          <h1>Your Growth Leak Score is ready</h1>
          <p className="sgs-lead">Enter your details to see your score, your top three repairs and your full 10-leak map.</p>
          <form className="sgsx-form" onSubmit={submit}>
            <div className="sgsx-trap" aria-hidden="true"><label htmlFor="gl-fax">Fax number</label><input type="text" id="gl-fax" name="fax_number_2" tabIndex={-1} autoComplete="off" /></div>
            <div className="sgsx-form-grid">
              <div className="sgsx-field"><label htmlFor="gl-name">Name</label><input id="gl-name" name="name" type="text" autoComplete="name" required /></div>
              <div className="sgsx-field"><label htmlFor="gl-email">Business email</label><input id="gl-email" name="email" type="email" autoComplete="email" required /></div>
              <div className="sgsx-field"><label htmlFor="gl-company">Company</label><input id="gl-company" name="company_name" type="text" autoComplete="organization" required /></div>
              <div className="sgsx-field">
                <label htmlFor="gl-phone">Phone <span className="sgsx-opt">(optional)</span></label>
                <input id="gl-phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className="sgsx-field sgsx-field--full">
                <div className="sgsx-check sgsx-check--sms">
                  <input id="gl-sms" name="sms_consent" type="checkbox" value="yes" />
                  <label htmlFor="gl-sms">
                    {SMS_CONSENT_TEXT.replace(" See our Privacy Policy and Terms of Use.", "")} See our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/terms-of-use/">Terms of Use</a>.
                  </label>
                </div>
              </div>
            </div>
            <div className="sgsx-check">
              <input id="gl-privacy" name="privacy_consent" type="checkbox" value="yes" required />
              <label htmlFor="gl-privacy">I agree to the <a href="/privacy-policy/">Privacy Policy</a></label>
            </div>
            <p className="sgs-note">Your answers and details go to Soto Growth Systems so we can send you a follow-up about your results.</p>
            <div className="sgs-btns">
              <button type="button" className="sgs-btn sgs-btn--ghost" onClick={() => { setStep(LEAKS.length - 1); go("quiz"); }}>← Back</button>
              <button type="submit" className="sgs-btn sgs-btn--primary" disabled={status === "sending"}>{status === "sending" ? "Scoring…" : "Show my score →"}</button>
            </div>
            {status === "error" && <p role="alert" className="sgsx-error">We couldn’t save that yet. Please check your details and try again.</p>}
          </form>
        </div>
      </section>
    );
  }

  const top = ranked.slice(0, 3);
  return (
    <>
      <section className="sgs-sec sgs-sec--hero">
        <div className="sgs-wrap">
          <p className="sgs-eyebrow">Your growth system score</p>
          <h1><span className="sgsx-score">{score}</span> / 100 · {band.label}</h1>
          <p className="sgs-lead">{band.note}</p>
          <div className="sgs-btns">
            <a className="sgs-btn sgs-btn--primary" href={bookingUrl} target="_blank" rel="noopener">Book my strategy session ↗</a>
            <button type="button" className="sgs-btn sgs-btn--ghost" onClick={() => window.print()}>Print / save my results</button>
          </div>
        </div>
      </section>
      <section className="sgs-sec sgs-sec--alt">
        <div className="sgs-wrap">
          <div className="sgs-sec__head">
            <h2>Priority repair sequence: fix these first.</h2>
            <p>Your score is not a grade. It is a focus tool. Start with the leak that creates the biggest downstream drag.</p>
          </div>
          <div className="sgs-grid sgs-grid--3">
            {top.map((l, i) => (
              <div className="sgs-card" key={l.name}>
                <h3>{i + 1}. {l.name}</h3>
                <p><strong>{l.label} · {l.leak}% leak severity</strong></p>
                <p>{l.consequence}</p>
                <p><strong>Recommended next move:</strong> {l.nextMove}</p>
                <p><strong>Track:</strong> {l.metric}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sgs-sec">
        <div className="sgs-wrap">
          <div className="sgs-sec__head">
            <h2>Your 10-leak map</h2>
            <p>Leak severity shows how much operating risk is present in each part of the revenue system.</p>
          </div>
          <div className="sgs-tablewrap">
            <table className="sgs-table">
              <thead><tr><th>Leak</th><th>Severity</th><th>Status</th><th>Metric</th></tr></thead>
              <tbody>
                {ranked.map((l) => (
                  <tr key={l.name}><th>{l.name}</th><td>{l.leak}%</td><td>{l.label}</td><td>{l.metric}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="sgs-sec sgs-sec--dark">
        <div className="sgs-wrap">
          <h2>Turn the diagnosis into a system</h2>
          <p>Your best next step is a focused repair plan, not more random activity. In a Growth Leak Strategy Session, we will review your top three constraints, identify the fastest path to measurable lift, and map the right order of operations.</p>
          <ul className="sgs-list sgs-list--check">
            <li>Review the evidence behind your top leaks</li>
            <li>Choose the first 30-day repair sequence</li>
            <li>Leave with a clear next action, whether we work together or not</li>
          </ul>
          <div className="sgs-btns">
            <a className="sgs-btn sgs-btn--primary" href={bookingUrl} target="_blank" rel="noopener">Book my strategy session ↗</a>
            <button type="button" className="sgs-btn sgs-btn--ghost" onClick={() => start(false)}>Retake assessment</button>
          </div>
        </div>
      </section>
      <section className="sgs-sec">
        <div className="sgs-wrap">
          <p className="sgs-disclaimer">This assessment is a strategic planning tool, not a guarantee of financial performance.</p>
        </div>
      </section>
    </>
  );
}
