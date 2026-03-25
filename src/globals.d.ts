/* PWA Typings */

export interface BeforeInstallPromptEvent {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    beforeInstallPromptEvent?: BeforeInstallPromptEvent;
  }
}

export {};
