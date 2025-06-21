// hooks/useLocalAppointmentTime.ts
import { useMemo } from "react";
import { DateTime } from "luxon";

export function useLocalAppointmentTime(cetISO: string | null | undefined) {
  return useMemo(() => {
    if (!cetISO) return null;

    const localTime = DateTime.fromISO(cetISO, {
      zone: "Europe/Berlin",
    }).setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    return localTime.toLocaleString(DateTime.DATETIME_MED); // e.g., "Jun 21, 2025, 6:30 PM"
  }, [cetISO]);
}
