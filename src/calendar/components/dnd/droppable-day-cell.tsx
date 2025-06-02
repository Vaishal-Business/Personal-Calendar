"use client";

import { useDrop } from "react-dnd";
import { parseISO, differenceInMilliseconds } from "date-fns";

import { useUpdateEvent } from "@/calendar/hooks/use-update-event";

import { cn } from "@/lib/utils";
import { ItemTypes } from "@/calendar/components/dnd/draggable-event";

import type { IEvent, ICalendarCell } from "@/calendar/interfaces";

interface DroppableDayCellProps {
  cell: ICalendarCell;
  children: React.ReactNode;
}

export function DroppableDayCell({ cell, children }: DroppableDayCellProps) {
  const { updateEvent } = useUpdateEvent();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item: { event: IEvent }) => {
  const droppedEvent = item.event;

  const eventStartDate = parseISO(droppedEvent.startDate);
  const eventEndDate = parseISO(droppedEvent.endDate);

  const eventDurationMs = differenceInMilliseconds(eventEndDate, eventStartDate);

  const newStartDate = new Date(cell.date);
  newStartDate.setHours(
    eventStartDate.getHours(),
    eventStartDate.getMinutes(),
    eventStartDate.getSeconds(),
    eventStartDate.getMilliseconds()
  );
  const newEndDate = new Date(newStartDate.getTime() + eventDurationMs);

  const updatedEvent = {
    ...droppedEvent,
    startDate: newStartDate.toISOString(),
    endDate: newEndDate.toISOString(),
  };

  // 1. Update event in React state/context
  updateEvent(updatedEvent);

  // 2. Also update localStorage
  try {
    const stored = localStorage.getItem("calendar-events");
    if (stored) {
      const events = JSON.parse(stored);
      const updatedEvents = events.map((evt: IEvent) =>
        evt.id === updatedEvent.id ? updatedEvent : evt
      );
      localStorage.setItem("calendar-events", JSON.stringify(updatedEvents));
    }
  } catch (error) {
    console.error("Failed to update events in localStorage", error);
  }

  return { moved: true };
},

      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [cell.date, updateEvent]
  );

  return (
    <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className={cn(isOver && canDrop && "bg-accent/50")}>
      {children}
    </div>
  );
}
