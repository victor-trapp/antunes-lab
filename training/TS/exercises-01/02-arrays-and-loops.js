"use strict";
/**
 * Exercise 2: Arrays and Loops
 *
 * Practice working with typed arrays in TypeScript.
 */
// TODO: Annotate this array as a string array
const fruits = ["apple", "banana", "cherry"];
// TODO: Complete this function that takes a string array and returns
// a new array with each fruit name in uppercase
function uppercaseFruits(items) {
    return items.map(item => item.toUpperCase());
}
// TODO: Complete this function that takes a number array and returns
// the sum of all numbers
function sumArray(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}
// TODO: Complete this function that takes a string array and a string,
// and returns true if the item is in the array
function contains(items, item) {
    return items.includes(item);
}
// --- Tests (do not modify) ---
console.log(uppercaseFruits(fruits)); // ["APPLE", "BANANA", "CHERRY"]
console.log(sumArray([1, 2, 3, 4, 5])); // 15
console.log(contains(fruits, "banana")); // true
console.log(contains(fruits, "mango")); // false
