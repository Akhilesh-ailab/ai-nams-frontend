import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

interface StoredUser extends User {
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  users: StoredUser[];
}

const loadUsers = (): StoredUser[] => {
  try {
    const storedUsers = localStorage.getItem("ai-nams-users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch {
    return [];
  }
};

const loadUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("ai-nams-user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const storedToken = localStorage.getItem("ai-nams-token");

const initialState: AuthState = {
  user: loadUser(),
  token: storedToken,
  isAuthenticated: !!storedToken,
  users: loadUsers(),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    registerUser: (
      state,
      action: PayloadAction<StoredUser>
    ) => {
      state.users.push(action.payload);

      localStorage.setItem(
        "ai-nams-users",
        JSON.stringify(state.users)
      );
    },

    login: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "ai-nams-user",
        JSON.stringify(action.payload.user)
      );

      localStorage.setItem(
        "ai-nams-token",
        action.payload.token
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("ai-nams-user");
      localStorage.removeItem("ai-nams-token");
    },
  },
});

export const {
  registerUser,
  login,
  logout,
} = authSlice.actions;

export default authSlice.reducer;


