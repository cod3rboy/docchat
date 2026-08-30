import { Flex, Text } from "@radix-ui/themes";
import { Brand } from "./Brand";
import { useBuildInfo } from "../hooks/useBuildInfo";

export interface AboutProps {}

export function About({}: AboutProps) {
  const { version, build } = useBuildInfo();

  return (
    <Flex direction="column" align="center" py="6" gap="4">
      <Brand size="md" mode="portrait" />
      <Flex direction="column" align="center" gap="1">
        <Text size="2" style={{ color: "var(--accent-9)" }}>
          Build: {build}
        </Text>
        <Text size="2" style={{ color: "var(--accent-9)" }}>
          Version: {version}
        </Text>
      </Flex>
      {/*
      TODO: Actual version, License, GitHub link, Developer profile
        */}
    </Flex>
  );
}
