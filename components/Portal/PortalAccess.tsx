/**
 * Portal Access Component
 * Portal login and access information
 */

"use client";

import { motion } from "framer-motion";
import { LogIn, Users, Key, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { transitions, viewportConfig } from "@/lib/animations/constants";

const accessTypes = [
  {
    icon: Users,
    title: "Student Access",
    description: "Students can log in using their student ID and password to access academic records, schedules, and assignments.",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconColor: "text-white",
  },
  {
    icon: Users,
    title: "Parent Access",
    description: "Parents can monitor their child's academic progress, attendance, and communicate with teachers through the portal.",
    iconBg: "bg-gradient-to-br from-green-500 to-green-700",
    iconColor: "text-white",
  },
  {
    icon: Users,
    title: "Staff Access",
    description: "Teachers and staff members can access administrative tools, manage classes, and update student records.",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconColor: "text-white",
  },
];

export function PortalAccess() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Portal Access"
          description="Access the school portal using your credentials"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {accessTypes.map((access, index) => {
            const Icon = access.icon;
            return (
              <motion.div
                key={access.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ ...transitions.default, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full border-2 border-gold hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`${access.iconBg} p-4 rounded-full shadow-lg transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110`}>
                        <Icon className={`h-8 w-8 ${access.iconColor} transition-transform duration-500 group-hover:rotate-[360deg]`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">
                      {access.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {access.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Portal Login Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={transitions.default}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-2 border-gold">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-[#1B2B5C] to-blue-700 p-4 rounded-full shadow-lg">
                  <LogIn className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">
                Access School Portal
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Click the button below to access the school portal. You will be redirected to the portal login page where you can enter your credentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-[#1B2B5C] hover:bg-[#1B2B5C]/90 text-white border-2 border-gold flex items-center gap-2"
                  onClick={() => {
                    window.open('#', '_blank', 'noopener,noreferrer');
                  }}
                >
                  <LogIn className="h-5 w-5" />
                  Access Portal
                </Button>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span>Need help with login credentials?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Contact: admin@daddyjobe.edu.gm</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

