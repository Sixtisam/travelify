import { getRateToTripBase } from "./hooks";

export const calcDebts = (trip) => {
  const debts = simplifyDebts(trip);
  const transactions = calcOptimalBalancingTransactions(debts, 0);
  return simplifyTransactions(transactions);
};

const calcOptimalBalancingTransactions = (debts, curr) => {
  while (curr < debts.length && debts[curr][1] === 0) {
    curr++;
  }
  if (curr === debts.length) {
    return [];
  }

  let minTransactions = null;
  let minTxLength = Number.MAX_SAFE_INTEGER;
  for (let i = curr + 1; i < debts.length; i++) {
    // if there is an inbalance between both
    if (debts[i][1] * debts[curr][1] < 0) {
      debts[i][1] += debts[curr][1];
      const transactions = calcOptimalBalancingTransactions(debts, curr + 1);
      if (transactions.length + 1 <= minTxLength) {
        const newTxs = transactions.concat([{ from: debts[curr][0], to: debts[i][0], amount: debts[curr][1] }]);
        minTransactions = pickBetterTransactionList(minTransactions || newTxs, newTxs);
        minTxLength = minTransactions.length;
      }
      debts[i][1] -= debts[curr][1];
    }
  }
  return minTransactions || [];
};

const pickBetterTransactionList = (txs1, txs2) => {
  if (txs2.length < txs1.length) {
    return txs2;
  } else if (txs1.length < txs2.length) {
    return txs1;
  }
  const transferredMoneyTxs1 = txs1.reduce((sum, curr) => sum + Math.abs(curr.amount), 0);
  const transferredMoneyTxs2 = txs2.reduce((sum, curr) => sum + Math.abs(curr.amount), 0);
  if (transferredMoneyTxs2 < transferredMoneyTxs1) {
    return txs2;
  } else {
    return txs1;
  }
};

const simplifyDebts = (trip) => {
  const debtsMap = {};
  Object.values(trip.expenses).forEach((expense) => {
    const creditor = expense.mateId;
    const rateToTripBase = getRateToTripBase(trip, expense.currency);
    Object.entries(expense.shares).forEach(([debitor, amount]) => {
      debtsMap[creditor] = (debtsMap[creditor] || 0.0) - amount * rateToTripBase;
      debtsMap[debitor] = (debtsMap[debitor] || 0.0) + amount * rateToTripBase;
    });
  });
  const debts = Object.entries(debtsMap);
  debts.sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]));
  return debts;
};

const simplifyTransactions = (transactions) => {
  return transactions.map((tx) => {
    if (tx.amount < 0) {
      return {
        from: tx.to,
        to: tx.from,
        amount: -tx.amount,
      };
    } else {
      return tx;
    }
  });
};
