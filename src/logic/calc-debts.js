import { calcTotalMateCost } from "./hooks";

export function calcDebts(trip) {
  const mates = Object.values(trip.mates);
  let entireAmount = 0; // in trip.baseCurrency
  const matesWithTotalExpense = mates.map((mate) => {
    const totalMateExpense = calcTotalMateCost(mate, trip);
    entireAmount += totalMateExpense;
    return {
      id: mate.id,
      name: mate.name,
      totalExpense: totalMateExpense,
    };
  });

  // Goal: each mate has spent the same (aka the average)
  const averageExpense = entireAmount / mates.length;

  return matesWithTotalExpense.reduce((prevDebts, currMate) => {
    if (currMate.totalExpense < averageExpense) {
      // the mates with too less expenses will distribute money to the others
      return prevDebts.concat(distributeMoney(averageExpense - currMate.totalExpense, averageExpense, currMate.id, matesWithTotalExpense));
    } else {
      return prevDebts;
    }
  }, []);
}

function distributeMoney(amountToDistribute, averageExpense, mateIdToSkip, mates) {
  const debts = [];
  let remainingToSpend = amountToDistribute;
  for (let n in mates) {
    const mate = mates[n];
    if (mate.id === mateIdToSkip || mate.totalExpense <= averageExpense) {
      continue;
    }
    if (mate.totalExpense - averageExpense >= remainingToSpend) {
      // himself can give money to the other mate, but that other mate is still not at average
      debts.push({ from: mateIdToSkip, to: mate.id, amount: remainingToSpend });
      mate.totalExpense -= remainingToSpend;
      remainingToSpend = 0;
    } else {
      // calc how much money the other needs to be at average (the other one will be at average after the transfer)
      const needed = mate.totalExpense - averageExpense;
      debts.push({ from: mateIdToSkip, to: mate.id, amount: needed });
      mate.totalExpense -= needed;
      remainingToSpend -= needed;
    }

    // if himself has spent enough money to be at average, return early
    if (remainingToSpend === 0) break;
  }

  // check
  if (Math.abs(amountToDistribute - debts.reduce((prev, curr) => curr.amount + prev, 0)) > 0.000000001) {
    console.log(debts);
    console.log("to reach: ", amountToDistribute);
    console.log(
      "reached: ",
      debts.reduce((prev, curr) => curr.amount + prev, 0)
    );
    throw new Error("has not paid out all he needs to!");
  }

  return debts;
}
