import { createContext, PropsWithChildren, useEffect, useState } from "react";
import {
  Build as getAppBuild,
  Version as getAppVersion,
} from "../../wailsjs/go/main/BuildInfo";

export interface BuildInfo {
  version: string;
  build: string;
}

const defaultBuildInfo: BuildInfo = {
  version: "dev",
  build: "unknown",
};

export const BuildContext = createContext<BuildInfo>(defaultBuildInfo);

export function BuildInfoProvider({ children }: PropsWithChildren) {
  const [buildInfo, setBuildInfo] = useState<BuildInfo>(defaultBuildInfo);

  useEffect(() => {
    (async () => {
      const build = await getAppBuild();
      const version = await getAppVersion();
      setBuildInfo({ version, build });
    })();
  }, []);

  return (
    <BuildContext.Provider value={buildInfo}>{children}</BuildContext.Provider>
  );
}
