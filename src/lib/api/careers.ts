import apiClient from "@/lib/api/apiClient";
import { CareerFormValues } from "@/lib/schemas/careerFormSchema";
import { Career, CareerStatus, SavedUser } from "@/types";

export interface CreateCareerPayload extends Partial<CareerFormValues> {
  status: CareerStatus;
  step: number;
  orgID: string;
  createdBy: SavedUser;
  lastEditedBy: SavedUser;
}

export interface UpdateCareerPayload extends Partial<CareerFormValues> {
  status?: CareerStatus;
  step?: number;
  directInterviewLink?: string | null;
  lastEditedBy: SavedUser;
}

export interface CareerResponse {
  message: string;
  career: Career;
}

export interface CareersListResponse {
  careers: Career[];
}

export interface ListCareersParams {
  status?: CareerStatus;
  orgID?: string;
}

/**
 * Create a new career (draft, inactive, or active)
 */
export async function createCareer(payload: CreateCareerPayload): Promise<CareerResponse> {
  console.log("Creating career with payload:", payload);
  const response = await apiClient.post<CareerResponse>("/api/careers", payload);
  return response.data;
}

/**
 * Get a list of careers with optional filtering
 */
export async function listCareers(params?: ListCareersParams) {
  const response = await apiClient.get<CareersListResponse>("/api/careers", { params });
  return response.data;
}

/**
 * Get a single career by ID
 */
export async function getCareer(id: string) {
  console.log("Fetching career with ID:", id);
  const response = await apiClient.get<CareerResponse>(`/api/careers/${id}`);
  return response.data;
}

/**
 * Update an existing career (including status changes)
 */
export async function updateCareer(id: string, payload: UpdateCareerPayload) {
  console.log("Updating career with ID:", id);
  const response = await apiClient.patch<CareerResponse>(`/api/careers/${id}`, payload);
  return response.data;
}

/**
 * Delete a career (soft delete by default)
 */
export async function deleteCareer(id: string, hard: boolean = false) {
  console.log("Deleting career with ID:", id);
  const response = await apiClient.delete<{ message: string; career?: Career }>(
    `/api/careers/${id}`,
    {
      params: { hard },
    },
  );
  return response.data;
}
