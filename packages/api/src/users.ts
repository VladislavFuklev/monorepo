import type { User, PaginatedResponse, ApiResponse } from "@fintech/types";
import { apiClient } from "./client";

export async function getUser(id: string): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return data.data;
}

export async function getUsers(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>("/users", { params });
  return data;
}

export async function updateUser(id: string, payload: Partial<Omit<User, "id">>): Promise<User> {
  const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, payload);
  return data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
