const randomNumber = (min, max, amount = 1) => {
  const arrRandomNumber = [];
  while (arrRandomNumber.length !== amount) {
    const number = Math.floor(min + Math.random() * (max + 1 - min));
    if (!arrRandomNumber.includes(number)) {
      arrRandomNumber.push(number);
    }
  }
  return arrRandomNumber;
};
export default randomNumber;
