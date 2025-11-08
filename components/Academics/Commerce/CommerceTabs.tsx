"use client";

import { useCallback, useMemo, useState } from "react";
import type { ComponentType, KeyboardEvent, SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Book,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle,
  ClipboardCheck,
  Computer,
  DollarSign,
  Globe,
  Landmark,
  Laptop,
  LineChart,
  PiggyBank,
  ShoppingBag,
  TrendingUp,
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
    icon: BriefcaseBusiness,
    summary:
      "Rigorous business-focused subjects that form the backbone of every commerce scholar’s journey.",
  },
  {
    id: "elective",
    label: "Elective Subjects",
    icon: LineChart,
    summary:
      "Complementary courses that sharpen global awareness, policy insight, and commercial expertise.",
  },
  {
    id: "career",
    label: "Career Paths",
    icon: Briefcase,
    summary:
      "High-impact professions and entrepreneurial ventures that commerce graduates can pursue.",
  },
  {
    id: "facilities",
    label: "Commerce Facilities",
    icon: Building2,
    summary:
      "Real-world learning environments built to simulate boardrooms, labs, and business incubators.",
  },
  {
    id: "requirements",
    label: "Program Requirements",
    icon: ClipboardCheck,
    summary:
      "Academic strengths and personal qualities that set commerce students up for distinction.",
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
      "Lay the groundwork for advanced commerce studies with analytical, communication, and strategic disciplines that every business leader relies on.",
    items: [
      {
        title: "Mathematics",
        description:
          "Essential mathematical skills for business calculations, statistics, and financial analysis. Covers algebra, statistics, and applied mathematics.",
        icon: Calculator,
      },
      {
        title: "English Language",
        description:
          "Strong communication skills for business writing, presentations, reports, and professional correspondence in the business world.",
        icon: BookOpen,
      },
      {
        title: "Economics",
        description:
          "Understanding economic principles, market forces, supply and demand, national income, and economic policies affecting business.",
        icon: TrendingUp,
      },
      {
        title: "Accounting",
        description:
          "Financial accounting principles, bookkeeping, financial statements, cost accounting, and financial management for businesses.",
        icon: DollarSign,
      },
      {
        title: "Business Studies",
        description:
          "Business management, entrepreneurship, marketing, human resources, operations, and strategic business planning.",
        icon: Briefcase,
      },
    ],
  },
  elective: {
    heading: "Elective Subjects",
    description:
      "Select electives that expand your commercial worldview and deepen your ability to navigate global markets.",
    items: [
      {
        title: "Commerce",
        description:
          "Study of trade, business transactions, banking, insurance, and commercial activities. Covers retail, wholesale, and international trade principles.",
        icon: ShoppingBag,
      },
      {
        title: "Geography",
        description:
          "Understanding economic geography, resource distribution, and how geographic factors influence business and trade activities.",
        icon: Globe,
      },
      {
        title: "Government",
        description:
          "Understanding government policies, regulations, and their impact on business. Covers public administration and business-government relations.",
        icon: Landmark,
      },
    ],
  },
  career: {
    heading: "Career Paths",
    description:
      "Translate classroom mastery into thriving careers across finance, enterprise leadership, consulting, and beyond.",
    items: [
      {
        title: "Accounting",
        description:
          "Become a certified accountant, auditor, or financial analyst. Work in public accounting firms, corporations, or government agencies.",
        icon: Calculator,
      },
      {
        title: "Banking & Finance",
        description:
          "Pursue careers in banking, investment management, insurance, or financial services. Work with financial institutions and investment companies.",
        icon: Building2,
      },
      {
        title: "Business Administration",
        description:
          "Management positions in corporations, startups, or non-profit organizations. Lead teams, manage operations, and drive business growth.",
        icon: Laptop,
      },
      {
        title: "Marketing & Sales",
        description:
          "Marketing management, advertising, brand management, or sales roles. Help businesses connect with customers and grow market share.",
        icon: ShoppingBag,
      },
      {
        title: "Entrepreneurship",
        description:
          "Start and manage your own business. Apply business knowledge to create innovative products or services and build successful enterprises.",
        icon: BriefcaseBusiness,
      },
      {
        title: "Economics & Research",
        description:
          "Economic analyst, policy researcher, or consultant roles. Analyze economic trends and provide insights to businesses and governments.",
        icon: PiggyBank,
      },
    ],
  },
  facilities: {
    heading: "Commerce Facilities",
    description:
      "Experience industry-grade facilities that replicate professional offices, digital labs, and collaboration hubs for aspiring commerce leaders.",
    items: [
      {
        title: "Accounting Lab",
        description:
          "Practical accounting workspace with calculators, accounting software, and resources for hands-on accounting practice.",
        icon: Calculator,
      },
      {
        title: "Computer Lab",
        description:
          "Modern computer facilities with business software, spreadsheets, and online resources for commerce studies and research.",
        icon: Computer,
      },
      {
        title: "Business Library",
        description:
          "Extensive collection of business textbooks, economics journals, financial publications, and reference materials.",
        icon: Book,
      },
      {
        title: "Business Resource Center",
        description:
          "Dedicated space for business case studies, group projects, and entrepreneurial activities.",
        icon: Briefcase,
      },
    ],
  },
  requirements: {
    heading: "Program Requirements",
    description:
      "Understand the academic readiness and professional mindset that position commerce students for excellence.",
    items: [
      {
        title: "Academic Prerequisites",
        description:
          "Strong performance in Mathematics and English at the junior secondary level. Interest in business and economics is important.",
        icon: BookOpen,
      },
      {
        title: "Mathematical Skills",
        description:
          "Proficiency in basic mathematics, arithmetic, and problem-solving essential for accounting and business calculations.",
        icon: Calculator,
      },
      {
        title: "WASSCE Preparation",
        description:
          "Commitment to regular study, completing assignments, and active participation in business projects and case studies.",
        icon: Award,
      },
      {
        title: "Business Interest",
        description:
          "Genuine interest in business, economics, and entrepreneurship. Willingness to engage in practical business activities.",
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

export function CommerceTabs() {
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
          title="Commerce Pathways Navigator"
          description={
            <div className="space-y-3 text-white/80 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
              <p>
                Explore the engine room of the Commerce Program—master the core disciplines, tailor your electives, and visualize the business careers that await. Each tab delivers curated guidance to help you connect coursework with real-world enterprise impact.
              </p>
              <p>
                Dive into the professional facilities that simulate modern workplaces and understand the expectations that drive outstanding performance. Whether you are planning your subject combination or coaching future entrepreneurs, this navigator keeps every insight within reach.
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
                  aria-controls={`commerce-tabpanel-${tab.id}`}
                  id={`commerce-tab-${tab.id}`}
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
                id={`commerce-tabpanel-${activeTab}`}
                aria-labelledby={`commerce-tab-${activeTab}`}
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


