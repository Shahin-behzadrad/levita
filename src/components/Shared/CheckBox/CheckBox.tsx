import React, { useRef } from 'react';
import clsx from 'clsx';
import classes from './CheckBox.module.scss';

type CustomCheckboxProps = {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
};

const Checkbox = ({ checked, onChange, id, name }: CustomCheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={clsx(classes.checkboxContainer)}
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={classes.checkboxInput}
      />
      <span className={classes.checkboxMark} />
    </div>
  );
};

export default Checkbox;
