import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
