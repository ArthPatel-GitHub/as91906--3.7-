/* global Notyf */

// ==========================================
// 1. GLOBAL CORE ENVIRONMENT VARIABLES
// ==========================================

// I'm setting up my main variables here to keep track of the songs and the audio player state.
let songsDatabase = []; 
let notificationEngine;
let playbackHistoryStack = [];
const songCacheMap = new Map();

// This holds the actual HTML5 Audio object that plays my mp3s
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

  // Fetching my JSON file so I have all my song data ready to go
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
      
      // I wrote this to check if I'm on the player page so it auto-loads the correct song
      const urlParams = new URLSearchParams(window.location.search);
      const requestedSongId = urlParams.get('song');
      
      if (requestedSongId && document.getElementById('player-container')) {
        handleStreamSong(requestedSongId, true);
      }

      if (notificationEngine && !requestedSongId) {
        notificationEngine.success('Song database compiled instantly.');
      }
    })
    .catch(error => {
      console.error(error);
      // I'll need a fallback UI just in case the JSON fails to load
    });

  // I added a debounce here so the search doesn't lag if I type too fast
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let debounceTimeoutPointer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeoutPointer);
      debounceTimeoutPointer = setTimeout(() => {
        executeCompoundFiltering(); 
      }, 250); 
    });
  }
});

function showFallbackError() {
  const container = document.getElementById('songs-container');
  if (container) {
    container.innerHTML = '<p class="text-muted-fallback">Unable to load the song database. Please refresh the page.</p>';
  }
  if (notificationEngine) {
    notificationEngine.error('Could not load song database.');
  }
}

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

  // Looping through my database to create the song cards dynamically
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
    
    // Clicking this sends the user to the player page with the song ID in the URL
    loadButton.addEventListener('click', () => {
      window.location.href = `player.html?song=${song.id}`;
    });

    cardElement.appendChild(cardTitle);
    cardElement.appendChild(cardP);
    cardElement.appendChild(loadButton);
    container.appendChild(cardElement);
  });
}

// ==========================================
// 5. PIPELINE INTERACTION: High-Speed Stream Engine
// ==========================================
function handleStreamSong(songId, shouldPushToHistory = true) {
  const playerContainer = document.getElementById('player-container');
  if (!playerContainer) return;

  const activeSong = songCacheMap.get(songId);
  if (!activeSong) return;

  currentActiveSongId = songId;

  safelyPurgeActiveIntervals();
  
  // I have to make sure any currently playing song stops before I load a new one
  if (currentAudioElement) {
    currentAudioElement.pause();
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

  // This is the magic line that actually loads my audio file from the URL I provided in the JSON
  currentAudioElement = new Audio(activeSong.audioUrl);
<<<<<<< HEAD
=======
  
  // I'm telling the audio to play immediately, but catching the error if the browser blocks autoplay
  currentAudioElement.play().then(() => {
    // Autoplay worked!
  }).catch((error) => {
    // The browser blocked it, so I'll let the user know they need to click play manually
    if (notificationEngine) {
      notificationEngine.error('Autoplay blocked by browser. Please press Play.');
    }
    const playBtn = document.querySelector('button.btn:nth-child(2)'); 
    if (playBtn) {
      playBtn.innerHTML = '▶️ Play';
      playBtn.style.background = 'linear-gradient(135deg, var(--accent-blue) 0%, #4f46e5 100%)';
    }
  });
>>>>>>> 307770633d6173e4fdd359dc7befeed4c4f1af42

  const playerBox = document.createElement('div');
  playerBox.className = 'player-box';

  const sourceIndicator = document.createElement('div');
  sourceIndicator.className = 'player-source';
  sourceIndicator.textContent = '📡 CUSTOM MULTIMEDIA STATION ACTIVATED';

  const trackTitle = document.createElement('h2');
  trackTitle.className = 'track-heading';
  trackTitle.textContent = activeSong.title;

  // ==========================================
  // CUSTOM MEDIA CONTROLLER DASHBOARD
  // (Buttons now use CSS classes from style.css
  //  instead of inline styles, so they automatically
  //  match the app's button aesthetic.)
  // ==========================================
  const controlDashboard = document.createElement('div');
  controlDashboard.className = 'control-dashboard';

  const buttonRow = document.createElement('div');
  buttonRow.className = 'control-button-row';

  // --- Previous ---
  const prevButton = document.createElement('button');
  prevButton.className = 'btn btn-nav';
  prevButton.innerHTML = '⏮️ Previous';
  if (playbackHistoryStack.length <= 1) {
    prevButton.classList.add('is-disabled');
    prevButton.disabled = true;
  } else {
    prevButton.addEventListener('click', handleNavigationBackwards);
  }

  // --- Play / Pause ---
  const playPauseButton = document.createElement('button');
  playPauseButton.className = 'btn btn-play';
  playPauseButton.innerHTML = '⏸️ Pause';
  playPauseButton.addEventListener('click', () => {
    if (currentAudioElement.paused) {
      currentAudioElement.play();
      playPauseButton.innerHTML = '⏸️ Pause';
      playPauseButton.classList.remove('is-paused');
    } else {
      currentAudioElement.pause();
      playPauseButton.innerHTML = '▶️ Play';
      playPauseButton.classList.add('is-paused');
    }
  });

  // --- Next ---
  const forwardButton = document.createElement('button');
  forwardButton.className = 'btn btn-nav';
  forwardButton.innerHTML = 'Next ⏭️';
  forwardButton.addEventListener('click', handleNavigationForward);

  // --- Playback speed ---
  const speedController = document.createElement('select');
  speedController.className = 'btn-speed-select';

  const speedOptions = [
    { value: 0.5, label: '0.5x (Slow)' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1x (Normal)' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x (Fast)' }
  ];

  speedOptions.forEach(opt => {
    const optionElement = document.createElement('option');
    optionElement.value = opt.value;
    optionElement.textContent = opt.label;
    if (opt.value === 1.0) optionElement.selected = true;
    speedController.appendChild(optionElement);
  });

  speedController.addEventListener('change', (event) => {
    if (currentAudioElement) {
      const newSpeed = parseFloat(event.target.value);
      currentAudioElement.playbackRate = newSpeed;
      if (notificationEngine) {
        notificationEngine.success(`Playback speed set to ${newSpeed}x`);
      }
    }
  });

  // --- Download ---
  // NOTE on offline playback (Phase 2, once login + hosting are ready):
  // True "save for offline" requires a Service Worker + Cache API (or
  // storing the fetched audio Blob in IndexedDB), and a Service Worker
  // will only register over HTTPS or localhost. For now this button
  // just saves the MP3 to the user's device — a normal download, not
  // an in-app offline library. Gate this behind login once auth exists
  // by checking something like `isUserLoggedIn()` before calling
  // triggerSongDownload().
  const downloadButton = document.createElement('button');
  downloadButton.className = 'btn btn-download';
  downloadButton.innerHTML = '📥 Download';
  downloadButton.addEventListener('click', () => {
    triggerSongDownload(activeSong, downloadButton);
  });

  buttonRow.appendChild(prevButton);
  buttonRow.appendChild(playPauseButton);
  buttonRow.appendChild(forwardButton);
  buttonRow.appendChild(downloadButton);
  buttonRow.appendChild(speedController);

  const timelineRow = document.createElement('div');
  timelineRow.className = 'control-timeline-row';

  const currentTimeText = document.createElement('span');
  currentTimeText.className = 'timeline-time';
  currentTimeText.textContent = '0:00';

  const timelineSlider = document.createElement('input');
  timelineSlider.type = 'range';
  timelineSlider.min = '0';
  timelineSlider.max = '100';
  timelineSlider.value = '0';
  timelineSlider.className = 'timeline-slider';

  const totalTimeText = document.createElement('span');
  totalTimeText.className = 'timeline-time';
  totalTimeText.textContent = '0:00';

  timelineSlider.addEventListener('input', () => {
    if (!currentAudioElement.duration) return;
    currentAudioElement.currentTime = (timelineSlider.value / 100) * currentAudioElement.duration;
  });

  timelineRow.appendChild(currentTimeText);
  timelineRow.appendChild(timelineSlider);
  timelineRow.appendChild(totalTimeText);

  const downloadStatus = document.createElement('div');
  downloadStatus.className = 'download-status';
  downloadStatus.id = 'download-status-text';

  controlDashboard.appendChild(buttonRow);
  controlDashboard.appendChild(timelineRow);
  controlDashboard.appendChild(downloadStatus);

  // Try to play automatically, but catch the browser's autoplay block
  currentAudioElement.play().then(() => {
    // Autoplay worked!
  }).catch(() => {
    // Autoplay was blocked. Inform the user they need to click play.
    if (notificationEngine) {
      notificationEngine.error('Autoplay blocked by browser. Please press Play.');
    }
    playPauseButton.innerHTML = '▶️ Play';
    playPauseButton.classList.add('is-paused');
  });

  // ==========================================
  // MULTI-MODE LYRICS LEARNING MODULE
  // ==========================================
  const lyricsModuleContainer = document.createElement('div');
  lyricsModuleContainer.className = 'lyrics-module-container';

  const lyricsTabRow = document.createElement('div');
  lyricsTabRow.className = 'lyrics-tab-row';

  const lyricsContentArea = document.createElement('div');
  lyricsContentArea.className = 'lyrics-content-area';

  const songLines = activeSong.lyrics.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const modes = ['Full Lyrics', 'Line-by-Line', 'Flashcards'];
  let currentMode = 'Full Lyrics';
  let currentLineIndex = 0;
  let isCardFlipped = false;

  modes.forEach(mode => {
    const tabButton = document.createElement('button');
    tabButton.className = `lyrics-tab ${mode === currentMode ? 'active' : ''}`;
    tabButton.textContent = mode;
    tabButton.addEventListener('click', () => {
      Array.from(lyricsTabRow.children).forEach(btn => btn.classList.remove('active'));
      tabButton.classList.add('active');
      
      currentMode = mode;
      isCardFlipped = false; 
      renderLyricsInterface();
    });
    lyricsTabRow.appendChild(tabButton);
  });

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
      const scene = document.createElement('div');
      scene.className = 'flashcard-scene';

      const card = document.createElement('div');
      card.className = `flashcard ${isCardFlipped ? 'is-flipped' : ''}`;
      
      scene.addEventListener('click', () => {
        isCardFlipped = !isCardFlipped;
        card.classList.toggle('is-flipped');
      });

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

  renderLyricsInterface();

  lyricsModuleContainer.appendChild(lyricsTabRow);
  lyricsModuleContainer.appendChild(lyricsContentArea);

<<<<<<< HEAD
=======
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

  const prevButton = document.createElement('button');
  prevButton.className = 'btn';
  prevButton.innerHTML = '⏮️ Previous';
  if (playbackHistoryStack.length <= 1) {
    prevButton.style.opacity = '0.3';
    prevButton.style.cursor = 'not-allowed';
  } else {
    prevButton.addEventListener('click', handleNavigationBackwards);
  }

  // I set up my custom play/pause toggle here to control the Audio element
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

  const forwardButton = document.createElement('button');
  forwardButton.className = 'btn';
  forwardButton.innerHTML = 'Next ⏭️';
  forwardButton.addEventListener('click', handleNavigationForward);

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

  const speedController = document.createElement('select');
  speedController.className = 'btn';
  speedController.style.background = 'rgba(255, 255, 255, 0.05)';
  speedController.style.border = '1px solid var(--glass-border)';
  speedController.style.color = '#ffffff';
  speedController.style.cursor = 'pointer';
  speedController.style.appearance = 'none'; 
  speedController.style.padding = '12px 20px';

  
  const speedOptions = [
    { value: 0.5, label: '0.5x (Slow)' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1x (Normal)' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x (Fast)' }
  ];

  speedOptions.forEach(opt => {
    const optionElement = document.createElement('option');
    optionElement.value = opt.value;
    optionElement.textContent = opt.label;
    optionElement.style.background = '#111827'; 
    optionElement.style.color = '#ffffff';
    if (opt.value === 1.0) optionElement.selected = true;
    speedController.appendChild(optionElement);
  });

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

  // I added an event listener so dragging the slider changes the song position
  timelineSlider.addEventListener('input', () => {
    if (!currentAudioElement.duration) return;
    currentAudioElement.currentTime = (timelineSlider.value / 100) * currentAudioElement.duration;
  });

  timelineContainer.appendChild(currentTimeText);
  timelineContainer.appendChild(timelineSlider);
  timelineContainer.appendChild(totalTimeText);

  controlDashboard.appendChild(buttonRow);
  controlDashboard.appendChild(timelineContainer);

>>>>>>> 307770633d6173e4fdd359dc7befeed4c4f1af42
  playerBox.appendChild(sourceIndicator);
  playerBox.appendChild(trackTitle);
  playerBox.appendChild(controlDashboard);
  playerBox.appendChild(lyricsModuleContainer);

  playerContainer.appendChild(playerBox);

  // This interval updates my progress bar math visually every quarter of a second
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

  // I put this here so the next song plays automatically when one finishes
  currentAudioElement.addEventListener('ended', () => {
    safelyPurgeActiveIntervals();
    handleNavigationForward();
  });
}

// ==========================================
// 5b. DOWNLOAD-TO-DEVICE HANDLER
// ==========================================
// Fetches the audio as a Blob and triggers a save dialog via a
// temporary object URL. This is more reliable than a bare
// <a download> link for cross-origin files (like the SoundHelix
// demo tracks), because some servers/browsers ignore the
// `download` attribute on cross-origin links and just navigate
// to the file instead of saving it.
//
// Phase 2 (once login is built): wrap this call in an auth check,
// e.g.
//   if (!isUserLoggedIn()) { promptLogin(); return; }
// before downloading.
function triggerSongDownload(song, buttonEl) {
  const statusEl = document.getElementById('download-status-text');
  const originalLabel = buttonEl.innerHTML;

  buttonEl.disabled = true;
  buttonEl.innerHTML = '⏳ Downloading…';
  if (statusEl) statusEl.textContent = `Fetching "${song.title}"...`;

  fetch(song.audioUrl)
    .then(response => {
      if (!response.ok) throw new Error('File not found on server');
      return response.blob();
    })
    .then(blob => {
      const objectUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = objectUrl;
      tempLink.download = `${song.title.replace(/[^a-z0-9]+/gi, '_')}.mp3`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(objectUrl);

      if (notificationEngine) notificationEngine.success('Download complete!');
      if (statusEl) statusEl.textContent = `Saved "${song.title}" to your device.`;
    })
    .catch(error => {
      console.error('Download failed:', error);
      if (notificationEngine) notificationEngine.error('Download failed. File may be missing.');
      if (statusEl) statusEl.textContent = 'Download failed — audio file unavailable.';
    })
    .finally(() => {
      buttonEl.disabled = false;
      buttonEl.innerHTML = originalLabel;
    });
}

// ==========================================
// 6. COMPLEX DATA STRUCTURE POINTER LOGIC
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
  
  if (nextDatabaseIndex >= songsDatabase.length) {
    nextDatabaseIndex = 0; 
  }

  const nextSongTarget = songsDatabase[nextDatabaseIndex];
  handleStreamSong(nextSongTarget.id, true);
}

// ==========================================
// 7. GARBAGE DISPOSAL & EXCEPTION CLEANING
// ==========================================

function safelyPurgeActiveIntervals() {
  if (progressUpdateInterval) {
    clearInterval(progressUpdateInterval);
    progressUpdateInterval = null;
  }
}

// ==========================================
// 8. DATA FILTERING LOGIC
// ==========================================

let activeTypeFilter = 'all'; 
let activeLengthFilter = 'all'; 

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
      btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (binding.type === 'type') activeTypeFilter = binding.value;
      if (binding.type === 'length') activeLengthFilter = binding.value;
      
      executeCompoundFiltering();
    });
  }
});

function executeCompoundFiltering() {
  const searchInput = document.getElementById('search-input');
  const searchString = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  const filteredSongs = songsDatabase.filter(song => {
    const matchesText = song.title.toLowerCase().includes(searchString) || 
                        song.history.toLowerCase().includes(searchString);
                        
    const matchesType = (activeTypeFilter === 'all') || 
                        (song.type && song.type.toLowerCase() === activeTypeFilter);
                        
    let matchesLength = true;
    if (activeLengthFilter === 'short') matchesLength = (song.durationInSeconds < 180);
    if (activeLengthFilter === 'long') matchesLength = (song.durationInSeconds >= 180);
    
    return matchesText && matchesType && matchesLength;
  });

  if (filteredSongs.length === 0 && notificationEngine) {
    notificationEngine.error('No matching tracks found in filter matrices.');
  }

  renderSongCatalogue(filteredSongs);
}