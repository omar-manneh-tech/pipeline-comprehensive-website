"use client";

import { useCallback, useMemo, useState } from "react";
import type { ComponentType, KeyboardEvent, SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Inbox,
  Mail,
  MapPin,
  Phone,
  Send,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TabId = "requirements" | "dates" | "how-to-apply" | "contact";

interface AccordionItem {
  id: string;
  title: string;
  description: string | string[];
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

interface TabConfig {
  id: TabId;
  label: string;
  subtitle: string;
  accordions: AccordionItem[];
  footer?: {
    heading: string;
    description: string;
  };
}

const tabs: TabConfig[] = [
  {
    id: "requirements",
    label: "Admission Requirements",
    subtitle: "What you need to enroll in Grade 10 at Daddy Jobe Comprehensive School",
    accordions: [
      {
        id: "eligibility",
        title: "1️⃣ Eligibility Criteria",
        description: [
          "Completion of Grade 9 (Junior Secondary School)",
          "Minimum age of 15 years",
          "Grade 9 completion certificate or equivalent",
          "Two recent passport-sized photographs",
          "Copy of birth certificate",
          "Medical certificate (health clearance)",
          "Previous school records/transcripts",
          "Recommendation letter from previous school",
        ],
        icon: ClipboardList,
      },
      {
        id: "documents",
        title: "2️⃣ Required Documents",
        description: [
          "Completed admission application form",
          "Photocopy of Grade 9 certificate",
          "Copy of birth certificate",
          "Medical clearance certificate",
          "Passport-sized photographs (2 copies)",
          "Previous school academic records",
          "Recommendation letter",
          "Parent/Guardian identification",
        ],
        icon: FileText,
      },
    ],
  },
  {
    id: "dates",
    label: "Important Dates",
    subtitle: "Key dates for the 2025–2026 academic year admission cycle",
    accordions: [
      {
        id: "application-start",
        title: "1️⃣ Application Period Opens — February 1, 2025",
        description: "Start submitting your admission applications.",
        icon: CalendarDays,
      },
      {
        id: "application-deadline",
        title: "2️⃣ Application Deadline — March 31, 2025",
        description: "Last day to submit completed applications.",
        icon: CalendarDays,
      },
      {
        id: "interviews",
        title: "3️⃣ Interviews & Assessments — April 15–30, 2025",
        description: "Interview and assessment period for applicants.",
        icon: CalendarDays,
      },
      {
        id: "results",
        title: "4️⃣ Admission Results — May 15, 2025",
        description: "Successful candidates will be notified.",
        icon: CalendarDays,
      },
      {
        id: "enrollment",
        title: "5️⃣ Enrollment Period — May 20 – June 15, 2025",
        description: "Complete enrollment and fee payment.",
        icon: CalendarDays,
      },
      {
        id: "orientation",
        title: "6️⃣ Orientation Day — September 1, 2025",
        description: "Welcome orientation for new students.",
        icon: CalendarDays,
      },
    ],
  },
  {
    id: "how-to-apply",
    label: "How To Apply",
    subtitle: "Follow these steps to submit your admission application",
    accordions: [
      {
        id: "download-form",
        title: "1️⃣ Step 1 — Download Application Form",
        description:
          "Download the admission application form from our website or collect it from the school office.",
        icon: Inbox,
      },
      {
        id: "complete-form",
        title: "2️⃣ Step 2 — Complete the Form",
        description:
          "Fill out all required sections of the application form accurately and completely.",
        icon: ClipboardList,
      },
      {
        id: "gather-documents",
        title: "3️⃣ Step 3 — Gather Documents",
        description:
          "Collect all required documents as listed in the admission requirements section.",
        icon: FileText,
      },
      {
        id: "submit-application",
        title: "4️⃣ Step 4 — Submit Application",
        description:
          "Submit your completed application form and documents to the school administration office.",
        icon: Send,
      },
    ],
    footer: {
      heading: "Ready to Apply?",
      description:
        "Download the application form and ensure all required documents are included for processing.",
    },
  },
  {
    id: "contact",
    label: "Contact Admissions Office",
    subtitle: "Have questions? We’re here to help with your admission inquiries.",
    accordions: [
      {
        id: "get-in-touch",
        title: "1️⃣ Get In Touch",
        description: [
          "**Address:** 123 Education Street, Banjul, The Gambia",
          "**Phone:** +220 123 4567",
          "**Email:** info@daddyjobe.edu.gm",
        ],
        icon: MapPin,
      },
      {
        id: "office-hours",
        title: "2️⃣ Office Hours",
        description: [
          "Monday – Friday: 8:00 AM – 4:00 PM",
          "Saturday: 9:00 AM – 1:00 PM",
        ],
        icon: UserRound,
      },
      {
        id: "quick-actions",
        title: "3️⃣ Quick Actions",
        description: [
          "Send Email Inquiry",
          "Call Admissions Office",
          "Visit Contact Page",
        ],
        icon: Mail,
      },
    ],
  },
];

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function AdmissionsInfoTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("requirements");
  const [openItems, setOpenItems] = useState<Record<TabId, string | null>>({
    requirements: "eligibility",
    dates: "application-start",
    "how-to-apply": "download-form",
    contact: "get-in-touch",
  });

  const currentTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)!,
    [activeTab]
  );

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (index + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = (index - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex].id);
      }
    },
    []
  );

  const handleToggleAccordion = useCallback((itemId: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] === itemId ? null : itemId,
    }));
  }, [activeTab]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Admissions Information"
          description="Navigate program requirements, key dates, application steps, and direct contact details—all in one place."
        />

        <div className="mt-12 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div
              role="tablist"
              aria-orientation="vertical"
              className="flex lg:flex-col gap-3 rounded-3xl bg-navy/95 text-white p-4 lg:p-6 shadow-2xl"
            >
              {tabs.map((tab, index) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`admissions-tabpanel-${tab.id}`}
                    id={`admissions-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={[
                      "group rounded-2xl px-4 py-3 text-left transition-all duration-300 ease-in-out",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy/95",
                      selected
                        ? "bg-white/15 text-white shadow-xl"
                        : "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide">
                      {tab.label}
                    </p>
                    <p className="text-xs text-white/60 mt-1 leading-snug">
                      {tab.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  role="tabpanel"
                  id={`admissions-tabpanel-${activeTab}`}
                  aria-labelledby={`admissions-tab-${activeTab}`}
                  className="rounded-3xl border border-navy/10 bg-gradient-to-br from-white via-blue-50 to-white shadow-[0_25px_60px_rgba(23,44,89,0.15)] overflow-hidden"
                >
                  <div className="px-6 sm:px-10 py-8">
                    <header className="space-y-2 mb-8">
                      <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
                        {currentTab.label}
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-navy">
                        {currentTab.subtitle}
                      </h3>
                    </header>

                    <div className="divide-y divide-navy/10">
                      {currentTab.accordions.map((item) => {
                        const isOpen = openItems[activeTab] === item.id;
                        const Icon = item.icon;
                        return (
                          <div key={item.id} className="overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleToggleAccordion(item.id)}
                              aria-expanded={isOpen}
                              aria-controls={`${activeTab}-${item.id}-content`}
                              id={`${activeTab}-${item.id}-trigger`}
                              className={[
                                "w-full py-5 flex items-center justify-between gap-6 text-left transition-all duration-300 ease-in-out",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                                isOpen
                                  ? "text-navy"
                                  : "text-navy/80 hover:text-navy",
                              ].join(" ")}
                            >
                              <div className="flex items-center gap-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                  {Icon ? <Icon className="h-5 w-5" /> : "+"}
                                </span>
                                <span className="text-base sm:text-lg font-semibold leading-tight">
                                  {item.title}
                                </span>
                              </div>
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 border border-primary/20 text-primary">
                                {isOpen ? "–" : "+"}
                              </span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  key={item.id}
                                  id={`${activeTab}-${item.id}-content`}
                                  role="region"
                                  aria-labelledby={`${activeTab}-${item.id}-trigger`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="pb-6 pl-14 pr-8 text-navy/80 leading-relaxed text-sm sm:text-base">
                                    {Array.isArray(item.description) ? (
                                      <ul className="space-y-2 list-disc list-inside">
                                        {item.description.map((point) => (
                                          <li key={point} dangerouslySetInnerHTML={{ __html: point }} />
                                        ))}
                                      </ul>
                                    ) : (
                                      <p>{item.description}</p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>

                    {currentTab.footer && (
                      <div className="mt-10 rounded-2xl border border-primary/10 bg-primary/5 px-6 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-navy mb-1">
                            {currentTab.footer.heading}
                          </h4>
                          <p className="text-sm text-navy/80">
                            {currentTab.footer.description}
                          </p>
                        </div>
                        <Button
                          asChild
                          className="rounded-full px-6 py-3 text-sm font-semibold"
                        >
                          <Link href="/files/daddy-jobe-application-form.pdf" target="_blank">
                            Download Application Form
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


