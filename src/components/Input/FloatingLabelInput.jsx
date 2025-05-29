import React, { useState, useEffect, useRef } from "react";

const textLikeTypes = ["text", "email", "password", "number", "tel", "url"];

const FloatingLabelInput = ({
  id,
  type = "text",
  value,
  onChange,
  children,
  className = "",
  required = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [hasText, setHasText] = useState(false);
  const inputRef = useRef(null);

  const isTextLike = textLikeTypes.includes(type);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    if (!isTextLike) return;
    setFocused(false);
    setHasText(inputRef.current?.value !== "");
  };

  useEffect(() => {
    if (!isTextLike) return;

    const checkValue = () => {
      setHasText(inputRef.current?.value !== "");
    };

    checkValue();

    const timeout = setTimeout(checkValue, 100);
    const interval = setInterval(checkValue, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isTextLike]);

  const isFloating = isTextLike && (focused || hasText);

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        id={id}
        value={value || ""}
        onChange={onChange}
        required={required}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`peer w-full px-3 py-3 border border-gray-300 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          ${focused ? "border-black" : "border-gray-300"}
        `}
        placeholder={children}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
