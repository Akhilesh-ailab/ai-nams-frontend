export type UserRole =
  | "admin"
  | "pharmacist"
  | "doctor"
  | "pharmacologist"
  | "hospital_admin"
  | "regulatory_authority";

export interface User {
  id: string;
  fullName: string;
  hospitalName: string;
  email: string;
  role: UserRole;
}

export interface StoredUser extends User {
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  users: StoredUser[];
}