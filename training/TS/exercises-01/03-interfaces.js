"use strict";
/**
 * Exercise 3: Interfaces
 *
 * Interfaces describe the shape of an object.
 * Define interfaces and use them to type your functions.
 */
// TODO: Complete this function that takes a Person and returns a formatted string:
// "Name: Alice, Age: 30" (no email) or "Name: Alice, Age: 30, Email: alice@example.com"
function formatPerson(person) {
    return `Name: ${person.name}, Age: ${person.age}` + `, Email: ${person.email}`;
}
// TODO: Complete this function that takes an array of Products
// and returns only the ones that are in stock
function getInStockProducts(products) {
    return products.filter(product => product.inStock);
}
// --- Tests (do not modify) ---
const alice = { name: "Alice", age: 30, email: "alice@example.com" };
const bob = { name: "Bob", age: 25 };
console.log(formatPerson(alice)); // Name: Alice, Age: 30, Email: alice@example.com
console.log(formatPerson(bob)); // Name: Bob, Age: 25
const products = [
    { id: 1, name: "Laptop", price: 999, inStock: true },
    { id: 2, name: "Mouse", price: 25, inStock: false },
    { id: 3, name: "Keyboard", price: 75, inStock: true },
];
console.log(getInStockProducts(products).map(p => p.name)); // ["Laptop", "Keyboard"]
