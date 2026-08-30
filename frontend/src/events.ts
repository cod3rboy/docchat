export const EventTypeAppSettings = "appSettings";
export interface EventAppSettings {}

export const EventTypeSettingsUpdated = "settingsUpdated";
export interface EventSettingsUpdated {}

export const EventTypeThreadFirstMessage = "threadFirstMessage";
export interface EventThreadFirstMessage {
  threadId: string;
  message: string;
}
