/* global Notyf */

// ==========================================
// 1. GLOBAL CORE ENVIRONMENT VARIABLES
// ==========================================

let songsDatabase = []; 
let notificationEngine;
let playbackHistoryStack = [];
const songCacheMap = new Map();

/**
 * Global State Engine Trackers
 * Tracks active media streams and hardware execution play states natively.
 */
let currentAudioElement = null;
let currentActiveSongId = null;

// ==========================================
// 2. LIFECYCLE INITIALIZATION PIPELINE
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  if (typeof Notyf !== 'undefined') {
    notificationEngine = new Notyf({
      duration: 2500,
      position: { x: 'right', y: 'top' },
      ripple: false
    });
  }

  fetch('/database.json')
    .then(response => {
      if (!response.ok) throw new Error('Network pipeline response was not operational');
      return response.json();
    })
    .then(data => {
      songsDatabase = data;
      songsDatabase.forEach(song => songCacheMap.set(song.id, song));
      renderSongCatalogue(songsDatabase);
      runCalendarSelection();
      
      if (notificationEngine) {
        notificationEngine.success('Song database compiled instantly.');
      }
    })
    .catch(error => {
      console.error('Database Fetch Error:', error);
      showFallbackError();
    });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchFiltering);
  }
});

// ==========================================
// 3. SELECTION STRUCTURE: Calendar Engine
// ==========================================
function runCalendarSelection() {
  const currentDay = new Date().getDay(); 
  const scheduleTextElement = document.getElementById('schedule-text');
  if (!scheduleTextElement) return;

  switch (currentDay) {
    case 1: scheduleTextElement.textContent = "Monday Chapel Service: Focus on traditional foundation hymns."; break;
    case 2: scheduleTextElement.textContent = "Tuesday Assembly: General school announcements performance."; break;
    case 4: scheduleTextElement.textContent = "Thursday Congregational Practice: Focus on full anthem vocals."; break;
    case 5: scheduleTextElement.textContent = "Friday House Singing: High-energy school spirit preparation."; break;
    default: scheduleTextElement.textContent = "Independent Practice Mode: Keep our musical traditions sharp.";
  }
}

// ==========================================
// 4. ITERATION STRUCTURE: UI Render Engine
// ==========================================
function renderSongCatalogue(songsArray) {
  const container = document.getElementById('songs-container');
  if (!container) return;

  container.innerHTML = '';

  if (songsArray.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.className = 'text-muted-fallback'; 
    noResultsMessage.textContent = 'No tracks match search query.';
    container.appendChild(noResultsMessage);
    return;
  }

  songsArray.forEach(song => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = song.title;

    const cardHistory = document.createElement('p');
    cardHistory.textContent = song.history;

    const loadButton = document.createElement('button');
    loadButton.className = 'btn';
    loadButton.textContent = '⚙️ Load Track';
    loadButton.addEventListener('click', () => handleStreamSong(song.id, true));

    cardElement.appendChild(cardTitle);
    cardElement.appendChild(cardHistory);
    cardElement.appendChild(loadButton);
    container.appendChild(cardElement);
  });
}

// ==========================================
// 5. DATA FILTERING LOGIC
// ==========================================
function handleSearchFiltering(event) {
  const searchString = event.target.value.toLowerCase().trim();
  
  const filteredSongs = songsDatabase.filter(song => {
    return song.title.toLowerCase().includes(searchString) || 
           song.history.toLowerCase().includes(searchString);
  });

  renderSongCatalogue(filteredSongs);
}

// ==========================================
// 6. PIPELINE INTERACTION: High-Speed Stream Engine
// ==========================================
function handleStreamSong(songId, shouldPushToHistory = true) {
  const playerContainer = document.getElementById('player-container');
  if (!playerContainer) return;

  const activeSong = songCacheMap.get(songId);
  if (!activeSong) return;

  // Track State Synchronization
  currentActiveSongId = songId;

  // Safeguard: Stop any existing running audio instance before mounting a new player stream
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }

  // Push Operation: Record traversal trace array boundaries
  if (shouldPushToHistory) {
    const topOfStack = playbackHistoryStack[playbackHistoryStack.length - 1];
    if (topOfStack !== songId) {
      playbackHistoryStack.push(songId); 
    }
  }

  playerContainer.innerHTML = '';

  if (notificationEngine) {
    notificationEngine.success(`Streaming: ${activeSong.title}`);
  }

  // Instantiate Hidden Audio Core Node Engine
  currentAudioElement = new Audio(activeSong.audioUrl);
  currentAudioElement.autoplay = true;

  const playerBox = document.createElement('div');
  playerBox.className = 'player-box';

  const sourceIndicator = document.createElement('div');
  sourceIndicator.className = 'player-source';
  sourceIndicator.textContent = '📡 CUSTOM MULTIMEDIA STATION ACTIVATED';

  const trackTitle = document.createElement('h2');
  trackTitle.className = 'track-heading';
  trackTitle.textContent = activeSong.title;

  const lyricsDisplay = document.createElement('div');
  lyricsDisplay.className = 'lyrics-display';
  lyricsDisplay.textContent = activeSong.lyrics;

  // ==========================================
  // EXCELLENCE FEATURE: CUSTOM CONTROL DASHBOARD BUILD
  // ==========================================
  const controlDashboard = document.createElement('div');
  controlDashboard.style.display = 'flex';
  controlDashboard.style.gap = '10px';
  controlDashboard.style.justifyContent = 'center';
  controlDashboard.style.margin = '20px 0';
  controlDashboard.style.padding = '15px';
  controlDashboard.style.background = '#0f172a';
  controlDashboard.style.borderRadius = '12px';
  controlDashboard.style.border = '1px solid #334155';

  // 1. BUTTON: Previous Song (LIFO Stack Traversal)
  const prevButton = document.createElement('button');
  prevButton.className = 'btn';
  prevButton.innerHTML = '⏮️ Previous';
  // Disable visually if there's nowhere to go back to in our history array stack
  if (playbackHistoryStack.length <= 1) {
    prevButton.style.opacity = '0.4';
    prevButton.style.cursor = 'not-allowed';
  } else {
    prevButton.addEventListener('click', handleNavigationBackwards);
  }

  // 2. BUTTON: Play / Pause Toggle Engine
  const playPauseButton = document.createElement('button');
  playPauseButton.className = 'btn';
  playPauseButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  playPauseButton.innerHTML = '⏸️ Pause';
  
  playPauseButton.addEventListener('click', () => {
    if (currentAudioElement.paused) {
      currentAudioElement.play();
      playPauseButton.innerHTML = '⏸️ Pause';
      playPauseButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else {
      currentAudioElement.pause();
      playPauseButton.innerHTML = '▶️ Play';
      playPauseButton.style.background = 'linear-gradient(135deg, var(--accent-blue) 0%, #4f46e5 100%)';
    }
  });

  // 3. BUTTON: Skip Forward (Linear Database Incrementor)
  const forwardButton = document.createElement('button');
  forwardButton.className = 'btn';
  forwardButton.innerHTML = 'Next ⏭️';
  forwardButton.addEventListener('click', handleNavigationForward);

  // Append control elements cleanly to dashboard viewport
  controlDashboard.appendChild(prevButton);
  controlDashboard.appendChild(playPauseButton);
  controlDashboard.appendChild(forwardButton);

  // Assemble full interface cards
  playerBox.appendChild(sourceIndicator);
  playerBox.appendChild(trackTitle);
  playerBox.appendChild(controlDashboard);
  playerBox.appendChild(lyricsDisplay);

  playerContainer.appendChild(playerBox);

  // Automation Link: When a hymn ends completely, auto-skip forward to the next index row item automatically!
  currentAudioElement.addEventListener('ended', handleNavigationForward);
}

// ==========================================
// 7. COMPLEX DATA STRUCTURE POINTER LOGIC
// ==========================================

function handleNavigationBackwards() {
  if (playbackHistoryStack.length <= 1) {
    if (notificationEngine) {
      notificationEngine.error('No further history tracked.');
    }
    return; 
  }

  // Pop out the current active node context track item layer completely
  playbackHistoryStack.pop(); 
  const targetPreviousSongId = playbackHistoryStack[playbackHistoryStack.length - 1];

  // Reload the media streams backwards without adding duplicates onto the history track stack
  handleStreamSong(targetPreviousSongId, false);
}

/**
 * Excellence Sequence Controller: Forward Index Nav Engine
 * Evaluates current array offsets, handles edge boundary rollover exceptions,
 * and increments pointers to compute adjacent song tracks instantly.
 */
function handleNavigationForward() {
  if (songsDatabase.length === 0) return;

  // Locate our index pointer rank location inside the database array structure
  const currentDatabaseIndex = songsDatabase.findIndex(song => song.id === currentActiveSongId);

  // Boundary Condition Check: If we are on the very last song row, loop back around to index 0 smoothly
  let nextDatabaseIndex = currentDatabaseIndex + 1;
  if (nextDatabaseIndex >= songsDatabase.length) {
    nextDatabaseIndex = 0; 
  }

  const nextSongTarget = songsDatabase[nextDatabaseIndex];
  
  // Fire execution pipeline
  handleStreamSong(nextSongTarget.id, true);
}

// ==========================================
// 8. SYSTEM EXCEPTION RECOVERY
// ==========================================
function showFallbackError() {
  const container = document.getElementById('songs-container');
  if (!container) return;
  
  const errorWrapper = document.createElement('div');
  errorWrapper.className = 'error-fallback-box';
  errorWrapper.textContent = 'System Error: Unable to stream song database.';
  container.appendChild(errorWrapper);
}