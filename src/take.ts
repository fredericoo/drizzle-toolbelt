/** Takes first element from array if it exists.
 *  Intended to be used with the drizzle query builder.
 *
 * @example
 * ```ts
 * const firstUserOrUndefined = await db.select().from(users).…
 * .then(takeFirst);
 * ```
 */
export const takeFirst = <T>(arr: Array<T> | ReadonlyArray<T>): T | undefined =>
  arr[0];

/** Takes first element from array or throws if no results.
 *  Intended to be used with the drizzle query builder.
 *
 * @example
 * ```ts
 * const firstUserOrThrow = awaitdb.select().from(users).…
 * .then(takeFirstOrThrow, "No users found");
 *
 * const firstUserOrThrowCustom = awaitdb.select().from(users).…
 * .then(takeFirstOrThrow, new UnauthorizedError("You cannot view this page."));
 * ```
 */
export const takeFirstOrThrow = <T>(
  arr: T[],
  error?: string | Error
): NonNullable<T> => {
  if (!arr[0]) {
    if (error === undefined) throw new Error("No rows found.");
    if (typeof error === "string") throw new Error(error);
    throw error;
  }
  return arr[0];
};
