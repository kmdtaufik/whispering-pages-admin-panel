import React, { useState } from "react";

const FloatingLabelInput = ({ children, id, type = "text", ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasText, setHasText] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    setFocused(false);
    setHasText(e.target.value !== "");
  };

  const isFloating = focused || hasText;

  return (
    <div className="relative w-full mt-6">
      <input
        id={id}
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full px-4 pt-6 pb-2 text-base border rounded-xl focus:outline-none
          ${focused ? "border-black" : "border-gray-300"}
        `}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute px-1 bg-white left-3 transition-all duration-200  pointer-events-none
          ${
            isFloating
              ? "text-sm -top-2.5 text-black"
              : "top-1/2 -translate-y-1/2 text-gray-500"
          }
        `}
      >
        {children}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
