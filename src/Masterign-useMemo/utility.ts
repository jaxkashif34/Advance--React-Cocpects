// Traditional way of using memoization
import _ from 'lodash';

export function swatch(color: string) {
  console.log(`Swatch render: ${color}`);
  return `Swatch render: ${color}`;
}

/* 
swatch('red');
swatch('blue');
swatch('red');
swatch('blue');
*/

/*when i run this function without using the memoization function of lodash it will runs every time no matter what will be the input  */

// Using memoization method of lodash

export const swatchMemoized = _.memoize(swatch);

// this will run only two times because we are only passing two different colors as an input
/* 
swatchMemoized('red');
swatchMemoized('blue');
swatchMemoized('red');
swatchMemoized('blue');
*/

// how we can create our own memoization function

const prev = {
  // this is the object which will store the previous values
  color: '',
  result: '',
};

export const rmSwatch = (color: string) => {
  if (prev.color === color) {
    return prev.result;
  }
  prev.color = color;
  prev.result = swatch(color);
  return prev.result;
};

/*  we have to learn that when memoization is good and when it is bad and when it works and when doesn't
and we really need to know when to use it and when not to use it and how to use it

WORST CASE SCENARIO 
rmSwatch('red');
rmSwatch('blue');
rmSwatch('red');
rmSwatch('blue');


BEST CASE SCENARIO 
rmSwatch('red');
rmSwatch('red');
rmSwatch('blue');
rmSwatch('blue');
*/

/* With Closure */

const createSwatch = () => {
  const prev = {
    // this is the object which will store the previous values
    color: '',
    result: '',
  };

  return (color: string) => {
    if (prev.color === color) {
      return prev.result;
    }
    prev.color = color;
    prev.result = swatch(color);
    return prev.result;
  };
};

const swatch1 = createSwatch();
const swatch2 = createSwatch();

/* we have to know that the red and blue passing to the swatch1 are only specific to the swatch1 and the red and blue passing to the swatch2 are only specific to the swatch2 and each pair of red and blue invoke the swatch function two times and it is not sharing the values with each other


swatch1('red closure1');
swatch1('blue closure1');

swatch2('red closure2');
swatch2('blue closure2');
*/