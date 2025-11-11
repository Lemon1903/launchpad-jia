import { NextRequest, NextResponse } from "next/server";

import { UpdateCareerPayload } from "@/lib/api";
import {
  deleteCareer,
  getActiveCareerCount,
  getCareerById,
  updateCareer,
} from "@/lib/mongoDB/career-repository";
import { getOrganizationDetails } from "@/lib/mongoDB/organization-repository";
import { careerFormSchema } from "@/lib/schemas/careerFormSchema";

/**
 * GET /api/careers/[id]
 * Get a single career by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const career = await getCareerById(id);
    if (!career) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    return NextResponse.json({ career });
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json({ error: "Failed to fetch career" }, { status: 500 });
  }
}

/**
 * PATCH /api/careers/[id]
 * Update an existing career (including status changes)
 * This handles: draft updates, publish, unpublish, and full edits
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const body = (await request.json()) as UpdateCareerPayload;

    const {
      // Metadata
      status,
      step,
      lastEditedBy,
      directInterviewLink,
      ...values
    } = body;

    const existingCareer = await getCareerById(id);
    if (!existingCareer) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 });
    }

    // For updates that are not publishing, use partial schema (all fields optional)
    const validated = careerFormSchema.partial().safeParse(values);
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

    // If changing status to active, validate organization limits
    if (status === "active" && existingCareer.status !== "active") {
      const orgID = existingCareer.orgID;

      const orgDetails = await getOrganizationDetails(orgID);
      if (!orgDetails) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }

      const totalActiveCareers = await getActiveCareerCount(orgID);
      const jobLimit = orgDetails.plan.jobLimit + orgDetails.extraJobSlots;

      if (totalActiveCareers >= jobLimit) {
        return NextResponse.json(
          {
            error:
              "Cannot publish: You have reached the maximum number of active jobs for your plan",
            limit: jobLimit,
            current: totalActiveCareers,
          },
          { status: 400 },
        );
      }
    }

    let lastActivityAt = existingCareer.lastActivityAt;
    if (status && status !== existingCareer.status) {
      lastActivityAt = new Date();
    }

    // Update career
    const updatedCareer = await updateCareer(id, {
      ...validatedData,
      status: status || existingCareer.status,
      step: step || existingCareer.step,
      lastEditedBy: lastEditedBy || existingCareer.lastEditedBy,
      lastActivityAt,
      directInterviewLink,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Career updated successfully",
      career: updatedCareer,
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { error: "Failed to update career", details: error instanceof Error ? error.message : "" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/careers/[id]
 * Delete a career (soft delete by setting status to 'deleted' or hard delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const hard = searchParams.get("hard") === "true";

    if (hard) {
      // Permanent deletion
      const result = await deleteCareer(id, true);
      if (!result) {
        return NextResponse.json({ error: "Career not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Career permanently deleted" });
    } else {
      // Soft delete (set status to 'deleted')
      const result = await deleteCareer(id, false);
      if (!result) {
        return NextResponse.json({ error: "Career not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Career archived successfully",
        career: result,
      });
    }
  } catch (error) {
    console.error("Error deleting career:", error);
    return NextResponse.json({ error: "Failed to delete career" }, { status: 500 });
  }
}
