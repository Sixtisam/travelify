import "react-native-get-random-values";

import * as Localization from "expo-localization";

import { de, en } from "date-fns/locale";

import format from "date-fns/format";
import uuid from "react-native-uuid";

const locale = (() => {
  if (Localization.locale.startsWith("de")) {
    return de;
  } else {
    return en;
  }
})();

export const generateId = () => uuid.v4();

export const formatMoney = (money, currency) => {
  if (money == null) return "-";
  const formatter = new Intl.NumberFormat(Localization.locale, { style: "currency", currency });
  return formatter.format((Math.round(money * 100) / 100).toFixed(2));
};

export const roundExchangeRate = (rate) => Math.round(rate * 100000) / 100000;

export const getCurrentTimestampSec = () => Math.round(Date.now() / 1000);

export const formatDateAsText = (secTimestamp) => {
  if (secTimestamp == null) return "-";
  return format(new Date(secTimestamp * 1000), "PPPP", { locale });
};

export const formatDateTime = (secTimestamp) => {
  if (secTimestamp == null) return "-";
  return format(new Date(secTimestamp * 1000), "P HH:mm", { locale, timeZone: Localization.timezone });
};
