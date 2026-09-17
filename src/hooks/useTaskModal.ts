"use client";

import { useState, useCallback } from "react";

export type TaskMode = "create" | "edit" | "review" | "approval" | "view";

/**
 * Hook khusus untuk mengelola state TaskModal beserta data payload & mode pengerjaan.
 */
export function useTaskModal<T = unknown>() {
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState<T | null>(null);
  const [mode, setMode] = useState<TaskMode>("create");

  const openTask = useCallback(
    (data: T | null = null, taskMode: TaskMode = "create") => {
      setTaskData(data);
      setMode(taskMode);
      setIsOpen(true);
    },
    []
  );

  const closeTask = useCallback(() => {
    setIsOpen(false);
    setTaskData(null);
  }, []);

  return {
    isOpen,
    taskData,
    mode,
    openTask,
    closeTask,
    setTaskData,
    setMode,
  };
}
