/**
 * Exercise 9: Async / Promises
 *
 * TypeScript fully types async functions and Promises.
 * Use async/await to handle asynchronous operations cleanly.
 */

// Simulated async helpers — do not modify
function fetchUser(id: number): Promise<{ id: number; name: string }> {
  return new Promise(resolve =>
    setTimeout(() => resolve({ id, name: id === 1 ? "Alice" : "Bob" }), 10)
  );
}

function fetchScore(userId: number): Promise<number> {
  return new Promise(resolve =>
    setTimeout(() => resolve(userId === 1 ? 95 : 80), 10)
  );
}

function mayFail(succeed: boolean): Promise<string> {
  return new Promise((resolve, reject) =>
    setTimeout(() => (succeed ? resolve("ok") : reject(new Error("oops"))), 10)
  );
}

// TODO: Complete this async function that fetches a user by id
// and returns their name as a string.
async function getUserName(id: number): Promise<string> {
  return (await fetchUser(id)).name;
}

// TODO: Complete this async function that fetches a user AND their score
// in parallel (use Promise.all), then returns:
// "Alice scored 95"
async function getUserSummary(id: number): Promise<string> {
  const [user, score] = await Promise.all([fetchUser(id), fetchScore(id)]);
  return `${user.name} scored ${score}`;
}

// TODO: Complete this async function that calls mayFail(succeed).
// - If it resolves, return the value uppercased.
// - If it rejects, return "failed: <error message>".
async function safeCall(succeed: boolean): Promise<string> {
  if (succeed) {
    return (await mayFail(true)).toUpperCase();
  } else {
    try {
      await mayFail(false);
      return "unexpected success";
    } catch (error) {
      if (error instanceof Error) {
        return `failed: ${error.message}`;
      } else {
        return "failed: unknown error";
      }
    }
  }
}

// --- Tests (do not modify) ---
getUserName(1).then(console.log);       // "Alice"
getUserName(2).then(console.log);       // "Bob"

getUserSummary(1).then(console.log);    // "Alice scored 95"
getUserSummary(2).then(console.log);    // "Bob scored 80"

safeCall(true).then(console.log);       // "OK"
safeCall(false).then(console.log);      // "failed: oops"
