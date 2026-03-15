/**
 * Exercise 2: Arrays and Loops
 *
 * Practice working with typed arrays in TypeScript.
 */

// TODO: Annotate this array as a string array
const fruits: string[] = ["apple", "banana", "cherry"];

// TODO: Complete this function that takes a string array and returns
// a new array with each fruit name in uppercase
function uppercaseFruits(items: string[]): string[] {
  return items.map(item => item.toUpperCase());
}

// TODO: Complete this function that takes a number array and returns
// the sum of all numbers
function sumArray(numbers: number[]): number {
  let total = 0
  for (const num of numbers) {
    total = total + num;
}
return total;
}
// TODO: Complete this function that takes a string array and a string,
// and returns true if the item is in the array
  function contains(items: string[], item: string): boolean {
  return items.includes(item);
}



// --- Tests (do not modify) ---
console.log(uppercaseFruits(fruits));          // ["APPLE", "BANANA", "CHERRY"]
console.log(sumArray([1, 2, 3, 4, 5]));        // 15
console.log(contains(fruits, "banana"));       // true
console.log(contains(fruits, "mango"));        // false
