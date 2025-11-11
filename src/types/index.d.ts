import { CareerFormValues } from "@/lib/schemas/careerFormSchema";

interface SavedUser {
  email: string;
  name: string;
  image: string;
}

type CareerStatus = "draft" | "inactive" | "active" | "deleted";

interface Career extends Partial<CareerFormValues> {
  id: string;
  status: CareerStatus;
  step: number;
  orgID: string;
  createdBy: SavedUser;
  lastEditedBy: SavedUser;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  directInterviewLink: string | null;
}

type OrganizationTier = "startup" | "corporate" | "enterprise";
type OrganizationType = "startup" | "enterprise";
type OrganizationStatus = "active" | "inactive";

interface Organization {
  _id: string;
  name: string;
  tier: OrganizationTier;
  organizationType: OrganizationType;
  status: OrganizationStatus;
  description: string;
  image: string;
  coverImage: string;
  country: string;
  province: string;
  city: string;
  address: string;
  extraJobSlots: number;
  documents: any[];
  orgID: string;
  planId: string;
  createdAt: Date;
  updatedAt: Date;
  creator: string;
  createdBy: SavedUser;
  lastEditedBy: SavedUser;
}

type OrganizationPlanName = "Startup Plan" | "Growth Plan" | "Enterprise Plan";

interface OrganizationPlan {
  _id: string;
  name: OrganizationPlanName;
  jobLimit: number;
  price: number;
  features: string[];
  createdAt: Date;
}

interface OrganizationWithPlan extends Organization {
  plan: OrganizationPlan;
}
