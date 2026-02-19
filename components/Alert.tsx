import React from "react";

interface AlertProps {
  type: "error" | "success" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ type, title, message, onClose }, ref) => {
    const bgColors = {
      error: "bg-red-50 border-error text-error",
      success: "bg-green-50 border-success text-success",
      warning: "bg-yellow-50 border-warning text-warning",
      info: "bg-blue-50 border-primary text-primary",
    };

    const icons = {
      error: "⚠",
      success: "✓",
      warning: "⚡",
      info: "ℹ",
    };

    return (
      <div
        ref={ref}
        className={`border rounded-md p-4 ${bgColors[type]}`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl font-bold">{icons[type]}</span>
          <div className="flex-1">
            {title && <h3 className="font-semibold">{title}</h3>}
            <p className={title ? "text-sm mt-1" : ""}>{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-lg leading-none hover:opacity-70"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";
