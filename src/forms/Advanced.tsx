import {
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../foundations/Icon';
import { useDismissibleLayer } from '../overlays/useOverlay';

const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export interface CalendarProps {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  className?: string;
}

export function Calendar({ value, onChange, min, max, className = '' }: CalendarProps) {
  const initial = value ? new Date(`${value}T00:00:00`) : new Date();
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const first = view.getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = Array.from(
    { length: Math.ceil((first + days) / 7) * 7 },
    (_, index) => index - first + 1,
  );

  return (
    <div className={`hf-calendar ${className}`}>
      <header>
        <button
          type="button"
          aria-label="上个月"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
        >
          <Icon name="chevron-down" className="hf-calendar__prev" />
        </button>
        <strong>{view.getFullYear()} 年 {view.getMonth() + 1} 月</strong>
        <button
          type="button"
          aria-label="下个月"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
        >
          <Icon name="chevron-down" className="hf-calendar__next" />
        </button>
      </header>
      <div className="hf-calendar__week">
        {'日一二三四五六'.split('').map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="hf-calendar__days">
        {cells.map((day, index) => {
          if (day < 1 || day > days) return <span key={index} />;
          const date = iso(new Date(view.getFullYear(), view.getMonth(), day));
          const disabled = Boolean((min && date < min) || (max && date > max));
          const stateClass = date === value ? 'is-selected' : date === iso(new Date()) ? 'is-today' : '';
          return (
            <button
              type="button"
              key={date}
              disabled={disabled}
              className={stateClass}
              aria-pressed={date === value}
              onClick={() => onChange?.(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface DatePickerProps {
  label?: ReactNode;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  error?: ReactNode;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = '选择日期',
  min,
  max,
  error,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useDismissibleLayer<HTMLDivElement>(open, () => setOpen(false), {
    autoFocus: false,
  });
  return (
    <div ref={rootRef} className="hf-field hf-date-picker">
      {label && <span className="hf-field__label">{label}</span>}
      <button
        type="button"
        className={`hf-picker-trigger${error ? ' is-error' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? '' : 'is-placeholder'}>{value || placeholder}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <div className="hf-date-picker__panel">
          <Calendar
            value={value}
            min={min}
            max={max}
            onChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
          />
        </div>
      )}
      {error && <span className="hf-field__hint hf-field__hint--error">{error}</span>}
    </div>
  );
}

export interface TimePickerProps {
  label?: ReactNode;
  value?: string;
  onChange: (value: string) => void;
  step?: number;
}

export function TimePicker({ label, value, onChange, step = 30 }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useDismissibleLayer<HTMLDivElement>(open, () => setOpen(false), {
    autoFocus: false,
  });
  const times = Array.from({ length: Math.ceil(1440 / step) }, (_, index) => {
    const minutes = index * step;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  });
  return (
    <div ref={rootRef} className="hf-field hf-time-picker">
      {label && <span className="hf-field__label">{label}</span>}
      <button
        type="button"
        className="hf-picker-trigger"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? '' : 'is-placeholder'}>{value || '选择时间'}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <div className="hf-time-picker__panel" role="listbox">
          {times.map((time) => (
            <button
              type="button"
              role="option"
              aria-selected={time === value}
              key={time}
              onClick={() => {
                onChange(time);
                setOpen(false);
              }}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: ReactNode;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  showValue = true,
  ...props
}: SliderProps) {
  const percent = (value - Number(min)) / (Number(max) - Number(min)) * 100;
  return (
    <label className="hf-slider">
      <span>{label}{showValue && <strong>{value}</strong>}</span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        style={{ '--hf-slider-value': `${percent}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
        {...props}
      />
    </label>
  );
}
