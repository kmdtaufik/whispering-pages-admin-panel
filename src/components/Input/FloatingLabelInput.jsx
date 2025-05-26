import React, { useState, useEffect, useRef } from "react";

const textLikeTypes = ["text", "email", "password", "number", "tel", "url"];

const FloatingLabelInput = ({
  children,
  id,
  type = "text",
  className = "",
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
    <div className={`relative w-full mt-6 font-lato ${className}`}>
      <input
        id={id}
        type={type}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full px-4 pt-6 pb-2 text-base border rounded-xl focus:outline-none
          ${focused ? "border-black" : "border-gray-300"}
        `}
        {...props}
      />
      {isTextLike && (
        <label
          htmlFor={id}
          className={`absolute px-1 bg-white left-3 transition-all duration-200 pointer-events-none
            ${
              isFloating
                ? "text-sm -top-2.5 text-black"
                : "top-1/2 -translate-y-1/2 text-gray-500"
            }
          `}
        >
          {children}
        </label>
      )}
    </div>
  );
};

export default FloatingLabelInput;
