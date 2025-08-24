// src/app/goals/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient
} from "wagmi";
import { parseUnits } from "viem";
import { goalVaultV2Abi } from "@/config/abi";
import { GOAL_VAULT_V2_ADDRESS, TOKEN_MXN_DECIMALS } from "@/config/contracts";
import { parseGoalIdFromLogs } from "@/lib/parseGoalId";

export default function NewGoalPage() {
  const router = useRouter();
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",     // "1000.50"
    termDays: "",   // "30"
  });
  const [uiError, setUiError] = useState<string | null>(null);

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { data: receipt, isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({ hash });

  function validate(): string | null {
    if (!address) return "Conecta tu wallet para continuar.";
    if (!publicClient) return "Proveedor (wagmi) no inicializado.";
    if (chain?.id !== 10143) return "Conéctate a Monad Testnet (chainId 10143).";
    if (!form.title.trim()) return "Falta el título.";
    if (!form.description.trim()) return "Falta la descripción.";
    const targetNum = Number(form.target);
    if (!Number.isFinite(targetNum) || targetNum <= 0) return "El objetivo debe ser un número > 0.";
    const daysNum = Number(form.termDays);
    if (!Number.isFinite(daysNum) || daysNum <= 0) return "El plazo (días) debe ser un entero > 0.";
    if (!GOAL_VAULT_V2_ADDRESS?.startsWith("0x")) return "Dirección del contrato inválida.";
    const dec = Number(TOKEN_MXN_DECIMALS);
    if (!Number.isInteger(dec) || dec < 0 || dec > 36) return "TOKEN_MXN_DECIMALS inválido.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUiError(null);

    const v = validate();
    if (v) { setUiError(v); return; }

    // Unidades seguras
    let targetWei: bigint;
    try {
      targetWei = parseUnits(form.target, Number(TOKEN_MXN_DECIMALS));
    } catch {
      setUiError("Cantidad inválida (objetivo). Revisa decimales y formato."); 
      return;
    }

    // Deadline (uint64 en ABI)
    const now = Math.floor(Date.now() / 1000);
    const days = Math.floor(Number(form.termDays));
    const deadlineSec = BigInt(now + days * 86400);
    if (deadlineSec <= BigInt(now)) {
      setUiError("El deadline debe ser futuro.");
      return;
    }

    // Simulación previa: atrapa selector incorrecto o args inválidos
    try {
      await publicClient!.simulateContract({
        abi: goalVaultV2Abi,
        address: GOAL_VAULT_V2_ADDRESS as `0x${string}`,
        functionName: "configureGoal",
        args: [form.title, form.description, targetWei, deadlineSec],
        account: address as `0x${string}`,
        chain: chain, // asegura simulación en chain actual
      });
    } catch (simErr: any) {
      const msg = String(simErr?.shortMessage || simErr?.message || "");
      const hint =
        msg.includes("returned no data") || msg.includes("selector")
          ? " (¿ABI/firma/despliegue correcto? deadline debe ser uint64; address del contrato V2 correcto; red 10143)"
          : "";
      setUiError(`Simulación falló: ${msg}${hint}`);
      return;
    }

    // Enviar tx
    writeContract({
      abi: goalVaultV2Abi,
      address: GOAL_VAULT_V2_ADDRESS as `0x${string}`,
      functionName: "configureGoal",
      args: [form.title, form.description, targetWei, deadlineSec],
    });
  }

  // redirección cuando minó: parseamos goalId del log
  useEffect(() => {
    if (!receipt) return;
    const goalId = parseGoalIdFromLogs((receipt as any).logs || []);
    if (goalId != null) {
      router.replace(`/goals/${goalId.toString()}/deposit`);
    }
  }, [receipt, router]);

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Crear meta</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder={`Objetivo (decimales ${TOKEN_MXN_DECIMALS})`}
          type="number" min="0" step="0.01"
          value={form.target}
          onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Plazo (días)"
          type="number" min="1"
          value={form.termDays}
          onChange={(e) => setForm((p) => ({ ...p, termDays: e.target.value }))}
        />

        <button disabled={isPending || waiting} className="w-full bg-black text-white rounded p-2">
          {isPending || waiting ? "Firmando…" : "Firmar configuración (Tx #1)"}
        </button>
      </form>

      {uiError && <p className="text-red-600 text-sm">{uiError}</p>}
      {error && <p className="text-red-600 text-sm">{String((error as any)?.shortMessage || (error as any)?.message)}</p>}
      {isSuccess && <p className="text-emerald-700 text-sm">Meta configurada. Redirigiendo…</p>}
    </main>
  );
}
