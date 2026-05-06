import { mockUsers } from "@/lib/mock-data";
import { UserTable } from "@/components/UserTable";

export default function UsersPage() {
  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === "active").length,
    verified: mockUsers.filter((u) => u.kycStatus === "verified").length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage platform users and their permissions.</p>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "KYC Verified", value: stats.verified },
          { label: "Admins", value: stats.admins },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </section>

      <UserTable users={mockUsers} />
    </main>
  );
}
