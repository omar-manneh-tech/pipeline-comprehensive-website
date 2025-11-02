/**
 * Admin Login Page
 * Allows admin users to authenticate and access the admin dashboard
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/Shared/SectionHeader";
import { apiClient } from "@/services/api/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/activities";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push(redirect);
    }
  }, [router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus("idle");
    setErrors({});
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (!contentType || !contentType.includes("application/json")) {
        // If not JSON, it's likely an error page (404, 500, etc.)
        const text = await response.text();
        console.error("[Login Error] Non-JSON response:", text.substring(0, 200));
        if (response.status === 404) {
          setErrorMessage("Login endpoint not found. Please check if the API is properly configured.");
        } else {
          setErrorMessage("Server error. Please check if the API endpoint is available.");
        }
        setSubmitStatus("error");
        return;
      }

      // Parse JSON response
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("[Login Error] JSON parse error:", parseError);
        setErrorMessage("Invalid response from server. Please try again.");
        setSubmitStatus("error");
        return;
      }

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrorMessage(data.message || "Login failed. Please check your credentials.");
        }
        setSubmitStatus("error");
        return;
      }

      if (data.success && data.token) {
        // Store token
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));

        // Set success status
        setSubmitStatus("success");
        
        // Use window.location for hard redirect to ensure middleware doesn't interfere
        // router.push sometimes doesn't work properly with middleware
        window.location.href = redirect;
      } else {
        // If no token in response, something went wrong
        setErrorMessage("Login failed. No token received from server.");
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("[Login Error]", error);
      if (error instanceof Error) {
        if (error.message.includes("JSON")) {
          setErrorMessage("Server error. The login endpoint may not be available.");
        } else {
          setErrorMessage("Network error. Please check your connection and try again.");
        }
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B2B5C] via-[#1B2B5C] to-[#0F1A3A] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-2 border-gold">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-[#1B2B5C] p-4 rounded-full">
                <Lock className="h-8 w-8 text-gold" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-navy">
              Admin Login
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to access the admin dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B5C]`}
                    placeholder="admin@daddyjobe.edu.gm"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B5C]`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B2B5C] hover:bg-[#1B2B5C]/90 text-white border-2 border-gold flex items-center justify-center gap-2"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                First time? Contact system administrator to create your account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

