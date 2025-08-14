// Import User type from Prisma, but define enums manually for now
import type { User } from "@prisma/client";

// Define enums manually (these should match your Prisma schema)
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  RESTAURANT_OWNER = "RESTAURANT_OWNER",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Re-export User type
export type { User };

export interface CreateUserInput {
  businessName: string;
  email: string;
  phoneNumber: string;
  password: string;
  businessLicenseFile?: string;
  role?: UserRole;
}

export interface LoginInput {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: Omit<User, "password" | "resetToken" | "resetTokenExpiry">;
  token?: string;
  message?: string;
  redirectUrl?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: Omit<User, "password" | "resetToken" | "resetTokenExpiry">;
}

export interface ApprovalRequest {
  userId: string;
  approved: boolean;
  adminId: string;
}
