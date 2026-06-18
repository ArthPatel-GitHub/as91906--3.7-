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
let progressUpdateInterval = null;

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
      // High Performance Mapping: Cache indices on boot-up for instant lookups
      songsDatabase.forEach(song => songCacheMap.set(song.id, song));
      
      renderSongCatalogue(songsDatabase);
      runCalendarSelection();
      
      if (notificationEngine) {
        notificationEngine.success('Song database compiled instantly.');
      }
    })
    .catch(error => {
      console.error('Critical System Exception Captured:', error);
      showFallbackError();
      if (notificationEngine) {
        notificationEngine.error('Critical Error: Failed to fetch data streams.');
      }
    });

  // HIGH-SPEED PERFORMANCE OPTIMIZATION: INPUT DEBOUNCING GATING
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let debounceTimeoutPointer;
    searchInput.addEventListener('input', (event) => {
      clearTimeout(debounceTimeoutPointer);
      debounceTimeoutPointer = setTimeout(() => {
        handleSearchFiltering(event);
      }, 250); // Suppresses layout thrashing by gating execution to 250ms quiet intervals
    });
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

    const cardP = document.createElement('p');
    cardP.textContent = song.history;

    const loadButton = document.createElement('button');
    loadButton.className = 'btn';
    loadButton.textContent = '⚙️ Load Track';
    loadButton.addEventListener('click', () => handleStreamSong(song.id, true));

    cardElement.appendChild(cardTitle);
    cardElement.appendChild(cardP);
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

  if (filteredSongs.length === 0 && notificationEngine) {
    notificationEngine.error('No matching tracks found.');
  }

  renderSongCatalogue(filteredSongs);
}

// ==========================================
// 6. PIPELINE INTERACTION: High-Speed Stream Engine
// ==========================================
function handleStreamSong(songId, shouldPushToHistory = true) {
  const playerContainer = document.getElementById('player-container');
  if (!playerContainer) return;

  // Instant lookups utilizing Map data structure instead of looping arrays
  const activeSong = songCacheMap.get(songId);
  if (!activeSong) return;

  currentActiveSongId = songId;

  // Memory Safety: Purge active thread tracking loops before instantiating new allocations
  safelyPurgeActiveIntervals();
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }

  // Complex LIFO Stack Record Traversal tracking boundaries
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

  
// ==========================================
  // MULTI-MODE LYRICS LEARNING MODULE
  // ==========================================
  const lyricsModuleContainer = document.createElement('div');
  lyricsModuleContainer.className = 'lyrics-module-container';

  const lyricsTabRow = document.createElement('div');
  lyricsTabRow.className = 'lyrics-tab-row';

  const lyricsContentArea = document.createElement('div');
  lyricsContentArea.className = 'lyrics-content-area';

  // Parse lyrics into a clean array of lines (ignoring empty blank lines)
  const songLines = activeSong.lyrics.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // State Tracking
  const modes = ['Full Lyrics', 'Line-by-Line', 'Flashcards'];
  let currentMode = 'Full Lyrics';
  let currentLineIndex = 0;
  let isCardFlipped = false;

  // Build Tabs
  modes.forEach(mode => {
    const tabButton = document.createElement('button');
    tabButton.className = `lyrics-tab ${mode === currentMode ? 'active' : ''}`;
    tabButton.textContent = mode;
    tabButton.addEventListener('click', () => {
      // Update active styling
      Array.from(lyricsTabRow.children).forEach(btn => btn.classList.remove('active'));
      tabButton.classList.add('active');
      
      // Update state and re-render
      currentMode = mode;
      isCardFlipped = false; // Reset flip state when changing tabs
      renderLyricsInterface();
    });
    lyricsTabRow.appendChild(tabButton);
  });

  // Render Engine for the Lyrics Interface
  function renderLyricsInterface() {
    lyricsContentArea.innerHTML = '';

    if (currentMode === 'Full Lyrics') {
      const fullDisplay = document.createElement('div');
      fullDisplay.className = 'lyrics-display';
      fullDisplay.style.marginTop = '0'; 
      fullDisplay.style.border = 'none';
      fullDisplay.style.boxShadow = 'none';
      fullDisplay.style.background = 'transparent';
      fullDisplay.textContent = activeSong.lyrics;
      lyricsContentArea.appendChild(fullDisplay);
    } 
    
    else if (currentMode === 'Line-by-Line') {
      const lineDisplay = document.createElement('div');
      lineDisplay.className = 'line-display';
      lineDisplay.textContent = songLines[currentLineIndex];

      const controls = createLearningControls();
      lyricsContentArea.appendChild(lineDisplay);
      lyricsContentArea.appendChild(controls);
    } 
    
    else if (currentMode === 'Flashcards') {
      // Scene Container
      const scene = document.createElement('div');
      scene.className = 'flashcard-scene';

      // The Card
      const card = document.createElement('div');
      card.className = `flashcard ${isCardFlipped ? 'is-flipped' : ''}`;
      
      // Clicking the card flips it
      scene.addEventListener('click', () => {
        isCardFlipped = !isCardFlipped;
        card.classList.toggle('is-flipped');
      });

      // Front Face (The Hint / Previous Line)
      const frontFace = document.createElement('div');
      frontFace.className = 'flashcard-face flashcard-front';
      
      const hintLabel = document.createElement('div');
      hintLabel.className = 'flashcard-hint-label';
      hintLabel.textContent = currentLineIndex === 0 ? 'Starting Line' : 'Previous Line';

      const hintText = document.createElement('div');
      hintText.className = 'flashcard-hint-text';
      hintText.textContent = currentLineIndex === 0 ? "(Beginning of the song)" : songLines[currentLineIndex - 1];

      const clickPrompt = document.createElement('div');
      clickPrompt.className = 'flashcard-click-prompt';
      clickPrompt.textContent = 'Click to reveal next line';

      frontFace.appendChild(hintLabel);
      frontFace.appendChild(hintText);
      frontFace.appendChild(clickPrompt);

      // Back Face (The Answer / Current Line)
      const backFace = document.createElement('div');
      backFace.className = 'flashcard-face flashcard-back';
      backFace.textContent = songLines[currentLineIndex];

      card.appendChild(frontFace);
      card.appendChild(backFace);
      scene.appendChild(card);

      const controls = createLearningControls();
      lyricsContentArea.appendChild(scene);
      lyricsContentArea.appendChild(controls);
    }
  }

  // Helper to create the Previous/Next buttons for learning modes
  function createLearningControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'learning-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-secondary';
    prevBtn.textContent = '← Prev Line';
    prevBtn.disabled = currentLineIndex === 0;
    prevBtn.addEventListener('click', () => {
      if (currentLineIndex > 0) {
        currentLineIndex--;
        isCardFlipped = false;
        renderLyricsInterface();
      }
    });

    const progress = document.createElement('span');
    progress.className = 'learning-progress';
    progress.textContent = `${currentLineIndex + 1} / ${songLines.length}`;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-secondary';
    nextBtn.textContent = 'Next Line →';
    nextBtn.disabled = currentLineIndex === songLines.length - 1;
    nextBtn.addEventListener('click', () => {
      if (currentLineIndex < songLines.length - 1) {
        currentLineIndex++;
        isCardFlipped = false;
        renderLyricsInterface();
      }
    });

    controlsContainer.appendChild(prevBtn);
    controlsContainer.appendChild(progress);
    controlsContainer.appendChild(nextBtn);
    
    return controlsContainer;
  }

  // Initialize the first render
  renderLyricsInterface();

  lyricsModuleContainer.appendChild(lyricsTabRow);
  lyricsModuleContainer.appendChild(lyricsContentArea);

  // ==========================================
  // CUSTOM MEDIA CONTROLLER DASHBOARD
  // ==========================================
  const controlDashboard = document.createElement('div');
  controlDashboard.style.background = '#0d1117';
  controlDashboard.style.borderRadius = '12px';
  controlDashboard.style.border = '1px solid var(--glass-border)';
  controlDashboard.style.padding = '20px';
  controlDashboard.style.margin = '20px 0';

  const buttonRow = document.createElement('div');
  buttonRow.style.display = 'flex';
  buttonRow.style.gap = '10px';
  buttonRow.style.justifyContent = 'center';
  buttonRow.style.marginBottom = '20px';

  // Control Node 1: LIFO Step-Back Controller
  const prevButton = document.createElement('button');
  prevButton.className = 'btn';
  prevButton.innerHTML = '⏮️ Previous';
  if (playbackHistoryStack.length <= 1) {
    prevButton.style.opacity = '0.3';
    prevButton.style.cursor = 'not-allowed';
  } else {
    prevButton.addEventListener('click', handleNavigationBackwards);
  }

  // Control Node 2: Programmatic Play/Pause State Switcher
  const playPauseButton = document.createElement('button');
  playPauseButton.className = 'btn';
  playPauseButton.style.background = 'linear-gradient(135deg, var(--brand-green) 0%, #059669 100%)';
  playPauseButton.innerHTML = '⏸️ Pause';
  playPauseButton.addEventListener('click', () => {
    if (currentAudioElement.paused) {
      currentAudioElement.play();
      playPauseButton.innerHTML = '⏸️ Pause';
      playPauseButton.style.background = 'linear-gradient(135deg, var(--brand-green) 0%, #059669 100%)';
    } else {
      currentAudioElement.pause();
      playPauseButton.innerHTML = '▶️ Play';
      playPauseButton.style.background = 'linear-gradient(135deg, var(--accent-blue) 0%, #4f46e5 100%)';
    }
  });

  // Control Node 3: Database Index Step-Forward Calculator
  const forwardButton = document.createElement('button');
  forwardButton.className = 'btn';
  forwardButton.innerHTML = 'Next ⏭️';
  forwardButton.addEventListener('click', handleNavigationForward);

  // Control Node 4: Downstream Archiving Element (Download Anchor)
  const downloadButton = document.createElement('a');
  downloadButton.className = 'btn';
  downloadButton.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
  downloadButton.style.textDecoration = 'none';
  downloadButton.style.display = 'inline-flex';
  downloadButton.style.alignItems = 'center';
  downloadButton.href = activeSong.audioUrl;
  downloadButton.download = `${activeSong.title.replace(/\s+/g, '_')}_Practice_Track.mp3`;
  downloadButton.innerHTML = '📥 Download';
  downloadButton.addEventListener('click', () => {
    if (notificationEngine) notificationEngine.success('Downloading media file...');
  });

  // Control Node 5: Playback Speed Controller
  const speedController = document.createElement('select');
  speedController.className = 'btn';
  speedController.style.background = 'rgba(255, 255, 255, 0.05)';
  speedController.style.border = '1px solid var(--glass-border)';
  speedController.style.color = '#ffffff';
  speedController.style.cursor = 'pointer';
  speedController.style.appearance = 'none'; // Cleans up default browser styling
  speedController.style.padding = '12px 20px';

  // Define the speed options
  const speedOptions = [
    { value: 0.5, label: '0.5x (Slow)' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1x (Normal)' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x (Fast)' }
  ];

  // Populate the dropdown
  speedOptions.forEach(opt => {
    const optionElement = document.createElement('option');
    optionElement.value = opt.value;
    optionElement.textContent = opt.label;
    optionElement.style.background = '#111827'; // Matches your dark theme
    optionElement.style.color = '#ffffff';
    if (opt.value === 1.0) optionElement.selected = true;
    speedController.appendChild(optionElement);
  });

  // Wire up the logic to the audio element
  speedController.addEventListener('change', (event) => {
    if (currentAudioElement) {
      const newSpeed = parseFloat(event.target.value);
      currentAudioElement.playbackRate = newSpeed;
      if (notificationEngine) {
        notificationEngine.success(`Playback speed set to ${newSpeed}x`);
      }
    }
  });

  buttonRow.appendChild(prevButton);
  buttonRow.appendChild(playPauseButton);
  buttonRow.appendChild(forwardButton);
  buttonRow.appendChild(downloadButton);
  buttonRow.appendChild(speedController);

  // PROGRESS SCRUBBING GRAPHIC GRID
  const timelineContainer = document.createElement('div');
  timelineContainer.style.display = 'flex';
  timelineContainer.style.alignItems = 'center';
  timelineContainer.style.gap = '12px';

  const currentTimeText = document.createElement('span');
  currentTimeText.style.fontSize = '0.8rem';
  currentTimeText.style.color = 'var(--text-muted)';
  currentTimeText.style.fontFamily = 'monospace';
  currentTimeText.textContent = '0:00';

  const timelineSlider = document.createElement('input');
  timelineSlider.type = 'range';
  timelineSlider.min = '0';
  timelineSlider.max = '100';
  timelineSlider.value = '0';
  timelineSlider.style.flex = '1';
  timelineSlider.style.cursor = 'pointer';
  timelineSlider.style.accentColor = 'var(--brand-green)';

  const totalTimeText = document.createElement('span');
  totalTimeText.style.fontSize = '0.8rem';
  totalTimeText.style.color = 'var(--text-muted)';
  totalTimeText.style.fontFamily = 'monospace';
  totalTimeText.textContent = '0:00';

  // Scrubbing Listener: Direct state virtualization mutations
  timelineSlider.addEventListener('input', () => {
    if (!currentAudioElement.duration) return;
    currentAudioElement.currentTime = (timelineSlider.value / 100) * currentAudioElement.duration;
  });

  timelineContainer.appendChild(currentTimeText);
  timelineContainer.appendChild(timelineSlider);
  timelineContainer.appendChild(totalTimeText);

  controlDashboard.appendChild(buttonRow);
  controlDashboard.appendChild(timelineContainer);

  playerBox.appendChild(sourceIndicator);
  playerBox.appendChild(trackTitle);
  playerBox.appendChild(controlDashboard);
  playerBox.appendChild(lyricsModuleContainer);

  playerContainer.appendChild(playerBox);

  // Sync polling cycles utilizing 250ms intervals
  progressUpdateInterval = setInterval(() => {
    if (!currentAudioElement || !currentAudioElement.duration) return;
    
    timelineSlider.value = (currentAudioElement.currentTime / currentAudioElement.duration) * 100;

    const currentMin = Math.floor(currentAudioElement.currentTime / 60);
    const currentSec = Math.floor(currentAudioElement.currentTime % 60).toString().padStart(2, '0');
    currentTimeText.textContent = `${currentMin}:${currentSec}`;

    const totalMin = Math.floor(currentAudioElement.duration / 60);
    const totalSec = Math.floor(currentAudioElement.duration % 60).toString().padStart(2, '0');
    totalTimeText.textContent = `${totalMin}:${totalSec}`;
  }, 250);

  currentAudioElement.addEventListener('ended', () => {
    safelyPurgeActiveIntervals();
    handleNavigationForward();
  });
}

// ==========================================
// 7. COMPLEX DATA STRUCTURE POINTER LOGIC
// ==========================================

function handleNavigationBackwards() {
  if (playbackHistoryStack.length <= 1) {
    if (notificationEngine) notificationEngine.error('No further history tracked.');
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
  
  // Boundary Exception Guard: Roll back cleanly around to index 0 if target breaches limits
  if (nextDatabaseIndex >= songsDatabase.length) {
    nextDatabaseIndex = 0; 
  }

  const nextSongTarget = songsDatabase[nextDatabaseIndex];
  handleStreamSong(nextSongTarget.id, true);
}

// ==========================================
// 8. GARBAGE DISPOSAL & EXCEPTION CLEANING
// ==========================================

function safelyPurgeActiveIntervals() {
  if (progressUpdateInterval) {
    clearInterval(progressUpdateInterval);
    progressUpdateInterval = null;
  }
}

function showFallbackError() {
  const container = document.getElementById('songs-container');
  if (!container) return;
  container.innerHTML = `<div class="error-fallback-box">System Exception: Connection to song bank failed.</div>`;
}

// Active Filter State Vectors
let activeTypeFilter = 'all'; // Can be: 'all', 'hymn', 'anthem'
let activeLengthFilter = 'all'; // Can be: 'all', 'short', 'long'

// Filter Button Event Wire-up

const filterBindings = [
  { id: 'filter-all-type', type: 'type', value: 'all' },
  { id: 'filter-hymn', type: 'type', value: 'hymn' },
  { id: 'filter-anthem', type: 'type', value: 'anthem' },
  { id: 'filter-all-len', type: 'length', value: 'all' },
  { id: 'filter-short', type: 'length', value: 'short' },
  { id: 'filter-long', type: 'length', value: 'long' }
];

filterBindings.forEach(binding => {
  const btn = document.getElementById(binding.id);
  if (btn) {
    btn.addEventListener('click', () => {
      // Manage active visual tab switching states
      btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update data variables
      if (binding.type === 'type') activeTypeFilter = binding.value;
      if (binding.type === 'length') activeLengthFilter = binding.value;
      
      // Re-trigger the filtering logic immediately using current search text
      executeCompoundFiltering();
    });
  }
});

// Compound Multi-Criteria Filter Matrix

function executeCompoundFiltering() {
  const searchInput = document.getElementById('search-input');
  const searchString = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  const filteredSongs = songsDatabase.filter(song => {
    // Stage 1: Text Search Evaluation Gate
    const matchesText = song.title.toLowerCase().includes(searchString) || 
                        song.history.toLowerCase().includes(searchString);
                        
    // Stage 2: Classification Evaluation Gate (Assumes your json rows have a .type field)
    const matchesType = (activeTypeFilter === 'all') || 
                        (song.type && song.type.toLowerCase() === activeTypeFilter);
                        
    // Stage 3: Duration Evaluation Gate (Assumes your json rows have a .durationInSeconds field)
    let matchesLength = true;
    if (activeLengthFilter === 'short') matchesLength = (song.durationInSeconds < 180);
    if (activeLengthFilter === 'long') matchesLength = (song.durationInSeconds >= 180);
    
    // Return true ONLY if the song clears all three conditional bounds simultaneously
    return matchesText && matchesType && matchesLength;
  });

  if (filteredSongs.length === 0 && notificationEngine) {
    notificationEngine.error('No matching tracks found in filter matrices.');
  }

  renderSongCatalogue(filteredSongs);
}
