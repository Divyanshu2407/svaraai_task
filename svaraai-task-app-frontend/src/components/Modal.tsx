'use client';

import { ReactElement } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactElement | ReactElement[];
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <button
          className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
