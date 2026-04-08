"use strict";
/**
 * Exercise 4: Union Types & Type Guards
 *
 * Union types allow a value to be one of several types.
 * Type guards narrow down the type at runtime.
 */
// TODO: Complete this function that takes a StringOrNumber.
// - If it's a string, return its length
// - If it's a number, return the number doubled
function processValue(value) {
    if (typeof value === "string") {
        return value.length;
    }
    else {
        return value * 2;
    }
}
// TODO: Complete this function that takes a Result and returns:
// - "Got data: <data>" on success
// - "Error: <message>" on error
function handleResult(result) {
    if (result.status === "success") {
        return `Got data: ${result.data}`;
    }
    else {
        return `Error: ${result.message}`;
    }
}
// TODO: Complete this function that takes an array of StringOrNumber
// and returns two separate arrays: one for strings, one for numbers
function splitByType(values) {
    return values.reduce((acc, value) => {
        if (typeof value === "string") {
            acc.strings.push(value);
        }
        else {
            acc.numbers.push(value);
        }
        return acc;
    }, { strings: [], numbers: [] });
}
// --- Tests (do not modify) --- 
console.log(processValue("hello")); // 5
console.log(processValue(21)); // 42
console.log(handleResult({ status: "success", data: "user data" })); // Got data: user data
console.log(handleResult({ status: "error", message: "not found" })); // Error: not found
const mixed = [1, "apple", 2, "banana", 3];
console.log(splitByType(mixed)); // { strings: ["apple", "banana"], numbers: [1, 2, 3] }
