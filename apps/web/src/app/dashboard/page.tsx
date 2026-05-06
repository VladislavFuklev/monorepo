import { mockUser, mockTransactions } from "@/lib/mock-data";
import { UserCard } from "@/components/UserCard";
import { TransactionTable } from "@/components/TransactionTable";
import { StatCard } from "@/components/StatCard";

function computeStats(txns: typeof mockTransactions) {
  const completed = txns.filter((t) => t.status === "completed");
  const totalIn = completed
    .filter((t) => t.type === "credit")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalOut = completed
    .filter((t) => t.type === "debit")
    .reduce((acc, t) => acc + t.amount, 0);
  const pending = txns.filter((t) => t.status === "pending").length;
  return { totalIn, totalOut, pending };
}

export default function DashboardPage() {
  const { totalIn, totalOut, pending } = computeStats(mockTransactions);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {mockUser.firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">Here's your financial overview for this month.</p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total In" value={fmt(totalIn)} sub="+4.2% vs last month" trend="up" />
        <StatCard label="Total Out" value={fmt(totalOut)} sub="-1.8% vs last month" trend="down" />
        <StatCard label="Net Balance" value={fmt(totalIn - totalOut)} trend="up" />
        <StatCard label="Pending" value={String(pending)} sub="transactions" trend="neutral" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="mb-3 text-base font-semibold text-gray-800">Recent Transactions</h2>
          <TransactionTable transactions={mockTransactions} />
        </div>
        <div>
          <h2 className="mb-3 text-base font-semibold text-gray-800">Account</h2>
          <UserCard user={mockUser} />
        </div>
      </section>
    </main>
  );
}
