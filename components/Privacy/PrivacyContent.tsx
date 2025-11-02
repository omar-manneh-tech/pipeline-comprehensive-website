/**
 * Privacy Policy Content
 * Main content sections for privacy policy
 */

"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Database, Lock, Eye, UserCheck, FileText } from "lucide-react";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Name and contact information when you contact us</li>
          <li>Email address for inquiries and communications</li>
          <li>Phone number (optional) for follow-up purposes</li>
          <li>Any other information you choose to provide in forms</li>
        </ul>
        <p>
          We also automatically collect certain information when you visit our website, such as IP address, browser type, and pages visited.
        </p>
      </div>
    ),
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: (
      <div className="space-y-4">
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Respond to your inquiries and provide customer support</li>
          <li>Send you important updates about our school</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
          <li>Protect our rights and prevent fraud</li>
        </ul>
      </div>
    ),
  },
  {
    icon: Lock,
    title: "How We Protect Your Information",
    content: (
      <div className="space-y-4">
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information, including:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Encryption of data in transit using HTTPS</li>
          <li>Secure server infrastructure</li>
          <li>Regular security audits and updates</li>
          <li>Limited access to personal information on a need-to-know basis</li>
        </ul>
      </div>
    ),
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: (
      <div className="space-y-4">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Access your personal information</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to processing of your personal information</li>
          <li>Request data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mt-4">
          To exercise these rights, please contact us using the information provided below.
        </p>
      </div>
    ),
  },
  {
    icon: FileText,
    title: "Cookies and Tracking",
    content: (
      <div className="space-y-4">
        <p>
          Our website uses cookies and similar tracking technologies to enhance your experience. We use cookies for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Essential website functionality</li>
          <li>Analytics to understand how visitors use our site</li>
          <li>Remembering your preferences</li>
        </ul>
        <p className="mt-4">
          You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
        </p>
      </div>
    ),
  },
  {
    icon: Shield,
    title: "Data Retention",
    content: (
      <div className="space-y-4">
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
        </p>
        <p>
          Contact form submissions are retained for up to 2 years unless you request earlier deletion. Analytics data may be retained in anonymized form for longer periods.
        </p>
      </div>
    ),
  },
];

export function PrivacyContent() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Privacy Policy"
          description="We are committed to protecting your privacy and personal information."
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {privacySections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={transitions.default}
              >
                <Card className="border-2 border-gold">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-lg flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-navy mb-3">{section.title}</h3>
                        <div className="text-gray-700 leading-relaxed">{section.content}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={transitions.default}
          className="max-w-4xl mx-auto mt-12"
        >
          <Card className="border-2 border-gold bg-navy text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Changes to This Policy</h3>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

