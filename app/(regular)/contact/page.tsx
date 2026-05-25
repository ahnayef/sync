import type { Metadata } from "next";
import { FiClock, FiMail, FiMapPin } from "react-icons/fi";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Sync team. We're here to help.",
};

const contactItems = [
  {
    label: "Email",
    value: "hello@loop.edu",
    color: "#4f8ef7",
    icon: FiMail,
  },
  {
    label: "Address",
    value: "123 Campus Lane, Edu City",
    color: "#a371f7",
    icon: FiMapPin,
  },
  {
    label: "Support Hours",
    value: "Mon-Fri, 9 AM - 6 PM",
    color: "#3fb950",
    icon: FiClock,
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-base)]">
      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1100px]">
          
          {/* Main cohesive card wrapper */}
          <section className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(17,23,32,0.95),rgba(21,28,37,0.92))] p-6 sm:p-10 lg:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,142,247,0.16),transparent_68%)] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[-70px] bottom-[-90px] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(163,113,247,0.12),transparent_68%)] blur-3xl"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
              
              {/* Left Column: Heading & Contact Info */}
              <div className="flex flex-col justify-between py-2">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] text-[#8ab2ff] uppercase">
                    GET IN TOUCH
                  </div>

                  <h1 className="text-[clamp(28px,5vw,46px)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--color-text-primary)]">
                    We&apos;d love to <span className="gradient-text">hear from you</span>
                  </h1>

                  <p className="mt-4 text-sm sm:text-base leading-7 text-[var(--color-text-secondary)]">
                    Have a question, found a bug, or want help with a schedule issue? Send a message and we&apos;ll route it to the right place.
                  </p>
                </div>

                {/* Compact contact cards inside left column */}
                <div className="mt-10 space-y-4">
                  {contactItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(11,16,21,0.5)] p-4 transition-all hover:bg-[rgba(11,16,21,0.7)]"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
                          style={{
                            background: `${item.color}15`,
                            border: `1px solid ${item.color}25`,
                            color: item.color,
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-[var(--color-text-secondary)]">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Clean, elegant form card */}
              <ContactForm />

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}