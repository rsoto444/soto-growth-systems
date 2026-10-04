// The Growth Leak Score: the 10 questions, answers and scoring, copied word for
// word from the original app at growthleak.sotogrowthsystems.com (rebuilt into
// this site on 4 October 2026 so the score sits behind contact details and
// feeds GoHighLevel). Never reword these: they are the owner's copy.

export type Answer = { label: string; detail: string; value: number };
export type Leak = {
  short: string;
  name: string;
  prompt: string;
  context: string;
  consequence: string;
  nextMove: string;
  metric: string;
  answers: Answer[];
};

export const LEAKS: Leak[] = [
 {
  "short": "Source",
  "name": "Lead Source",
  "prompt": "How reliably can you explain where your next qualified leads will come from?",
  "context": "A healthy lead engine is diversified, measurable, and predictable enough to plan around.",
  "consequence": "Pipeline volume changes without warning, making growth expensive and difficult to forecast.",
  "nextMove": "Choose one primary and one secondary channel, then track qualified opportunities and revenue by source every week.",
  "metric": "Qualified leads by source",
  "answers": [
   {
    "label": "Unpredictable",
    "detail": "We depend mostly on referrals, word of mouth, or whatever happens to work.",
    "value": 0
   },
   {
    "label": "Some activity",
    "detail": "We use one or two channels, but volume and quality fluctuate.",
    "value": 35
   },
   {
    "label": "Mostly reliable",
    "detail": "Several channels produce leads and we know which perform best.",
    "value": 70
   },
   {
    "label": "Predictable engine",
    "detail": "Our channel mix is documented, measured, and tied to revenue.",
    "value": 100
   }
  ]
 },
 {
  "short": "Capture",
  "name": "Lead Capture",
  "prompt": "What happens when a prospect raises their hand?",
  "context": "Every inquiry should enter one visible system with the right contact details, source, and owner.",
  "consequence": "Good opportunities disappear across inboxes, forms, DMs, calls, and team members.",
  "nextMove": "Route every form, call, chat, and DM into one lead record with a source, timestamp, and assigned owner.",
  "metric": "Lead capture rate",
  "answers": [
   {
    "label": "Easy to lose",
    "detail": "Leads live in personal inboxes, phones, DMs, notes, or spreadsheets.",
    "value": 0
   },
   {
    "label": "Partly centralized",
    "detail": "Most leads reach one place, but some channels still require manual entry.",
    "value": 35
   },
   {
    "label": "Consistent capture",
    "detail": "Nearly every inquiry creates a complete, assigned lead record.",
    "value": 70
   },
   {
    "label": "Fully connected",
    "detail": "All channels capture source, consent, contact data, and ownership automatically.",
    "value": 100
   }
  ]
 },
 {
  "short": "Speed",
  "name": "Speed-to-Lead",
  "prompt": "How quickly does a new lead receive a useful first response?",
  "context": "Fast acknowledgement plus clear ownership protects intent while it is highest.",
  "consequence": "Prospects cool off, keep searching, or choose the first competitor who responds.",
  "nextMove": "Create an instant acknowledgement and a five-minute human-response standard during business hours.",
  "metric": "Median first-response time",
  "answers": [
   {
    "label": "Usually 24+ hours",
    "detail": "Response time depends on who notices the lead and when.",
    "value": 0
   },
   {
    "label": "Same business day",
    "detail": "We usually respond that day, but there is no firm standard.",
    "value": 35
   },
   {
    "label": "Within one hour",
    "detail": "An owner is alerted and most leads hear from us quickly.",
    "value": 70
   },
   {
    "label": "Within five minutes",
    "detail": "Immediate acknowledgement and rapid human follow-up are built into the system.",
    "value": 100
   }
  ]
 },
 {
  "short": "Follow-up",
  "name": "Follow-Up",
  "prompt": "What happens when a qualified prospect does not reply right away?",
  "context": "A complete follow-up system creates useful, timely contact without relying on memory.",
  "consequence": "Interested prospects are mistaken for lost leads before they have had time to decide.",
  "nextMove": "Install a 14-day multi-channel cadence with named owners, useful touches, and a longer nurture path.",
  "metric": "Touches before disposition",
  "answers": [
   {
    "label": "One or two tries",
    "detail": "Follow-up depends on memory and usually stops quickly.",
    "value": 0
   },
   {
    "label": "Inconsistent cadence",
    "detail": "Some team members follow up several times, but execution varies.",
    "value": 35
   },
   {
    "label": "Documented sequence",
    "detail": "We use a defined cadence and can see the next action.",
    "value": 70
   },
   {
    "label": "Owned and automated",
    "detail": "Automation supports personal follow-up, nurture, and clear exit rules.",
    "value": 100
   }
  ]
 },
 {
  "short": "Appts",
  "name": "Appointments",
  "prompt": "How reliably do booked appointments turn into qualified conversations?",
  "context": "Qualification, confirmation, reminders, and no-show recovery should work as one system.",
  "consequence": "Calendar volume looks healthy while no-shows and poor-fit meetings consume the team.",
  "nextMove": "Add a short qualification step, multi-channel reminders, and a same-day no-show recovery workflow.",
  "metric": "Qualified show rate",
  "answers": [
   {
    "label": "Frequent no-shows",
    "detail": "Booking is informal and prospects receive little preparation or confirmation.",
    "value": 0
   },
   {
    "label": "Basic calendar",
    "detail": "We send a calendar invite, but reminders and qualification are inconsistent.",
    "value": 35
   },
   {
    "label": "Reliable process",
    "detail": "Prospects are qualified, confirmed, and reminded before the meeting.",
    "value": 70
   },
   {
    "label": "Optimized handoff",
    "detail": "We track show quality, recover no-shows, and improve booking rules from data.",
    "value": 100
   }
  ]
 },
 {
  "short": "Sales",
  "name": "Sales Process",
  "prompt": "How consistent is the journey from first conversation to decision?",
  "context": "A strong sales process makes discovery, fit, value, objections, and next steps repeatable.",
  "consequence": "Results depend on individual talent, and the team cannot see why deals stall or close.",
  "nextMove": "Define the discovery, qualification, recommendation, follow-up, and disposition steps—and review calls weekly.",
  "metric": "Qualified close rate",
  "answers": [
   {
    "label": "Different every time",
    "detail": "Sales is mostly improvised and lives with the owner or a top performer.",
    "value": 0
   },
   {
    "label": "Informal framework",
    "detail": "We share a general approach, but stages and exit criteria are unclear.",
    "value": 35
   },
   {
    "label": "Repeatable process",
    "detail": "The team follows defined stages, questions, and next-step standards.",
    "value": 70
   },
   {
    "label": "Measured and coached",
    "detail": "We review conversion, calls, objections, losses, and rep performance.",
    "value": 100
   }
  ]
 },
 {
  "short": "CRM",
  "name": "CRM Discipline",
  "prompt": "Can your CRM tell you the truth about every active opportunity?",
  "context": "The CRM should be the shared operational record—not an optional reporting chore.",
  "consequence": "Forecasts become guesses, handoffs break, and follow-up slips through missing or stale records.",
  "nextMove": "Simplify stages, require a next action and owner on every open deal, then audit pipeline hygiene weekly.",
  "metric": "Open deals with next action",
  "answers": [
   {
    "label": "No shared truth",
    "detail": "We rely on inboxes, notes, spreadsheets, or individual memory.",
    "value": 0
   },
   {
    "label": "CRM is optional",
    "detail": "A CRM exists, but records and stages are often incomplete or outdated.",
    "value": 35
   },
   {
    "label": "Team standard",
    "detail": "Stages, owners, notes, and next actions are consistently maintained.",
    "value": 70
   },
   {
    "label": "Operational backbone",
    "detail": "Automation, validation, and audits keep the CRM accurate and useful.",
    "value": 100
   }
  ]
 },
 {
  "short": "KPIs",
  "name": "KPI Visibility",
  "prompt": "How quickly can you see where revenue performance is breaking down?",
  "context": "A useful scorecard connects activity, pipeline, conversion, revenue, and ownership.",
  "consequence": "Problems surface at the end of the month—too late to correct the behavior that caused them.",
  "nextMove": "Build one weekly scorecard covering leads, response time, appointments, show rate, close rate, and revenue.",
  "metric": "Scorecard updated on time",
  "answers": [
   {
    "label": "Mostly invisible",
    "detail": "We look at revenue or bank balance after the fact.",
    "value": 0
   },
   {
    "label": "Basic totals",
    "detail": "We track a few numbers, but not the full path from lead to revenue.",
    "value": 35
   },
   {
    "label": "Weekly scorecard",
    "detail": "Core leading and lagging indicators are reviewed consistently.",
    "value": 70
   },
   {
    "label": "Decision-ready",
    "detail": "Live KPIs show conversion by stage, source, owner, and time period.",
    "value": 100
   }
  ]
 },
 {
  "short": "Ownership",
  "name": "Accountability",
  "prompt": "When a number misses target, is the next corrective action clear?",
  "context": "Accountability combines a visible standard, a named owner, a review rhythm, and follow-through.",
  "consequence": "The same breakdowns repeat because goals are discussed without changing daily behavior.",
  "nextMove": "Assign one owner to every KPI and add a weekly meeting that ends with named actions and due dates.",
  "metric": "Actions completed by due date",
  "answers": [
   {
    "label": "Reactive",
    "detail": "We address problems only when they become urgent.",
    "value": 0
   },
   {
    "label": "Goals, little rhythm",
    "detail": "Targets exist, but ownership and review cadence are inconsistent.",
    "value": 35
   },
   {
    "label": "Clear ownership",
    "detail": "Each outcome has an owner and misses are reviewed every week.",
    "value": 70
   },
   {
    "label": "Execution culture",
    "detail": "Daily visibility, weekly review, coaching, and escalation keep commitments moving.",
    "value": 100
   }
  ]
 },
 {
  "short": "Owner",
  "name": "Owner Bottleneck",
  "prompt": "How much of the revenue engine can operate well without the owner?",
  "context": "The owner should set direction and solve high-value problems—not carry every handoff and decision.",
  "consequence": "Growth increases workload, team decisions slow down, and the business cannot scale cleanly.",
  "nextMove": "Map the three owner-dependent handoffs that delay revenue, then transfer one with a clear rule and scorecard.",
  "metric": "Owner-free revenue handoffs",
  "answers": [
   {
    "label": "Owner carries it",
    "detail": "The owner touches nearly every lead, decision, sale, or escalation.",
    "value": 0
   },
   {
    "label": "Partial delegation",
    "detail": "The team helps, but frequently waits for owner approval or rescue.",
    "value": 35
   },
   {
    "label": "Defined roles",
    "detail": "Most work follows documented roles, rules, and handoffs.",
    "value": 70
   },
   {
    "label": "Runs without heroics",
    "detail": "The team owns the system and the owner focuses on strategy and exceptions.",
    "value": 100
   }
  ]
 }
];

export type Severity = { label: "Critical" | "High" | "Moderate" | "Controlled"; tone: string; leak: number };

// Leak severity is the gap to a perfect answer, in the same four bands as the original.
export function severity(health: number): Severity {
  const leak = 100 - health;
  if (leak >= 75) return { label: "Critical", tone: "critical", leak };
  if (leak >= 50) return { label: "High", tone: "high", leak };
  if (leak >= 25) return { label: "Moderate", tone: "moderate", leak };
  return { label: "Controlled", tone: "controlled", leak };
}

export type RankedLeak = Leak & Severity & { index: number; health: number };

// Worst leak first; ties keep question order.
export function rankLeaks(answers: number[]): RankedLeak[] {
  return LEAKS.map((leak, index) => {
    const health = answers[index] < 0 ? 0 : answers[index];
    return { ...leak, index, health, ...severity(health) };
  }).sort((a, b) => b.leak - a.leak || a.index - b.index);
}

export function overallScore(answers: number[]): number {
  return Math.round(answers.reduce((sum, v) => sum + Math.max(0, v), 0) / LEAKS.length);
}

export function scoreBand(score: number): { label: string; note: string } {
  if (score < 35) return { label: "Revenue at risk", note: "Your growth engine is relying on effort and memory more than a dependable system." };
  if (score < 55) return { label: "Growth is leaking", note: "You have working pieces, but a few major gaps are suppressing conversion and predictability." };
  if (score < 75) return { label: "System needs reinforcement", note: "Your foundation is taking shape. Tightening the weakest handoffs should create visible lift." };
  return { label: "Built to compound", note: "Your system is strong. Focus on the remaining constraints and protect the operating discipline you have built." };
}
