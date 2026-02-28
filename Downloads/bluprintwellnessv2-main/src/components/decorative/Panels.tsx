"use client";

import { useState, useEffect } from "react";
import { scrollEvents } from "@/lib/scroll-events";

export default function Panels() {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  useEffect(() => {
    const handleToggle = (data: { panel: string; active: boolean }) => {
      if (data.panel === "left") setLeftActive(data.active);
      if (data.panel === "right") setRightActive(data.active);
    };
    scrollEvents.on("togglePanel", handleToggle);
    return () => scrollEvents.off("togglePanel", handleToggle);
  }, []);

  return (
    <>
      <div className={`panel panel--left ${leftActive ? "active" : ""}`} />
      <div className={`panel panel--right ${rightActive ? "active" : ""}`} />
    </>
  );
}
