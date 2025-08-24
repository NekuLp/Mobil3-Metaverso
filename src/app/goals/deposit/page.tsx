"use client";
import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GOAL_VAULT, TOKEN_MXN } from "@/config/constants";
import { goalVaultAbi, erc20Abi } from "@/config/abi";

export default function InitialDepositPage(){
  const { address } = useAccount();
  const [goalId, setGoalId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const { writeContract: writeApprove, data: approveHash, isPending: approving, error: approveErr } = useWriteContract();
  const { writeContract: writeDeposit, data: depositHash, isPending: depositing, error: depositErr } = useWriteContract();
  const waitingApprove = useWaitForTransactionReceipt({ hash: approveHash }).isLoading;
  const waitingDeposit = useWaitForTransactionReceipt({ hash: depositHash }).isLoading;

  const onApprove = () => {
    const amt = BigInt(Math.round(Number(amount) * 1e2)); // ajusta decimales reales del token
    writeApprove({ abi: erc20Abi, address: TOKEN_MXN, functionName: "approve", args: [GOAL_VAULT, amt] });
  };
  const onDeposit = () => {
    const amt = BigInt(Math.round(Number(amount) * 1e2));
    writeDeposit({ abi: goalVaultAbi, address: GOAL_VAULT, functionName: "deposit", args: [BigInt(goalId), amt] });
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-3">
      <h1 className="text-xl font-semibold">Depósito inicial</h1>
      <input className="w-full border p-2 rounded" placeholder="Goal ID"
        value={goalId} onChange={e=>setGoalId(e.target.value)}/>
      <input type="number" step="0.01" className="w-full border p-2 rounded" placeholder="Monto (MXN)"
        value={amount} onChange={e=>setAmount(e.target.value)}/>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onApprove} disabled={approving||waitingApprove} className="bg-gray-800 text-white rounded p-2">
          {(approving||waitingApprove) ? "Aprobando…" : "Aprobar token"}
        </button>
        <button onClick={onDeposit} disabled={depositing||waitingDeposit} className="bg-black text-white rounded p-2">
          {(depositing||waitingDeposit) ? "Depositando…" : "Depositar (Tx #2)"}
        </button>
      </div>
      {(approveErr||depositErr) && <p className="text-red-600 text-sm">
        {approveErr?.shortMessage || approveErr?.message || depositErr?.shortMessage || depositErr?.message}
      </p>}
      {(depositHash) && <p className="text-sm">Tx hash: {depositHash}</p>}
      <p className="text-xs text-neutral-500">Tip: si ya emites evento <code>GoalCreated(user, goalId,...)</code> en la Tx #2, puedes leer el <i>goalId</i> de los logs y saltarte el input.</p>
    </main>
  );
}
