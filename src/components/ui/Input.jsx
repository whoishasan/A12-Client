import React, { forwardRef } from "react";

const Input = forwardRef(
  ({ label, errorMessage, children, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <>
            <label className="block mb-1 font-semibold text-neutral-800">
              {label}
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
          </>
        )}
        <input
          className={`border w-full px-5 py-2 rounded-md ring-offset-1 focus:ring-1 ring-red-700/60 transition-all focus:border-transparent text-sm placeholder:text-color-1/80 placeholder:font-medium ${className}`}
          {...props}
          ref={ref}
        />
        {children && React.cloneElement(children, { error: errorMessage })}
      </div>
    );
  }
);

export default Input;
