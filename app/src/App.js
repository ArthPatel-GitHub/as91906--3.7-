// ==========================================
// 1. GLOBAL CORE ENVIRONMENT VARIABLES
// ==========================================

/**
 * Global persistent dataset variable.
 * Holds the complete collection of unmutated song objects parsed from database.json.
 * Accessible across all operational search, filter, and stream modules.
 */
let songsDatabase = []; 

// ==========================================
// 2. LIFECYCLE INITIALIZATION PIPELINE
// ==========================================

/**
 * Top-level application bootstrap module.
 * Monitors the browser DOM rendering state and initiates network streaming pipelines
 * once structural nodes are ready for manipulation.
 */
window.addEventListener('DOMContentLoaded', () => {
  // Asynchronously request data records from external storage file
  fetch('/database.json')
    .then(response => {
      // Structural fallback validation: check if operational network path is open
      if (!response.ok) {
        throw new Error('Network pipeline response was not operational');
      }
      return response.json(); // Safely parse the text rows into standard JSON arrays
    })
    .then(data => {
      songsDatabase = data; // Assign parsed array to our globally accessible storage cache
      renderSongCatalogue(songsDatabase); // Generate GUI track listing layout natively
      runCalendarSelection(); // Execute context checking for the schedule component
    })
    .catch(error => {
      // Gracefully catch missing network files or broken syntax arrays without stalling execution
      console.error('Database Fetch Error:', error);
      showFallbackError(); // Inject visual error module alert wrapper container
    });

  // Track user input vectors to handle dynamic keyboard filtration
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchFiltering);
  }
});

// ==========================================
// 3. SELECTION STRUCTURE: Calendar Engine
// ==========================================

/**
 * Runtime conditional selection algorithm.
 * Evaluates host system hardware clock variables using an optimized conditional 
 * switch-case map to update targeted student routines.
 */
function runCalendarSelection() {
  const currentDay = new Date().getDay(); // Pulls system calendar day indices (0 = Sunday, 1 = Monday...)
  const scheduleTextElement = document.getElementById('schedule-text');
  
  if (!scheduleTextElement) return; // Structural protection boundary check

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
      // Executed as a safe boundary condition on non-practice days (Wednesday, Saturday, Sunday)
      scheduleTextElement.textContent = "Independent Practice Mode: Keep our musical traditions sharp.";
  }
}

// ==========================================
// 4. ITERATION STRUCTURE: UI Render Engine (CLEAN NODE INJECTION)
// ==========================================

/**
 * Core dynamic Graphical User Interface (GUI) engine module.
 * Iterates through available data records using programmatic loops to instantiate, 
 * configure, and append physical DOM element tree nodes on the screen.
 * * @param {Array} songsArray - The collection of song datasets targeted for interface construction.
 */
function renderSongCatalogue(songsArray) {
  const container = document.getElementById('songs-container');
  if (!container) return;

  container.innerHTML = ''; // Safely wipe old structural iterations to avoid appending duplication artifacts

  // Boundary condition check: Display clear fallback UX layout if arrays filter to zero rows
  if (songsArray.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.className = 'text-muted-fallback'; 
    noResultsMessage.textContent = 'No tracks match search query.';
    container.appendChild(noResultsMessage);
    return;
  }

  // Iteration Loop: Standardized programmatic walkthrough traversal across the list structure
  songsArray.forEach(song => {
    // Generate native structural containers programmatically using memory blocks instead of dirty string injection
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = song.title;

    const cardHistory = document.createElement('p');
    cardHistory.textContent = song.history;

    const loadButton = document.createElement('button');
    loadButton.className = 'btn';
    loadButton.textContent = 'Load Media Stream';
    
    // Bind click event vectors to load up specific streaming ids dynamically on context demand
    loadButton.addEventListener('click', () => handleStreamSong(song.id));

    // Assembly Layout Sequence: Construct cascading element structures cleanly via the parent tree appender
    cardElement.appendChild(cardTitle);
    cardElement.appendChild(cardHistory);
    cardElement.appendChild(loadButton);
    container.appendChild(cardElement); // Append compiled container safely to active browser viewports
  });
}

// ==========================================
// 5. DATA FILTERING LOGIC
// ==========================================

/**
 * Functional input character match module.
 * Sanitizes typing entries and queries titles/history indexes to execute zero-lag real-time matching.
 * * @param {Event} event - Browser input change action argument containing the character string stream.
 */
function handleSearchFiltering(event) {
  // Extract user text stream, sanitize characters to lowercase, and strip trailing padding spaces
  const searchString = event.target.value.toLowerCase().trim();
  
  // Functional evaluation filtering loop searching across global attributes data rows
  const filteredSongs = songsDatabase.filter(song => {
    return song.title.toLowerCase().includes(searchString) || 
           song.history.toLowerCase().includes(searchString);
  });

  // Push filtered records down to GUI compilation loops to update visible viewport containers
  renderSongCatalogue(filteredSongs);
}

// ==========================================
// 6. PIPELINE INTERACTION: Simulate Media Stream (CLEAN MEDIA BOX)
// ==========================================

/**
 * Dynamic Media Station compilation engine.
 * Receives track identification variables, maps indices, and programmatically instantiates 
 * HTML5 multimedia layout components inside the playback view channel wrapper.
 * * @param {number} songId - Relational identifier unique targeting attribute to locate tracking structures.
 */
function handleStreamSong(songId) {
  const playerContainer = document.getElementById('player-container');
  if (!playerContainer) return;

  // Search local tracking arrays to find the record mapping match configuration matching the ID pointer
  const activeSong = songsDatabase.find(song => song.id === songId);
  if (!activeSong) return;

  playerContainer.innerHTML = ''; // Wipe old media pipelines cleanly
  
  // Create a visual streaming latency indicator block to provide clear execution tracking context
  const loadingStatus = document.createElement('div');
  loadingStatus.className = 'status-loading';
  loadingStatus.textContent = '🔄 Initializing asynchronous server pipeline stream...';
  playerContainer.appendChild(loadingStatus);

  // Simulate an active asynchronous network data pipeline delay using hardware clock thresholds
  setTimeout(() => {
    playerContainer.innerHTML = ''; // Destroy tracking loader block

    // Construct high-end media presentation components programmatically using native DOM creation logic
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
    audioPlayer.controls = true; // Mount browser native scrubbing and master gain hardware sliders
    audioPlayer.autoplay = true; // Auto-fire track decoders down the pipeline channel loop instantly
    audioPlayer.src = activeSong.audioUrl; // Map targeted multimedia directory paths

    // Structural audio channel layout nesting assembly loop execution
    audioWrapper.appendChild(audioLabel);
    audioWrapper.appendChild(audioPlayer);

    playerBox.appendChild(sourceIndicator);
    playerBox.appendChild(trackTitle);
    playerBox.appendChild(lyricsDisplay);
    playerBox.appendChild(audioWrapper);

    playerContainer.appendChild(playerBox); // Safely render final compiled Media Station box to viewport
  }, 450); // Hardcoded delay threshold set to 450 milliseconds to stabilize data pipeline animation cues
}

// ==========================================
// 7. SYSTEM EXCEPTION RECOVERY
// ==========================================

/**
 * Operational exception handler module.
 * Triggered by network pipe breaks to programmatically mount fallback structural blocks 
 * in place of empty records lists.
 */
function showFallbackError() {
  const container = document.getElementById('songs-container');
  if (!container) return;
  
  const errorWrapper = document.createElement('div');
  errorWrapper.className = 'error-fallback-box';
  errorWrapper.textContent = 'System Error: Unable to stream song database. Please check your network connection.';
  container.appendChild(errorWrapper);
}