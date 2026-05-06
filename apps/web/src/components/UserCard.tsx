import type { User } from "@fintech/types";
import { Card, CardHeader, CardTitle, Badge } from "@fintech/ui";

interface UserCardProps {
  user: User;
}

const kycBadgeVariant = {
  verified: "success",
  pending: "warning",
  rejected: "error",
} as const;

const statusBadgeVariant = {
  active: "success",
  inactive: "default",
  suspended: "error",
} as const;

export function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile</CardTitle>
          <Badge variant={statusBadgeVariant[user.status]}>{user.status}</Badge>
        </div>
      </CardHeader>
      <div className="grid gap-3 text-sm">
        <Row label="Name" value={`${user.firstName} ${user.lastName}`} />
        <Row label="Email" value={user.email} />
        <Row label="Role" value={user.role} />
        <Row
          label="KYC"
          value={
            <Badge variant={kycBadgeVariant[user.kycStatus]}>{user.kycStatus}</Badge>
          }
        />
        <Row label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-1 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
