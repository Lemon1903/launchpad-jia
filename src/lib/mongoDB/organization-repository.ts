import { ObjectId } from "mongodb";

import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { OrganizationWithPlan } from "@/types";

export async function getOrganizationDetails(
  orgID: string
): Promise<OrganizationWithPlan | undefined> {
  const { db } = await connectMongoDB();
  const orgDetails = await db
    .collection("organizations")
    .aggregate([
      {
        $match: {
          _id: new ObjectId(orgID),
        },
      },
      {
        $lookup: {
          from: "organization-plans",
          let: { planId: "$planId" },
          pipeline: [
            {
              $addFields: {
                _id: { $toString: "$_id" },
              },
            },
            {
              $match: {
                $expr: { $eq: ["$_id", "$$planId"] },
              },
            },
          ],
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
    ])
    .toArray();

  return orgDetails[0] as OrganizationWithPlan | undefined;
}
