import { ContactForm } from "@/components/viewer/ContactForm";
import { PublicPageLayout } from "@/components/viewer/PublicPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Projects by SI",
  description: "Get in touch with Sankalp Indish.",
};

export default function ContactPage() {
  return (
    <PublicPageLayout>
      <section className="bg-[#0d6efd] py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">Get in Touch</h1>
          <p className="mt-3 text-lg text-white/95 sm:text-xl">
            Have a question or want to collaborate? Drop me a message below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border-0 bg-white p-6 shadow-lg sm:p-10">
            <h2 className="mb-8 text-center text-xl font-semibold text-[#6c757d]">
              Contact Form
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
