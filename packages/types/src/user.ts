export type UserRole = "admin" | "analyst" | "viewer";
export type UserStatus = "active" | "inactive" | "suspended";
export type KycStatus = "pending" | "verified" | "rejected";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KycStatus;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}
