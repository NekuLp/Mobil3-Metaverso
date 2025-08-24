// src/app/goals/[id]/deposit/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useInitialDeposit } from "@/lib/useInitialDeposit";

export default function DepositPage() {
  const { id } = useParams<{ id: string }>();
  const goalId = BigInt(id);
  const router = useRouter();
  const [amount, setAmount] = useState("0");
  const { approve, deposit, approveWait, depositWait } = useInitialDeposit(goalId);

  const loading = approveWait.isLoading || depositWait.isLoading;

  return (
    <main className="max-w-md mx-auto p-4 space-y-3">
      <h1 className="text-xl font-semibold">Depósito inicial</h1>
      <input
        className="w-full border p-2 rounded"
        placeholder="Monto (MXN)"
        type="number" step="0.01" min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => approve(Number(amount))}
          disabled={loading}
          className="bg-gray-800 text-white rounded p-2"
        >
          {approveWait.isLoading ? "Aprobando…" : "Aprobar token"}
        </button>
        <button
          onClick={() => deposit(Number(amount))}
          disabled={loading}
          className="bg-black text-white rounded p-2"
        >
          {depositWait.isLoading ? "Depositando…" : "Depositar (Tx #2)"}
        </button>
      </div>

      {(approveWait.data || depositWait.data) && (
        <div className="text-xs text-neutral-600 space-y-1">
          {approveWait.data && <div>Approve tx: {(approveWait.data as any).transactionHash}</div>}
          {depositWait.data && <div>Deposit tx: {(depositWait.data as any).transactionHash}</div>}
        </div>
      )}

      {depositWait.isSuccess && (
        <button
          className="mt-4 underline text-blue-700"
          onClick={() => router.replace(`/goals/${id}`)}
        >
          Ir a la meta
        </button>
      )}
    </main>
  );
}
