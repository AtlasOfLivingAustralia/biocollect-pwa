export const isFrame = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};
