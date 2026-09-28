import type { ReactNode } from "react";
import { Select } from "../forms/Select";
export interface ScheduleEvent {
  id: string;
  title: ReactNode;
  start: string;
  end: string;
  color?: string;
  resourceId?: string;
}
export function EventCard({
  event,
  onClick,
}: {
  event: ScheduleEvent;
  onClick?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="hf-event-card"
      onClick={() => onClick?.(event.id)}
    >
      <strong>{event.title}</strong>
      <time>
        {event.start}–{event.end}
      </time>
    </button>
  );
}
export function Scheduler({
  days,
  events,
  onEventClick,
}: {
  days: readonly string[];
  events: readonly ScheduleEvent[];
  onEventClick?: (id: string) => void;
}) {
  return (
    <div className="hf-scheduler">
      {days.map((day) => (
        <section key={day}>
          <strong>{day}</strong>
          {events
            .filter((e) => e.start.startsWith(day))
            .map((e) => (
              <EventCard key={e.id} event={e} onClick={onEventClick} />
            ))}
        </section>
      ))}
    </div>
  );
}
export interface CalendarResource {
  id: string;
  name: ReactNode;
}
export function ResourceCalendar({
  resources,
  events,
}: {
  resources: readonly CalendarResource[];
  events: readonly ScheduleEvent[];
}) {
  return (
    <div className="hf-resource-calendar">
      {resources.map((r) => (
        <section key={r.id}>
          <strong>{r.name}</strong>
          {events
            .filter((e) => e.resourceId === r.id)
            .map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
        </section>
      ))}
    </div>
  );
}
export interface RecurrenceValue {
  frequency: "none" | "daily" | "weekly" | "monthly";
  interval: number;
  end?: string;
}
export function RecurrenceEditor({
  value,
  onChange,
}: {
  value: RecurrenceValue;
  onChange: (v: RecurrenceValue) => void;
}) {
  return (
    <div className="hf-recurrence">
      <Select
        className="hf-recurrence__select"
        aria-label="重复频率"
        value={value.frequency}
        options={[
          { value: "none", label: "不重复" },
          { value: "daily", label: "每天" },
          { value: "weekly", label: "每周" },
          { value: "monthly", label: "每月" },
        ]}
        onChange={(e) =>
          onChange({
            ...value,
            frequency: e.target.value as RecurrenceValue["frequency"],
          })
        }
      />
      <input
        aria-label="重复间隔"
        type="number"
        min={1}
        value={value.interval}
        onChange={(e) => onChange({ ...value, interval: +e.target.value })}
      />
    </div>
  );
}
export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}
export function TimezoneSelect({
  options,
  value,
  onChange,
}: {
  options: readonly TimezoneOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select
      aria-label="时区"
      className="hf-timezone"
      value={value}
      options={options.map((option) => ({
        value: option.value,
        label: `${option.label} (${option.offset})`,
      }))}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
export type AvailabilityState =
  | "available"
  | "busy"
  | "tentative"
  | "unavailable";
export function AvailabilityGrid({
  people,
  slots,
  value,
}: {
  people: readonly { id: string; name: ReactNode }[];
  slots: readonly string[];
  value: Readonly<Record<string, Readonly<Record<string, AvailabilityState>>>>;
}) {
  return (
    <div className="hf-availability">
      <table>
        <thead>
          <tr>
            <th>成员</th>
            {slots.map((s) => (
              <th key={s}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <th>{p.name}</th>
              {slots.map((s) => (
                <td key={s}>
                  <i className={`is-${value[p.id]?.[s] ?? "unavailable"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
