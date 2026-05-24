// ==========================================
// 1. GLOBAL ENVIRONMENT VARIABLES
// ==========================================
let songsData = []; // Array holding our database records

// DOM Target Selectors
const searchInput = document.getElementById('search-input');
const songsContainer = document.getElementById('songs-container');
const playerContainer = document.getElementById('player-container');
const scheduleText = document.getElementById('schedule-text');

// ==========================================
// 2. MIDDLE-END PIPELINE: Fetching From Backend Database
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  fetch('/database.json')
    .then(response => response.json())
    .then(data => {
      songsData = data;
      renderCatalogue(songsData); // Run iteration loop
    })
    .catch(error => console.error("Database connection failure:", error));

  runCalendarSelection();
});

// ==========================================
// 3. SELECTION STRUCTURE: Calendar Engine
// ==========================================
function runCalendarSelection() {
  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  let text = "";

  switch(currentDay) {
    case 1:
    case 4:
      text = "Assembly Prep: Practice the traditional Foundation Hymn.";
      break;
    case 2:
      text = "Chapel Day: Stand tall and practice your vocal responses.";
      break;
    case 5:
      text = "Friday House Singing: Get ready to blast anthems with maximum pride!";
      break;
    default:
      text = "Independent Practice Mode: Keep our musical traditions sharp.";
  }
  scheduleText.innerText = text;
}

// ==========================================
// 4. ITERATION STRUCTURE: Rendering Song Catalogue Grid
// ==========================================
function renderCatalogue(songs) {
  songsContainer.innerHTML = ""; // Clear existing listing

  songs.forEach(song => {
    // Dynamically builds components into the DOM interface shell
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3 style="color: #16a34a; margin: 0 0 8px 0;">${song.title}</h3>
      <p style="font-size: 0.9rem; color: #94a3b8; margin: 0 0 12px 0;">${song.history}</p>
      <button class="btn" onclick="handleStreamSong(${song.id})">Fetch From Server</button>
    `;
    songsContainer.appendChild(card);
  });

  if (songs.length === 0) {
    songsContainer.innerHTML = `<p style="color: #64748b; font-style: italic;">No tracks match search query.</p>`;
  }
}

// ==========================================
// 5. INPUT EVENT HANDLING: Search Filter Filter Loop
// ==========================================
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = songsData.filter(song => song.title.toLowerCase().includes(query));
  renderCatalogue(filtered); // Reruns iteration dynamically
});

// ==========================================
// 6. PIPELINE INTERACTION: Simulate Server Media Stream
// ==========================================
window.handleStreamSong = function(songId) {
  playerContainer.innerHTML = `
    <div style="background-color: #1c2541; padding: 40px; border-radius: 12px; border: 2px dashed #3a506b; text-align: center;">
      <p style="color: #3b82f6; font-weight: 600; margin: 0;">📡 Querying Backend Database Pipeline... Buffering audio stream...</p>
    </div>
  `;

  // Emulates server stream pipeline response timing
  setTimeout(() => {
    const selectedSong = songsData.find(s => s.id === songId);
    
    playerContainer.innerHTML = `
      <div class="player-box">
        <h3 style="margin: 0 0 4px 0; font-size: 1.4rem;">${selectedSong.title}</h3>
        <p style="font-size: 0.85rem; color: #16a34a; margin: 0 0 20px 0; font-weight: 600;">CONNECTED // SOURCE: EXTERNAL_AUDIO_DB</p>
        
        <div class="lyrics-display">
          <p style="margin: 0;">${selectedSong.lyrics}</p>
        </div>

        <label id="time-monitor" style="display: block; color: #94a3b8; font-size: 0.85rem; margin-bottom: 8px; font-weight: 600;">
          AUDIO MONITOR (TIME TRACKER WORKING)
        </label>
        <audio src="${selectedSong.audioUrl}" controls style="width: 100%;" id="audio-widget"></audio>
      </div>
    `;

    // Attaches tracking to hardware audio playhead changes
    const audioWidget = document.getElementById('audio-widget');
    const timeMonitor = document.getElementById('time-monitor');
    audioWidget.addEventListener('timeupdate', () => {
      timeMonitor.innerText = `AUDIO MONITOR (TIME SLIDER POSITION: ${Math.floor(audioWidget.currentTime)}s)`;
    });

  }, 600);
};