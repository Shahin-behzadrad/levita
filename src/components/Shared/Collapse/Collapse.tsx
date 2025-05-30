import React, { useState, ReactNode, useRef, useEffect } from "react";
import classes from "./Collapse.module.scss";
import Text from "../Text";

import clsx from "clsx";
import { ChevronUp } from "lucide-react";

export interface CustomAccordionProps {
  title: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const Collapse: React.FC<CustomAccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  className,
  endIcon,
  startIcon,
}) => {
  // Controls the animation (expanded vs collapsed)
  const [expanded, setExpanded] = useState(defaultExpanded);
  // Controls whether the content is in the DOM
  const [shouldRender, setShouldRender] = useState(defaultExpanded);
  // Store timeout id so we can clear it if needed
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Transition duration in ms (should match your CSS)
  const TRANSITION_DURATION = 300;

  const toggleAccordion = () => {
    if (!expanded) {
      // Expanding: Immediately add content to DOM and animate open
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShouldRender(true);
      // Allow next tick to ensure the element is rendered
      setTimeout(() => setExpanded(true), 0);
    } else {
      // Collapsing: Start animation, then remove content after timeout
      setExpanded(false);
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, TRANSITION_DURATION);
    }
  };

  // Clear any pending timeout if the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={clsx(classes.accordion, className)}>
      <div className={classes.header} onClick={toggleAccordion}>
        {startIcon && <>{startIcon}</>}
        <Text value={title} />
        {endIcon && <>{endIcon}</>}
        <ChevronUp
          className={clsx(classes.icon, {
            [classes.rotateIcon]: expanded,
          })}
        />
      </div>
      {shouldRender && (
        <div
          className={clsx(classes.content, {
            [classes.expanded]: expanded,
          })}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapse;
