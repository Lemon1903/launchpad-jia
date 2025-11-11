import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { Career } from "@/types";
import { ObjectId } from "mongodb";

export async function getCareerById(id: string): Promise<Career | null> {
  const { db } = await connectMongoDB();
  const careeer = await db.collection("careers").findOne({ _id: new ObjectId(id) });
  return { id: careeer._id, ...careeer };
}

export async function createCareer(careerData: Omit<Career, "id">): Promise<Career> {
  const { db } = await connectMongoDB();
  const result = await db.collection("careers").insertOne(careerData);
  return { id: result.insertedId, ...careerData };
}

export async function updateCareer(
  id: string,
  updateData: Partial<Career>,
): Promise<Career | null> {
  const { db } = await connectMongoDB();
  const updatedCareer = await db.collection("careers").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }, // Return updated document
  );

  if (!updatedCareer) {
    return null;
  }

  return { id: updatedCareer._id, ...updatedCareer };
}

export async function deleteCareer(
  id: string,
  hardDelete = false,
): Promise<Career | boolean | null> {
  const { db } = await connectMongoDB();

  if (hardDelete) {
    const result = await db.collection("careers").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  const result = await db.collection("careers").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: "deleted",
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  if (!result) {
    return null;
  }

  return { id: result._id, ...result };
}

export async function getActiveCareerCount(orgID: string): Promise<number> {
  const { db } = await connectMongoDB();
  return await db.collection("careers").countDocuments({ orgID, status: "active" });
}
