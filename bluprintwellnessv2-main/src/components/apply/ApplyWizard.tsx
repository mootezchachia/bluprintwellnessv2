"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  /* Step 0 — About You */
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hearAbout: string[];
  referralName: string;
  /* Step 1 — Location & Work */
  location: string;
  workRhythm: string;
  aboutWork: string;
  /* Step 2 — Your Interests */
  drawsYou: string[];
  mostInterested: string[];
  /* Step 3 — Your Vision */
  whyMember: string;
  investingHealth: string;
  hopingToChange: string;
  /* Step 4 — Final Details */
  beginMembership: string;
  bestTimeToReach: string;
  anythingElse: string;
  /* Step 5 — Review */
  agreement: boolean;
}

const INITIAL: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  hearAbout: [],
  referralName: "",
  location: "",
  workRhythm: "",
  aboutWork: "",
  drawsYou: [],
  mostInterested: [],
  whyMember: "",
  investingHealth: "",
  hopingToChange: "",
  beginMembership: "",
  bestTimeToReach: "",
  anythingElse: "",
  agreement: false,
};

const TOTAL_STEPS = 6;

const HEAR_ABOUT_OPTIONS = [
  "Referred by Friend or Member(s)",
  "Social Media",
  "Web Search",
  "Practitioner Referral",
  "Press / News",
  "Event",
  "Other",
];

const REFERRAL_TRIGGERS = [
  "Referred by Friend or Member(s)",
  "Practitioner Referral",
];

const LOCATION_OPTIONS = [
  "I currently live in North County San Diego",
  "I currently live in North County San Diego part time",
  "I live in San Diego",
  "I live outside of San Diego",
];

const WORK_RHYTHM_OPTIONS = [
  "I work fully remote",
  "I work hybrid",
  "I own my own company",
  "I freelance/consult/create",
  "I work in person",
];

const DRAWS_YOU_OPTIONS = [
  "Performance and Strength",
  "Longevity & Aging Optimization",
  "Recovery and Nervous System Regulation",
  "Medical Optimization",
  "Community and Environment",
  "Accountability and Structure",
];

const MOST_INTERESTED_OPTIONS = [
  "Personal Training",
  "AI incorporated Gym Equipment",
  "Functional Medicine",
  "Aesthetic Treatments",
  "Recovery Modalities",
  "Social/Community Building",
  "Concierge Wellness",
];

const BEGIN_MEMBERSHIP_OPTIONS = [
  "Immediately",
  "Within 1-3 months",
  "Just exploring",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ApplyWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  /* ---- helpers --------------------------------------------------- */

  const setTextField = useCallback(
    (field: keyof FormData) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) =>
        setData((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  );

  const toggleCheckbox = useCallback(
    (field: keyof FormData, value: string) => () => {
      setData((prev) => {
        const arr = prev[field] as string[];
        return {
          ...prev,
          [field]: arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value],
        };
      });
    },
    [],
  );

  const setRadio = useCallback(
    (field: keyof FormData, value: string) => () => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const showReferralInput = data.hearAbout.some((v) =>
    REFERRAL_TRIGGERS.includes(v),
  );

  const canContinue = useCallback((): boolean => {
    switch (step) {
      case 0:
        return !!(
          data.firstName.trim() &&
          data.lastName.trim() &&
          data.email.trim() &&
          data.phone.trim() &&
          data.hearAbout.length > 0
        );
      case 1:
        return !!(
          data.location &&
          data.workRhythm &&
          data.aboutWork.trim()
        );
      case 2:
        return !!(data.drawsYou.length > 0 && data.mostInterested.length > 0);
      case 3:
        return !!(
          data.whyMember.trim() &&
          data.investingHealth.trim() &&
          data.hopingToChange.trim()
        );
      case 4:
        return !!(
          data.beginMembership &&
          data.bestTimeToReach.trim()
        );
      case 5:
        return data.agreement;
      default:
        return false;
    }
  }, [step, data]);

  const next = useCallback(() => {
    if (!canContinue()) return;
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  }, [step, canContinue]);

  const back = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        next();
      }
    },
    [next],
  );

  const handleSubmit = useCallback(() => {
    const subject = encodeURIComponent(
      `Membership Application — ${data.firstName} ${data.lastName}`,
    );

    const body = encodeURIComponent(
      [
        `ABOUT YOU`,
        `Name: ${data.firstName} ${data.lastName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `How did you hear about Bluprint: ${data.hearAbout.join(", ")}`,
        ...(data.referralName
          ? [`Referral Name: ${data.referralName}`]
          : []),
        ``,
        `LOCATION & WORK`,
        `Current Location: ${data.location}`,
        `Work Rhythm: ${data.workRhythm}`,
        `About Work: ${data.aboutWork}`,
        ``,
        `INTERESTS`,
        `What draws you to Bluprint: ${data.drawsYou.join(", ")}`,
        `Most interested in: ${data.mostInterested.join(", ")}`,
        ``,
        `VISION`,
        `Why become a member: ${data.whyMember}`,
        `Investing in health means: ${data.investingHealth}`,
        `Hoping to change: ${data.hopingToChange}`,
        ``,
        `FINAL DETAILS`,
        `Begin membership: ${data.beginMembership}`,
        `Best time to reach: ${data.bestTimeToReach}`,
        ...(data.anythingElse
          ? [`Anything else: ${data.anythingElse}`]
          : []),
        ``,
        `Membership Agreement: Accepted`,
      ].join("\n"),
    );

    window.location.href = `mailto:jonathan@bluprintwellness.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }, [data]);

  /* ---- render helpers -------------------------------------------- */

  const renderField = (
    label: string,
    field: keyof FormData,
    type: string = "text",
    required: boolean = true,
  ) => (
    <div className="applyWizard_field" key={field}>
      <label className="applyWizard_label" htmlFor={field}>
        {label}
        {required && <span className="applyWizard_required">*</span>}
      </label>
      <input
        id={field}
        className="applyWizard_input"
        type={type}
        value={data[field] as string}
        onChange={setTextField(field)}
        required={required}
      />
    </div>
  );

  const renderTextarea = (
    label: string,
    field: keyof FormData,
    required: boolean = true,
  ) => (
    <div className="applyWizard_field" key={field}>
      <label className="applyWizard_label" htmlFor={field}>
        {label}
        {required && <span className="applyWizard_required">*</span>}
      </label>
      <textarea
        id={field}
        className="applyWizard_textarea"
        value={data[field] as string}
        onChange={setTextField(field)}
        required={required}
        rows={5}
      />
    </div>
  );

  const renderCheckboxGroup = (
    label: string,
    field: keyof FormData,
    options: string[],
    required: boolean = true,
  ) => (
    <div className="applyWizard_field" key={field}>
      <label className="applyWizard_label">
        {label}
        {required && <span className="applyWizard_required">*</span>}
      </label>
      <div className="applyWizard_checkboxGroup">
        {options.map((option) => {
          const selected = (data[field] as string[]).includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`applyWizard_checkbox${selected ? " selected" : ""}`}
              onClick={toggleCheckbox(field, option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRadioGroup = (
    label: string,
    field: keyof FormData,
    options: string[],
    required: boolean = true,
  ) => (
    <div className="applyWizard_field" key={field}>
      <label className="applyWizard_label">
        {label}
        {required && <span className="applyWizard_required">*</span>}
      </label>
      <div className="applyWizard_checkboxGroup">
        {options.map((option) => {
          const selected = data[field] === option;
          return (
            <button
              key={option}
              type="button"
              className={`applyWizard_radio${selected ? " selected" : ""}`}
              onClick={setRadio(field, option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ---- step content ---------------------------------------------- */

  const stepTitles = [
    "About You",
    "Location & Work",
    "Your Interests",
    "Your Vision",
    "Final Details",
    "Review & Submit",
  ];

  const stepBodies = [
    "Let us know who you are so we can personalise your experience.",
    "Tell us about where you are and what you do.",
    "What aspects of Bluprint resonate with you?",
    "Help us understand your wellness goals.",
    "Just a few more details before you submit.",
    "Review your application before submitting.",
  ];

  const renderStepFields = () => {
    switch (step) {
      /* Step 0 — About You */
      case 0:
        return (
          <div className="applyWizard_fields">
            {renderField("First Name", "firstName")}
            {renderField("Last Name", "lastName")}
            {renderField("Email", "email", "email")}
            {renderField("Phone Number", "phone", "tel")}
            {renderCheckboxGroup(
              "How did you hear about Bluprint?",
              "hearAbout",
              HEAR_ABOUT_OPTIONS,
            )}
            {showReferralInput && (
              <div className="applyWizard_field">
                <label className="applyWizard_label" htmlFor="referralName">
                  Referral Name
                </label>
                <input
                  id="referralName"
                  className="applyWizard_input"
                  type="text"
                  value={data.referralName}
                  onChange={setTextField("referralName")}
                  placeholder="Who referred you?"
                />
              </div>
            )}
          </div>
        );

      /* Step 1 — Location & Work */
      case 1:
        return (
          <div className="applyWizard_fields">
            {renderRadioGroup(
              "What best describes your current location?",
              "location",
              LOCATION_OPTIONS,
            )}
            {renderRadioGroup(
              "What best describes your daily work rhythm?",
              "workRhythm",
              WORK_RHYTHM_OPTIONS,
            )}
            {renderTextarea("Tell us about your work", "aboutWork")}
          </div>
        );

      /* Step 2 — Your Interests */
      case 2:
        return (
          <div className="applyWizard_fields">
            {renderCheckboxGroup(
              "What draws you to Bluprint?",
              "drawsYou",
              DRAWS_YOU_OPTIONS,
            )}
            {renderCheckboxGroup(
              "What aspect of Bluprint are you most interested in?",
              "mostInterested",
              MOST_INTERESTED_OPTIONS,
            )}
          </div>
        );

      /* Step 3 — Your Vision */
      case 3:
        return (
          <div className="applyWizard_fields">
            {renderTextarea(
              "Why would you like to become a member and how do you see yourself using Bluprint Wellness?",
              "whyMember",
            )}
            {renderTextarea(
              'What does "investing in your health" mean to you?',
              "investingHealth",
            )}
            {renderTextarea(
              "What are you hoping to change or improve in the next year?",
              "hopingToChange",
            )}
          </div>
        );

      /* Step 4 — Final Details */
      case 4:
        return (
          <div className="applyWizard_fields">
            {renderRadioGroup(
              "Are you looking to begin membership:",
              "beginMembership",
              BEGIN_MEMBERSHIP_OPTIONS,
            )}
            {renderField(
              "Please let us know the best time to reach you",
              "bestTimeToReach",
            )}
            {renderTextarea(
              "Is there anything else you'd like us to know about you?",
              "anythingElse",
              false,
            )}
          </div>
        );

      /* Step 5 — Review & Submit */
      case 5:
        return (
          <div className="applyWizard_confirm">
            <div className="applyWizard_summary">
              {/* About You */}
              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">About You</span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Name</span>
                  <span className="applyWizard_summary_value">
                    {data.firstName} {data.lastName}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Email</span>
                  <span className="applyWizard_summary_value">
                    {data.email}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Phone</span>
                  <span className="applyWizard_summary_value">
                    {data.phone}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    How did you hear
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.hearAbout.join(", ")}
                  </span>
                </div>
                {data.referralName && (
                  <div className="applyWizard_summary_row">
                    <span className="applyWizard_summary_key">
                      Referral Name
                    </span>
                    <span className="applyWizard_summary_value">
                      {data.referralName}
                    </span>
                  </div>
                )}
              </div>

              {/* Location & Work */}
              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">
                  Location & Work
                </span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Location</span>
                  <span className="applyWizard_summary_value">
                    {data.location}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Work Rhythm</span>
                  <span className="applyWizard_summary_value">
                    {data.workRhythm}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">About Work</span>
                  <span className="applyWizard_summary_value">
                    {data.aboutWork}
                  </span>
                </div>
              </div>

              {/* Your Interests */}
              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">
                  Your Interests
                </span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    What draws you
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.drawsYou.join(", ")}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    Most interested in
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.mostInterested.join(", ")}
                  </span>
                </div>
              </div>

              {/* Your Vision */}
              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">Your Vision</span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Why member</span>
                  <span className="applyWizard_summary_value">
                    {data.whyMember}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    Investing in health
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.investingHealth}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    Hoping to change
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.hopingToChange}
                  </span>
                </div>
              </div>

              {/* Final Details */}
              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">
                  Final Details
                </span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    Begin membership
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.beginMembership}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    Best time to reach
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.bestTimeToReach}
                  </span>
                </div>
                {data.anythingElse && (
                  <div className="applyWizard_summary_row">
                    <span className="applyWizard_summary_key">
                      Anything else
                    </span>
                    <span className="applyWizard_summary_value">
                      {data.anythingElse}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Membership Agreement */}
            <div className="applyWizard_agreement">
              <label className="applyWizard_agreementLabel">
                <input
                  type="checkbox"
                  className="applyWizard_agreementCheckbox"
                  checked={data.agreement}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      agreement: e.target.checked,
                    }))
                  }
                />
                <span className="applyWizard_agreementText">
                  Yes, I understand that Bluprint Wellness is a membership-based
                  wellness studio and agree to be contacted regarding my
                  application.
                  <span className="applyWizard_required">*</span>
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---- submitted state ------------------------------------------- */

  if (submitted) {
    return (
      <div className="applyWizard">
        <nav className="applyWizard_nav">
          <Link href="/" className="applyWizard_back">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path
                d="M12 4L6 10L12 16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
        </nav>

        <div className="applyWizard_inner">
          <div className="applyWizard_submitted">
            <span className="applyWizard_step st4">Thank You</span>
            <h2 className="applyWizard_title">Application Sent</h2>
            <p className="applyWizard_body">
              Your email client has been opened with your application details.
              We&rsquo;ll be in touch soon.
            </p>
            <div className="applyWizard_actions">
              <Link href="/" className="button">
                <span className="button_circle" />
                <span className="button_label">Back to Home</span>
                <span className="button_plus">+</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- main render ----------------------------------------------- */

  return (
    <div className="applyWizard" onKeyDown={handleKeyDown}>
      {/* Top navigation bar */}
      <nav className="applyWizard_nav">
        <Link href="/" className="applyWizard_back">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path
              d="M12 4L6 10L12 16"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </Link>

        <div className="applyWizard_progress">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`applyWizard_progress_dot${i === step ? " active" : ""}${i < step ? " done" : ""}`}
            />
          ))}
        </div>
      </nav>

      {/* Step content — key triggers re-mount for slide-in animation */}
      <div className="applyWizard_inner" key={step}>
        <span className="applyWizard_step st4">
          {String(step + 1).padStart(2, "0")} /{" "}
          {String(TOTAL_STEPS).padStart(2, "0")}
        </span>
        <h2 className="applyWizard_title">{stepTitles[step]}</h2>
        <p className="applyWizard_body">{stepBodies[step]}</p>

        {renderStepFields()}

        {/* Actions */}
        <div className="applyWizard_actions">
          {step > 0 && (
            <button
              type="button"
              className="button button--empty"
              onClick={back}
            >
              <span className="button_circle" />
              <span className="button_label">Back</span>
              <span className="button_plus">+</span>
            </button>
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              className="button"
              disabled={!canContinue()}
              onClick={next}
            >
              <span className="button_circle" />
              <span className="button_label">Continue</span>
              <span className="button_plus">+</span>
            </button>
          ) : (
            <button
              type="button"
              className="button"
              disabled={!canContinue()}
              onClick={handleSubmit}
            >
              <span className="button_circle" />
              <span className="button_label">Submit Application</span>
              <span className="button_plus">+</span>
            </button>
          )}
        </div>

        {/* Keyboard hint */}
        {step < TOTAL_STEPS - 1 && (
          <p className="applyWizard_hint">Press Enter to continue</p>
        )}
      </div>
    </div>
  );
}
