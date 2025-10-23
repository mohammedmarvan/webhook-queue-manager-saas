let sessionExpiredCallback: (() => void) | null = null;

export function registerSessionExpiredCallback(callback: () => void) {
  sessionExpiredCallback = callback;
}

export function triggerSessionExpired() {
  if (sessionExpiredCallback) {
    sessionExpiredCallback();
  } else {
    console.warn('Session expired callback not registered yet.');
  }
}
