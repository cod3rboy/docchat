import { JSX } from "react";
import {
  Blockquote,
  Code,
  Heading,
  Link,
  Separator,
  Strong,
  Table,
  Text,
} from "@radix-ui/themes";
import { ExtraProps } from "react-markdown";
import clsx from "clsx";
import "highlight.js/styles/github.css";
import { Responsive } from "@radix-ui/themes/dist/cjs/props/prop-def";
import "../markdown.css";

export type MdCodeProps = Omit<JSX.IntrinsicElements["code"], "color"> &
  ExtraProps;

function MdCode({ node, className, children, ...props }: MdCodeProps) {
  return (
    <Code className={clsx(className)} {...props}>
      {children}
    </Code>
  );
}

type Headings = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingProps = {
  [key in Headings]: Omit<JSX.IntrinsicElements[key], "color"> & ExtraProps;
};
export type MdH1Props = HeadingProps["h1"];
export type MdH2Props = HeadingProps["h2"];
export type MdH3Props = HeadingProps["h3"];
export type MdH4Props = HeadingProps["h4"];
export type MdH5Props = HeadingProps["h5"];
export type MdH6Props = HeadingProps["h6"];

function getHeadingComponent(heading: Headings) {
  return ({
    node,
    className,
    children,
    ...props
  }: HeadingProps[typeof heading]) => {
    const sizes: Record<
      Headings,
      Responsive<"7" | "6" | "5" | "4" | "3" | "2">
    > = {
      h1: "7",
      h2: "6",
      h3: "5",
      h4: "4",
      h5: "3",
      h6: "2",
    };
    return (
      <Heading
        my="2"
        as={heading}
        weight="medium"
        size={sizes[heading]}
        {...props}
      >
        {children}
      </Heading>
    );
  };
}

export type MdHrProps = Omit<JSX.IntrinsicElements["hr"], "color"> & ExtraProps;

function MdHr({ node, className, ...props }: MdHrProps) {
  return <Separator className={className} my="2" size="4" {...props} />;
}

export type MdPProps = Omit<JSX.IntrinsicElements["p"], "color"> & ExtraProps;

function MdP({ node, className, children, ...props }: MdPProps) {
  return (
    <Text as="p" my="0.4rem" className={className} {...props}>
      {children}
    </Text>
  );
}

export type MdOListProps = Omit<JSX.IntrinsicElements["ol"], "color"> &
  ExtraProps;

function MdOList({ node, className, children, ...props }: MdOListProps) {
  return (
    <ol className={clsx(className, "list-decimal", "pl-8")} {...props}>
      {children}
    </ol>
  );
}

export type MdUListProps = Omit<JSX.IntrinsicElements["ul"], "color"> &
  ExtraProps;

function MdUList({ node, className, children, ...props }: MdUListProps) {
  return (
    <ul className={clsx(className, "list-disc", "pl-8")} {...props}>
      {children}
    </ul>
  );
}

export type MdBlockquoteProps = Omit<
  JSX.IntrinsicElements["blockquote"],
  "color"
> &
  ExtraProps;

function MdBlockquote({
  node,
  className,
  children,
  ...props
}: MdBlockquoteProps) {
  return (
    <Blockquote className={className} {...props}>
      {children}
    </Blockquote>
  );
}

export type MdAProps = Omit<JSX.IntrinsicElements["a"], "color"> & ExtraProps;

function MdA({ node, className, href, children, ...props }: MdAProps) {
  return (
    <Link className={className} href={href} {...props}>
      {children}
    </Link>
  );
}

export type MdTableCellProps = Omit<JSX.IntrinsicElements["td"], "color"> &
  ExtraProps;

function MdTableCell({
  node,
  className,
  width,
  children,
  ...props
}: MdTableCellProps) {
  let cellWidth: Responsive<string> | undefined;
  if (typeof width === "string") {
    cellWidth = width;
  }
  if (typeof width === "number") {
    cellWidth = width.toString();
  }

  return (
    <Table.Cell width={cellWidth} className={className} {...props}>
      {children}
    </Table.Cell>
  );
}

export const Markdown = {
  Code: MdCode,
  H1: getHeadingComponent("h1"),
  H2: getHeadingComponent("h2"),
  H3: getHeadingComponent("h3"),
  H4: getHeadingComponent("h4"),
  H5: getHeadingComponent("h5"),
  H6: getHeadingComponent("h6"),
  Hr: MdHr,
  P: MdP,
  Strong: Strong,
  Ol: MdOList,
  Ul: MdUList,
  Blockquote: MdBlockquote,
  A: MdA,
  Table: Table.Root,
  THead: Table.Header,
  Tr: Table.Row,
  Th: Table.ColumnHeaderCell,
  TBody: Table.Body,
  Td: MdTableCell,
};
