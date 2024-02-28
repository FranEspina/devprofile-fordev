import React from 'react';

interface CloseButtonProps {
  onClick: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {

  return (
    <button
      className="absolute top-3 right-3 text-gray-50 hover:text-gray-200 hover:scale-110 transition"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox='0 0 24 24'
        stroke="currentColor"
        className="h-4 w-4 md:h-5 md:w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
};

export default CloseButton;