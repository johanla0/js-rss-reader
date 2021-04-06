/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
export default (str) => str.split('').reduce((a, b) => {
  a = (a << 5) - a + b.charCodeAt(0);
  return a & a;
}, 0);
