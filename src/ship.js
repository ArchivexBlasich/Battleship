const Ship = (shipLength) => {
  let length;
  let numberOfHits = 0;

  const _init = () => {
    if (shipLength < 1 || shipLength > 5)
      throw Error("Ship Length can not be less than 1 and greater than 5");

    length = shipLength;
  };

  const getNumberOfHits = () => {
    return numberOfHits;
  };

  const getLength = () => {
    return length;
  };

  const hit = () => {
    if (numberOfHits >= length) return;

    numberOfHits++;
  };

  const isSunk = () => {
    return numberOfHits === length;
  }

  _init();

  return {
    getNumberOfHits,
    getLength,
    hit,
    isSunk,
  };
};

export { Ship };
