"use client";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useUserGoals } from "@/lib/useGoals"; // si usas Envio/GraphQL; o haz readContract en lote

export default function Dashboard(){
  const { address } = useAccount();
  const { data: goals = [] } = useUserGoals(address); // [{ id, target, deposited, completed, deadline }, ...]

  const nowSec = Math.floor(Date.now()/1000);
  const isFulfilled = (g:any) => g.completed || Number(g.deposited) >= Number(g.target) || nowSec >= Number(g.deadline);

  const activas = goals.filter(g => !isFulfilled(g));
  const archivadas = goals.filter(g => isFulfilled(g));

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tus metas</h1>
        <Link href="/goals/new" className="underline">Crear meta</Link>
      </div>

      <section>
        <h2 className="font-medium mb-2">Activas</h2>
        {activas.length === 0 && <p className="text-sm text-neutral-500">Sin metas activas.</p>}
        <ul className="space-y-2">{activas.map((g:any)=>(
          <li key={g.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">Meta #{g.id}</div>
              <div className="text-sm">Progreso: {Number(g.deposited)/1e2}/{Number(g.target)/1e2} MXN</div>
            </div>
            <Link href={`/goals/${g.id}`} className="text-blue-600 underline">Ver</Link>
          </li>
        ))}</ul>
      </section>

      <section>
        <h2 className="font-medium mb-2">Archivadas</h2>
        <ul className="space-y-2">{archivadas.map((g:any)=>(
          <li key={g.id} className="border rounded p-3 bg-neutral-50">
            <div className="font-medium">Meta #{g.id}</div>
            <div className="text-sm">Objetivo: {Number(g.target)/1e2} MXN – Retirable</div>
          </li>
        ))}</ul>
      </section>
    </main>
  );
}
