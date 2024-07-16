const updateStep = (totalPoints) => {
  if (totalPoints < 500) return 1;
  if (totalPoints < 3000) return 2;
  if (totalPoints < 10000) return 3;
  if (totalPoints < 50000) return 4;
  if (totalPoints < 100000) return 5;
  if (totalPoints < 500000) return 6;
  if (totalPoints < 1000000) return 7;
  if (totalPoints < 2000000) return 8;
  if (totalPoints < 5000000) return 9;
  return 10;
};

module.exports = updateStep;
