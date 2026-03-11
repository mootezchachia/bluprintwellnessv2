"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  /* Step 1 — About You */
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /* Step 2 — Your Life */
  age: string;
  occupation: string;
  activityLevel: string;
  /* Step 3 — Your Goals */
  primaryGoal: string;
  timeline: string;
  /* Step 4 — Your Why */
  motivation: string;
  hearAbout: string;
}

const INITIAL: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  occupation: "",
  activityLevel: "",
  primaryGoal: "",
  timeline: "",
  motivation: "",
  hearAbout: "",
};

const TOTAL_STEPS = 5;

const ACTIVITY_LEVELS = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
  "Competitive Athlete",
];

const GOALS = [
  "Performance Training",
  "Advanced Recovery",
  "Functional Medicine",
  "Precision Aesthetics",
  "Integrated Wellness (All)",
];

const TIMELINES = [
  "Immediately",
  "Within 1 Month",
  "Within 3 Months",
  "Exploring Options",
];

const HEAR_ABOUT = [
  "Referral",
  "Social Media",
  "Google Search",
  "Press / Media",
  "Other",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ApplyWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  /* ---- helpers --------------------------------------------------- */

  const set = useCallback(
    (field: keyof FormData) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) =>
        setData((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  );

  const canContinue = useCallback((): boolean => {
    switch (step) {
      case 0:
        return !!(
          data.firstName.trim() &&
          data.lastName.trim() &&
          data.email.trim() &&
          data.phone.trim()
        );
      case 1:
        return !!(
          data.age.trim() &&
          data.occupation.trim() &&
          data.activityLevel
        );
      case 2:
        return !!(data.primaryGoal && data.timeline);
      case 3:
        return !!data.motivation.trim();
      case 4:
        return true;
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
        `ABOUT`,
        `Name: ${data.firstName} ${data.lastName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        ``,
        `LIFE`,
        `Age: ${data.age}`,
        `Occupation: ${data.occupation}`,
        `Activity Level: ${data.activityLevel}`,
        ``,
        `GOALS`,
        `Primary Goal: ${data.primaryGoal}`,
        `Timeline: ${data.timeline}`,
        ``,
        `WHY`,
        `Motivation: ${data.motivation}`,
        `Heard About Us: ${data.hearAbout || "—"}`,
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
        value={data[field]}
        onChange={set(field)}
        required={required}
      />
    </div>
  );

  const renderSelect = (
    label: string,
    field: keyof FormData,
    options: string[],
    required: boolean = true,
  ) => (
    <div className="applyWizard_field" key={field}>
      <label className="applyWizard_label" htmlFor={field}>
        {label}
        {required && <span className="applyWizard_required">*</span>}
      </label>
      <select
        id={field}
        className="applyWizard_select"
        value={data[field]}
        onChange={set(field)}
        required={required}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
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
        value={data[field]}
        onChange={set(field)}
        required={required}
        rows={5}
      />
    </div>
  );

  /* ---- step content ---------------------------------------------- */

  const stepTitles = [
    "About You",
    "Your Life",
    "Your Goals",
    "Your Why",
    "Confirm",
  ];

  const stepBodies = [
    "Let us know who you are so we can personalise your experience.",
    "A few details about your current lifestyle.",
    "Tell us what you want to achieve.",
    "What drives you to pursue this?",
    "Review your application before submitting.",
  ];

  const renderStepFields = () => {
    switch (step) {
      case 0:
        return (
          <div className="applyWizard_fields">
            {renderField("First Name", "firstName")}
            {renderField("Last Name", "lastName")}
            {renderField("Email", "email", "email")}
            {renderField("Phone", "phone", "tel")}
          </div>
        );
      case 1:
        return (
          <div className="applyWizard_fields">
            {renderField("Age", "age")}
            {renderField("Occupation", "occupation")}
            {renderSelect(
              "Activity Level",
              "activityLevel",
              ACTIVITY_LEVELS,
            )}
          </div>
        );
      case 2:
        return (
          <div className="applyWizard_fields">
            {renderSelect("Primary Goal", "primaryGoal", GOALS)}
            {renderSelect("Timeline", "timeline", TIMELINES)}
          </div>
        );
      case 3:
        return (
          <div className="applyWizard_fields">
            {renderTextarea("What motivates you to join?", "motivation")}
            {renderSelect(
              "How did you hear about us?",
              "hearAbout",
              HEAR_ABOUT,
              false,
            )}
          </div>
        );
      case 4:
        return (
          <div className="applyWizard_confirm">
            <div className="applyWizard_summary">
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
              </div>

              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">Your Life</span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Age</span>
                  <span className="applyWizard_summary_value">{data.age}</span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Occupation</span>
                  <span className="applyWizard_summary_value">
                    {data.occupation}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    Activity Level
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.activityLevel}
                  </span>
                </div>
              </div>

              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">Your Goals</span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">
                    Primary Goal
                  </span>
                  <span className="applyWizard_summary_value">
                    {data.primaryGoal}
                  </span>
                </div>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Timeline</span>
                  <span className="applyWizard_summary_value">
                    {data.timeline}
                  </span>
                </div>
              </div>

              <div className="applyWizard_summary_group">
                <span className="applyWizard_summary_label">Your Why</span>
                <div className="applyWizard_summary_row">
                  <span className="applyWizard_summary_key">Motivation</span>
                  <span className="applyWizard_summary_value">
                    {data.motivation}
                  </span>
                </div>
                {data.hearAbout && (
                  <div className="applyWizard_summary_row">
                    <span className="applyWizard_summary_key">
                      Heard About Us
                    </span>
                    <span className="applyWizard_summary_value">
                      {data.hearAbout}
                    </span>
                  </div>
                )}
              </div>
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
          {String(step + 1).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
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
