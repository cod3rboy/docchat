import { Toaster } from "sonner";
import { AppPanel } from "./components/AppPanel";
import { AppShell } from "./components/AppShell";
import { ChatPanel } from "./components/ChatPanel";
import { SettingsDialog } from "./components/SettingsDialog";
import { ThreadPanel } from "./components/ThreadPanel";
import { ThreadProvider } from "./providers/ThreadProvider";
import { WorkspaceProvider } from "./providers/WorkspaceProvider";
import { ChatPanelSlot } from "./components/ChatPanelSlot";

function App() {
  return (
    <div id="App">
      <SettingsDialog />
      <AppShell>
        <WorkspaceProvider>
          <ThreadProvider>
            <AppPanel />
            <ChatPanelSlot>
              <ChatPanel />
            </ChatPanelSlot>
            <ThreadPanel />
          </ThreadProvider>
        </WorkspaceProvider>
        <Toaster
          richColors
          position="top-right"
          duration={6000}
          closeButton
          swipeDirections={["left", "right"]}
        />
      </AppShell>
    </div>
  );
}

export default App;
