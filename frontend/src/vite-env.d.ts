/// <reference types="vite/client" />

import {
  EventAppSettings,
  EventSettingsUpdated,
  EventThreadFirstMessage,
  EventTypeAppSettings,
  EventTypeSettingsUpdated,
  EventTypeThreadFirstMessage,
} from "./events";

declare global {
  interface Window {
    openSettings: () => void;
  }

  interface WindowEventMap {
    [EventTypeAppSettings]: CustomEvent<EventAppSettings>;
    [EventTypeSettingsUpdated]: CustomEvent<EventSettingsUpdated>;
    [EventTypeThreadFirstMessage]: CustomEvent<EventThreadFirstMessage>;
  }
}
