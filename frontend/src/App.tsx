import { AppPanel } from "./components/AppPanel";
import { AppShell } from "./components/AppShell";
import { ChatPanel } from "./components/ChatPanel";
import { ThreadPanel } from "./components/ThreadPanel";
import { WorkspaceProvider } from "./providers/WorkspaceProvider";

function App() {
  return (
    <div id="App">
      <AppShell>
        <WorkspaceProvider>
          <AppPanel />
          <ChatPanel title="Title for the chat thread here" />
          <ThreadPanel />
        </WorkspaceProvider>
      </AppShell>
    </div>
  );
}

export default App;
