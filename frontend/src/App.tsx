import { AppPanel } from "./components/AppPanel";
import { AppShell } from "./components/AppShell";
import { ChatPanel } from "./components/ChatPanel";
import { ThreadPanel } from "./components/ThreadPanel";

function App() {
  return (
    <div id="App">
      <AppShell>
        <AppPanel />
        <ChatPanel title="Title for the chat thread here" />
        <ThreadPanel />
      </AppShell>
    </div>
  );
}

export default App;
