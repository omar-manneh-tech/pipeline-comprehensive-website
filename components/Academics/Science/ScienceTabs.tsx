"use client";

import { useCallback, useMemo, useState } from "react";
import type { ComponentType, KeyboardEvent, SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  ClipboardCheck,
  FlaskConical,
  Globe,
  GraduationCap,
  Laptop,
  Leaf,
  LineChart,
  Microscope,
  NotebookPen,
  Pill,
  Sigma,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { SectionHeader } from "@/components/Shared/SectionHeader";

type TabId = "core" | "elective" | "career" | "facilities" | "requirements";

interface TabConfig {
  id: TabId;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  summary: string;
}

const tabs: TabConfig[] = [
  {
    id: "core",
    label: "Core Subjects",
    icon: GraduationCap,
    summary:
      "Foundational courses every science student must master for WASSCE success and tertiary readiness.",
  },
  {
    id: "elective",
    label: "Elective Subjects",
    icon: LineChart,
    summary:
      "Specialized subjects that broaden scientific perspectives and support targeted career aspirations.",
  },
  {
    id: "career",
    label: "Career Paths",
    icon: BriefcaseIcon,
    summary:
      "University degrees and professional routes available to science scholars from Daddy Jobe.",
  },
  {
    id: "facilities",
    label: "Science Facilities",
    icon: FlaskConical,
    summary:
      "State-of-the-art laboratories and resources designed to power hands-on scientific exploration.",
  },
  {
    id: "requirements",
    label: "Program Requirements",
    icon: ClipboardCheck,
    summary:
      "Academic expectations and personal qualities that help every science learner thrive.",
  },
];

const tabContent: Record<
  TabId,
  {
    heading: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: ComponentType<SVGProps<SVGSVGElement>>;
    }>;
  }
> = {
  core: {
    heading: "Core Subjects",
    description:
      "Master the essential disciplines that underpin every science-focused profession and open doors to global tertiary opportunities.",
    items: [
      {
        title: "Mathematics",
        description:
          "Advanced mathematics covering algebra, geometry, trigonometry, calculus, and statistics. Essential for all science disciplines.",
        icon: Calculator,
      },
      {
        title: "English Language",
        description:
          "Strong communication skills for scientific writing, presentations, and academic discourse in tertiary education.",
        icon: Brain,
      },
      {
        title: "Physics",
        description:
          "Study of matter, motion, energy, and force. Topics include mechanics, thermodynamics, electricity, magnetism, and modern physics.",
        icon: Atom,
      },
      {
        title: "Chemistry",
        description:
          "Understanding chemical principles, reactions, and compounds. Laboratory work emphasizes practical application of chemical concepts.",
        icon: FlaskConical,
      },
      {
        title: "Biology",
        description:
          "Comprehensive study of living organisms, cells, genetics, ecology, and human anatomy. Laboratory sessions enhance understanding.",
        icon: Microscope,
      },
    ],
  },
  elective: {
    heading: "Elective Subjects",
    description:
      "Select electives that complement your passions and support your intended university major.",
    items: [
      {
        title: "Further Mathematics",
        description:
          "Advanced mathematical topics including calculus, linear algebra, and complex numbers. Recommended for students pursuing Engineering and advanced sciences.",
        icon: Calculator,
      },
      {
        title: "Agricultural Science",
        description:
          "Study of agricultural principles, crop production, animal husbandry, and sustainable farming practices. Useful for agricultural science and related fields.",
        icon: Leaf,
      },
      {
        title: "Geography",
        description:
          "Understanding physical geography, human geography, and environmental systems. Complements science studies with earth science perspectives.",
        icon: Globe,
      },
    ],
  },
  career: {
    heading: "Career Paths",
    description:
      "Envision the professional pathways available after mastering the Science Program’s rigorous curriculum.",
    items: [
      {
        title: "Medicine",
        description:
          "Become a doctor, surgeon, or medical specialist. Requires university medical school and residency training.",
        icon: Stethoscope,
      },
      {
        title: "Engineering",
        description:
          "Pursue careers in Civil, Mechanical, Electrical, Chemical, or Computer Engineering. Design and build solutions.",
        icon: WrenchIcon,
      },
      {
        title: "Pharmacy",
        description:
          "Study pharmaceutical sciences, become a pharmacist, or pursue pharmaceutical research and development.",
        icon: Pill,
      },
      {
        title: "Computer Science",
        description:
          "Software development, data science, cybersecurity, artificial intelligence, and information technology.",
        icon: Laptop,
      },
      {
        title: "Scientific Research",
        description:
          "Pursue research careers in biology, chemistry, physics, or interdisciplinary sciences. Contribute to scientific advancement.",
        icon: Microscope,
      },
      {
        title: "Nursing & Healthcare",
        description:
          "Become a nurse, midwife, or healthcare administrator. Provide essential healthcare services to communities.",
        icon: HeartPulseIcon,
      },
    ],
  },
  facilities: {
    heading: "Science Facilities",
    description: "State-of-the-art facilities supporting science education.",
    items: [
      {
        title: "Chemistry Laboratory",
        description:
          "Fully equipped chemistry lab with modern apparatus for experiments in organic, inorganic, and physical chemistry.",
        icon: FlaskConical,
      },
      {
        title: "Biology Laboratory",
        description:
          "Well-equipped biology lab with microscopes, dissection equipment, and specimens for comprehensive biological studies.",
        icon: Microscope,
      },
      {
        title: "Physics Laboratory",
        description:
          "Advanced physics lab with equipment for experiments in mechanics, electricity, optics, and modern physics.",
        icon: Atom,
      },
      {
        title: "Science Library",
        description:
          "Extensive collection of science textbooks, reference materials, and research resources for students.",
        icon: BookOpen,
      },
    ],
  },
  requirements: {
    heading: "Program Requirements",
    description: "What you need to succeed in the Science Program.",
    items: [
      {
        title: "Academic Prerequisites",
        description:
          "Strong performance in Mathematics and Science subjects at the junior secondary level. Minimum grade requirements apply.",
        icon: NotebookPen,
      },
      {
        title: "Mathematics Proficiency",
        description:
          "Solid foundation in basic mathematics, algebra, and problem-solving skills essential for success in Physics and Chemistry.",
        icon: Sigma,
      },
      {
        title: "WASSCE Preparation",
        description:
          "Commitment to rigorous study, regular attendance, and active participation in laboratory practical sessions.",
        icon: ClipboardCheck,
      },
      {
        title: "Science Interest",
        description:
          "Genuine interest in science subjects, curiosity about how things work, and willingness to engage in hands-on experiments.",
        icon: Sparkles,
      },
    ],
  },
};

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function ScienceTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("core");

  const currentContent = useMemo(() => tabContent[activeTab], [activeTab]);

  const handleKeyDown = useCallback(
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

  return (
    <section className="py-20 bg-gradient-to-br from-[#020b26] via-[#031132] to-[#020922]">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Science Pathways Explorer"
          description={
            <div className="space-y-3 text-white/80 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
              <p>
                Navigate the heart of the Science Program—discover required subjects, strategic electives, and the career pathways they unlock. Each tab gives you an inside view of how our curriculum fuels academic excellence and prepares students for the world&apos;s most demanding scientific careers.
              </p>
              <p>
                Explore the laboratories and resources that make hands-on experimentation possible, understand the expectations for aspiring scientists, and map the routes to global opportunities. Whether you are charting your academic plan or mentoring a future innovator, this explorer keeps everything at your fingertips.
              </p>
            </div>
          }
          titleClassName="text-white drop-shadow-lg"
          descriptionClassName="text-white/80 drop-shadow-md max-w-3xl mx-auto"
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 mt-12">
          <div
            role="tablist"
            aria-orientation="vertical"
            className="flex lg:flex-col gap-4 rounded-3xl bg-white/5 backdrop-blur-xl p-4 border border-white/10"
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`science-tabpanel-${tab.id}`}
                  id={`science-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={[
                    "group flex-1 lg:flex-none rounded-2xl border border-white/10 px-4 py-3 text-left transition-all",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                    selected
                      ? "bg-white/15 text-white shadow-lg"
                      : "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "rounded-xl p-2 transition-transform duration-300",
                        selected ? "bg-gold/20 text-gold" : "bg-white/10 text-white",
                        "group-hover:scale-105",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-wide uppercase">
                        {tab.label}
                      </p>
                      <p className="text-xs text-white/60 mt-1 leading-snug">
                        {tab.summary}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                role="tabpanel"
                id={`science-tabpanel-${activeTab}`}
                aria-labelledby={`science-tab-${activeTab}`}
                className="space-y-6"
              >
                <header className="space-y-3">
                  <p className="text-sm font-semibold tracking-wide uppercase text-gold">
                    {currentContent.heading}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-semibold drop-shadow-lg">
                    {currentContent.heading}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {currentContent.description}
                  </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {currentContent.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="p-2 rounded-xl bg-gold/20 text-gold">
                            <Icon className="h-5 w-5" />
                          </span>
                          <h4 className="text-lg font-semibold leading-tight">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 3h-6a2 2 0 0 0-2 2v2h10V5a2 2 0 0 0-2-2Z" />
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M9 13h6" />
    </svg>
  );
}

function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.41 2a5.36 5.36 0 0 0-.91 5.7l-7.8 7.8a2 2 0 0 0 2.82 2.84l7.8-7.82A5.38 5.38 0 0 0 22 7.59l-3.65.63-1.29-3.59Z" />
      <path d="m5 11 4 4" />
      <path d="m4 16 1 1" />
    </svg>
  );
}

function HeartPulseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.5 9.5 9 14l3-3 3 3L19.5 9.5" />
      <path d="M19.5 4.5a5.5 5.5 0 0 0-9 0 5.5 5.5 0 0 0-9 0c-2.1 2.1-1.8 5.5.6 7.4l8.4 7.6a2 2 0 0 0 2.6 0l8.4-7.6c2.4-1.9 2.7-5.3.6-7.4" />
    </svg>
  );
}


