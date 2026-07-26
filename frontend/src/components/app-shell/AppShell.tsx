import { Grid } from "@radix-ui/themes";

export type AppShellProps = {
    leftPanel: React.ReactNode
    midPanel: React.ReactNode
    rightPanel: React.ReactNode
}

export function AppShell({ leftPanel, midPanel, rightPanel }: AppShellProps) {
    return <Grid columns="1fr 3fr 1fr" width="auto" height="100vh">
        {leftPanel}
        {midPanel}
        {rightPanel}
    </Grid>
}