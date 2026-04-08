/**
 * Exercise 8: Type Aliases & Intersection Types
 *
 * Type aliases let you name complex types.
 * Intersection types combine multiple types into one.
 */

// TODO: Define a type alias `Coordinates` as an object with:
//   x: number, y: number
type Coordinates = {
  x: number;
  y: number;
} 

// TODO: Define a type alias `Named` as an object with:
//   name: string
type Named = {
  name: string
} 

// TODO: Define a type alias `NamedPoint` as the intersection of Coordinates and Named
type NamedPoint = Coordinates & Named

// TODO: Define a type alias `ID` that can be either a string or a number
type ID = string | number

// TODO: Complete this function that takes two Coordinates and
// returns the distance between them (use Math.sqrt and Math.pow)
function distance(a: Coordinates, b: Coordinates): number {
  const distance = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  return distance
}

// TODO: Complete this function that takes an ID and returns
// a string: "string-id:<value>" or "number-id:<value>"
function formatId(id: ID): string {
  if (typeof id === "string") {
    return `string-id:${id}`;
  } else {
    return `number-id:${id}`;
  }
}
// TODO: Complete this function that takes a NamedPoint and returns
// a formatted string: "<name> at (x, y)"
function describePoint(point: NamedPoint): string {
  return `${point.name} at (${point.x}, ${point.y})`;
}

// --- Tests (do not modify) ---
const orig: Coordinates = { x: 0, y: 0 };
const point: Coordinates = { x: 3, y: 4 };
console.log(distance(orig, point)); // 5

console.log(formatId("abc-123"));     // "string-id:abc-123"
console.log(formatId(42));            // "number-id:42"

const namedPoint: NamedPoint = { x: 1, y: 2, name: "Home" };
console.log(describePoint(namedPoint)); // "Home at (1, 2)"
