/* global Notyf, UserAccount, UserValidationError */

// ==========================================
// LOGIN PAGE CONTROLLER
// ==========================================
// Wires the forms in login.html to the UserAccount class from
// auth.js. Kept as its own file (rather than stuffed into App.js)
// since this logic is specific to login.html and not needed on
// every other page yet.

window.addEventListener('DOMContentLoaded', async () => {
  const account = new UserAccount();
  await account.seedDemoAccountsIfEmpty();

  const loggedInPanel = document.getElementById('logged-in-panel');
  const authFormsPanel = document.getElementById('auth-forms-panel');
  const welcomeMessage = document.getElementById('welcome-message');
  const logoutBtn = document.getElementById('logout-btn');

  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const errorMessageEl = document.getElementById('auth-error-message');

  const notyf = typeof Notyf !== 'undefined'
    ? new Notyf({ duration: 2500, position: { x: 'right', y: 'top' }, ripple: false })
    : null;

  // ---- UI state helpers ----

  function showLoggedInState() {
    const user = account.getCurrentUser();
    loggedInPanel.style.display = 'block';
    authFormsPanel.style.display = 'none';
    welcomeMessage.textContent = `Welcome back, ${user.fullName}! (${user.role}${user.isAdmin ? ', admin' : ''})`;
  }

  function showFormsState() {
    loggedInPanel.style.display = 'none';
    authFormsPanel.style.display = 'block';
  }

  function showError(message) {
    errorMessageEl.textContent = message;
    errorMessageEl.style.display = 'block';
  }

  function clearError() {
    errorMessageEl.style.display = 'none';
    errorMessageEl.textContent = '';
  }

  function switchTab(tab) {
    clearError();
    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    } else {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
    }
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabSignup.addEventListener('click', () => switchTab('signup'));

  // ---- Initial render ----
  if (account.isLoggedIn()) {
    showLoggedInState();
  } else {
    showFormsState();
  }

  // ---- Logout ----
  logoutBtn.addEventListener('click', () => {
    account.logOut();
    if (notyf) notyf.success('Logged out.');
    showFormsState();
    loginForm.reset();
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
  });

  // If login/logout happens via the nav auth-widget while this
  // page is open, keep this page's own panel in sync too.
  window.addEventListener('auth-state-changed', () => {
    if (account.isLoggedIn()) {
      showLoggedInState();
    } else {
      showFormsState();
    }
  });

  // ---- Login form submit ----
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearError();

    const idOrEmail = document.getElementById('login-id-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const user = await account.logIn({ idOrEmail, password });
      if (notyf) notyf.success(`Welcome back, ${user.fullName}!`);
      showLoggedInState();
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
    } catch (error) {
      if (error instanceof UserValidationError) {
        showError(error.message);
      } else {
        showError('Something went wrong while logging in. Please try again.');
        console.error(error);
      }
    }
  });

  // ---- Signup form submit ----
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearError();

    const fullName = document.getElementById('signup-name').value;
    const idOrInitials = document.getElementById('signup-id').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
      await account.signUp({ fullName, idOrInitials, email, password });
      if (notyf) notyf.success('Account created! You can now log in.');
      signupForm.reset();
      switchTab('login');
    } catch (error) {
      if (error instanceof UserValidationError) {
        showError(error.message);
      } else {
        showError('Something went wrong while signing up. Please try again.');
        console.error(error);
      }
    }
  });
});