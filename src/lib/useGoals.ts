"use client";
import { useQuery } from "@tanstack/react-query";

// Tipo de goal para mantener consistencia
type Goal = {
  id: string;
  title: string;
  description: string;
  target: number;
  deposited: number;
  deadline: number;
  archived: boolean;
};

// Función mock que devuelve un par de metas fake
async function fetchMockGoals(address?: string): Promise<Goal[]> {
  if (!address) return [];

  return [
    {
      id: "0",
      title: "Viaje a CDMX",
      description: "Ahorro para ir al hackathon",
      target: 5000,
      deposited: 2500,
      deadline: Math.floor(Date.now() / 1000) + 7 * 86400,
      archived: false,
    },
    {
      id: "1",
      title: "Laptop nueva",
      description: "Meta para comprar una compu",
      target: 20000,
      deposited: 20000,
      deadline: Math.floor(Date.now() / 1000) - 86400, // vencida
      archived: true,
    },
  ];
}

// Hook que usa React Query pero devuelve mock
export function useUserGoals(address?: string) {
  return useQuery({
    queryKey: ["mockGoals", address],
    queryFn: () => fetchMockGoals(address),
    enabled: !!address,
    refetchInterval: 5000,
  });
}