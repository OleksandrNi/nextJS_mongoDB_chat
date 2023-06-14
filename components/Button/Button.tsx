import React from "react";
import { ButtonProps } from "../../types/propTypes";
import classNames from "classnames";
import styles from "./Button.module.scss";

const Button = ({
  title,
  type,
  disabled,
  onClick,
  width,
  variant,
  height,
}: ButtonProps) => {
  const buttonClass = classNames(styles.container, {
    [styles.disabled]: disabled,
    [styles.customWidth]: width,
    [styles[`container_variant_${variant}`]]: variant,
  });

  const buttonStyle = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <button
      className={buttonClass}
      style={buttonStyle}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {disabled ? "Processing..." : title}
    </button>
  );
};

export default Button;
