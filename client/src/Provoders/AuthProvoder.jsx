"use client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthProvoder({ children }) {
  const router = useRouter();
  return <div>{children}</div>;
}
