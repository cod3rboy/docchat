import { Flex, Text } from "@radix-ui/themes";
import { Brand } from "./Brand";

export interface AboutProps {}

export function About({}: AboutProps) {
  return (
    <Flex direction="column" align="center" py="6" gap="2">
      <Brand size="md" mode="portrait" />
      <Text style={{ color: "var(--accent-8)" }}>Version 0.1.0</Text>
      {/*
      TODO: Actual version, License, GitHub link, Developer profile
        */}
    </Flex>
  );
}
