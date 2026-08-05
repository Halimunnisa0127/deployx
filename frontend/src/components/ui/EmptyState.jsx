import React from "react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
  minHeight = "h-[400px]",
}) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border p-8 flex flex-col items-center justify-center text-center shadow-lg ${minHeight} ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">{description}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        {secondaryAction && (
          <Button variant="secondary" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            variant="primary"
            onClick={primaryAction.onClick}
            iconLeft={primaryAction.icon}
          >
            {primaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
