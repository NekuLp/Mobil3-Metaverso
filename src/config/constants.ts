import { Environment } from "@getpara/react-sdk";

export const GOAL_VAULT = "0x5A5A593aA1e4c1Df97DbAeBCF899D27581172A50"; // Monad testnet
export const TOKEN_MXN  = process.env.NEXT_PUBLIC_TOKEN_MXN as `0x${string}`; // ERC20 que depositan

export const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY ?? "";
export const ENVIRONMENT =
  (process.env.NEXT_PUBLIC_PARA_ENVIRONMENT as Environment) || Environment.BETA;

if (!API_KEY) {
  throw new Error(
    "API key is not defined. Please set NEXT_PUBLIC_PARA_API_KEY in your environment variables."
  );
}
