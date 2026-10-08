import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { site } from "../lib/site";
import { useMagnetic } from "../lib/useMagnetic";

const SERVICES = [
  "AI Customer Service Chatbots",
  "Automated Email Sorting and Triage",
  "AI Invoice Processing and Accounts Payable",
  "Automated Lead Generation and Outreach",
  "AI Report Generation and Data Analytics",
  "CRM Synchronization and Data Updates",
  "Internal Document Processing and OCR",
  "Automated Employee Onboarding and HR Support",
  "AI Financial Reconciliation and Compliance Auditing",
  "Automated Workflow Approval Chains",
  "Not sure yet",
];

interface Values {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  problem: string;
}

type ErrorKey = "name" | "email" | "service" | "problem";
type Errors = Partial<Record<ErrorKey, string>>;

const EMPTY: Values = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  problem: "",
};

const ID: Record<keyof Values, string> = {
  name: "cf-name",
  email: "cf-email",
  company: "cf-company",
  phone: "cf-phone",
  service: "cf-service",
  problem: "cf-problem",
};

const inputCls = (bad?: boolean) =>
  `w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-mute transition-colors focus:border-pine ${
    bad ? "border-red-500" : "border-line"
  }`;

const labelCls = "block text-sm font-medium text-ink";

export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [botcheck, setBotcheck] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);
  useMagnetic(submitRef);

  const update =
    (key: keyof Values) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key as ErrorKey]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
      if (sent) setSent(false);
      if (failed) setFailed(false);
    };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please add your name.";
    if (!values.email.trim()) next.email = "Please add your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "That email doesn't look right.";
    if (!values.service) next.service = "Please select a service.";
    if (!values.problem.trim()) next.problem = "Please describe the problem.";
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      setSent(false);
      setFailed(false);
      const first = (["name", "email", "service", "problem"] as ErrorKey[]).find(
        (k) => next[k]
      );
      if (first) document.getElementById(ID[first])?.focus();
      return;
    }

    setSending(true);
    setSent(false);
    setFailed(false);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: site.formAccessKey,
          subject: `New project enquiry from ${values.name.trim()}`,
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim() || "-",
          phone: values.phone.trim() || "-",
          service: values.service,
          message: values.problem.trim(),
          botcheck,
        }),
      });
      const data: { success?: boolean; message?: string } | null = await res
        .json()
        .catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed");
      setValues(EMPTY);
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const hasErrors = (Object.keys(errors) as ErrorKey[]).some((k) => errors[k]);

  return (
    <form noValidate onSubmit={onSubmit} className="card p-6 md:p-8">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-azure-deep">
        Start a project
      </h2>

      {hasErrors && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          Please fill in the required fields marked with * before sending.
        </div>
      )}
      {sent && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-azure/40 bg-wash px-4 py-3 text-sm font-medium text-ink"
        >
          Thanks — your message is sent. I'll reply within one working day.
        </div>
      )}
      {failed && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          Couldn't send your message. Please try again, or email{" "}
          {site.emailDisplay} directly.
        </div>
      )}

      <div className="mt-5 grid gap-4">
        {/* Honeypot: invisible to people, filled by naive bots. */}
        <input
          type="text"
          name="botcheck"
          value={botcheck}
          onChange={(e) => setBotcheck(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ID.name} className={labelCls}>
              Name <span className="text-azure-deep">*</span>
            </label>
            <input
              id={ID.name}
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={update("name")}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${ID.name}-err` : undefined}
              className={`mt-1.5 ${inputCls(!!errors.name)}`}
              placeholder="Your name"
            />
            {errors.name && (
              <p id={`${ID.name}-err`} className="mt-1.5 text-xs font-medium text-red-600">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={ID.email} className={labelCls}>
              Email <span className="text-azure-deep">*</span>
            </label>
            <input
              id={ID.email}
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={update("email")}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${ID.email}-err` : undefined}
              className={`mt-1.5 ${inputCls(!!errors.email)}`}
              placeholder="you@company.com"
            />
            {errors.email && (
              <p id={`${ID.email}-err`} className="mt-1.5 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ID.company} className={labelCls}>
              Company name
            </label>
            <input
              id={ID.company}
              type="text"
              autoComplete="organization"
              value={values.company}
              onChange={update("company")}
              className={`mt-1.5 ${inputCls()}`}
              placeholder="Optional"
            />
          </div>
          <div>
            <label htmlFor={ID.phone} className={labelCls}>
              Phone number
            </label>
            <input
              id={ID.phone}
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={update("phone")}
              className={`mt-1.5 ${inputCls()}`}
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label htmlFor={ID.service} className={labelCls}>
            Select a service <span className="text-azure-deep">*</span>
          </label>
          <select
            id={ID.service}
            value={values.service}
            onChange={update("service")}
            aria-required="true"
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? `${ID.service}-err` : undefined}
            className={`mt-1.5 ${inputCls(!!errors.service)}`}
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id={`${ID.service}-err`} className="mt-1.5 text-xs font-medium text-red-600">
              {errors.service}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={ID.problem} className={labelCls}>
            Tell me about your problem <span className="text-azure-deep">*</span>
          </label>
          <textarea
            id={ID.problem}
            rows={5}
            value={values.problem}
            onChange={update("problem")}
            aria-required="true"
            aria-invalid={!!errors.problem}
            aria-describedby={errors.problem ? `${ID.problem}-err` : undefined}
            className={`mt-1.5 resize-y ${inputCls(!!errors.problem)}`}
            placeholder="What is manual today, which tools are involved, and where it hurts most."
          />
          {errors.problem && (
            <p id={`${ID.problem}-err`} className="mt-1.5 text-xs font-medium text-red-600">
              {errors.problem}
            </p>
          )}
        </div>
      </div>

      <button
        ref={submitRef}
        type="submit"
        disabled={sending}
        className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
