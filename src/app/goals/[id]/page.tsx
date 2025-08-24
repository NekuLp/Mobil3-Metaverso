// src/app/goals/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { goalVaultV2Abi } from "@/config/abi";
import { GOAL_VAULT_V2_ADDRESS, TOKEN_MXN_DECIMALS } from "@/config/contracts";
import { useWithdraw } from "@/lib/useWithdraw";

function fmt(amount: bigint) {
  return Number(amount) / 10 ** TOKEN_MXN_DECIMALS;
}

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const goalId = BigInt(id);

  const { data: goal } = useReadContract({
    abi: goalVaultV2Abi,
    address: GOAL_VAULT_V2_ADDRESS as `0x${string}`,
    functionName: "goals",
    args: [goalId],
  }) as { data: any };

  const { data: can } = useReadContract({
    abi: goalVaultV2Abi,
    address: GOAL_VAULT_V2_ADDRESS as `0x${string}`,
    functionName: "canWithdraw",
    args: [goalId],
  }) as { data: boolean };

  const { withdraw, isPending, wait } = useWithdraw(goalId);

  if (!goal) return <main className="p-4">Cargando…</main>;

  const [owner, title, description, target, deadline, deposited, archived] = goal;

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-neutral-600">{description}</p>
      <div className="border rounded p-3 bg-white">
        <div>Objetivo: <b>{fmt(target)}</b> MXN</div>
        <div>Depositado: <b>{fmt(deposited)}</b> MXN</div>
        <div>Deadline: <b>{new Date(Number(deadline) * 1000).toLocaleString()}</b></div>
        <div>Archivada: <b>{archived ? "Sí" : "No"}</b></div>
      </div>

      <button
        onClick={withdraw}
        disabled={!can || isPending || wait.isLoading}
        className={`w-full rounded p-2 text-white ${can ? "bg-emerald-600" : "bg-gray-400 cursor-not-allowed"}`}
      >
        {wait.isLoading || isPending ? "Retirando…" : "Retirar"}
      </button>

      {wait.data && (
        <p className="text-xs text-neutral-600 break-all">
          Tx: {(wait.data as any).transactionHash}
        </p>
      )}
      {!can && <p className="text-xs text-neutral-500">Aún no puedes retirar: falta alcanzar el objetivo o llegar al plazo.</p>}
    </main>
  );
}
