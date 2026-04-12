"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const getBaseURL = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.AUTH_INTERNAL_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [adminClient()],
});
