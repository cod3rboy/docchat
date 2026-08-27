import { useContext, useMemo } from "react";
import {
  type AppThemeContextValue,
  type Mode as _Mode,
  type AccentColor as _AccentColor,
  AppThemeContext,
  accentColors,
  modes,
} from "../providers/ThemeProvider";

export type Mode = _Mode;
export type AccentColor = _AccentColor;

export type UseAppThemeHookResult = AppThemeContextValue & {
  modes: readonly Mode[];
  accentColors: readonly AccentColor[];
};

export function useAppTheme(): UseAppThemeHookResult {
  const appThemeCtxValue = useContext(AppThemeContext);

  const hookResult = useMemo(
    () => ({
      ...appThemeCtxValue,
      modes,
      accentColors,
    }),
    [appThemeCtxValue],
  );

  return hookResult;
}
