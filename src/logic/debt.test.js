import { calcDebts } from "./calc-debts";

describe("calcDebts", () => {
  it("easy", () => {
    const trip = {
      exchangeRates: {
        CHF: 1.0,
      },
      baseCurrency: "CHF",
      expenses: {
        "exp-a": {
          mateId: "mate-a",
          currency: "CHF",
          shares: {
            "mate-a": 50,
            "mate-b": 50,
          },
        },
        "exp-b": {
          mateId: "mate-b",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
          },
        },
        "exp-c": {
          mateId: "mate-c",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
          },
        },
      },
    };
    const txs = calcDebts(trip);
    expect(txs.length).toBe(2);
    expect(txs[0]).toEqual({ from: "mate-a", to: "mate-c", amount: 100 });
    expect(txs[1]).toEqual({ from: "mate-a", to: "mate-b", amount: 50 });
  });
  it("cycle-easy", () => {
    const trip = {
      exchangeRates: {
        CHF: 1.0,
      },
      baseCurrency: "CHF",
      expenses: {
        "exp-a": {
          mateId: "mate-a",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
          },
        },
        "exp-b": {
          mateId: "mate-b",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
          },
        },
        "exp-c": {
          mateId: "mate-c",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
          },
        },
      },
    };
    const txs = calcDebts(trip);
    expect(txs.length).toBe(0);
  });
  it("medium-cycle", () => {
    const trip = {
      exchangeRates: {
        CHF: 1.0,
      },
      baseCurrency: "CHF",
      expenses: {
        "exp-a": {
          mateId: "mate-a",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
            "mate-d": 50,
          },
        },
        "exp-b": {
          mateId: "mate-b",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
            "mate-d": 50,
          },
        },
        "exp-c": {
          mateId: "mate-c",
          currency: "CHF",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
            "mate-d": 50,
          },
        },
      },
    };
    const txs = calcDebts(trip);
    expect(txs.length).toBe(3);
    expect(txs[0]).toEqual({ from: "mate-d", to: "mate-c", amount: 50 });
    expect(txs[1]).toEqual({ from: "mate-d", to: "mate-b", amount: 50 });
    expect(txs[2]).toEqual({ from: "mate-d", to: "mate-a", amount: 50 });
  });
  it("easy-two-currency", () => {
    const trip = {
      exchangeRates: {
        CHF: 1.0,
        EUR: 5.0,
      },
      baseCurrency: "CHF",
      expenses: {
        "exp-a": {
          mateId: "mate-b",
          currency: "EUR",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
          },
        },
      },
    };
    const txs = calcDebts(trip);
    expect(txs.length).toBe(2);
    expect(txs[0]).toEqual({ from: "mate-c", to: "mate-b", amount: 20 });
    expect(txs[1]).toEqual({ from: "mate-a", to: "mate-b", amount: 20 });
  });
  it("complex", () => {
    const trip = {
      exchangeRates: {
        CHF: 1.0,
        EUR: 0.5,
      },
      baseCurrency: "CHF",
      expenses: {
        "exp-a": {
          mateId: "mate-d",
          currency: "EUR",
          shares: {
            "mate-a": 100,
            "mate-b": 100,
            "mate-c": 100,
            "mate-d": 100,
            "mate-e": 100,
          },
        },
        "exp-b": {
          mateId: "mate-e",
          currency: "CHF",
          shares: {
            "mate-a": 500,
            "mate-b": 500,
            "mate-c": 500,
            "mate-d": 500,
            "mate-e": 500,
          },
        },
        "exp-c": {
          mateId: "mate-a",
          currency: "EUR",
          shares: {
            "mate-a": 300,
            "mate-b": 100,
            "mate-c": 200,
            "mate-d": 100,
            "mate-e": 500,
          },
        },
        "exp-d": {
          mateId: "mate-c",
          currency: "CHF",
          shares: {
            "mate-a": 50,
            "mate-c": 40,
            "mate-d": 70,
            "mate-e": 80,
          },
        },
        "exp-e": {
          mateId: "mate-b",
          currency: "CHF",
          shares: {
            "mate-a": 90,
            "mate-b": 60,
            "mate-d": 30,
            "mate-e": 10,
          },
        },
        "exp-f": {
          mateId: "mate-d",
          currency: "EUR",
          shares: {
            "mate-a": 70,
            "mate-b": 80,
            "mate-c": 90,
            "mate-e": 150,
          },
        },
        "exp-g": {
          mateId: "mate-c",
          currency: "EUR",
          shares: {
            "mate-a": 70,
            "mate-b": 80,
            "mate-c": 90,
            "mate-d": 100,
          },
        },
        "exp-h": {
          mateId: "mate-a",
          currency: "EUR",
          shares: {
            "mate-a": 70,
            "mate-b": 80,
            "mate-d": 100,
            "mate-e": 150,
          },
        },
        "exp-i": {
          mateId: "mate-e",
          currency: "CHF",
          shares: {
            "mate-b": 80,
            "mate-c": 90,
            "mate-d": 100,
            "mate-e": 150,
          },
        },
      },
    };
    const txs = calcDebts(trip);
    console.log(txs);
    expect(txs.length).toBe(4);
    expect(txs[0]).toEqual({ from: "mate-b", to: "mate-a", amount: 1330 });
    expect(txs[1]).toEqual({ from: "mate-c", to: "mate-a", amount: 10 });
    expect(txs[2]).toEqual({ from: "mate-c", to: "mate-e", amount: 380 });
    expect(txs[3]).toEqual({ from: "mate-c", to: "mate-d", amount: 280 });
  });
});
