import "react-native-get-random-values";

import * as Localization from "expo-localization";

import { de, en } from "date-fns/locale";

import format from "date-fns/format";
import { v4 as uuidv4 } from "uuid";

const locale = (() => {
  if (Localization.locale.startsWith("de")) {
    return de;
  } else {
    return en;
  }
})();

export const generateId = uuidv4;

export const formatMoney = (money) => {
  if (money == null) return "-";
  return (Math.round(money * 100) / 100).toFixed(2);
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
