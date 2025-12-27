import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function Button({
  type = "button",
  children,
  className,
  disabled = false,
  onClick,
  dataTooltipId,
  dataTooltipContent,
}) {
  return (
    <button
      type={type}
      className={twMerge(clsx("disabled:opacity-75 disabled:cursor-not-allowed  cursor-pointer", className))}
      disabled={disabled}
      onClick={onClick}
      data-tooltip-id={dataTooltipId}
      data-tooltip-content={dataTooltipContent}>
      {children}
    </button>
  );
}

export default Button;
