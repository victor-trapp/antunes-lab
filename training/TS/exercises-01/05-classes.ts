/**
 * Exercise 5: Classes
 *
 * TypeScript classes support access modifiers (public, private, readonly)
 * and can implement interfaces.
 */

// TODO: Create a class `BankAccount` with:
//   - private property `balance: number` (starts at 0)
//   - readonly property `owner: string` (set in constructor)
//   - method `deposit(amount: number): void` — adds amount to balance (ignore negatives)
//   - method `withdraw(amount: number): boolean` — subtracts amount if funds are sufficient,
//     returns true on success, false if insufficient funds
//   - method `getBalance(): number` — returns current balance

// TODO: Create a class `SavingsAccount` that extends `BankAccount` with:
//   - private property `interestRate: number` (set in constructor, e.g. 0.05 for 5%)
//   - method `applyInterest(): void` — adds balance * interestRate to balance

class BankAccount {
  private balance: number = 0;
  readonly owner: string;

  constructor(owner: string) {
    this.owner = owner;
  }

  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  withdraw(amount: number): boolean {
    if (amount <= this.balance) {
      this.balance -= amount;
      return true;
    }

    return false;
  }

  getBalance(): number {
    return this.balance;
  }
}

class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(owner: string, interestRate: number) {
    super(owner);
    this.interestRate = interestRate;
  }

  applyInterest(): void {
    const interest = this.getBalance() * this.interestRate;
    this.deposit(interest);
  }
}

// --- Tests (do not modify) ---
const account = new BankAccount("Alice");
account.deposit(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.withdraw(30)); // true
console.log(account.getBalance()); // 120
console.log(account.withdraw(200)); // false
console.log(account.getBalance()); // 120
console.log(account.owner);        // Alice

const savings = new SavingsAccount("Bob", 0.1);
savings.deposit(200);
savings.applyInterest();
console.log(savings.getBalance()); // 220
