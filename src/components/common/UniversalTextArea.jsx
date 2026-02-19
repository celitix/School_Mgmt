import React, { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import CustomTooltip from "./CustomTooltip";

const UniversalTextArea = ({
  label,
  id,
  name,
  value,
  storageKey = null,
  placeholder,
  error,
  onChange,
  col,
  row,
  readOnly = false,
  className = "",
  ref = null,
  maxLength = "",
  minLength = "",
  tooltipContent = "",
  tooltipPlacement = "top",
  textareaClassName = "",
  disabled = false,
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (storageKey) {
      const storedText = localStorage.getItem(storageKey);
      if (storedText) setText(storedText);
    }
  }, [storageKey]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (storageKey) {
      localStorage.setItem(storageKey, newText);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {tooltipContent && (
            <CustomTooltip
              title={tooltipContent}
              placement={tooltipPlacement}
              arrow
            >
              <span>
                <AiOutlineInfoCircle className="text-gray-500 cursor-pointer hover:text-gray-700" />
              </span>
            </CustomTooltip>
          )}
        </div>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        ref={ref}
        onChange={handleTextChange}
        placeholder={placeholder}
        cols={col}
        rows={row}
        readOnly={readOnly}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        className={`w-full p-2 text-sm border bg-white rounded-md shadow-sm transition-all duration-300
            focus:ring-2 focus:ring-indigo-200 outline-none
            ${
              error
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-indigo-200"
            }
            ${readOnly || disabled ? "bg-gray-200 cursor-not-allowed" : ""}
            ${textareaClassName} ${className}`}
      ></textarea>
      {error && (
        <p className="text-red-500 text-xs mt-1">This field is required.</p>
      )}
    </div>
  );
};

export default UniversalTextArea;
