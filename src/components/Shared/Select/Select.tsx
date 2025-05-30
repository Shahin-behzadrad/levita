import { useState } from "react";
import classes from "./Select.module.scss";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  label: string;
  error?: string;
  labelBackground?: "card" | "background";
  fullwidth?: boolean;
  className?: string;
}

const Select = ({
  options,
  value,
  onChange,
  label,
  error,
  fullwidth,
  className,
  labelBackground = "card",
}: CustomSelectProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isLabelActive = Boolean(value) || isFocused;

  return (
    <div
      className={clsx(classes.selectContainer, className, {
        [classes.error]: error,
        [classes.fullwidth]: fullwidth,
      })}
    >
      <label
        className={clsx(classes.label, {
          [classes.labelActive]: isLabelActive,
          [classes.backgroundLabel]: labelBackground === "background",
        })}
      >
        {label}
      </label>

      <select
        className={classes.select}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <option value="" disabled hidden></option>

        {options.map((option) => (
          <option
            className={classes.option}
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div
        className={clsx(classes.arrow, {
          [classes.rotateArrow]: isFocused,
        })}
      >
        <ChevronDown />
      </div>
      {error && <div className={classes.errorText}>{error}</div>}
    </div>
  );
};

export default Select;
