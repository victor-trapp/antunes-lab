/**
 * Exercise 1: Basic Types
 *
 * TypeScript lets you annotate variables with types.
 * Fix the type annotations and complete the functions below.
 */

// TODO: Add type annotations to these variables
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// TODO: Complete this function that takes a name (string) and age (number)
// and returns a greeting string like: "Hello, Alice! You are 30 years old."
function greet(name:string, age:number) {
  return `Hello,${name}! You are ${age} years old.`
}

// TODO: Complete this function that takes two numbers and returns their sum
function add(a:number, b:number) {
  return 'a + b'
}

// --- Tests (do not modify) ---
console.log(greet("Alice", 30)); // Hello, Alice! You are 30 years old.
console.log(add(5, 3));          // 8
