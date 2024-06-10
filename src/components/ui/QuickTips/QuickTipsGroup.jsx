"use client"

import IconChat from "@/components/icon/IconChat";
import IconFlash from "@/components/icon/IconFlash";
import IconTask from "@/components/icon/IconTask";
import QuickTipsItem from "./QuickTipsItem";
import { useState, useEffect } from "react";
import QuickChat from "../QuickChat";
import QuickTask from "../QuickTask";

export default function QuickTipsGroup({ tips }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [openDialogs, setOpenDialogs] = useState([]);
  const [container, setContainer] = useState(null);

  const handleOpenDialog = (type) => {
    setOpenDialogs((prev) => {
      const newDialogs = [...prev];
      if (!newDialogs.includes(type)) {
        newDialogs.push(type);
      }
      return newDialogs;
    });
  };

  const handleCloseDialog = (type) => {
    setOpenDialogs((prev) => prev.filter((dialog) => dialog !== type));
  };

  useEffect(() => {
    if (isChatOpen) {
      handleOpenDialog("chat");
    } else {
      handleCloseDialog("chat");
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (isTaskOpen) {
      handleOpenDialog("task");
    } else {
      handleCloseDialog("task");
    }
  }, [isTaskOpen]);

  const getIndex = (type) => openDialogs.indexOf(type);

  return (
    <>
      <div className="absolute right-0 bottom-12 flex gap-6 items-center justify-items-end flex-row-reverse " >
        <QuickTipsItem icon={<IconFlash />} type="group" />
        <div className="flex gap-6 items-center relative" ref={setContainer}>
        <QuickTipsItem icon={<IconTask />} type="task" onClick={() => setIsTaskOpen(!isTaskOpen)} />
        <QuickTipsItem icon={<IconChat />} type="chat" onClick={() => setIsChatOpen(!isChatOpen)} />
        {isChatOpen && <QuickChat key="chat" open={isChatOpen} onClose={() => setIsChatOpen(false)} index={getIndex("chat")} container={container} />}
        {isTaskOpen && <QuickTask key="task" open={isTaskOpen} onClose={() => setIsTaskOpen(false)} index={getIndex("task")} container={container} />}
        </div>
       
      </div>
     
     
    </>
  );
}