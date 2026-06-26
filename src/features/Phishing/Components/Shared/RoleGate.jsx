import React from "react";
import { useAuth } from "../../../auth/context/AuthContext";
import { resolvePhishingRole } from "../../utils/roles";

export default function RoleGate({ allow, children, fallback = null }) {
  const { user } = useAuth();
  const role = resolvePhishingRole(user);
  if (!allow(role)) return fallback;
  return children;
}
