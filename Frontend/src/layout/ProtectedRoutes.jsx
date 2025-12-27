import { Outlet, useNavigate } from "react-router-dom";
import { multipleApi } from "../utils/api/api";
import { clearLocalSessionStorage } from "../utils/helper/helper";
import { AUTH_PAGE_PATH } from "../constant/constant";
import { useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";

function ProtectedRoutes() {
  const navigate = useNavigate();

  const useEffectRef = useRef(false);

  const verifyUserWithDebounce = useDebounce(async () => {
    const endpoints = [
      {
        endPoint: "auth/verify-token/",
        protected: true,
        method: "GET",
      },
    ];
    const response = await multipleApi(endpoints);

    const res = response[0];
    if (!res?.success) {
      clearLocalSessionStorage();
      navigate(AUTH_PAGE_PATH);
    }
  }, 100);

  useEffect(() => {
    if (useEffectRef?.current) return;
    useEffectRef.current = true;
    verifyUserWithDebounce();
  }, [verifyUserWithDebounce]);
  return <Outlet />;
}

export default ProtectedRoutes;
