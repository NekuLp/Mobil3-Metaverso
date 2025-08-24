// src/lib/useWithdraw.ts
"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { goalVaultV2Abi } from "@/config/abi";
import { GOAL_VAULT_V2_ADDRESS } from "@/config/contracts";

export function useWithdraw(goalId: bigint) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const wait = useWaitForTransactionReceipt({ hash });

  function withdraw() {
    writeContract({
      abi: goalVaultV2Abi,
      address: GOAL_VAULT_V2_ADDRESS as `0x${string}`,
      functionName: "withdraw",
      args: [goalId],
    });
  }

  return { withdraw, isPending, error, wait };
}
