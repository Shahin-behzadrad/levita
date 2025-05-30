import styles from "./Separator.module.scss";

interface SeparatorProps {
  className?: string;
}

export const Separator = ({ className }: SeparatorProps) => {
  return <div className={`${styles.separator} ${className || ""}`} />;
};
