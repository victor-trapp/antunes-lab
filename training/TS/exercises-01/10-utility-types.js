"use strict";
/**
 * Exercise 10: Utility Types
 *
 * TypeScript ships built-in utility types that transform existing types.
 * Common ones: Partial, Required, Readonly, Pick, Omit, Record.
 */
UserWithoutId = // your code here
    // TODO: Using the `Partial` utility type, define a type `UserUpdate`
    // where all User fields are optional (for update/patch operations).
    type;
UserUpdate = // your code here
    // TODO: Using the `Record` utility type, define a type `UserMap`
    // that maps a string key to a User value.
    type;
UserMap = // your code here
    // TODO: Complete this function that takes a User and returns a UserPreview
    // (only id and name).
    function toPreview(user) {
        // your code here
    };
// TODO: Complete this function that takes a UserMap and a string key,
// and returns the user's name, or "unknown" if the key doesn't exist.
function lookupName(map, key) {
    // your code here
}
// TODO: Complete this function that applies a UserUpdate patch to a User
// and returns the updated User (spread the original, then the patch).
function applyUpdate(user, update) {
    // your code here
}
// --- Tests (do not modify) ---
const user = { id: 1, name: "Alice", email: "alice@example.com", age: 30 };
console.log(toPreview(user)); // { id: 1, name: "Alice" }
const userMap = {
    alice: { id: 1, name: "Alice", email: "alice@example.com", age: 30 },
    bob: { id: 2, name: "Bob", email: "bob@example.com", age: 25 },
};
console.log(lookupName(userMap, "alice")); // "Alice"
console.log(lookupName(userMap, "eve")); // "unknown"
const updated = applyUpdate(user, { name: "Alicia", age: 31 });
console.log(updated); // { id: 1, name: "Alicia", email: "alice@example.com", age: 31 }
