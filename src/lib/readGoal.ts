// src/lib/readGoal.ts
import { readContract } from "wagmi/actions";
import { goalAbi } from "@/config/abi";

export async function readUserGoal(client:any, address:`0x${string}`){
  return readContract(client, {
    abi: goalAbi, address: "0x5A5A593aA1e4c1Df97DbAeBCF899D27581172A50",
    functionName: "goals", args: [address],
  });
}
