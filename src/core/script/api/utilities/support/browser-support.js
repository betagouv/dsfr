const supportLocalStorage = () => {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
};

const supportAspectRatio = () => {
  return CSS.supports('aspect-ratio: 16 / 9');
};

export { supportLocalStorage, supportAspectRatio };
