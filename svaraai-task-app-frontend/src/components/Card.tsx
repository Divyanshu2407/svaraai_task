'use client';
import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  id?: string; // ✅ Added optional id prop for DnD
}

export default function Card({ children, className, id, ...rest }: CardProps) {
  return (
    <div
      id={id}
      className={`bg-white p-4 rounded shadow ${className || ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}
