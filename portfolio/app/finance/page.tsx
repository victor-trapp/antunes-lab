"use client";

import React, { useMemo, useState } from "react";
import { simulatePayoff, sumAmounts, type Debt } from "@/lib/finance-calculator";

type MoneyItem = { label: string; amount: number };

function monthLabelFromNow(monthsFromNow: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export default function FinanceCalculator() {
  const [income, setIncome] = useState<MoneyItem[]>([
    { label: "Salary", amount: 0 },
  ]);

  const [expenses, setExpenses] = useState<MoneyItem[]>([
    { label: "Rent", amount: 0 },
  ]);

  const [debts, setDebts] = useState<Debt[]>([
    { name: "Credit Card", balance: 500, minPayment: 0, apr: 19.9 },
  ]);

  const [extra, setExtra] = useState<number>(0);

  const totalIncome = useMemo(() => sumAmounts(income), [income]);
  const totalExpenses = useMemo(() => sumAmounts(expenses), [expenses]);

  const totalMinDebtPayments = useMemo(
    () =>
      debts.reduce(
        (s, d) => s + (Number.isFinite(d.minPayment) ? d.minPayment : 0),
        0
      ),
    [debts]
  );

  const disposable = useMemo(
    () => totalIncome - totalExpenses - totalMinDebtPayments,
    [totalIncome, totalExpenses, totalMinDebtPayments]
  );

  const effectiveExtra = Math.max(0, extra);

  const payoff = useMemo(
    () => simulatePayoff(debts, effectiveExtra),
    [debts, effectiveExtra]
  );

  const warnings = payoff?.warnings ?? [];
  const perDebt = payoff?.perDebt ?? [];

  const updateIncome = (idx: number, patch: Partial<MoneyItem>) =>
    setIncome((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    );

  const updateExpense = (idx: number, patch: Partial<MoneyItem>) =>
    setExpenses((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    );

  const updateDebt = (idx: number, patch: Partial<Debt>) =>
    setDebts((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    );

  const removeIncome = (idx: number) =>
    setIncome((p) => p.filter((_, i) => i !== idx));
  const removeExpense = (idx: number) =>
    setExpenses((p) => p.filter((_, i) => i !== idx));
  const removeDebt = (idx: number) =>
    setDebts((p) => p.filter((_, i) => i !== idx));

  const addIncome = () =>
    setIncome((p) => [...p, { label: "New income", amount: 0 }]);
  const addExpense = () =>
    setExpenses((p) => [...p, { label: "New expense", amount: 0 }]);
  const addDebt = () =>
    setDebts((p) => [
      ...p,
      { name: "New debt", balance: 0, minPayment: 0, apr: 0 },
    ]);

  // Theme helpers
  const card =
    "group relative rounded-2xl border border-white/10 bg-[#0b0616]/70 backdrop-blur-md shadow-[0_18px_50px_rgba(6,2,18,0.45)]";
  const glow =
    "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-200 before:rounded-2xl before:bg-[radial-gradient(500px_circle_at_20%_20%,rgba(112,66,248,0.25),transparent_40%),radial-gradient(500px_circle_at_80%_80%,rgba(34,211,238,0.18),transparent_40%)] group-hover:before:opacity-100";
  const accentBar =
    "mb-4 h-[2px] w-12 bg-gradient-to-r from-purple-400/80 to-cyan-400/70";
  const inputBase =
    "min-w-0 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/25";
  const buttonAdd =
    "rounded-lg border border-white/10 bg-gradient-to-r from-purple-500/15 to-cyan-500/10 px-3 py-1 text-sm text-gray-200 transition hover:from-purple-500/25 hover:to-cyan-500/20";
  const buttonX =
    "rounded-lg border border-white/10 bg-black/10 text-gray-300 transition hover:bg-white/5 hover:text-white";

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-5xl px-6 pb-10 pt-28 md:pt-32">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Finance Calculator (In Construction...)
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Enter your monthly numbers. Nothing is saved — this is just a quick
            planner. :D
          </p>
        </div>

        {/* Totals */}
        <div className={`${card} ${glow} p-6`}>
          <div className={accentBar} />
          <h2 className="text-lg font-semibold text-white">Monthly overview</h2>

          <div className="mt-2 grid gap-2 text-sm text-gray-200 sm:grid-cols-2">
            <div className="flex items-center justify-between">
              <span>Total income</span>
              <span className="font-medium text-white">
                £{totalIncome.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Total expenses</span>
              <span className="font-medium text-white">
                £{totalExpenses.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Min debt payments</span>
              <span className="font-medium text-white">
                £{totalMinDebtPayments.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Disposable after mins</span>
              <span
                className={`font-semibold ${
                  disposable >= 0 ? "text-emerald-300" : "text-red-300"
                }`}
              >
                £{disposable.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Income */}
          <div className={`${card} ${glow} p-5`}>
            <div className={accentBar} />
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">Income</h3>
              <button onClick={addIncome} className={buttonAdd}>
                + Add
              </button>
            </div>

            <div className="grid gap-3">
              {income.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_110px_40px] gap-2 items-center"
                >
                  <input
                    value={row.label}
                    onChange={(e) =>
                      updateIncome(idx, { label: e.target.value })
                    }
                    className={inputBase}
                  />
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      updateIncome(idx, { amount: Number(e.target.value) })
                    }
                    className={inputBase}
                  />
                  <button
                    onClick={() => removeIncome(idx)}
                    className={`${buttonX} h-10 w-10`}
                    aria-label="Remove income row"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div className={`${card} ${glow} p-5`}>
            <div className={accentBar} />
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">Bills / expenses</h3>
              <button onClick={addExpense} className={buttonAdd}>
                + Add
              </button>
            </div>

            <div className="grid gap-3">
              {expenses.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_110px_40px] gap-2 items-center"
                >
                  <input
                    value={row.label}
                    onChange={(e) =>
                      updateExpense(idx, { label: e.target.value })
                    }
                    className={inputBase}
                  />
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      updateExpense(idx, { amount: Number(e.target.value) })
                    }
                    className={inputBase}
                  />
                  <button
                    onClick={() => removeExpense(idx)}
                    className={`${buttonX} h-10 w-10`}
                    aria-label="Remove expense row"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Debts */}
          <div className={`${card} ${glow} p-5`}>
            <div className={accentBar} />
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">Debts</h3>
              <button onClick={addDebt} className={buttonAdd}>
                + Add
              </button>
            </div>

            <div className="grid gap-3">
              {debts.map((d, idx) => (
                <div
                  key={idx}
                  className="grid gap-2 rounded-xl border border-white/10 bg-black/10 p-3 min-w-0"
                >
                  <div className="grid grid-cols-[1fr_40px] gap-2 items-center min-w-0">
                    <input
                      value={d.name}
                      onChange={(e) =>
                        updateDebt(idx, { name: e.target.value })
                      }
                      className={inputBase}
                      placeholder="Debt name"
                    />
                    <button
                      onClick={() => removeDebt(idx)}
                      className={`${buttonX} h-10 w-10`}
                      aria-label="Remove debt"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                    <div className="min-w-0">
                      <label className="text-xs text-gray-400">Balance</label>
                      <input
                        type="number"
                        value={d.balance}
                        onChange={(e) =>
                          updateDebt(idx, { balance: Number(e.target.value) })
                        }
                        className={`mt-1 ${inputBase}`}
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-xs text-gray-400">Min / month</label>
                      <input
                        type="number"
                        value={d.minPayment}
                        onChange={(e) =>
                          updateDebt(idx, { minPayment: Number(e.target.value) })
                        }
                        className={`mt-1 ${inputBase}`}
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-xs text-gray-400">APR %</label>
                      <input
                        type="number"
                        value={d.apr}
                        onChange={(e) =>
                          updateDebt(idx, { apr: Number(e.target.value) })
                        }
                        className={`mt-1 ${inputBase}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payoff */}
        <div className={`mt-8 ${card} ${glow} p-6`}>
          <div className={accentBar} />

          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">
              Debt payoff estimate
            </h2>
            <p className="mt-1 text-sm text-gray-300">
              Add an extra monthly payment to see an estimated timeline.
            </p>
          </div>

          <div className="mt-5 flex justify-center">
            <label className="flex flex-col items-center gap-2 text-sm text-gray-200">
              <span>Extra / month</span>
              <input
                type="number"
                value={extra}
                onChange={(e) => setExtra(Number(e.target.value))}
                className={`w-40 text-center ${inputBase}`}
              />
            </label>
          </div>

          <div className="mt-6 grid gap-2 text-sm text-gray-200">
            <div className="text-center">
              Months to debt-free:{" "}
              <span className="font-semibold text-white">
                {payoff?.monthsToDebtFree === null
                  ? "N/A"
                  : payoff?.monthsToDebtFree}
              </span>

              {typeof payoff?.monthsToDebtFree === "number" && (
                <span className="ml-2 text-gray-400">
                  (approx {monthLabelFromNow(payoff.monthsToDebtFree)})
                </span>
              )}
            </div>

            {warnings.length > 0 && (
              <div className="mt-2 rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-3 text-yellow-100">
                <div className="font-semibold">Note</div>
                <ul className="mt-1 list-disc pl-5">
                  {warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-semibold text-white">Per debt</h3>
              <ul className="mt-2 grid gap-1">
                {perDebt.map((d) => (
                  <li
                    key={d.name}
                    className="flex justify-between border-b border-white/5 py-2"
                  >
                    <span>{d.name}</span>
                    <span className="font-medium text-white">
                      {d.monthsToPayOff ?? "N/A"}
                      {typeof d.monthsToPayOff === "number"
                        ? ` mo (${monthLabelFromNow(d.monthsToPayOff)})`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              This is a learning project and an estimate (not financial advice).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
