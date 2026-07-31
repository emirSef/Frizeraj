export const serviceRecordKeys = {
  all: ["service-records"] as const,
  byClient: (clientId: string) => [...serviceRecordKeys.all, "client", clientId] as const,
  byAppointment: (appointmentId: string) =>
    [...serviceRecordKeys.all, "appointment", appointmentId] as const,
};
