import axios from "axios";
import { EnvConfig } from "../../config/EnvConfig";
import { AUTH_PAGE_PATH, ERROR_MESSAGES, UNAUTHORIZED_STATUS_CODE } from "../../constant/constant";
import { clearLocalSessionStorage, getDataFromSecureCookie } from "../helper/helper";

const VITE_ENVIRONMENT = EnvConfig.VITE_ENVIRONMENT;
const BACKEND_BASE_URL = EnvConfig.BACKEND_BASE_URL;

export const ErrorHandler = (error) => {
  if (axios.isAxiosError(error)) {
    const errorData = {
      success: error?.response?.data?.detail?.success ?? false,
      message: error?.response?.data?.detail?.message ?? ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      data: error?.response?.data?.detail?.data ?? null,
    };
    return errorData;
  } else {
    const errorData = {
      success: false,
      message: "An unknown error occurred",
      data: null,
    };
    return errorData;
  }
};

const multipleFetchApiErrorHandler = (error) => {
  if (VITE_ENVIRONMENT == "DEVELOPMENT") {
    return ErrorHandler(error);
  } else {
    const status = error?.response?.status || error?.status;
    if (UNAUTHORIZED_STATUS_CODE.includes(status)) {
      window.location.href = AUTH_PAGE_PATH;
      return { success: false, message: ERROR_MESSAGES?.UNAUTHORIZED, data: null };
    } else if (!status && error?.message?.includes("Network")) {
      clearLocalSessionStorage();
      window.location.href = AUTH_PAGE_PATH;
      return { success: false, message: ERROR_MESSAGES?.UNAUTHORIZED, data: null };
    } else {
      return ErrorHandler(error);
    }
  }
};

export const multipleApi = async (endPointArr) => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const authToken = `Bearer ${getDataFromSecureCookie("authenticationToken")}`;

      const headers = eachEndPoint?.header
        ? eachEndPoint.header
        : {
            "Content-Type": "application/json",
            Authorization: authToken,
          };

      if (!headers?.Authorization) {
        headers.Authorization = authToken;
      }
      const url = `${BACKEND_BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: eachEndPoint.method,
        url,
        headers: headers,
        data: eachEndPoint.data,
      };

      try {
        const res = await axios(config);
        return res?.data ?? { success: false, message: ERROR_MESSAGES?.NO_RESPONSE_FROM_BACKEND, data: null };
      } catch (error) {
        return multipleFetchApiErrorHandler(error);
      }
    } else {
      const url = `${BACKEND_BASE_URL}/${eachEndPoint.endPoint}`;
      console.log(url);
      const config = {
        method: eachEndPoint.method,
        url,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data ?? { success: false, message: ERROR_MESSAGES?.NO_RESPONSE_FROM_BACKEND, data: null };
      } catch (error) {
        return multipleFetchApiErrorHandler(error);
      }
    }
  });

  // Wait for all promises to resolve
  return await Promise.all(promises);
};
