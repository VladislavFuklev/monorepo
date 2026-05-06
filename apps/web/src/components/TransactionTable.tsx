import type { Transaction } from "@fintech/types";
import { Badge } from "@fintech/ui";
import type { BadgeProps } from "@fintech/ui";

interface TransactionTableProps {
  transactions: Transaction[];
}

const statusVariant: Record<Transaction["status"], BadgeProps["variant"]> = {
  completed: "success",
  pending: "warning",
  failed: "error",
  reversed: "default",
};

const typeVariant: Record<Transaction["type"], BadgeProps["variant"]> = {
  credit: "success",
  debit: "info",
  transfer: "default",
};

function formatAmount(amount: number, currency: string, type: Transaction["type"]) {
  const sign = type === "credit" ? "+" : type === "debit" ? "-" : "";
  return `${sign}${new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount)}`;
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {["Reference", "Description", "Type", "Amount", "Status", "Date"].map((h) => (
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
          {transactions.map((txn) => (
            <tr key={txn.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{txn.reference}</td>
              <td className="px-4 py-3 text-gray-900">{txn.description}</td>
              <td className="px-4 py-3">
                <Badge variant={typeVariant[txn.type]}>{txn.type}</Badge>
              </td>
              <td className="px-4 py-3 font-medium tabular-nums">
                <span className={txn.type === "credit" ? "text-green-700" : "text-gray-900"}>
                  {formatAmount(txn.amount, txn.currency, txn.type)}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[txn.status]}>{txn.status}</Badge>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(txn.createdAt).toLocaleDateString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
