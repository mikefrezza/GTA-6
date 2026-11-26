import { useEffect, useRef } from "react";
import { padLevel } from "../game";
import type { LevelUp, Toast } from "../store";

export function ToastBar({ toast, onUndo }: { toast: Toast; onUndo: () => void }) {
  return (
    <div className="toast" role="status">
      <p>{toast.text}</p>
      {toast.canUndo ? (
        <button type="button" onClick={onUndo}>
          Undo
        </button>
      ) : null}
    </div>
  );
}

export function LevelUpOverlay({ levelUp, onClose }: { levelUp: LevelUp; onClose: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="levelup-root" role="dialog" aria-modal="true" aria-labelledby="levelup-title">
      <div className="levelup-card" key={levelUp.level}>
        <p className="levelup-flag">{levelUp.rankChanged ? "New rank" : "Level up"}</p>
        <p className="levelup-num">{padLevel(levelUp.level)}</p>
        <h2 id="levelup-title">{levelUp.rankName}</h2>
        <p className="levelup-line">{levelUp.rankLine}</p>
        <button ref={buttonRef} type="button" className="btn btn-primary btn-block" onClick={onClose}>
          Keep going
        </button>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="confirm-root" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-body">
      <div className="backdrop" onClick={onClose} />
      <div className="confirm-card">
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-body">{body}</p>
        <div className="confirm-actions">
          <button ref={cancelRef} type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={danger ? "btn btn-danger" : "btn btn-primary"} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
