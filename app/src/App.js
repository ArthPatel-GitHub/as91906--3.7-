// ==========================================
// 1. GLOBAL CORE ENVIRONMENT VARIABLES
// ==========================================
let songsDatabase = []; // Array holding our active database rows

// ==========================================
// 2. LIFECYCLE INITIALIZATION PIPELINE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  fetch('/database.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network pipeline response was not operational');
      }
      return response.json();
    })
    .then(data => {
      songsDatabase = data;
      renderSongCatalogue(songsDatabase);
      runCalendarSelection();
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
    case 1:
      scheduleTextElement.textContent = "Monday Chapel Service: Focus on traditional foundation hymns.";
      break;
    case 2:
      scheduleTextElement.textContent = "Tuesday Assembly: General school announcements performance.";
      break;
    case 4:
      scheduleTextElement.textContent = "Thursday Congregational Practice: Focus on full anthem vocals.";
      break;
    case 5:
      scheduleTextElement.textContent = "Friday House Singing: High-energy school spirit preparation.";
      break;
    default:
      scheduleTextElement.textContent = "Independent Practice Mode: Keep our musical traditions sharp.";
  }
}

// ==========================================
// 4. ITERATION STRUCTURE: UI Render Engine (CLEAN NODE INJECTION)
// ==========================================
function renderSongCatalogue(songsArray) {
  const container = document.getElementById('songs-container');
  if (!container) return;

  container.innerHTML = '';

  if (songsArray.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.className = 'text-muted-fallback'; // Handled cleanly via CSS styling classes
    noResultsMessage.textContent = 'No tracks match search query.';
    container.appendChild(noResultsMessage);
    return;
  }

  songsArray.forEach(song => {
    // Creating elements natively using DOM Nodes instead of messy raw HTML strings
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = song.title;

    const cardHistory = document.createElement('p');
    cardHistory.textContent = song.history;

    const loadButton = document.createElement('button');
    loadButton.className = 'btn';
    loadButton.textContent = 'Load Media Stream';
    loadButton.addEventListener('click', () => handleStreamSong(song.id));

    // Assembly layout sequence tree injection
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
// 6. PIPELINE INTERACTION: Simulate Media Stream (CLEAN MEDIA BOX)
// ==========================================
function handleStreamSong(songId) {
  const playerContainer = document.getElementById('player-container');
  if (!playerContainer) return;

  const activeSong = songsDatabase.find(song => song.id === songId);
  if (!activeSong) return;

  playerContainer.innerHTML = '';
  
  const loadingStatus = document.createElement('div');
  loadingStatus.className = 'status-loading';
  loadingStatus.textContent = '🔄 Initializing asynchronous server pipeline stream...';
  playerContainer.appendChild(loadingStatus);

  setTimeout(() => {
    playerContainer.innerHTML = '';

    const playerBox = document.createElement('div');
    playerBox.className = 'player-box';

    const sourceIndicator = document.createElement('div');
    sourceIndicator.className = 'player-source';
    sourceIndicator.textContent = '📡 LIVE MEDIA RELEASING VIA SECURE DATABASE LINK';

    const trackTitle = document.createElement('h2');
    trackTitle.className = 'track-heading';
    trackTitle.textContent = activeSong.title;

    const lyricsDisplay = document.createElement('div');
    lyricsDisplay.className = 'lyrics-display';
    lyricsDisplay.textContent = activeSong.lyrics;

    const audioWrapper = document.createElement('div');
    audioWrapper.className = 'audio-wrapper';

    const audioLabel = document.createElement('label');
    audioLabel.className = 'audio-label';
    audioLabel.textContent = 'HARDWARE DECODER AUDIO OUTPUT';

    const audioPlayer = document.createElement('audio');
    audioPlayer.controls = true;
    audioPlayer.autoplay = true;
    audioPlayer.src = activeSong.audioUrl;

    audioWrapper.appendChild(audioLabel);
    audioWrapper.appendChild(audioPlayer);

    playerBox.appendChild(sourceIndicator);
    playerBox.appendChild(trackTitle);
    playerBox.appendChild(lyricsDisplay);
    playerBox.appendChild(audioWrapper);

    playerContainer.appendChild(playerBox);
  }, 450);
}

// Helper to keep error strings out of raw HTML layout pipelines
function showFallbackError() {
  const container = document.getElementById('songs-container');
  if (!container) return;
  
  const errorWrapper = document.createElement('div');
  errorWrapper.className = 'error-fallback-box';
  errorWrapper.textContent = 'System Error: Unable to stream song database. Please check your network connection.';
  container.appendChild(errorWrapper);
}