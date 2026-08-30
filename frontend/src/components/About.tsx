import { Badge, DataList, Flex, Grid } from "@radix-ui/themes";
import { BrowserLink } from "./BrowserLink";
import { Brand } from "./Brand";
import { useBuildInfo } from "../hooks/useBuildInfo";
import {
  FileTextIcon,
  GitHubLogoIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

export interface AboutProps {}

export function About({}: AboutProps) {
  const { version, build } = useBuildInfo();

  return (
    <Flex direction="column" gap="4">
      <Grid rows="1fr" columns="1fr 1fr" my="6" gap="4">
        <Brand size="md" mode="portrait" />
        <DataList.Root
          className="border-l border-solid border-l-(--gray-6) pl-4"
          size="1"
          orientation="vertical"
        >
          <DataList.Item>
            <DataList.Label>Build</DataList.Label>
            <DataList.Value>
              <Badge>{build}</Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Version</DataList.Label>
            <DataList.Value>
              <Badge>{version}</Badge>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Grid>

      <ul className="flex flex-col mt-6 gap-3 items-center">
        <li className="flex gap-1 items-center">
          <PersonIcon width={16} height={16} />
          <BrowserLink size="2" href="https://www.cod3rboy.com">
            Author
          </BrowserLink>
        </li>
        <li className="flex gap-1 items-center">
          <FileTextIcon width={16} height={16} />
          <BrowserLink
            size="2"
            href="https://github.com/cod3rboy/docchat/blob/master/LICENSE"
          >
            License
          </BrowserLink>
        </li>
        <li className="flex gap-1 items-center">
          <GitHubLogoIcon width={16} height={16} />
          <BrowserLink size="2" href="https://github.com/cod3rboy/docchat">
            View on GitHub
          </BrowserLink>
        </li>
      </ul>
    </Flex>
  );
}
