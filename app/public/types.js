/* global */

// ==========================================
// STUDENT-DEFINED TYPES
// ==========================================
// This file defines the "shape" of the data our app works with,
// and validates raw data against that shape before anything else
// in the app is allowed to use it.
//
// Why this exists: previously, songsDatabase = data; just trusted
// whatever came out of database.json. If a song entry was missing
// a field (e.g. someone forgot "audioUrl" when adding a new hymn),
// the bug wouldn't show up until a student clicked that song and
// the player silently broke. Validating on load catches that
// immediately, with a clear error pointing at exactly which song
// and which field is the problem.

// ==========================================
// 1. CUSTOM ERROR TYPE
// ==========================================
// A dedicated error type so calling code can tell "this song's
// data is broken" apart from other kinds of errors (network
// failures, etc.) if it ever needs to handle them differently.
class SongValidationError extends Error {
  constructor(message, songId) {
    super(message);
    this.name = 'SongValidationError';
    this.songId = songId;
  }
}

// ==========================================
// 2. THE Song TYPE
// ==========================================
// Describes every field a valid song object must have, and what
// type/shape that field must be in.
const SONG_SCHEMA = {
  id: 'string',
  title: 'string',
  lyrics: 'string',
  history: 'string',
  audioUrl: 'string',
  type: 'string',
  durationInSeconds: 'number'
};

const VALID_SONG_TYPES = ['hymn', 'anthem'];

/**
 * Validates a raw song object (e.g. one entry from database.json)
 * and returns a clean, validated Song object.
 *
 * Throws SongValidationError if the data doesn't match the
 * expected shape, instead of letting bad data through silently.
 *
 * @param {object} rawData - one untrusted object from the JSON file
 * @returns {object} a validated Song object
 */
function createSong(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    throw new SongValidationError(
      'Song entry is not a valid object.',
      rawData ? rawData.id : undefined
    );
  }

  const fallbackId = rawData.id || '(unknown id)';

  // Check every required field exists and is the correct type
  for (const fieldName in SONG_SCHEMA) {
    const expectedType = SONG_SCHEMA[fieldName];
    const actualValue = rawData[fieldName];

    if (actualValue === undefined || actualValue === null) {
      throw new SongValidationError(
        `Song "${fallbackId}" is missing required field "${fieldName}".`,
        fallbackId
      );
    }

    if (typeof actualValue !== expectedType) {
      throw new SongValidationError(
        `Song "${fallbackId}" field "${fieldName}" should be a ${expectedType}, ` +
        `but got ${typeof actualValue}.`,
        fallbackId
      );
    }
  }

  // Extra checks beyond just "right type" - the value also has to make sense
  if (rawData.title.trim().length === 0) {
    throw new SongValidationError(
      `Song "${fallbackId}" has an empty title.`,
      fallbackId
    );
  }

  if (rawData.audioUrl.trim().length === 0) {
    throw new SongValidationError(
      `Song "${fallbackId}" has an empty audioUrl.`,
      fallbackId
    );
  }

  if (rawData.durationInSeconds <= 0) {
    throw new SongValidationError(
      `Song "${fallbackId}" has an invalid durationInSeconds (${rawData.durationInSeconds}). ` +
      `Must be a positive number.`,
      fallbackId
    );
  }

  if (!VALID_SONG_TYPES.includes(rawData.type.toLowerCase())) {
    throw new SongValidationError(
      `Song "${fallbackId}" has an unrecognised type "${rawData.type}". ` +
      `Expected one of: ${VALID_SONG_TYPES.join(', ')}.`,
      fallbackId
    );
  }

  // Data is valid - return a clean, predictable Song object.
  // We rebuild the object explicitly (rather than just returning
  // rawData) so we know exactly what shape it is downstream, and
  // any unexpected extra junk fields in the JSON get dropped.
  return {
    id: rawData.id,
    title: rawData.title,
    lyrics: rawData.lyrics,
    history: rawData.history,
    audioUrl: rawData.audioUrl,
    type: rawData.type.toLowerCase(),
    durationInSeconds: rawData.durationInSeconds
  };
}

/**
 * Validates an entire array of raw song data (e.g. the full
 * database.json file). Invalid entries are skipped (with a
 * console warning) rather than crashing the whole app, so one
 * broken entry doesn't take down the entire song catalogue.
 *
 * @param {Array} rawSongsArray
 * @returns {Array} array of validated Song objects
 */
function createSongDatabase(rawSongsArray) {
  if (!Array.isArray(rawSongsArray)) {
    throw new SongValidationError('Song database is not an array.');
  }

  const validatedSongs = [];

  rawSongsArray.forEach((rawSong, index) => {
    try {
      validatedSongs.push(createSong(rawSong));
    } catch (error) {
      // Skip the broken entry, but make noise about it so it
      // gets noticed and fixed in the JSON file - we don't want
      // it failing silently either.
      console.warn(
        `Skipping invalid song at index ${index}: ${error.message}`
      );
    }
  });

  return validatedSongs;
}

// ==========================================
// 3. THE PlaybackState TYPE
// ==========================================
// Describes the shape of "what is currently going on" in the
// player - the current song, whether shuffle/repeat are on, and
// what order songs should play in. This used to be scattered
// across separate global variables; giving it one defined shape
// is what the MusicPlayer class (next step) will be built around.

const REPEAT_MODES = ['off', 'one', 'all'];

/**
 * Creates a fresh, valid PlaybackState object with sensible
 * defaults. Call this once when the player starts up.
 *
 * @returns {object} a new PlaybackState object
 */
function createPlaybackState() {
  return {
    currentSongId: null,
    isShuffleOn: false,
    repeatMode: 'off',       // one of REPEAT_MODES
    historyStack: [],        // existing stack behaviour, now typed
    shuffleQueue: []         // upcoming songs in shuffled order
  };
}

/**
 * Validates that a repeat mode value is one we actually support,
 * before it's allowed to be set on a PlaybackState.
 *
 * @param {string} mode
 * @returns {boolean}
 */
function isValidRepeatMode(mode) {
  return REPEAT_MODES.includes(mode);
}

// ==========================================
// 4. THE User TYPE
// ==========================================
// Describes a valid signup/login submission. Same idea as Song:
// check the shape and contents are sensible BEFORE any of it is
// trusted by the rest of the app (UserAccount class, storage, etc).
//
// NOTE ON SCOPE: this app only ever stores accounts in the
// current browser's own localStorage (see auth.js). There is no
// shared server, so this is a self-contained demo of the
// signup/login pattern using fictional seeded accounts, not a
// system that collects or holds real students' personal details.

class UserValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'UserValidationError';
    this.field = field;
  }
}

// Matches the same identification pattern already used in
// contact.html: a 6-8 digit student ID, or 3 letter staff initials.
const ID_PATTERN = /^(\d{6,8}|[A-Za-z]{3})$/;

// A reasonably standard "looks like an email" check. Not aiming
// to catch every edge case RFC 5322 allows, just obviously wrong input.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates a raw signup submission (name, id, email, password)
 * and returns a clean, validated object ready to be turned into
 * a stored account by the UserAccount class.
 *
 * Throws UserValidationError with a field-specific message if
 * anything is wrong, so the signup form can show the user exactly
 * what to fix.
 *
 * @param {object} rawData - { fullName, idOrInitials, email, password }
 * @returns {object} a validated signup object
 */
function createUserSignupRequest(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    throw new UserValidationError('Signup data is not a valid object.');
  }

  const { fullName, idOrInitials, email, password } = rawData;

  if (typeof fullName !== 'string' || fullName.trim().length === 0) {
    throw new UserValidationError('Full name is required.', 'fullName');
  }

  if (typeof idOrInitials !== 'string' || !ID_PATTERN.test(idOrInitials.trim())) {
    throw new UserValidationError(
      'ID must be a 6-8 digit Student ID, or 3-letter Staff Initials.',
      'idOrInitials'
    );
  }

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    throw new UserValidationError('Please enter a valid email address.', 'email');
  }

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new UserValidationError(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      'password'
    );
  }

  // Staff vs student is inferred the same way the ID itself is
  // validated: pure letters = staff initials, digits = student ID.
  const isStaffAccount = /^[A-Za-z]{3}$/.test(idOrInitials.trim());

  return {
    fullName: fullName.trim(),
    idOrInitials: idOrInitials.trim(),
    email: email.trim().toLowerCase(),
    password, // not trimmed - a password's whitespace is meaningful
    role: isStaffAccount ? 'staff' : 'student'
  };
}

/**
 * Validates a login attempt has the minimum shape needed to even
 * attempt a lookup (we don't know yet if the account exists or
 * the password is correct - that's the UserAccount class's job).
 *
 * @param {object} rawData - { idOrEmail, password }
 * @returns {object} a validated login request
 */
function createLoginRequest(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    throw new UserValidationError('Login data is not a valid object.');
  }

  const { idOrEmail, password } = rawData;

  if (typeof idOrEmail !== 'string' || idOrEmail.trim().length === 0) {
    throw new UserValidationError('Student ID, Staff Initials, or email is required.', 'idOrEmail');
  }

  if (typeof password !== 'string' || password.length === 0) {
    throw new UserValidationError('Password is required.', 'password');
  }

  return {
    idOrEmail: idOrEmail.trim().toLowerCase(),
    password
  };
}

// Export everything the rest of the app needs.
// (No module bundler in this project, so these attach to window
// for App.js / player.js to use, the same way the rest of the
// codebase works.)
window.SongValidationError = SongValidationError;
window.createSong = createSong;
window.createSongDatabase = createSongDatabase;
window.createPlaybackState = createPlaybackState;
window.isValidRepeatMode = isValidRepeatMode;
window.REPEAT_MODES = REPEAT_MODES;
window.UserValidationError = UserValidationError;
window.createUserSignupRequest = createUserSignupRequest;
window.createLoginRequest = createLoginRequest;