import React, { useState, useEffect } from 'react';
import { songsData } from './songsData';

function App() {
  // 1. DATA TYPES: Storing Text strings and Objects dynamically in state
  const [searchQuery, setSearchQuery] = useState(""); 
  const [scheduleText, setScheduleText] = useState("");
  const [activeSong, setActiveSong] = useState(null);

  // 2. SELECTION STRUCTURE: Context-Aware Calendar Logic
  useEffect(() => {
    const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    switch(currentDay) {
      case 1: // Monday
      case 4: // Thursday
        setScheduleText("Assembly Prep: Practice the School Hymn!");
        break;
      case 2: // Tuesday
        setScheduleText("Chapel Day: Ensure you know the weekly response.");
        break;
      case 5: // Friday
        setScheduleText("Friday Singing: Get ready to blast Jerusalem!");
        break;
      default:
        setScheduleText("No formal singing scheduled today. Independent practice mode active.");
    }
  }, []);

  // 3. ITERATION STRUCTURE: Filters the array based on user search input
  const filteredSongs = songsData.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 4. INTERFACE RENDERING (JSX Layout Engine)
  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      
      <header style={{ borderBottom: '2px solid #15803d', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ color: '#ef4444', margin: 0, fontSize: '2rem' }}>Rathkeale College Song Portal</h1>
      </header>

      <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #22c55e' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 4px 0', textTransform: 'uppercase' }}>TODAY'S SCHEDULE</h3>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{scheduleText}</p>
      </div>

      <input 
        type="text" 
        placeholder="Search for a hymn or song..." 
        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '24px' }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      <div style={{ display: 'grid', gap: '16px' }}>
        <h2>Available Songs</h2>
        
        {filteredSongs.map(song => (
          <div key={song.id} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <h3 style={{ color: '#22c55e', margin: '0 0 8px 0' }}>{song.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '12px' }}>{song.history}</p>
            <button 
              onClick={() => setActiveSong(song)}
              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              View Lyrics & Practice
            </button>
          </div>
        ))}
      </div>

      {activeSong && (
        <div style={{ marginTop: '32px', backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '2px solid #ef4444' }}>
          <h2 style={{ margin: '0 0 8px 0' }}>Practicing: {activeSong.title}</h2>
          <blockquote style={{ background: '#0f172a', padding: '16px', borderRadius: '4px', fontStyle: 'italic', lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '16px' }}>
            {activeSong.lyrics}
          </blockquote>
          <audio src={activeSong.audioUrl} controls style={{ width: '100%' }} />
        </div>
      )}

    </div>
  );
}

export default App;