// src/lib/parseGoalId.ts
import { decodeEventLog, Hex } from "viem";
import { goalVaultV2Abi } from "@/config/abi";

export function parseGoalIdFromLogs(logs: Array<{ topics: Hex[]; data: Hex }>): bigint | null {
  for (const log of logs) {
    try {
      const ev = decodeEventLog({
        abi: goalVaultV2Abi,
        data: log.data,
        topics: log.topics as Hex[],
      });
      if (ev.eventName === "GoalConfigured") {
        // args: user (indexed), goalId (indexed), target, deadline
        return ev.args?.goalId as bigint;
      }
    } catch {
      // skip non-matching logs
    }
  }
  return null;
}
