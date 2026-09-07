const behaviorUtils = {
  getScale: (score) => {
    if (score >= 18) return "AD";
    if (score >= 15) return "A";
    if (score >= 11) return "B";
    return "C";
  },
};

export { behaviorUtils };