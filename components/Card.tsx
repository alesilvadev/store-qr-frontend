import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  clickable?: boolean;
  padding?: "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { children, className = "", clickable = false, padding = "md", ...props },
    ref
  ) => {
    const paddingStyles = {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg border border-border shadow-sm
          ${paddingStyles[padding]}
          ${clickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
