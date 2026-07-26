import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
