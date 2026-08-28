import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  PropsWithChildren,
} from "react";
import { Theme } from "@radix-ui/themes";
import {
  WindowSetLightTheme,
  WindowSetDarkTheme,
} from "../../wailsjs/runtime/runtime";
import {
  GetThemeSettings as getThemeSettings,
  ChangeThemeMode as changeThemeMode,
  ChangeThemeAccent as changeThemeAccent,
} from "../../wailsjs/go/bindings/Settings";
import { colors } from "../../lib/theme";

export const accentColors = colors;

// prettier-ignore
export const modes = ['auto','light', 'dark'] as const;

const systemModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

export type Mode = (typeof modes)[number];
export type AccentColor = (typeof accentColors)[number];

export type AppTheme = {
  mode: Mode;
  accent: AccentColor;
};

export interface AppThemeActions {
  changeMode: (mode: Mode) => void;
  changeAccent: (color: AccentColor) => void;
}

const defaultTheme: AppTheme = {
  mode: "auto",
  accent: "blue",
};

const defaultActions: AppThemeActions = {
  changeMode: () => {},
  changeAccent: () => {},
};

export type AppThemeContextValue = AppTheme & AppThemeActions;

export const AppThemeContext = createContext<AppThemeContextValue>(
  Object.assign({}, defaultTheme, defaultActions),
);

export interface ThemeProviderProps {}

export function ThemeProvider({
  children,
}: PropsWithChildren<ThemeProviderProps>) {
  const [systemMode, setSystemMode] = useState<Exclude<Mode, "auto">>(() => {
    return systemModeMediaQuery.matches ? "dark" : "light";
  });
  const [theme, setTheme] = useState<AppTheme>(defaultTheme);

  const changeMode = useCallback((mode: Mode) => {
    setTheme((prev) => ({ ...prev, mode }));
    changeThemeMode(mode);
  }, []);

  const changeAccent = useCallback((accent: AccentColor) => {
    setTheme((prev) => ({ ...prev, accent }));
    changeThemeAccent(accent);
  }, []);

  const ctxValue: AppThemeContextValue = useMemo(
    () => ({ ...theme, changeMode, changeAccent }),
    [theme, changeMode, changeAccent],
  );

  useEffect(() => {
    // load initial theme
    (async () => {
      const themeSettings = await getThemeSettings();
      const theme: AppTheme = { ...defaultTheme };
      if (modes.includes(themeSettings.mode as Mode)) {
        theme.mode = themeSettings.mode as Mode;
      }
      if (accentColors.includes(themeSettings.accent as AccentColor)) {
        theme.accent = themeSettings.accent as AccentColor;
      }
      setTheme(theme);
    })();
  }, []);

  useEffect(() => {
    // respond to system theme mode changes
    const handleSystemModeChange = () => {
      const systemMode = systemModeMediaQuery.matches ? "dark" : "light";
      setSystemMode(systemMode);
    };

    systemModeMediaQuery.addEventListener("change", handleSystemModeChange);

    return () => {
      systemModeMediaQuery.removeEventListener(
        "change",
        handleSystemModeChange,
      );
    };
  }, []);

  useEffect(() => {
    // respond to theme mode changes
    const isLight =
      theme.mode === "light" ||
      (theme.mode === "auto" && systemMode === "light");
    const isDark =
      theme.mode === "dark" || (theme.mode === "auto" && systemMode === "dark");
    if (isLight) {
      WindowSetLightTheme();
      return;
    }
    if (isDark) {
      WindowSetDarkTheme();
      return;
    }
  }, [theme.mode, systemMode]);

  return (
    <AppThemeContext.Provider value={ctxValue}>
      <Theme
        appearance={theme.mode === "auto" ? systemMode : theme.mode}
        accentColor={theme.accent}
      >
        {children}
      </Theme>
    </AppThemeContext.Provider>
  );
}
