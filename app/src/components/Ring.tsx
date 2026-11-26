import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { formatXp } from "../game";

type Props = {
  ratio: number;
  size?: number;
  stroke?: number;
  label: string;
  children?: ReactNode;
};

export function Ring({ ratio, size = 136, stroke = 10, label, children }: Props) {
  const rawId = useId().replace(/:/g, "");
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, ratio));
  const offset = circumference * (1 - clamped);
  const prev = useRef(clamped);
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    if (clamped + 0.001 < prev.current) {
      setSmooth(false);
      const frame = requestAnimationFrame(() => setSmooth(true));
      prev.current = clamped;
      return () => cancelAnimationFrame(frame);
    }
    prev.current = clamped;
  }, [clamped]);

  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={rawId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d93" />
            <stop offset="52%" stopColor="#ffc857" />
            <stop offset="100%" stopColor="#5ef2e0" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          className={smooth ? "ring-value" : "ring-value instant"}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${rawId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

export function XpBar({ into, need, ratio }: { into: number; need: number; ratio: number }) {
  const prev = useRef(ratio);
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    if (ratio + 0.001 < prev.current) {
      setSmooth(false);
      const frame = requestAnimationFrame(() => setSmooth(true));
      prev.current = ratio;
      return () => cancelAnimationFrame(frame);
    }
    prev.current = ratio;
  }, [ratio]);

  return (
    <div className="xpbar">
      <div className="xpbar-track" role="meter" aria-valuemin={0} aria-valuemax={need} aria-valuenow={into} aria-label="XP to next level">
        <div className={smooth ? "xpbar-fill" : "xpbar-fill instant"} style={{ width: `${ratio * 100}%` }} />
      </div>
      <div className="xpbar-meta">
        <span>
          {formatXp(into)} / {formatXp(need)} XP
        </span>
        <span>to next level</span>
      </div>
    </div>
  );
}
