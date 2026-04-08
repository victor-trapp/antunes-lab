"use strict";
/**
 * Exercise 7: Enums
 *
 * Enums let you define a set of named constants.
 * TypeScript supports both numeric and string enums.
 */
// TODO: Define a numeric enum `Direction` with values:
// Up, Down, Left, Right (default numeric values starting at 0)
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
// TODO: Define a string enum `Status` with values:
// Pending = "PENDING", Active = "ACTIVE", Inactive = "INACTIVE"
var Status;
(function (Status) {
    Status["Pending"] = "PENDING";
    Status["Active"] = "ACTIVE";
    Status["Inactive"] = "INACTIVE";
})(Status || (Status = {}));
// TODO: Complete this function that takes a Direction and returns
// the opposite direction (Up<->Down, Left<->Right)
function opposite(dir) {
    switch (dir) {
        case Direction.Up:
            return Direction.Down;
        case Direction.Down:
            return Direction.Up;
        case Direction.Left:
            return Direction.Right;
        case Direction.Right:
            return Direction.Left;
    }
}
// TODO: Complete this function that takes a Status and returns
// true if the status is Active, false otherwise
function isActive(status) {
    return status === Status.Active;
}
// TODO: Complete this function that takes an array of Status values
// and returns only the Active ones
function getActiveItems(statuses) {
    const result = [];
    for (const status of statuses) {
        if (status === Status.Active) {
            result.push(status);
        }
    }
    return result;
}
// --- Tests (do not modify) ---
console.log(Direction.Up); // 0
console.log(Direction.Down); // 1
console.log(Direction.Left); // 2
console.log(Direction.Right); // 3
console.log(Status.Pending); // "PENDING"
console.log(Status.Active); // "ACTIVE"
console.log(Status.Inactive); // "INACTIVE"
console.log(opposite(Direction.Up)); // 1 (Down)
console.log(opposite(Direction.Left)); // 3 (Right)
console.log(isActive(Status.Active)); // true
console.log(isActive(Status.Pending)); // false
const statuses = [Status.Active, Status.Pending, Status.Active, Status.Inactive];
console.log(getActiveItems(statuses)); // ["ACTIVE", "ACTIVE"]
