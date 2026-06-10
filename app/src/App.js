/* global Notyf */

// ==========================================
// 1. GLOBAL CORE ENVIRONMENT VARIABLES
// ==========================================

/**
 * Global persistent dataset variable.
 * Holds the unmutated song objects parsed from database.json.
 */
let songsDatabase = []; 

/**
 * Third-Party Library Module Instance.
 * Declares a global pointer to house our initialized non-core notification pipeline handler.
 */
let notificationEngine;

/**
 * Complex Data Structure: Linear Execution Stack (LIFO - Last In, First Out)
 * Maintains a runtime trace array of historically loaded song identifiers.
 * This structure isolates playback data boundaries to allow step-back traversal.
 */
let playbackHistoryStack = [];

// ==========================================
// 2. LIFECYCLE INITIALIZATION PIPELINE
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  // Initialize the third-party alert container with custom UI presentation tokens
  if (typeof Notyf !== 'undefined') {
    notificationEngine = new Notyf({
      duration: 3500,
      position: { x: 'right', y: 'top' },
      ripple: true
    });
  }

  fetch('/database.json')
    .then(response => {
      if (!response.ok) throw new Error('Network pipeline response was not operational');
      return response.json();
    })
    .then(data => {
      songsDatabase = data;
      renderSongCatalogue(songsDatabase);
      runCalendarSelection();
      
      // Behavior: Use non-core library to broadcast a successful initialization alert
      if (notificationEngine) {
        notificationEngine.success('Song database loaded successfully!');
      }
    })
    .catch(error => {
      console.error('Database Fetch Error:', error);
      showFallbackError();
      
      // Behavior: Intercept pipeline crashes using automated third-party error cards
      if (notificationEngine) {
        notificationEngine.error('Critical Error: Failed to fetch song rows.');
      }
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
    loadButton.textContent = 'Load Media Stream';
    
    // Pass 'true' parameter to explicitly state this selection should push onto the stack tracking array
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
  // Scope definitions inside your interaction structures
  const searchString = event.target.value.toLowerCase().trim();
  
  const filteredSongs = songsDatabase.filter(song => {
    return song.title.toLowerCase().includes(searchString) || 
           song.history.toLowerCase().includes(searchString);
  });

  // Behavior: If filter results drop down to 0, push an amber/error alert box to the user via Notyf
  if (filteredSongs.length === 0 && notificationEngine) {
    notificationEngine.error('No matching tracks found in catalogue.');
  }

  renderSongCatalogue(filteredSongs);
}

// ==========================================
// 6. PIPELINE INTERACTION: Multimedia Stream Engine
// ==========================================

/**
 * Dynamic Media Station compilation engine.
 * Maps indices, instantiates players, and handles custom stack trace histories.
 * @param {number} songId - Relational identifier unique targeting attribute to locate tracking structures.
 * @param {boolean} shouldPushToHistory - Conditional flag stating whether to append the active ID to the stack.
 */
function handleStreamSong(songId, shouldPushToHistory = true) {
  const playerContainer = document.getElementById('player-container');
  if (!playerContainer) return;

  const activeSong = songsDatabase.find(song => song.id === songId);
  if (!activeSong) return;

  // Complex Data Structure Push Operation: Append current song layout state to historical data records boundary
  // Only push if the item was loaded fresh from the catalog, not when popping backwards via the back toggle
  if (shouldPushToHistory) {
    // Structural Guard: Ensure we don't duplicate the same song consecutively on the stack frame pointers
    const topOfStack = playbackHistoryStack[playbackHistoryStack.length - 1];
    if (topOfStack !== songId) {
      playbackHistoryStack.push(songId); 
    }
  }

  playerContainer.innerHTML = '';
  
  const loadingStatus = document.createElement('div');
  loadingStatus.className = 'status-loading';
  loadingStatus.textContent = '🔄 Initializing asynchronous server pipeline stream...';
  playerContainer.appendChild(loadingStatus);

  // Behavior: Broadcast an information feedback toast when a student begins loading a track stream
  if (notificationEngine) {
    notificationEngine.success(`Connecting stream for: ${activeSong.title}`);
  }

  setTimeout(() => {
    playerContainer.innerHTML = '';

    const playerBox = document.createElement('div');
    playerBox.className = 'player-box';

    const sourceIndicator = document.createElement('div');
    sourceIndicator.className = 'player-source';
    sourceIndicator.textContent = '📡 LIVE MEDIA RELEASING VIA SECURE DATABASE LINK';

    // Complex Data Structure UI Controller Integration: Construct custom back navigation actions
    // Only display this element if the stack data allocation block contains more than 1 past trace record
    if (playbackHistoryStack.length > 1) {
      const backButton = document.createElement('button');
      backButton.className = 'btn';
      backButton.style.marginBottom = '15px';
      backButton.style.padding = '8px 16px';
      backButton.style.fontSize = '0.85rem';
      backButton.style.background = 'linear-gradient(135deg, var(--accent-blue) 0%, #4f46e5 100%)';
      backButton.textContent = '🔙 Go Back to Previous Song';
      
      // Bind click trigger directly to our standalone stack evaluation router
      backButton.addEventListener('click', handleNavigationBackwards);
      playerBox.appendChild(backButton);
    }

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

// ==========================================
// 7. COMPLEX DATA STRUCTURE POINTER LOGIC
// ==========================================

/**
 * Stack Pop Functional Controller Module.
 * Triggered exclusively by user back-navigation interface nodes.
 * Pops the current track record frame completely out of structural memory boundaries
 * to expose and re-initialize the preceding data row block.
 */
function handleNavigationBackwards() {
  // Boundary Condition Safety Check: Validate if structural stack limits contain items to pop backward to
  if (playbackHistoryStack.length <= 1) {
    if (notificationEngine) {
      notificationEngine.error('Stack Underflow Boundary: No further history tracked.');
    }
    return; 
  }

  // Complex Data Structure Pop Operation: Remove current active song record array tracking index from memory top layer
  playbackHistoryStack.pop(); 

  // Read the new top element vector left on top of the trace array stack tree workspace
  const targetPreviousSongId = playbackHistoryStack[playbackHistoryStack.length - 1];

  // Reload the media streams programmatically using the target index reference pointer
  handleStreamSong(targetPreviousSongId, false);
}

// ==========================================
// 8. SYSTEM EXCEPTION RECOVERY
// ==========================================
function showFallbackError() {
  const container = document.getElementById('songs-container');
  if (!container) return;
  
  const errorWrapper = document.createElement('div');
  errorWrapper.className = 'error-fallback-box';
  errorWrapper.textContent = 'System Error: Unable to stream song database. Please check your network connection.';
  container.appendChild(errorWrapper);
}