import clsx from "clsx";
import { FaStarOfLife } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import DropDown from "./DropDown";

function Input({
  label,
  placeHolder,
  isRequiredField,
  type,
  className,
  value,
  onChange,
  setValue,
  showError,
  errorMessage,
  countryDropDownPosition,
  disabled,
  countryOptionsData,
  dropDownSelectedValue,
  setDropDownSelectedValue,
  countryDropDownMaxHeight,
}) {
  const updateValue = async (e) => {
    const val = e.target.value;
    const basicRegex = /^[^|+=:;?]*$/;

    if (!setValue) return;
    switch (type) {
      case "email":
      case "password":
        setValue(val);
        break;

      default:
        if (basicRegex.test(val)) {
          setValue(val);
        }
        break;
    }
  };
  return (
    <div className="w-full h-fit">
      {label && (
        <label
          htmlFor=""
          className="pb-2.5 inline-block font-space-grotesk text-sm md:text-base lg:text-xl font-medium">
          <span className="flex gap-1">
            <span>{label}</span>
            {isRequiredField && <FaStarOfLife className="w-1.5 text-red-700" />}
          </span>
        </label>
      )}

      <div className="flex w-full items-stretch justify-start">
        {type == "number" && countryOptionsData && (
          <DropDown
            dropdownMenuArray={countryOptionsData}
            dropDownSelectedValue={dropDownSelectedValue}
            setDropDownSelectedValue={setDropDownSelectedValue}
            styleDropdownButton="h-full bg-slate-100/[50] rounded-l-lg rounded-r-none border border-black/30  border-r-0"
            dropdownPosition={countryDropDownPosition}
            maxHeight={countryDropDownMaxHeight || 200}
            minWidth={300}
            disabled={disabled}
          />
        )}
        <div
          className={clsx(
            "bg-transparent  w-full relative focus-within:border-black/80 font-inter overflow-hidden !text-black",
            className
          )}
          style={{
            border: showError && errorMessage ? "1px solid red" : disabled ? "1px solid #7fab98" : "",
          }}>
          <input
            type={type == "number" ? "text" : type}
            value={typeof value == "string" ? value : ""}
            onChange={setValue ? updateValue : onChange}
            placeholder={placeHolder}
            className={twMerge(
              clsx(
                "border border-gray-500  px-7 py-3 bg-white w-full  text-black focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#191A23] font-space-grotesk text-sm md:text-lg !border-none placeholder:text-gray-500 disabled:bg-[#7fab98]/15 disabled:border disabled:border-[#7fab98] disabled:cursor-not-allowed",
                className
              )
            )}
            style={{
              border: 0,
              color: "black",
            }}
            disabled={disabled}
          />
        </div>
      </div>
      {showError && errorMessage && (
        <span className="text-rose-600  text-xs  mt-1 block px-1.5 font-inter">{errorMessage}</span>
      )}
    </div>
  );
}

export default Input;
