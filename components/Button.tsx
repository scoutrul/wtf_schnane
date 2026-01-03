
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  disabled, 
  className = '', 
  variant = 'primary' 
}) => {
  const baseStyles = "px-8 py-4 rounded-full font-black transform transition-all active:scale-95 border-2 uppercase tracking-tighter oswald text-lg";
  const variants = {
    primary: "bg-[#D4AF37] text-black border-[#C5A028] hover:bg-[#E5C158] shadow-[0_4px_15px_rgba(212,175,55,0.4)]",
    secondary: "bg-black text-[#FF1493] border-[#FF1493] hover:bg-[#FF1493] hover:text-white shadow-[0_4px_15px_rgba(255,20,147,0.3)]",
    danger: "bg-transparent text-zinc-500 border-zinc-800 hover:border-red-500 hover:text-red-500"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
