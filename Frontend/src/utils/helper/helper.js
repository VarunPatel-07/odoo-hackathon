import validator from "validator";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { EnvConfig } from "../../config/EnvConfig";

const VITE_ENVIRONMENT = EnvConfig.VITE_ENVIRONMENT;
const ENCRYPTION_KEY = EnvConfig.ENCRYPTION_KEY;

export const isValidEmail = (email) => {
  const isValid = validator.isEmail(email);
  return isValid;
};
export const classNames = (defaultClass, conditionBasedClass) => {
  return `${defaultClass} ${Object.keys(conditionBasedClass)
    .filter((key) => conditionBasedClass[key])
    .join(" ")}`;
};

const getCookieConfig = () => {
  const isProd = VITE_ENVIRONMENT === "PRODUCTION";

  return {
    secure: isProd,
    sameSite: "Strict",
    path: "/",
    ...(isProd && {
      domain:
        VITE_ENVIRONMENT === "PRODUCTION"
          ? "app.orbitrms.com"
          : VITE_ENVIRONMENT === "BETA-STAGING"
          ? "beta-staging.orbitrms.com"
          : "localhost",
    }),
  };
};

// here we are writing the function that will store the auth token and every thing in the cookie for the production
export const storeDataInSecureCookie = (
  _data,
  key,
  is_persistent,
  expire,
  encrypted = VITE_ENVIRONMENT == "PRODUCTION" ? true : false
) => {
  if (!key) {
    console.error("the key is required to store the data");
    return;
  }

  const cookieConfig = getCookieConfig();

  Cookies.remove(key, cookieConfig);

  let dataToStore;
  if (encrypted) {
    _data = typeof _data == "object" ? JSON.stringify(_data) : _data;

    dataToStore = CryptoJS.AES.encrypt(_data, ENCRYPTION_KEY).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }

  if (is_persistent === true) {
    cookieConfig.expires = expire ?? 30;
  }

  Cookies.set(key, dataToStore, cookieConfig);
};

export const getDataFromSecureCookie = (key, encrypted = VITE_ENVIRONMENT == "PRODUCTION" ? true : false) => {
  try {
    const cookieStorageData = Cookies.get(key);

    if (!cookieStorageData) return null;

    if (encrypted) {
      if (!ENCRYPTION_KEY) throw new Error("Encryption key is required for decryption");

      const decryptedData = CryptoJS.AES.decrypt(cookieStorageData, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

      if (key != "authenticationToken") {
        return JSON.parse(decryptedData);
      } else {
        return decryptedData;
      }
    }

    return JSON.parse(cookieStorageData);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return null;
  }
};

export const removeDataFromSecureCookie = (key) => {
  if (!key) {
    console.error("the key is required to store the data");
    return;
  }

  const cookieConfig = getCookieConfig();

  Cookies.remove(key, cookieConfig);
};

export const storeDataInLocalStorage = (_data, key, encrypted = VITE_ENVIRONMENT == "PRODUCTION" ? true : false) => {
  if (!key) {
    console.error("the key is required to store the data");
    return;
  }
  let dataToStore;
  if (encrypted) {
    _data = typeof _data == "object" ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, ENCRYPTION_KEY).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  localStorage.setItem(key, dataToStore);
};

//  * To Handel The Error From The One Place.

export const getDataFromLocalStorage = (key, encrypted = VITE_ENVIRONMENT == "PRODUCTION" ? true : false) => {
  try {
    const localStorageData = localStorage.getItem(key);
    if (!localStorageData) return null;

    if (encrypted) {
      if (!ENCRYPTION_KEY) throw new Error("Encryption key is required for decryption");
      const decryptedData = CryptoJS.AES.decrypt(localStorageData, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      if (key != "authenticationToken") {
        return JSON.parse(decryptedData);
      } else {
        return decryptedData;
      }
    }

    return JSON.parse(localStorageData);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return null;
  }
};
export const removeDataFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
// * to clear local storage all the value form it
export const clearLocalSessionStorage = () => {
  localStorage.clear();
  sessionStorage.clear();

  const cookieConfig = getCookieConfig();
  console.log(cookieConfig);
  Object.keys(Cookies.get()).forEach((cookieName) => {
    console.log(cookieName);
    Cookies.remove(cookieName, cookieConfig);
  });
};

export const storeDataInSessionStorage = (
  _data,
  key,
  encrypted = VITE_ENVIRONMENT == "PRODUCTION" ? true : false
) => {
  if (!key) {
    console.error("the key is required to store the data");
    return;
  }
  let dataToStore;
  if (encrypted) {
    _data = typeof _data == "object" ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, ENCRYPTION_KEY).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  sessionStorage.setItem(key, dataToStore);
};

export const getDataFromTheSessionStorage = (key, encrypted = VITE_ENVIRONMENT == "PRODUCTION" ? true : false) => {
  const sessionStorageData = sessionStorage.getItem(key);
  if (!sessionStorageData) return null;
  if (encrypted) {
    if (!ENCRYPTION_KEY) throw new Error("Encryption key is required for decryption");
    const decryptedData = CryptoJS.AES.decrypt(sessionStorageData, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    if (key != "authenticationToken") {
      return JSON.parse(decryptedData);
    } else {
      return decryptedData;
    }
  }
  return JSON.parse(sessionStorageData);
};

export const formateDate = (UTCString, default_dateformat = "DD-MMM-Y", showTime = true) => {
  const date = new Date(UTCString + "Z");
  const year = date.getFullYear();
  const twoDigitYear = year % 100;
  const month = date.getMonth();
  const day = date.getDate();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const replacements = {
    YYYY: `${year}`,
    MMM: monthNames[month],
    YY: twoDigitYear <= 9 ? `0${twoDigitYear}` : `${twoDigitYear}`,
    MM: month + 1 <= 9 ? `0${month + 1}` : `${month + 1}`,
    Y: `${year}`,
    DD: day <= 9 ? `0${day}` : `${day}`,
    D: `${day}`,
    M: `${month + 1}`,
  };

  const tokenOrder = ["YYYY", "MMM", "YY", "MM", "Y", "DD", "D", "M"];

  let formattedDate = default_dateformat;

  for (const token of tokenOrder) {
    const regex = new RegExp(`\\b${token}\\b`, "g");
    formattedDate = formattedDate?.replace(regex, replacements[token]);
  }

  if (showTime) {
    const creationTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    formattedDate += `, ${creationTime.toUpperCase()}`;
  }

  return formattedDate;
};
