export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export function validationError<T = undefined>(error: {
  flatten: () => { fieldErrors: unknown };
}): ActionResult<T> {
  return {
    success: false,
    error: "Please correct the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
  };
}
