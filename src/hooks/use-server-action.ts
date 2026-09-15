"use client";

import { useCallback, useState, useTransition } from "react";
import type { ActionResult } from "@/actions/types";

/** Keeps client components free of repetitive pending/error handling around a server action. */
export function useServerAction<TInput, TData>(
  action: (input: TInput) => Promise<ActionResult<TData>>,
) {
  const [result, setResult] = useState<ActionResult<TData> | null>(null);
  const [isPending, startTransition] = useTransition();

  const execute = useCallback(
    (input: TInput) =>
      new Promise<ActionResult<TData>>((resolve) => {
        startTransition(async () => {
          const next = await action(input);
          setResult(next);
          resolve(next);
        });
      }),
    [action],
  );

  return {
    execute,
    isPending,
    result,
    error: result && !result.success ? result.error : null,
    reset: () => setResult(null),
  };
}
