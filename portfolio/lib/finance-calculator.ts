export type MoneyItem = { label: string; amount: number };

export type Debt = {
  name: string;
  balance: number; // current balance
  minPayment: number; // minimum monthly payment
  apr: number; // APR %
};

export type PayoffPerDebt = {
  name: string;
  monthsToPayOff: number | null;
};

export type PayoffResult = {
  monthsToDebtFree: number | null;
  perDebt: PayoffPerDebt[];
  warnings: string[];
};

export function sumAmounts(items: MoneyItem[]): number {
  return items.reduce(
    (sum, i) => sum + (Number.isFinite(i.amount) ? i.amount : 0),
    0
  );
}

function clampNumber(n: unknown, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function monthlyRateFromApr(apr: number) {
  const a = clampNumber(apr, 0);
  return a <= 0 ? 0 : a / 100 / 12;
}

function sortDebtsAvalanche(debts: Debt[]) {
  const copy = [...debts];
  copy.sort((a, b) => (b.apr - a.apr) || (b.balance - a.balance));
  return copy;
}

export function simulatePayoff(
  debtsInput: Debt[],
  extraPayment: number
): PayoffResult {
  const warnings: string[] = [];

  const empty: PayoffResult = { monthsToDebtFree: null, perDebt: [], warnings };

  if (!Array.isArray(debtsInput) || debtsInput.length === 0) {
    warnings.push("No debts entered.");
    return empty;
  }

  const cleaned: Debt[] = debtsInput
    .map((d) => ({
      name: String(d.name ?? "Debt"),
      balance: Math.max(0, clampNumber(d.balance, 0)),
      minPayment: Math.max(0, clampNumber(d.minPayment, 0)),
      apr: Math.max(0, clampNumber(d.apr, 0)),
    }))
    .filter((d) => d.balance > 0.0001);

  if (cleaned.length === 0) {
    warnings.push("All debts have a balance of 0.");
    return empty;
  }

  const extra = Math.max(0, clampNumber(extraPayment, 0));

  const monthsToPayOffMap = new Map<string, number | null>();
  cleaned.forEach((d) => monthsToPayOffMap.set(d.name, null));

  let debts: Debt[] = cleaned.map((d) => ({ ...d }));

  const MAX_MONTHS = 600;
  let month = 0;

  // warning: if all min payments are zero and extra is zero → impossible
  const totalMin = debts.reduce((s, d) => s + d.minPayment, 0);
  if (totalMin <= 0 && extra <= 0) {
    warnings.push(
      "Minimum payments and extra payment are both 0 — debts will never reduce."
    );
    return empty;
  }

  while (month < MAX_MONTHS) {
    month += 1;

    // 1) Apply interest
    debts = debts.map((d) => {
      const r = monthlyRateFromApr(d.apr);
      const interest = d.balance * r;
      return { ...d, balance: d.balance + interest };
    });

    // 2) Pay minimums 
    let remainingExtra = extra;

    for (const d of debts) {
      if (d.balance <= 0) continue;
      const pay = Math.min(d.balance, d.minPayment);
      d.balance = d.balance - pay;
    }

    // 3) Apply extra to priority debt
    const ordered = sortDebtsAvalanche(debts);
    const target = ordered.find((d) => d.balance > 0.0001);

    if (target && remainingExtra > 0) {
      const pay = Math.min(target.balance, remainingExtra);
      target.balance = target.balance - pay;
      remainingExtra -= pay;
    }

    // 4) Record payoffs for any debt that just hit zero
    for (const d of debts) {
      if (d.balance <= 0.0001) {
        d.balance = 0;
        if (monthsToPayOffMap.get(d.name) === null) {
          monthsToPayOffMap.set(d.name, month);
        }
      }
    }

    // 5) All cleared?
    const stillOwing = debts.some((d) => d.balance > 0.0001);
    if (!stillOwing) {
      const perDebt: PayoffPerDebt[] = cleaned.map((d) => ({
        name: d.name,
        monthsToPayOff: monthsToPayOffMap.get(d.name) ?? null,
      }));

      return {
        monthsToDebtFree: month,
        perDebt,
        warnings,
      };
    }

    // warning: min payment might not cover interest for some debts
    if (month === 1) {
      const bad = debts.filter((d) => {
        const r = monthlyRateFromApr(d.apr);
        const interestOnly = d.balance * r;
        return d.minPayment > 0 && d.minPayment <= interestOnly && extra <= 0;
      });

      if (bad.length > 0) {
        warnings.push(
          "Some minimum payments may not cover monthly interest. Consider adding extra payment."
        );
      }
    }
  }

  warnings.push(
    "Payoff simulation exceeded the max timeline. Check your inputs/payment amounts."
  );

  const perDebt: PayoffPerDebt[] = cleaned.map((d) => ({
    name: d.name,
    monthsToPayOff: monthsToPayOffMap.get(d.name) ?? null,
  }));

  return {
    monthsToDebtFree: null,
    perDebt,
    warnings,
  };
}
