export const isFrame = () => {
  try {
    return window.self !== window.top;
  } catch (_) {
    return true;
  }
};
