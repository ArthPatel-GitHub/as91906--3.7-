/* global Notyf */

// ==========================================
// 1. GLOBAL CORE ENVIRONMENT VARIABLES
// ==========================================

let songsDatabase = []; 
let notificationEngine;
let playbackHistoryStack = [];
const songCacheMap = new Map();

let currentAudioElement = null;
let currentActiveSongId = null;
let progressUpdateInterval = null; // High-Performance hardware tracking pointer for timeline sync

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

  currentActiveSongId = songId;

  // Clear tracking operations from any previously running media components
  if (currentAudioElement) {
    currentAudioElement.pause();
    clearInterval(progressUpdateInterval);
    currentAudioElement = null;
  }

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
  // CUSTOM CONTROL DASHBOARD
  // ==========================================
  const controlDashboard = document.createElement('div');
  controlDashboard.style.background = '#0f172a';
  controlDashboard.style.borderRadius = '12px';
  controlDashboard.style.border = '1px solid #334155';
  controlDashboard.style.padding = '20px';
  controlDashboard.style.margin = '20px 0';

  // Layout Grid Block 1: Audio Core Buttons
  const buttonRow = document.createElement('div');
  buttonRow.style.display = 'flex';
  buttonRow.style.gap = '10px';
  buttonRow.style.justifyContent = 'center';
  buttonRow.style.marginBottom = '20px';

  const prevButton = document.createElement('button');
  prevButton.className = 'btn';
  prevButton.innerHTML = '⏮️ Previous';
  if (playbackHistoryStack.length <= 1) {
    prevButton.style.opacity = '0.4';
    prevButton.style.cursor = 'not-allowed';
  } else {
    prevButton.addEventListener('click', handleNavigationBackwards);
  }

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

  const forwardButton = document.createElement('button');
  forwardButton.className = 'btn';
  forwardButton.innerHTML = 'Next ⏭️';
  forwardButton.addEventListener('click', handleNavigationForward);

  // EXCELLENCE CAPABILITY ADDITION: Download Module Link
  const downloadButton = document.createElement('a');
  downloadButton.className = 'btn';
  downloadButton.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // Amber Accent Layout Theme
  downloadButton.style.textDecoration = 'none';
  downloadButton.style.display = 'inline-flex';
  downloadButton.style.alignItems = 'center';
  downloadButton.style.justifyContent = 'center';
  downloadButton.href = activeSong.audioUrl;
  downloadButton.download = `${activeSong.title.replace(/\s+/g, '_')}_Practice_Track.mp3`;
  downloadButton.innerHTML = '📥 Download';
  downloadButton.addEventListener('click', () => {
    if (notificationEngine) notificationEngine.success('Initializing local hardware download container...');
  });

  buttonRow.appendChild(prevButton);
  buttonRow.appendChild(playPauseButton);
  buttonRow.appendChild(forwardButton);
  buttonRow.appendChild(downloadButton);

  // Layout Grid Block 2: PLAYBACK TIMELINE WORKSPACE (Excellence State Controller)
  const timelineContainer = document.createElement('div');
  timelineContainer.style.display = 'flex';
  timelineContainer.style.alignItems = 'center';
  timelineContainer.style.gap = '12px';

  const currentTimeText = document.createElement('span');
  currentTimeText.style.fontSize = '0.8rem';
  currentTimeText.style.color = '#94a3b8';
  currentTimeText.style.fontFamily = 'monospace';
  currentTimeText.textContent = '0:00';

  const timelineSlider = document.createElement('input');
  timelineSlider.type = 'range';
  timelineSlider.min = '0';
  timelineSlider.max = '100';
  timelineSlider.value = '0';
  timelineSlider.style.flex = '1';
  timelineSlider.style.cursor = 'pointer';
  timelineSlider.style.accentColor = 'var(--accent-blue)';

  const totalTimeText = document.createElement('span');
  totalTimeText.style.fontSize = '0.8rem';
  totalTimeText.style.color = '#94a3b8';
  totalTimeText.style.fontFamily = 'monospace';
  totalTimeText.textContent = '0:00';

  // Interactivity Hook: Let the student scrub through the progress bar to alter track placement
  timelineSlider.addEventListener('input', () => {
    if (!currentAudioElement.duration) return;
    const seekTargetTime = (timelineSlider.value / 100) * currentAudioElement.duration;
    currentAudioElement.currentTime = seekTargetTime;
  });

  timelineContainer.appendChild(currentTimeText);
  timelineContainer.appendChild(timelineSlider);
  timelineContainer.appendChild(totalTimeText);

  // Append elements to the primary layout structure
  controlDashboard.appendChild(buttonRow);
  controlDashboard.appendChild(timelineContainer);

  playerBox.appendChild(sourceIndicator);
  playerBox.appendChild(trackTitle);
  playerBox.appendChild(controlDashboard);
  playerBox.appendChild(lyricsDisplay);

  playerContainer.appendChild(playerBox);

  // State Engine Automation: Sync progress ticks accurately using high-performance clock intervals
  progressUpdateInterval = setInterval(() => {
    if (!currentAudioElement || !currentAudioElement.duration) return;
    
    // Math Formula Implementation: Calculate percentage ratio of audio completion boundaries
    const completePercentage = (currentAudioElement.currentTime / currentAudioElement.duration) * 100;
    timelineSlider.value = completePercentage;

    // String manipulation formatting helper rules to parse seconds to minutes:seconds configurations
    const currentMin = Math.floor(currentAudioElement.currentTime / 60);
    const currentSec = Math.floor(currentAudioElement.currentTime % 60).toString().padStart(2, '0');
    currentTimeText.textContent = `${currentMin}:${currentSec}`;

    const totalMin = Math.floor(currentAudioElement.duration / 60);
    const totalSec = Math.floor(currentAudioElement.duration % 60).toString().padStart(2, '0');
    totalTimeText.textContent = `${totalMin}:${totalSec}`;
  }, 250);

  currentAudioElement.addEventListener('ended', () => {
    clearInterval(progressUpdateInterval);
    handleNavigationForward();
  });
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

  playbackHistoryStack.pop(); 
  const targetPreviousSongId = playbackHistoryStack[playbackHistoryStack.length - 1];
  handleStreamSong(targetPreviousSongId, false);
}

function handleNavigationForward() {
  if (songsDatabase.length === 0) return;

  const currentDatabaseIndex = songsDatabase.findIndex(song => song.id === currentActiveSongId);
  let nextDatabaseIndex = currentDatabaseIndex + 1;
  if (nextDatabaseIndex >= songsDatabase.length) {
    nextDatabaseIndex = 0; 
  }

  const nextSongTarget = songsDatabase[nextDatabaseIndex];
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