// src/app/dashboard/page.tsx
import React from 'react';

export default function DashboardPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Dashboard Title */}
      <h1>Dashboard</h1>

      {/* Main content container */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        {/* Placeholder for future dashboard content */}
        <p>Dashboard content will go here.</p>
      </div>

      {/* "Crear Meta" button */}
      <div style={{ marginTop: '20px' }}>
        <button 
          style={{
            width: '100%', 
            padding: '15px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Crear Meta
        </button>
      </div>

      {/* Deposit and Withdraw buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          style={{ 
            flex: '1', 
            padding: '10px', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          deposit
        </button>
        <button 
          style={{ 
            flex: '1', 
            padding: '10px', 
            marginLeft: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          withdraw
        </button>
      </div>

      {/* Placeholder for a list or table */}
      <div style={{ borderTop: '1px solid #eee', marginTop: '40px', paddingTop: '20px' }}>
        <p>Your goals will be listed here.</p>
      </div>
    </div>
  );
}