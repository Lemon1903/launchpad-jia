import { NextRequest, NextResponse } from "next/server";

import { CreateCareerPayload } from "@/lib/api";
import { createCareer, getActiveCareerCount } from "@/lib/mongoDB/career-repository";
import { getOrganizationDetails } from "@/lib/mongoDB/organization-repository";
import { careerFormSchema } from "@/lib/schemas/careerFormSchema";

/**
 * POST /api/careers
 * Create a new career with status: 'draft' | 'inactive' | 'active'
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCareerPayload;

    const {
      // Metadata
      status,
      orgID,
      step,
      createdBy,
      lastEditedBy,
      ...values
    } = body;

    // For drafts and inactive, use partial schema (all fields optional)
    // For active careers, use full schema (all required fields must be present)
    const schema = status === "draft" ? careerFormSchema.partial() : careerFormSchema;
    const validated = schema.safeParse(values);
    if (!validated.success) {
      console.error("Validation errors:", validated.error.format());
      return NextResponse.json(
        {
          error: "Invalid career data",
          issues: validated.error.issues,
        },
        { status: 400 },
      );
    }

    const validatedData = validated.data;

    // Check job limit only for active careers
    if (status === "active") {
      const orgDetails = await getOrganizationDetails(orgID);
      if (!orgDetails) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }

      const totalActiveCareers = await getActiveCareerCount(orgID);
      const jobLimit = orgDetails.plan.jobLimit + orgDetails.extraJobSlots;

      if (totalActiveCareers >= jobLimit) {
        return NextResponse.json(
          {
            error: "You have reached the maximum number of active jobs for your plan",
            limit: jobLimit,
            current: totalActiveCareers,
          },
          { status: 400 },
        );
      }
    }

    // Create career with the provided status (draft, inactive, or active)
    const createdCareer = await createCareer({
      ...validatedData,
      status,
      orgID,
      step,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
      createdBy,
      lastEditedBy,
      directInterviewLink: null,
    });

    return NextResponse.json({
      message: "Career created successfully",
      career: createdCareer,
    });
  } catch (error) {
    console.error("Error creating career:", error);
    return NextResponse.json(
      { error: "Failed to create career", details: error instanceof Error ? error.message : "" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/careers
 * List careers with optional filtering
 * Query params: status, orgID, page, limit
 */
export async function GET(request: NextRequest, { params }: { params: {} }) {
  // TODO: Copy the implementation from /api/get-careers
  return NextResponse.json({ message: "Use /api/get-careers for listing careers" });
}
