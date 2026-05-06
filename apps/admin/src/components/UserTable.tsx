"use client";

import { useState } from "react";
import type { User } from "@fintech/types";
import { Badge, Button, Input } from "@fintech/ui";
import type { BadgeProps } from "@fintech/ui";

interface UserTableProps {
  users: User[];
}

const statusVariant: Record<User["status"], BadgeProps["variant"]> = {
  active: "success",
  inactive: "default",
  suspended: "error",
};

const kycVariant: Record<User["kycStatus"], BadgeProps["variant"]> = {
  verified: "success",
  pending: "warning",
  rejected: "error",
};

const roleVariant: Record<User["role"], BadgeProps["variant"]> = {
  admin: "error",
  analyst: "info",
  viewer: "default",
};

export function UserTable({ users }: UserTableProps) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-72">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} users</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Role", "KYC", "Status", "Since", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={kycVariant[user.kycStatus]}>{user.kycStatus}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("en-US")}
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
