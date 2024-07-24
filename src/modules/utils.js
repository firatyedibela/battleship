const Utils = (function () {
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const generateRandomCoordinates = () => {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);

    return { row, col };
  };

  const generateRandomAxis = () => {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
  };

  return {
    delay,
    generateRandomCoordinates,
    generateRandomAxis,
  };
})();

export default Utils;
