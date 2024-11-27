interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export function isPWAInstalled(): boolean {
  // Ensure we're running in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  const nav = navigator as NavigatorStandalone;
  const isIOSStandalone = nav.standalone === true;

  const isAndroidStandalone = Boolean(
    document.referrer && document.referrer.startsWith('android-app://')
  );

  return isStandalone || isIOSStandalone || isAndroidStandalone;
}
