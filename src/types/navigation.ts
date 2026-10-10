import type { ElementType } from "react";
import type { UserRole } from "./auth";

export interface MenuItem {
  title: string;
  path: string;
  icon: ElementType;
  badge?: string;
  allowedRoles?: UserRole[];
}

export interface MenuGroup {
  section: string;
  items: MenuItem[];
}