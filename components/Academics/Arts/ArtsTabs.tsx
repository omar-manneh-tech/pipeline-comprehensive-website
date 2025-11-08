"use client";

import { useCallback, useMemo, useState } from "react";
import type { ComponentType, KeyboardEvent, SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Globe,
  GraduationCap,
  Languages,
  Landmark,
  MessageCircle,
  Newspaper,
  Palette,
  Scale,
  Sparkles,
  Users,
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
      "Essential humanities courses building critical thinking, communication, and civic insight.",
  },
  {
    id: "elective",
    label: "Elective Subjects",
    icon: ClipboardCheck,
    summary:
      "Specialized studies that broaden creative expression and global perspective.",
  },
  {
    id: "career",
    label: "Career Paths",
    icon: Landmark,
    summary:
      "Dynamic professions across justice, media, policy, culture, and community leadership.",
  },
  {
    id: "facilities",
    label: "Arts Facilities",
    icon: Palette,
    summary:
      "Immersive spaces designed for debate, creativity, research, and performance.",
  },
  {
    id: "requirements",
    label: "Program Requirements",
    icon: CheckCircle,
    summary:
      "Academic strengths and passions that empower arts students to excel.",
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
      "Develop a powerful humanities foundation through subjects that cultivate analysis, empathy, and persuasive communication.",
    items: [
      {
        title: "English Language",
        description:
          "Advanced English communication, grammar, comprehension, and composition skills. Essential for all arts disciplines and professional communication.",
        icon: BookOpen,
      },
      {
        title: "Literature in English",
        description:
          "Study of literary works, poetry, prose, and drama. Develops critical thinking, analysis, and appreciation of literature from various cultures.",
        icon: Sparkles,
      },
      {
        title: "History",
        description:
          "Understanding historical events, movements, and their impact on society. Covers local, national, and world history with emphasis on critical analysis.",
        icon: Globe,
      },
      {
        title: "Government",
        description:
          "Study of political systems, governance, public administration, and civic responsibilities. Essential for understanding political structures and policies.",
        icon: Landmark,
      },
      {
        title: "CRS/IRK",
        description:
          "Christian Religious Studies or Islamic Religious Knowledge. Study of religious principles, ethics, and moral values. Choose based on your faith.",
        icon: Users,
      },
    ],
  },
  elective: {
    heading: "Elective Subjects",
    description:
      "Personalize your humanities pathway with electives that unlock creative, linguistic, and economic fluency.",
    items: [
      {
        title: "Geography",
        description:
          "Study of physical geography, human geography, and environmental systems. Understanding the relationship between humans and the environment.",
        icon: Globe,
      },
      {
        title: "Economics",
        description:
          "Understanding economic principles, market forces, and economic policies. Useful for careers in public administration and policy.",
        icon: Landmark,
      },
      {
        title: "French",
        description:
          "Learn French language skills for communication, diplomacy, and international opportunities. Opens doors to francophone countries.",
        icon: Languages,
      },
      {
        title: "Art",
        description:
          "Creative arts including drawing, painting, and artistic expression. Develops creativity and artistic skills for careers in the arts.",
        icon: Palette,
      },
    ],
  },
  career: {
    heading: "Career Paths",
    description:
      "See how arts graduates lead change across legal systems, classrooms, media houses, diplomatic corps, and social enterprises.",
    items: [
      {
        title: "Law",
        description:
          "Become a lawyer, judge, or legal advisor. Study law at university and pursue careers in legal practice, judiciary, or legal consultancy.",
        icon: Scale,
      },
      {
        title: "Education",
        description:
          "Become a teacher, lecturer, or education administrator. Share knowledge and shape future generations through teaching.",
        icon: GraduationCap,
      },
      {
        title: "Journalism",
        description:
          "Pursue careers in journalism, media, broadcasting, or communications. Report news, write articles, or work in media production.",
        icon: Newspaper,
      },
      {
        title: "Public Administration",
        description:
          "Work in government agencies, public service, or policy-making. Contribute to governance and public service delivery.",
        icon: Landmark,
      },
      {
        title: "International Relations",
        description:
          "Pursue careers in diplomacy, foreign service, or international organizations. Work on global issues and international cooperation.",
        icon: Globe,
      },
      {
        title: "Social Services",
        description:
          "Work in social work, community development, or non-profit organizations. Help communities and advocate for social change.",
        icon: Users,
      },
    ],
  },
  facilities: {
    heading: "Arts Facilities",
    description:
      "Thrive in purpose-built spaces that nurture debate, creativity, research, and cultural exploration.",
    items: [
      {
        title: "Humanities Library",
        description:
          "Extensive collection of literature, history books, reference materials, and research resources for arts students.",
        icon: BookOpen,
      },
      {
        title: "Debate & Discussion Hall",
        description:
          "Dedicated space for debates, discussions, presentations, and group activities to develop communication and critical thinking skills.",
        icon: MessageCircle,
      },
      {
        title: "Research Center",
        description:
          "Facilities for research, writing, and academic projects. Access to resources for history, government, and literature research.",
        icon: Globe,
      },
      {
        title: "Creative Arts Studio",
        description:
          "Space for artistic expression, creative writing workshops, and cultural activities. Supports students pursuing creative arts.",
        icon: Palette,
      },
    ],
  },
  requirements: {
    heading: "Program Requirements",
    description:
      "Identify the academic readiness and personal attributes that empower arts students to excel in humanities disciplines.",
    items: [
      {
        title: "Academic Prerequisites",
        description:
          "Strong performance in English Language and Social Studies at the junior secondary level. Interest in reading and literature is beneficial.",
        icon: BookOpen,
      },
      {
        title: "Communication Skills",
        description:
          "Good verbal and written communication skills essential for success in literature, government, and social sciences.",
        icon: MessageCircle,
      },
      {
        title: "WASSCE Preparation",
        description:
          "Commitment to extensive reading, regular study, essay writing practice, and active participation in discussions and debates.",
        icon: Award,
      },
      {
        title: "Interest in Humanities",
        description:
          "Genuine interest in literature, history, government, and social issues. Willingness to engage in critical thinking and analysis.",
        icon: CheckCircle,
      },
    ],
  },
};

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function ArtsTabs() {
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
          title="Arts Pathways Navigator"
          description={
            <div className="space-y-3 text-white/80 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
              <p>
                Navigate the core of the Arts Program—explore foundational subjects, tailor elective choices, and map the inspiring careers shaped by humanities education. Every tab connects classroom learning with the real-world influence arts professionals deliver.
              </p>
              <p>
                Discover the creative studios, debate halls, and research centers that bring ideas to life, and review the academic expectations that prepare students for university and civic leadership. This navigator keeps students, families, and mentors aligned on the journey ahead.
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
                  aria-controls={`arts-tabpanel-${tab.id}`}
                  id={`arts-tab-${tab.id}`}
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
                id={`arts-tabpanel-${activeTab}`}
                aria-labelledby={`arts-tab-${activeTab}`}
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


