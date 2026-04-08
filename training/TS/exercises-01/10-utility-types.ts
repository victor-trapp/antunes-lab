/**
 * Exercise 10: Utility Types
 *
 * TypeScript ships built-in utility types that transform existing types.
 * Common ones: Partial, Required, Readonly, Pick, Omit, Record.
 */

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// TODO: Using the `Pick` utility type, define a type `UserPreview`
// that only contains `id` and `name` from User.
type UserPreview = Pick<User, "id" | "name">;

// TODO: Using the `Omit` utility type, define a type `UserWithoutId`
// that contains all User fields except `id`.
type UserWithoutId = Omit<User, "id">;

// TODO: Using the `Partial` utility type, define a type `UserUpdate`
// where all User fields are optional (for update/patch operations).
type UserUpdate = Partial<User>;

// TODO: Using the `Record` utility type, define a type `UserMap`
// that maps a string key to a User value.
type UserMap = Record<string, User>;

// TODO: Complete this function that takes a User and returns a UserPreview
// (only id and name).
function toPreview(user: User): UserPreview {
  return { id: user.id, name: user.name };
}

// TODO: Complete this function that takes a UserMap and a string key,
// and returns the user's name, or "unknown" if the key doesn't exist.
function lookupName(map: UserMap, key: string): string {
  return map[key]?.name ?? "unknown";
}

// TODO: Complete this function that applies a UserUpdate patch to a User
// and returns the updated User (spread the original, then the patch).
function applyUpdate(user: User, update: UserUpdate): User {
  return { ...user, ...update };
}

// --- Tests (do not modify) ---
const user: User = { id: 1, name: "Alice", email: "alice@example.com", age: 30 };

console.log(toPreview(user));           // { id: 1, name: "Alice" }

const userMap: UserMap = {
  alice: { id: 1, name: "Alice", email: "alice@example.com", age: 30 },
  bob:   { id: 2, name: "Bob",   email: "bob@example.com",   age: 25 },
};
console.log(lookupName(userMap, "alice")); // "Alice"
console.log(lookupName(userMap, "eve"));   // "unknown"

const updated = applyUpdate(user, { name: "Alicia", age: 31 });
console.log(updated); // { id: 1, name: "Alicia", email: "alice@example.com", age: 31 }
