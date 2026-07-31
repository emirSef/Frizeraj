export const serviceKeys = {
  all: ["services-admin"] as const,
  list: () => [...serviceKeys.all, "list"] as const,
};
