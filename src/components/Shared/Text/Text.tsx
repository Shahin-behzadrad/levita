import classes from "./Text.module.scss";

import clsx from "clsx";
import { CSSProperties, Fragment, ReactNode } from "react";

export type TextProps = {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  id?: string;
  value?: string | number;
  className?: string;
  textAlign?: "center" | "right" | "left";
  fontWeight?: "light" | "normal" | "medium" | "bold";
  includesPersianDigits?: boolean;
  numberOfLines?: number;
  variant?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  noWrap?: boolean;
  maxWidth?: number;
  fontSize?:
    | "xxxs"
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "xxxl"
    | "xxxxl"
    | "xxxxxl";
  CssStyle?: CSSProperties;
  color?:
    | "primary"
    | "secondary"
    | "gray"
    | "defaultTheme"
    | "white"
    | "black"
    | "true-white"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "title"
    | "caption";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Text = ({
  color = "title",
  id,
  value,
  className,
  fontWeight = "normal",
  includesPersianDigits = true,
  numberOfLines,
  variant = "p",
  fontSize = "md",
  CssStyle,
  noWrap,
  onClick,
  maxWidth,
  textAlign,
  startAdornment,
  endAdornment,
  ...restProps
}: TextProps &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >) => {
  const getClassName = (tag = variant, size = fontSize): string => {
    return `${tag}-${size}`;
  };

  const dynamicClass = getClassName();
  const HtmlTag = variant;

  let maxNumberLineStyle = {};
  if (numberOfLines && numberOfLines > 0) {
    maxNumberLineStyle = {
      lineClamp: numberOfLines,
      WebkitLineClamp: numberOfLines,
      display: "-webkit-box",
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
    };
  }

  return (
    <HtmlTag
      className={clsx(classes.text, className, classes[dynamicClass], {
        //font weight
        [classes.lightText]: fontWeight === "light",
        [classes.normalText]: fontWeight === "normal",
        [classes.mediumText]: fontWeight === "medium",
        [classes.boldText]: fontWeight === "bold",
        [classes.flexDisplay]: startAdornment || endAdornment,

        //color
        [classes.primary]: color === "primary",
        [classes.secondary]: color === "secondary",
        [classes.gray]: color === "gray",
        [classes.white]: color === "white",
        [classes.black]: color === "black",
        [classes.trueWhite]: color === "true-white",
        [classes.error]: color === "error",
        [classes.warning]: color === "warning",
        [classes.info]: color === "info",
        [classes.success]: color === "success",
        [classes.title]: color === "title",
        [classes.caption]: color === "caption",

        // Font family
        [classes.englishDigitsFontFamily]: !includesPersianDigits,
      })}
      onClick={onClick}
      id={id}
      style={{
        maxWidth: maxWidth ?? "unset",
        textOverflow: maxWidth ? "ellipsis" : "unset",
        overflow: maxWidth ? "hidden" : "unset",
        textWrap: noWrap ? "nowrap" : "unset",
        textAlign: textAlign,
        ...maxNumberLineStyle,
        ...CssStyle,
      }}
      {...restProps}
    >
      {startAdornment && <>{startAdornment}</>}
      {typeof value === "string"
        ? value.split("\n").map((line, index) => (
            <Fragment key={index}>
              {line}
              <br />
            </Fragment>
          ))
        : value}
      {endAdornment && <>{endAdornment}</>}
    </HtmlTag>
  );
};
