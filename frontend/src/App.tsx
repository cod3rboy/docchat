import { AppPanel } from "./components/AppPanel";
import { AppShell } from "./components/AppShell";
import { ChatPanel } from "./components/ChatPanel";
import { ThreadPanel } from "./components/ThreadPanel";
import { ThreadProvider } from "./providers/ThreadProvider";
import { WorkspaceProvider } from "./providers/WorkspaceProvider";

function App() {
  return (
    <div id="App">
      <AppShell>
        <WorkspaceProvider>
          <ThreadProvider>
            <AppPanel />
            <ChatPanel />
            <ThreadPanel />
          </ThreadProvider>
        </WorkspaceProvider>
      </AppShell>
    </div>
  );
}

export default App;
