import { Flex, Heading } from "@radix-ui/themes";
import LogoImage from "../assets/images/logo.png";

const sizes = {
  sm: {
    logo: "36",
    text: "5" as const,
  },
  md: {
    logo: "64",
    text: "7" as const,
  },
  lg: {
    logo: "128",
    text: "9" as const,
  },
};

const modes = {
  landscape: "row" as const,
  portrait: "column" as const,
};

export interface BrandProps {
  size?: keyof typeof sizes;
  mode?: keyof typeof modes;
}

export function Brand({ size = "sm", mode = "landscape" }: BrandProps) {
  return (
    <Flex direction={modes[mode]} gap="2" align="center">
      <img width={sizes[size].logo} height={sizes[size].logo} src={LogoImage} />
      <Heading as="h1" size={sizes[size].text}>
        <span style={{ color: "var(--accent-12)" }}>Doc</span>{" "}
        <span style={{ color: "var(--accent-10)" }}>Chat</span>
      </Heading>
    </Flex>
  );
}
