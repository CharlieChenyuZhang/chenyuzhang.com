import {
  BACKEND_DOMAIN_UAT,
  BACKEND_DOMAIN_PROD,
  BACKEND_DOMAIN_LOCALHOST,
} from "./constants";

export const backendDomain = () => {
  if (process.env.NODE_ENV === "development") {
    return BACKEND_DOMAIN_LOCALHOST;
  }

  return process.env.REACT_APP_ENVIRONMENT === "UAT"
    ? BACKEND_DOMAIN_UAT
    : BACKEND_DOMAIN_PROD;
};
