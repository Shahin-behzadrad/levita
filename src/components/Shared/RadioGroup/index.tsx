import React from "react";
import styles from "./RadioGroup.module.scss";

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  name: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  name,
}) => {
  return (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <div key={option.value} className={styles.radioOption}>
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
          />
          <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};
