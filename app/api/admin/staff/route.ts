/**
 * Admin Staff API
 * CRUD operations for staff members
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";

const staffSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.string().optional(),
  position: z.string().min(1),
  bio: z.string().min(1),
  image: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  qualifications: z.array(z.string()).or(z.string()).optional(),
  experience: z.number().int().optional(),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const published = searchParams.get("published");

    const where: { role?: string; published?: boolean } = {};
    if (role) where.role = role;
    if (published !== null) where.published = published === "true";

    const staff = await prisma.staffMember.findMany({
      where,
      orderBy: { order: "asc" },
    });

    const staffWithParsedQualifications = staff.map((member) => ({
      ...member,
      qualifications:
        typeof member.qualifications === "string"
          ? JSON.parse(member.qualifications)
          : member.qualifications,
    }));

    return NextResponse.json({
      success: true,
      data: staffWithParsedQualifications,
    });
  } catch (error) {
    console.error("[Staff API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    const body = await request.json();
    const validatedData = staffSchema.parse(body);

    const qualificationsJson =
      typeof validatedData.qualifications === "string"
        ? validatedData.qualifications
        : JSON.stringify(validatedData.qualifications || []);

    const staff = await prisma.staffMember.create({
      data: {
        ...validatedData,
        qualifications: qualificationsJson,
        createdBy: user.userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...staff,
          qualifications: JSON.parse(staff.qualifications),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Staff API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create staff member" },
      { status: 500 }
    );
  }
}

