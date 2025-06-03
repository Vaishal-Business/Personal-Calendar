"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import { CalendarProvider } from "@/calendar/contexts/calendar-context";
import { ChangeBadgeVariantInput } from "@/calendar/components/change-badge-variant-input";
import { ChangeVisibleHoursInput } from "@/calendar/components/change-visible-hours-input";
import { ChangeWorkingHoursInput } from "@/calendar/components/change-working-hours-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const users = [
  {
    id: "u1",
    name: "Vaishal Anil",
    picturePath:
      "https://lh3.googleusercontent.com/ogw/AF2bZyjlB2276uf81oGOAejo7bSkfdKk9vER-ZVmNjyPPSvZCQ=s1200-c-mo",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState([]);
  const [eventsKey, setEventsKey] = useState("initial");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("calendar-events");

      let parsedEvents = [];

      if (stored) {
        parsedEvents = JSON.parse(stored);
      } else {
        parsedEvents = [
          {
            id: "e1",
            title: "Project Kickoff Meeting",
            description: "Initial meeting to discuss the new project timeline.",
            startDate: "2025-06-05T10:00:00.000Z",
            endDate: "2025-06-05T11:00:00.000Z",
            color: "blue",
            user: { id: "u1", name: "Vaishal Anil" },
          },
        ];
        localStorage.setItem("calendar-events", JSON.stringify(parsedEvents));
      }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedEvents = parsedEvents.map((event: any) => ({
        ...event,
        user: users.find((u) => u.id === event.user?.id) || event.user,
      }));

      setEvents(formattedEvents);

      // Force calendar to re-render with new key
      setEventsKey(`events-${Date.now()}`);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  }, []);

  return (
    <CalendarProvider key={eventsKey} users={users} events={events}>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
        {children}

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="flex-none gap-2 py-0 hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings className="size-4" />
                <p className="text-base font-semibold">Calendar settings</p>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="mt-4 flex flex-col gap-6">
                <ChangeBadgeVariantInput />
                <ChangeVisibleHoursInput />
                <ChangeWorkingHoursInput />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </CalendarProvider>
  );
}
