"use strict";
/**
 * Exercise 6: Generics
 *
 * Generics let you write reusable functions and types that work
 * with any type while still being type-safe.
 */
// TODO: Complete this generic function that returns the first element
// of an array, or undefined if the array is empty.
// Signature: function first<T>(arr: T[]): T | undefined
function first(arr) {
    return arr.length > 0 ? arr[0] : undefined;
}
// TODO: Complete this generic function that takes two values and
// returns them as a tuple [A, B].
// Signature: function pair<A, B>(a: A, b: B): [A, B]
function pair(a, b) {
    return [a, b];
}
// TODO: Complete this generic function that filters an array
// using a predicate function.
// Signature: function filter<T>(arr: T[], predicate: (item: T) => boolean): T[]
function filter(arr, predicate) {
    return arr.filter(predicate);
}
// TODO: Complete this generic identity function that accepts a value
// and returns it unchanged.
// Signature: function identity<T>(value: T): T
function identity(value) {
    return value;
}
// --- Tests (do not modify) ---
console.log(first([1, 2, 3])); // 1
console.log(first(["a", "b"])); // "a"
console.log(first([])); // undefined
console.log(pair("hello", 42)); // ["hello", 42]
console.log(pair(true, "yes")); // [true, "yes"]
console.log(filter([1, 2, 3, 4, 5], x => x % 2 === 0)); // [2, 4]
console.log(filter(["apple", "banana", "avocado"], s => s.startsWith("a"))); // ["apple", "avocado"]
console.log(identity(7)); // 7
console.log(identity("typescript")); // "typescript"
