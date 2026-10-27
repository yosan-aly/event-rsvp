import type { ReactNode } from "react";

/** Botón redondo para subir o bajar una cantidad (− / +). */
export function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border bg-card text-forest disabled:opacity-40"
    >
      {children}
    </button>
  );
}
