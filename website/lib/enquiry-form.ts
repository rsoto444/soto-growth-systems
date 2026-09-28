// The General Enquiry form on /contact/, built to the field list the owner
// wrote on the WordPress page. Plain HTML: it posts to /api/lead with no
// JavaScript, which forwards it to GoHighLevel.
//
// SMS consent (toll-free verification, 28 September 2026): unchecked, never
// required, directly under Phone. The label is the owner's exact wording -
// never edit it. /api/lead turns a missing box into sms_consent = "no".
export const SMS_CONSENT_TEXT =
  "I agree to receive marketing and informational text messages from Soto Growth Systems at the phone number provided. Consent is not a condition of purchase. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out or HELP for help. See our Privacy Policy and Terms of Use.";

const smsLabel = SMS_CONSENT_TEXT
  .replace("Privacy Policy", '<a href="/privacy-policy/">Privacy Policy</a>')
  .replace("Terms of Use", '<a href="/terms-of-use/">Terms of Use</a>');

const options = (list: string[]) =>
  ['<option value="" disabled selected>Choose one</option>', ...list.map((o) => `<option>${o}</option>`)].join("");

export const enquiryFormHtml = `
<form class="sgsx-form" action="/api/lead/" method="post">
  <input type="hidden" name="form" value="general_enquiry">
  <div class="sgsx-trap" aria-hidden="true"><label for="fax_number_2">Fax number</label><input type="text" id="fax_number_2" name="fax_number_2" tabindex="-1" autocomplete="off"></div>
  <div class="sgsx-form-grid">
    <div class="sgsx-field"><label for="ef-name">Name</label><input id="ef-name" name="name" type="text" autocomplete="name" required></div>
    <div class="sgsx-field"><label for="ef-email">Business email</label><input id="ef-email" name="email" type="email" autocomplete="email" required></div>
    <div class="sgsx-field"><label for="ef-company">Company</label><input id="ef-company" name="company_name" type="text" autocomplete="organization" required></div>
    <div class="sgsx-field"><label for="ef-website">Website <span class="sgsx-opt">(optional)</span></label><input id="ef-website" name="website" type="text" inputmode="url" autocomplete="url"></div>
    <div class="sgsx-field sgsx-field--full">
      <label for="ef-phone">Phone <span class="sgsx-opt">(optional)</span></label><input id="ef-phone" name="phone" type="tel" autocomplete="tel">
      <div class="sgsx-check sgsx-check--sms"><input id="ef-sms" name="sms_consent" type="checkbox" value="yes"><label for="ef-sms">${smsLabel}</label></div>
    </div>
    <div class="sgsx-field"><label for="ef-revenue">Annual revenue range</label><select id="ef-revenue" name="revenue_range" required>${options(["Under $500K", "$500K–$1M", "$1M–$5M", "$5M–$10M", "Over $10M"])}</select></div>
    <div class="sgsx-field"><label for="ef-help">How can we help</label><select id="ef-help" name="help_topic" required>${options(["Growth Leak Score question", "Professional Assessment", "Implementation options", "Partnership", "Something else"])}</select></div>
    <div class="sgsx-field sgsx-field--full"><label for="ef-constraint">What is your biggest growth constraint right now</label><textarea id="ef-constraint" name="growth_constraint" rows="5" required></textarea></div>
  </div>
  <div class="sgsx-check"><input id="ef-privacy" name="privacy_consent" type="checkbox" value="yes" required><label for="ef-privacy">I agree to the <a href="/privacy-policy/">Privacy Policy</a></label></div>
  <button type="submit" class="sgs-btn sgs-btn--primary">Send Enquiry</button>
</form>`;
