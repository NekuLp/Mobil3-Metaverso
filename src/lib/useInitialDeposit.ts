// src/lib/useInitialDeposit.ts
"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi, goalVaultV2Abi } from "@/config/abi";
import { TOKEN_MXN_ADDRESS, GOAL_VAULT_V2_ADDRESS, TOKEN_MXN_DECIMALS } from "@/config/contracts";

export function useInitialDeposit(goalId?: bigint) {
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { writeContract: writeDeposit, data: depositHash } = useWriteContract();

  function toUnits(amountHuman: number) {
    return BigInt(Math.round(amountHuman * 10 ** TOKEN_MXN_DECIMALS));
  }

  function approve(amountHuman: number) {
    const amt = toUnits(amountHuman);
    writeApprove({
      abi: erc20Abi,
      address: TOKEN_MXN_ADDRESS as `0x${string}`,
      functionName: "approve",
      args: [GOAL_VAULT_V2_ADDRESS, amt],
    });
  }

  function deposit(amountHuman: number) {
    if (goalId == null) return;
    const amt = toUnits(amountHuman);
    writeDeposit({
      abi: goalVaultV2Abi,
      address: GOAL_VAULT_V2_ADDRESS as `0x${string}`,
      functionName: "deposit",
      args: [goalId, amt],
    });
  }

  const approveWait = useWaitForTransactionReceipt({ hash: approveHash });
  const depositWait = useWaitForTransactionReceipt({ hash: depositHash });

  return { approve, deposit, approveWait, depositWait };
}
