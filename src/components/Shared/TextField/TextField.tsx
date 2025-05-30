import {
  convertToEnglishDigit,
  numberFormat,
  removeWhiteSpaceFromString,
} from "@/lib/functions";
import classes from "./TextField.module.scss";
import clsx from "clsx";
import React, { ReactNode, ChangeEvent, KeyboardEvent, useState } from "react";
import { Text } from "../Text/Text";

export interface TextFieldProps {
  label?: string;
  multiline?: boolean;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "gray" | "white";
  inputSize?: "2xl" | "xl" | "lg" | "md" | "sm";
  onChangeText?: (text: string) => void;
  onChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  maxLength?: number;
  handleSubmit?: () => void;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  inputClasses?: string;
  inputMode?: "numeric" | "text" | "date";
  value?: string | number;
  endAdornmentClassName?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  errors?: string;
  labelBackground?: "card" | "modal";
  needsNumberFormat?: boolean;
  helperTextClickHandler?: () => void;
  direction?: "rtl" | "ltr";
}

export const TextField: React.FC<
  TextFieldProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  label,
  value,
  multiline = false,
  color = "gray",
  inputSize = "md",
  variant = "outlined",
  labelBackground = "card",
  onChangeText,
  onChange,
  maxLength = Infinity,
  handleSubmit,
  startAdornment,
  endAdornment,
  fullWidth = true,
  className,
  inputMode,
  inputClasses,
  endAdornmentClassName,
  error = false,
  containerClassName,
  errors,
  helperText,
  direction = "rtl",
  helperTextClickHandler,
  placeholder,
  needsNumberFormat,
  ...props
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const onChangeHandler = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onChange?.(e);
    let newValue = e.target.value;

    if (inputMode === "numeric") {
      const regex = /^[\u06F0-\u06F90-9,]+$/;

      if (!regex.test(newValue) && newValue !== "") {
        return;
      }

      newValue = removeWhiteSpaceFromString(newValue);
      newValue = convertToEnglishDigit(newValue);

      newValue = newValue.replace(/,/g, "");
    }

    if (newValue.length > maxLength) {
      return;
    }

    if (multiline && e.target instanceof HTMLTextAreaElement) {
      adjustTextAreaHeight(e.target);
    }

    onChangeText?.(newValue);
  };

  const adjustTextAreaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const onFocusHandler = (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setIsFocused(true);

    if (multiline && e.target instanceof HTMLTextAreaElement) {
      adjustTextAreaHeight(e.target);
    }
  };

  const onKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSubmit?.();
    }
  };

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div
      className={clsx(className, classes.inputField, {
        [classes.fullWidth]: fullWidth,
      })}
    >
      <div
        id="inputContainer"
        className={clsx(containerClassName, classes.inputContainer, {
          [classes.fullWidth]: fullWidth,
          [classes.focused]: isFocused,
          [classes.error]: error,
          //primary types
          [classes.containedPrimary]:
            color === "primary" && variant === "contained",
          [classes.outlinedPrimary]:
            color === "primary" && variant === "outlined",
          [classes.textPrimary]: color === "primary" && variant === "text",

          //white types
          [classes.containedWhite]:
            color === "white" && variant === "contained",
          [classes.outlinedWhite]: color === "white" && variant === "outlined",
          [classes.textWhite]: color === "white" && variant === "text",

          //secondary types
          [classes.containedSecondary]:
            color === "secondary" && variant === "contained",
          [classes.outlinedSecondary]:
            color === "secondary" && variant === "outlined",
          [classes.textSecondary]: color === "secondary" && variant === "text",

          //error types
          [classes.containedError]:
            color === "error" && variant === "contained",
          [classes.outlinedError]: color === "error" && variant === "outlined",
          [classes.textError]: color === "error" && variant === "text",

          //gray types
          [classes.containedgray]: color === "gray" && variant === "contained",
          [classes.outlinedgray]: color === "gray" && variant === "outlined",
          [classes.textgray]: color === "gray" && variant === "text",

          // Size
          [classes.xxl]: inputSize === "2xl",
          [classes.xl]: inputSize === "xl",
          [classes.lg]: inputSize === "lg",
          [classes.md]: inputSize === "md",
          [classes.sm]: inputSize === "sm",

          //justify start adornment
          [classes.startAdornment]: startAdornment,
          [classes.endAdornment]: endAdornment,
        })}
      >
        {label && (
          <label
            className={clsx(classes.label, {
              [classes.textFieldOnModal]: labelBackground === "modal",
              [classes.labelFocused]: isFocused || !!value, // Move label up
              [classes.labelPrimary]: isFocused, // Apply primary color only when focused
              [classes.labelError]: error, // Apply error color
            })}
          >
            {label}
          </label>
        )}

        {startAdornment && (
          <div className={classes.startAdornmentItem}>{startAdornment}</div>
        )}
        <InputComponent
          maxLength={maxLength}
          autoComplete="off"
          className={clsx(classes.input, inputClasses, {
            // direction
            [classes.ltrDirection]: direction === "ltr",
            // Size
            [classes.fontSize_xxl]: inputSize === "2xl",
            [classes.fontSize_xl]: inputSize === "xl",
            [classes.fontSize_lg]: inputSize === "lg",
            [classes.fontSize_md]: inputSize === "md",
            [classes.fontSize_sm]: inputSize === "sm",
            [classes.multiline]: multiline,
            [classes.errorInput]: error, // Apply error styles to input
          })}
          {...props}
          placeholder={
            label
              ? isFocused || !!value
                ? placeholder
                : ""
              : (placeholder ?? "")
          }
          value={
            needsNumberFormat && inputMode === "numeric"
              ? numberFormat(Number(value))
              : value
          }
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
        />
        {endAdornment && (
          <div
            className={clsx(endAdornmentClassName, classes.endAdornmentItem)}
          >
            {endAdornment}
          </div>
        )}
      </div>
      {(helperText || errors) && (
        <Text
          onClick={helperTextClickHandler}
          textAlign="right"
          value={errors ?? helperText}
          className={clsx(classes.helperText, {
            [classes.errorHelperText]: error,
            [classes.pointerHelperText]: Boolean(helperTextClickHandler),
          })}
        />
      )}
    </div>
  );
};
