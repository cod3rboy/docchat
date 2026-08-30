import { type PropsWithChildren, type MouseEventHandler } from "react";
import { type LinkProps, Link } from "@radix-ui/themes";
import { BrowserOpenURL as openUrlInBrowser } from "../../wailsjs/runtime/runtime";

const openExternalLinkOnClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
  e.preventDefault();
  const link = e.currentTarget.href;
  openUrlInBrowser(link);
};

export interface BrowserLinkProps extends Omit<LinkProps, "onClick"> {}

export function BrowserLink({
  children,
  ...props
}: PropsWithChildren<BrowserLinkProps>) {
  return (
    <Link onClick={openExternalLinkOnClick} {...props}>
      {children}
    </Link>
  );
}
