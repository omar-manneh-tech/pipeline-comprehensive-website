/**
 * Admission Process Component
 * Overview of the admission process steps
 */

"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";

type StepId = "step-1" | "step-2" | "step-3" | "step-4";

const steps: Array<{
  id: StepId;
  label: string;
  title: string;
  description: string;
}> = [
  {
    id: "step-1",
    label: "1️⃣ Step 1",
    title: "Submit Application",
    description:
      "Complete and submit your admission application form along with required documents.",
  },
  {
    id: "step-2",
    label: "2️⃣ Step 2",
    title: "Attend Interview",
    description:
      "Participate in an interview and assessment to evaluate your readiness for our program.",
  },
  {
    id: "step-3",
    label: "3️⃣ Step 3",
    title: "Receive Admission",
    description:
      "Successful candidates will receive an admission letter with enrollment instructions.",
  },
  {
    id: "step-4",
    label: "4️⃣ Step 4",
    title: "Complete Enrollment",
    description:
      "Complete the enrollment process, pay fees, and prepare for your first day of classes.",
  },
];

export function AdmissionProcess() {
  const [openStep, setOpenStep] = useState<StepId | null>("step-1");

  const handleToggle = useCallback(
    (stepId: StepId) => {
      setOpenStep((current) => (current === stepId ? null : stepId));
    },
    []
  );

  return (
    <section className="py-20 bg-gradient-to-br from-[#020b26] via-[#031132] to-[#020922]">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Admission Process"
          description={
            <div className="space-y-3 text-white/80 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
              <p>
                Follow these simple steps to join Daddy Jobe Comprehensive School. Our admissions journey is structured to guide you from application to enrollment with clarity and care, ensuring every family understands the milestones ahead.
              </p>
              <p>
                Use this interactive checklist to track your progress, stay informed about upcoming actions, and feel confident that you are meeting every requirement on time.
              </p>
            </div>
          }
          titleClassName="text-white drop-shadow-lg"
          descriptionClassName="text-white/80 drop-shadow-md max-w-3xl mx-auto"
        />

        <div className="max-w-4xl mx-auto mt-12">
          <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-lg divide-y divide-white/10 shadow-[0_20px_60px_rgba(12,28,73,0.35)]">
            {steps.map((step) => {
              const isOpen = openStep === step.id;
              return (
                <div key={step.id} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleToggle(step.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${step.id}-content`}
                    id={`${step.id}-trigger`}
                    className={[
                      "w-full px-6 sm:px-8 py-5 flex items-center justify-between gap-6 text-left transition-all duration-300 ease-in-out",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                      isOpen ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-sm font-semibold uppercase tracking-wide text-gold">
                        {step.label}
                      </span>
                      <span className="text-lg sm:text-xl font-semibold">
                        {step.title}
                      </span>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white">
                      {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={step.id}
                        id={`${step.id}-content`}
                        role="region"
                        aria-labelledby={`${step.id}-trigger`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-8 pb-6 text-white/80 leading-relaxed text-base">
                          {step.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


