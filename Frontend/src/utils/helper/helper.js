import validator from "validator";

export const isValidEmail = (email) => {
  const isValid = validator.isEmail(email);
  return isValid;
};
export const classNames = (defaultClass, conditionBasedClass) => {
  return `${defaultClass} ${Object.keys(conditionBasedClass)
    .filter((key) => conditionBasedClass[key])
    .join(" ")}`;
};
