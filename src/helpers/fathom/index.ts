/**
 * Initialize Fathom Analytics if site ID is configured
 */
export const initializeFathom = () => {
  const siteId = import.meta.env.VITE_FATHOM_SITE_ID;
  const scriptUrl = import.meta.env.VITE_FATHOM_SCRIPT_URL || 'https://cdn.usefathom.com/script.js';

  // Only load Fathom if a site ID is configured
  if (!siteId) {
    return;
  }

  // Skip if Fathom script is already present
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${scriptUrl}"]`,
  );

  if (existingScript) {
    return;
  }

  // Load the Fathom script dynamically
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.setAttribute('data-site', siteId);
  script.setAttribute('data-spa', 'auto');
  script.defer = true;
  document.head.appendChild(script);
};
