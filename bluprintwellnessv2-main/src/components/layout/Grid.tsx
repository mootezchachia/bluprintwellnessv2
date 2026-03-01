import React from "react";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`row ${className}`}>{children}</div>;
}

interface ColProps {
  children: React.ReactNode;
  span?: number;
  md?: number;
  sm?: number;
  xs?: number;
  offset?: number;
  offsetMd?: number;
  offsetSm?: number;
  offsetXs?: number;
  className?: string;
}

export function Col({ children, span, md, sm, xs, offset, offsetMd, offsetSm, offsetXs, className = "" }: ColProps) {
  const classes = [
    span ? `col-${span}` : "",
    md ? `col-md-${md}` : "",
    sm ? `col-sm-${sm}` : "",
    xs ? `col-xs-${xs}` : "",
    offset !== undefined ? `offset-${offset}` : "",
    offsetMd !== undefined ? `offset-md-${offsetMd}` : "",
    offsetSm !== undefined ? `offset-sm-${offsetSm}` : "",
    offsetXs !== undefined ? `offset-xs-${offsetXs}` : "",
    className,
  ].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}
