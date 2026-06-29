/* global createUserSignupRequest, createLoginRequest, UserValidationError */

// ==========================================
// AUTHENTICATION: PASSWORD HASHING + UserAccount CLASS
// ==========================================
// SCOPE NOTE: accounts created here are stored ONLY in this
// browser's own localStorage. There is no server, so there is no
// shared list of real students anywhere - each browser only ever
// knows about whoever signed up on that browser, plus the
// fictional demo accounts seeded below. This is a working
// demonstration of the signup/login pattern, not a system meant
// to hold real students' personal details.

const STORAGE_KEY_USERS = 'rathkeale_users';
const STORAGE_KEY_SESSION = 'rathkeale_session';

// ==========================================
// 1. PASSWORD HASHING
// ==========================================
// A real production system would use a dedicated library (e.g.
// bcrypt) on a server. This is a client-only demo, so we use the
// browser's built-in SubtleCrypto API to produce a genuine SHA-256
// hash - passwords are never stored in plain text, even though
// this is a simplified approach worth naming as a deliberate
// simplification rather than production-grade security.
//
// A "salt" (a random value mixed in before hashing) is added per
// user so two identical passwords don't produce identical hashes.

async function hashPassword(plainTextPassword, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + plainTextPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

// ==========================================
// 2. UserAccount CLASS
// ==========================================

class UserAccount {
  constructor() {
    this.currentUser = null; // set on successful login, cleared on logout
    this._loadSession();
  }

  // ---- Persistence helpers ----

  _loadAllUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USERS);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn('Could not read stored users, starting fresh.', error);
      return [];
    }
  }

  _saveAllUsers(usersArray) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(usersArray));
  }

  _loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      this.currentUser = raw ? JSON.parse(raw) : null;
    } catch (error) {
      this.currentUser = null;
    }
  }

  _saveSession(user) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    this.currentUser = user;
  }

  _clearSession() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    this.currentUser = null;
  }

  // ---- Public API ----

  /**
   * Registers a new account.
   * @param {object} rawSignupData - { fullName, idOrInitials, email, password }
   * @returns {Promise<object>} the public-safe user record (no password)
   */
  async signUp(rawSignupData) {
    const validated = window.createUserSignupRequest(rawSignupData);
    const allUsers = this._loadAllUsers();

    const alreadyExists = allUsers.some(
      (user) => user.idOrInitials === validated.idOrInitials || user.email === validated.email
    );
    if (alreadyExists) {
      throw new window.UserValidationError(
        'An account with that ID or email already exists.',
        'idOrInitials'
      );
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(validated.password, salt);

    const newUser = {
      fullName: validated.fullName,
      idOrInitials: validated.idOrInitials,
      email: validated.email,
      role: validated.role,
      isAdmin: false, // demo accounts only become admin via _seedDemoAccounts
      salt,
      passwordHash
    };

    allUsers.push(newUser);
    this._saveAllUsers(allUsers);

    return this._toPublicUser(newUser);
  }

  /**
   * Attempts to log in with either a Student ID/Staff Initials
   * OR an email, plus a password.
   * @param {object} rawLoginData - { idOrEmail, password }
   * @returns {Promise<object>} the public-safe user record (no password)
   */
  async logIn(rawLoginData) {
    const validated = window.createLoginRequest(rawLoginData);
    const allUsers = this._loadAllUsers();

    const matchedUser = allUsers.find(
      (user) =>
        user.idOrInitials.toLowerCase() === validated.idOrEmail ||
        user.email === validated.idOrEmail
    );

    if (!matchedUser) {
      throw new window.UserValidationError('No account found with that ID or email.', 'idOrEmail');
    }

    const attemptedHash = await hashPassword(validated.password, matchedUser.salt);
    if (attemptedHash !== matchedUser.passwordHash) {
      throw new window.UserValidationError('Incorrect password.', 'password');
    }

    const publicUser = this._toPublicUser(matchedUser);
    this._saveSession(publicUser);
    return publicUser;
  }

  logOut() {
    this._clearSession();
  }

  /**
   * Always reads the session fresh from localStorage rather than
   * a cached instance field. This matters because a page can have
   * MORE THAN ONE UserAccount instance alive at once (e.g. the
   * nav auth-widget and a page-specific controller both create
   * their own instance) - if login state were only cached on
   * construction, one instance logging in/out would leave the
   * other silently out of date.
   */
  getCurrentUser() {
    this._loadSession();
    return this.currentUser;
  }

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Returns every signed-up user, WITHOUT password hashes or
   * salts - only safe to call from admin-gated UI, but the method
   * itself never leaks sensitive fields regardless of caller.
   */
  getAllUsersPublic() {
    return this._loadAllUsers().map((user) => this._toPublicUser(user));
  }

  // Strips password/salt before returning a user object to any
  // caller - this is the ONE place that decides what's "public"
  // about a user, so we don't accidentally leak hashes elsewhere.
  _toPublicUser(user) {
    return {
      fullName: user.fullName,
      idOrInitials: user.idOrInitials,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin
    };
  }

  // ---- Demo seeding ----

  /**
   * Creates two fictional demo accounts the first time the app
   * runs, IF no accounts exist yet. Lets the app be demoed
   * immediately without needing to sign up first.
   */
  async seedDemoAccountsIfEmpty() {
    const allUsers = this._loadAllUsers();
    if (allUsers.length > 0) return; // already seeded, or real accounts exist

    const studentSalt = generateSalt();
    const staffSalt = generateSalt();

    const demoStudent = {
      fullName: 'Alex Test',
      idOrInitials: '123456',
      email: 'alex.test@example.com',
      role: 'student',
      isAdmin: false,
      salt: studentSalt,
      passwordHash: await hashPassword('demopass123', studentSalt)
    };

    const demoStaff = {
      fullName: 'J. Sample',
      idOrInitials: 'JSM',
      email: 'j.sample@example.com',
      role: 'staff',
      isAdmin: true,
      salt: staffSalt,
      passwordHash: await hashPassword('demopass123', staffSalt)
    };

    this._saveAllUsers([demoStudent, demoStaff]);
  }
}

window.UserAccount = UserAccount;
window.hashPassword = hashPassword; // exposed for testing
window.generateSalt = generateSalt; // exposed for testing