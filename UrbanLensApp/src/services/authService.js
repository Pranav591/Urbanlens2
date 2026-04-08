// Stub — swap internals for Firebase Auth in Phase 2

export const authService = {
  async login(email, password) {
    // TODO: Firebase signInWithEmailAndPassword
    await new Promise(r => setTimeout(r, 800));
    if (!email.includes('@')) throw new Error('Invalid email address.');
    return { name: 'Demo User', email };
  },

  async signup(name, email, password) {
    // TODO: Firebase createUserWithEmailAndPassword
    await new Promise(r => setTimeout(r, 800));
    return { name, email };
  },

  async guestLogin() {
    // TODO: Firebase signInAnonymously
    await new Promise(r => setTimeout(r, 400));
    return { name: 'Guest', email: 'guest@urbanlens.app', isGuest: true };
  },

  async logout() {
    // TODO: Firebase signOut
    return true;
  },

  getCurrentUser() {
    // TODO: Firebase currentUser
    return null;
  },
};