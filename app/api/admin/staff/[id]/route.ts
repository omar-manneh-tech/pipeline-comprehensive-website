/**
 * Admin Staff API - Individual Staff Member
 * GET, PUT, DELETE operations for a single staff member
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/middleware";

const staffUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  department: z.string().optional(),
  position: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  image: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  qualifications: z.array(z.string()).or(z.string()).optional(),
  experience: z.number().int().optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const staff = await prisma.staffMember.findUnique({
      where: { id },
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...staff,
        qualifications:
          typeof staff.qualifications === "string"
            ? JSON.parse(staff.qualifications)
            : staff.qualifications,
      },
    });
  } catch (error) {
    console.error("[Staff API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const validatedData = staffUpdateSchema.parse(body);

    const existingStaff = await prisma.staffMember.findUnique({
      where: { id },
    });

    if (!existingStaff) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 }
      );
    }

    const updateData: any = { ...validatedData };
    if (validatedData.qualifications) {
      updateData.qualifications =
        typeof validatedData.qualifications === "string"
          ? validatedData.qualifications
          : JSON.stringify(validatedData.qualifications);
    }

    const staff = await prisma.staffMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...staff,
        qualifications:
          typeof staff.qualifications === "string"
            ? JSON.parse(staff.qualifications)
            : staff.qualifications,
      },
    });
  } catch (error) {
    console.error("[Staff API Error]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update staff member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const staff = await prisma.staffMember.findUnique({
      where: { id },
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 }
      );
    }

    await prisma.staffMember.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    console.error("[Staff API Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete staff member" },
      { status: 500 }
    );
  }
}

