import { AppPanel } from "./components/app-shell/AppPanel"
import { AppShell } from "./components/app-shell/AppShell"
import { ChatPanel } from "./components/app-shell/ChatPanel"
import { ThreadPanel } from "./components/app-shell/ThreadPanel"

function App() {

    return (
        <div id="App">
            <AppShell
                leftPanel={<AppPanel />}
                midPanel={<ChatPanel />}
                rightPanel={<ThreadPanel />}
            />
        </div>
    )
}

export default App
