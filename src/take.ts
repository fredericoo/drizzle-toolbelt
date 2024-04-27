/** Takes first element from array if it exists.
 *  Intended to be used with the drizzle query builder.
 *
 * @example
 * ```ts
 * const firstUserOrUndefined = await db.select().from(users).…
 * .then(takeFirst);
 * ```
 */
export function takeFirst<T>(arr: T[]): T | undefined {
	return arr[0];
}

/** Takes first element from array or throws if no results.
 *  Intended to be used with the drizzle query builder.
 *
 * @example
 * ```ts
 * ** With default error**
 * const firstUserOrThrow = awaitdb.select().from(users).then(takeFirstOrThrow());
 * ```
 * @example
 * **With custom error**
 * ```ts
 * const takeFirstOrUnauthorized = takeFirstOrThrow(new UnauthorizedError("You cannot view this page."));
 * const firstUserOrThrowCustom = awaitdb.select().from(users).then(takeFirstOrUnauthorized);
 * ```
 */
export function takeFirstOrThrow(error?: Error) {
	return <T>(arr: T[]) => _takeFirstOrThrow(arr, error);
}

function _takeFirstOrThrow<T>(arr: T[], err: Error = new Error('No rows found.')) {
	if (!arr[0]) throw err;
	return arr[0];
}
