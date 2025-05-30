"use client";

import classes from "./Button.module.scss";

import { CSSProperties, forwardRef, ReactNode } from "react";
import clsx from "clsx";
import ThreeDotsLoading from "../ThreeDotsLoading";
import { useRouter } from "next/navigation";

export type ButtonType = {
  name?: string;
  id?: string;
  children?: ReactNode;
  variant?: "contained" | "outlined" | "text";
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "gray"
    | "white"
    | "info"
    | "success"
    | "warning"
    | "inherit";
  endIcon?: ReactNode;
  startIcon?: ReactNode;
  size?: "2xl" | "xl" | "lg" | "md" | "sm" | "xs" | "xxs";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  noBoxShadow?: boolean;
  style?: CSSProperties;
  childrenCLassName?: string;
  href?: string;
  selected?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonType>(
  (
    {
      childrenCLassName,
      variant = "text",
      fullWidth,
      name,
      id,
      children,
      color = "primary",
      endIcon,
      startIcon,
      size = "md",
      onClick,
      loading = false,
      type = "button",
      disabled = false,
      className,
      noBoxShadow = true,
      style,
      href,
      selected,
      ...rest
    },
    ref
  ) => {
    const router = useRouter();

    const clickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (href && href?.trim().length > 0) {
        router.push(href);
      } else {
        onClick?.(e);
      }
    };

    return (
      <button
        ref={ref}
        className={clsx(className, classes.button, {
          [classes.shadowBox]: noBoxShadow,
          // Variants & colors

          [classes.selected]: selected,

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

          //gray types
          [classes.containedgray]: color === "gray" && variant === "contained",
          [classes.outlinedgray]: color === "gray" && variant === "outlined",
          [classes.textgray]: color === "gray" && variant === "text",

          //error types
          [classes.containedError]:
            color === "error" && variant === "contained",
          [classes.outlinedError]: color === "error" && variant === "outlined",
          [classes.textError]: color === "error" && variant === "text",

          //info types
          [classes.containedInfo]: color === "info" && variant === "contained",
          [classes.outlinedInfo]: color === "info" && variant === "outlined",
          [classes.textInfo]: color === "info" && variant === "text",

          //success types
          [classes.containedSuccess]:
            color === "success" && variant === "contained",
          [classes.outlinedSuccess]:
            color === "success" && variant === "outlined",
          [classes.textSuccess]: color === "success" && variant === "text",

          //warning types
          [classes.containedWarning]:
            color === "warning" && variant === "contained",
          [classes.outlinedWarning]:
            color === "warning" && variant === "outlined",
          [classes.textWarning]: color === "warning" && variant === "text",

          // Size
          [classes.xxl]: size === "2xl",
          [classes.xl]: size === "xl",
          [classes.lg]: size === "lg",
          [classes.md]: size === "md",
          [classes.sm]: size === "sm",
          [classes.xs]: size === "xs",
          [classes.xxs]: size === "xxs",
          [classes.fullWidth]: fullWidth,
        })}
        onClick={clickHandler}
        disabled={disabled || loading}
        type={type}
        id={id}
        name={name}
        style={style}
        {...rest}
      >
        {loading ? (
          <ThreeDotsLoading className={classes.loading} loadingInButton />
        ) : (
          <>
            <div className={`${classes.childrenColor} ${childrenCLassName}`}>
              {startIcon && (
                <div className={classes.startIcon}>{startIcon}</div>
              )}
              {children}
              {endIcon && <div className={classes.endIcon}>{endIcon}</div>}
            </div>
          </>
        )}
      </button>
    );
  }
);
