import React, { useState } from 'react';
import { songsData } from './songsData';

function App() {
  // DATA TYPES USED: Strings, Booleans, and Numbers in React State
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isPlaying, setIsPlaying] = useState(false);  
  const [currentTime, setCurrentTime] = useState(0);  

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      
      {/* 1. FRONTEND GUI: HEADER & BRANDING */}
      <header style={{ borderBottom: '2px solid #15803d', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ color: '#ef4444', margin: 0, fontSize: '2rem' }}>Rathkeale College Song Portal</h1>
      </header>

      {/* 2. MIDDLE-END LOGIC: CONTEXT-AWARE SCHEDULE WIDGET */}
      <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #22c55e' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 4px 0', textTransform: 'uppercase' }}>TODAY'S EVENT</h3>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Dynamic Schedule Loading...</p>
      </div>

      {/* 3. INPUT: SEARCH BAR */}
      <input 
        type="text" 
        placeholder="Search for a hymn..." 
        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '24px' }}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      {/* 4. OUTPUT: SONG LIST ITERATION */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Available Songs</h2>
        <p style={{ color: '#94a3b8' }}>Song items will iterate here next.</p>
      </div>

    </div>
  );
}

export default App;