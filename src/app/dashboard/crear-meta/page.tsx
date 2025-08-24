'use client';

import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';

// Import your contract's ABI and address
import GoalABI from '@/abi/Goal.js'; 
const GOAL_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; 


export default function CrearMetaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [plazo, setPlazo] = useState('');
  const [yieldValue, setYieldValue] = useState('');

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ 
    hash,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!writeContract) return;

    // Call your smart contract function to create the goal
    writeContract({
      address: GOAL_CONTRACT_ADDRESS,
      abi: GoalABI,
      functionName: 'createGoal', // Replace with your function name
      args: [titulo, descripcion, cantidad, plazo, yieldValue], // Pass your form data as arguments
    });
  };

  // Check if the transaction is confirmed and then redirect
  React.useEffect(() => {
    if (isTransactionConfirmed) {
      alert('Meta creada con éxito! Ahora agrega liquidez.');
      // Redirect to the "add liquidity" page
      router.push('/dashboard/add-liquidity'); 
    }
  }, [isTransactionConfirmed, router]);


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Crear Meta</h1>
      <form onSubmit={handleSubmit}>
        {/* Your form fields go here, exactly as above */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="cantidad">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="plazo">Plazo / Yield</label>
          <input
            type="text"
            id="plazo"
            value={plazo}
            onChange={(e) => setPlazo(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isPending} // Disable the button while the transaction is pending
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isPending ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isPending ? 'Firmando Transacción...' : 'Confirmar y Firmar Transacción'}
        </button>
      </form>
    </div>
  );
}

// Don't forget to create the new page
// src/app/dashboard/add-liquidity/page.tsx
// that the user will be redirected to.