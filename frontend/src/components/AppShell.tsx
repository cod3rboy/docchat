import { Grid } from "@radix-ui/themes";

export function AppShell({ children }: React.PropsWithChildren) {
  return (
    <Grid columns="1fr 3fr 1fr" width="auto" height="100vh">
      {children}
    </Grid>
  );
}
