import React, { useState } from "react";
import { InputProps } from "../../types/propTypes";
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import styles from "./InputFeild.module.scss";

const InputFeild = ({
  placeholder,
  icon,
  type,
  required,
  value,
  onChange,
  name,
  error,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordIcon = () => {
    setShowPassword(!showPassword);
  };

  const renderPasswordIcon = () => {
    if (showPassword) {
      return <BsEyeSlash className={styles.eyeIcon} onClick={togglePasswordIcon} />;
    } else {
      return <BsEye className={styles.eyeIcon} onClick={togglePasswordIcon} />;
    }
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {icon}

        <input
          className={styles.input}
          placeholder={placeholder}
          type={inputType}
          required={required}
          value={value}
          onChange={onChange}
          name={name}
        />

        {type === "password" && renderPasswordIcon()}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default InputFeild;
