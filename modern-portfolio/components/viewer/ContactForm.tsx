"use client";

import { Loader2, Mail, Send, User } from "lucide-react";
import { useCallback, useState } from "react";

const TO_EMAIL = "sanind2004@gmail.com";

/** Structural email check (local@domain.tld); trim before testing. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim());
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [statusText, setStatusText] = useState("");

  const sendViaEmailJs = useCallback(async () => {
    /** EmailJS — must match .env.local variable names exactly */
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    if (!publicKey?.trim() || !serviceId?.trim() || !templateId?.trim()) {
      return false;
    }

    const emailjs = (await import("@emailjs/browser")).default;
    emailjs.init(publicKey.trim());
    await emailjs.send(serviceId.trim(), templateId.trim(), {
      from_name: name,
      from_email: email,
      message,
    });
    return true;
  }, [name, email, message]);

  const nameOk = name.trim().length > 0;
  const emailOk = isValidEmail(email);
  const messageOk = message.trim().length > 0;
  const formComplete = nameOk && emailOk && messageOk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComplete) return;
    setStatus("sending");
    setStatusText("");

    try {
      const usedEmailJs = await sendViaEmailJs();
      if (usedEmailJs) {
        setStatus("success");
        setStatusText("Your message has been sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        return;
      }
      const subject = encodeURIComponent(`Message from ${name || "Portfolio"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`,
      );
      window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("success");
      setStatusText(
        "Your mail app should open. If nothing happens, use Open Gmail below.",
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusText(
        err instanceof Error ? err.message : "Something went wrong. Try Gmail.",
      );
    }
  };

  const openGmail = () => {
    if (!formComplete) return;
    const subject = encodeURIComponent(`Message from ${name || "Portfolio"}`);
    const body = encodeURIComponent(
      `Name: \n${name}\n\nEmail: \n${email}\n\nMessage: \n${message}`,
    );
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${TO_EMAIL}&su=${subject}&body=${body}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1 block text-sm font-bold text-[#6c757d]"
        >
          Your Name
        </label>
        <div className="flex overflow-hidden rounded-md border border-[#dee2e6] bg-white focus-within:border-[#86b7fe] focus-within:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]">
          <span className="flex items-center border-r border-[#dee2e6] bg-[#f8f9fa] px-3 text-[#0d6efd]">
            <User className="size-4" aria-hidden />
          </span>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="min-w-0 flex-1 border-0 px-3 py-2.5 text-[#212529] outline-none placeholder:text-[#adb5bd]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-1 block text-sm font-bold text-[#6c757d]"
        >
          Your Email address
        </label>
        <div className="flex overflow-hidden rounded-md border border-[#dee2e6] bg-white focus-within:border-[#86b7fe] focus-within:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]">
          <span className="flex items-center border-r border-[#dee2e6] bg-[#f8f9fa] px-3 text-[#0d6efd]">
            <Mail className="size-4" aria-hidden />
          </span>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="min-w-0 flex-1 border-0 px-3 py-2.5 text-[#212529] outline-none placeholder:text-[#adb5bd]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block text-sm font-bold text-[#6c757d]"
        >
          Your Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Write your message here..."
          required
          className="w-full rounded-md border border-[#dee2e6] bg-white px-3 py-2.5 text-[#212529] outline-none placeholder:text-[#adb5bd] focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]"
        />
      </div>

      {status !== "idle" ? (
        <div
          role="alert"
          className={`rounded-md px-4 py-3 text-center text-sm ${
            status === "success"
              ? "bg-green-50 text-green-800"
              : status === "error"
                ? "bg-red-50 text-red-800"
                : "bg-[#e7f1ff] text-[#084298]"
          }`}
        >
          {status === "sending" ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending…
            </span>
          ) : (
            statusText
          )}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="submit"
          disabled={!formComplete || status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0d6efd] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0b5ed7] disabled:pointer-events-none disabled:opacity-40"
        >
          <Send className="size-4" aria-hidden />
          Send Message
        </button>
        <button
          type="button"
          onClick={openGmail}
          disabled={!formComplete}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#198754] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#157347] disabled:pointer-events-none disabled:opacity-40"
        >
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Open Gmail
        </button>
      </div>

      {!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? (
        <p className="text-center text-xs text-[#6c757d]">
          Tip: set{" "}
          <code className="rounded bg-[#f1f3f5] px-1">
            NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          </code>
          ,{" "}
          <code className="rounded bg-[#f1f3f5] px-1">
            NEXT_PUBLIC_EMAILJS_SERVICE_ID
          </code>
          , and{" "}
          <code className="rounded bg-[#f1f3f5] px-1">
            NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
          </code>{" "}
          in <code className="rounded bg-[#f1f3f5] px-1">.env.local</code> for
          in-browser EmailJS; otherwise Send Message opens your mail app.
        </p>
      ) : null}
    </form>
  );
}
