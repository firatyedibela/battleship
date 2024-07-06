const Utils = (function () {
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return {
    delay,
  };
})();

export default Utils;
