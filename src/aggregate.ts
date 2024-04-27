import get from "lodash/get";

/** More performant version of Object.values */
function extractValues<T extends object>(obj: T) {
  const values: Array<T[keyof T]> = [];
  for (const key in obj) {
    values.push(obj[key]);
  }
  return values;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type FlatKey<T extends Record<string, any>> = {
  [K in keyof T]: NonNullable<T[K]> extends PropertyKey
    ? K
    : NonNullable<T[K]> extends Record<string, any>
    ? // @ts-expect-error - Performance optimization
      `${K & string}.${FlatKey<NonNullable<T[K]>>}`
    : never;
}[keyof T];
type FirstSegment<T extends string> = T extends `${infer L}.${infer _}` ? L : T;

/** Aggregates a table by a given primary key and a set of fields.
 *  Data-last, intended to be used with the drizzle query builder.
 *
 * @example
 * ```ts
 * db.select({
 *   id: users.id,
 *   post: posts
 * }).from(users)
 * .leftJoin(posts.id, eq(posts.author_id, users.id))
 * .then(aggregate({ pkey: 'id', fields: { posts: 'post' } }));
 * ```
 * */
export const aggregate =
  <
    TRow extends Record<PropertyKey, any>,
    TParent extends keyof TRow,
    TChildren extends Record<string, FlatKey<TRow>>
  >(params: {
    pkey: TParent;
    fields: TChildren;
  }) =>
  (rows: TRow[]) => {
    type NewRow = Omit<
      TRow,
      FirstSegment<TChildren[keyof TChildren] & string>
    > & {
      [K in keyof TChildren]: NonNullable<
        TRow[FirstSegment<TChildren[K] & string>]
      >[];
    };
    return extractValues(
      rows.reduce((acc, row) => {
        const uid = row[params.pkey];
        if (!(acc[uid] as TRow | undefined)) {
          acc[uid] = { ...row } as NewRow;
          for (const key in params.fields) {
            const path = params.fields[key] as string;
            const firstSegment = path.split(".").shift();
            if (!firstSegment)
              throw new Error(`First segment not found for ${path}`);
            delete acc[uid][firstSegment];
            acc[uid][key] = [] as any;
          }
        }
        for (const key in params.fields) {
          const path = params.fields[key] as string;
          const [firstSegment, ...rest] = path.split(".") as [
            string,
            ...string[]
          ];
          const pathToDedupe = rest.join(".");
          const value = row[firstSegment];
          if (!value) continue;
          const valueToDedupe =
            typeof value === "object" ? get(row, path) : value;
          if (
            acc[uid][key].some((v: any) => {
              const value = typeof v === "object" ? get(v, pathToDedupe) : v;
              if (value === undefined)
                throw new Error(
                  `No property "${pathToDedupe}" on ${JSON.stringify(v)}`
                );
              return value === valueToDedupe;
            })
          )
            continue;
          const aggregate = row[firstSegment];
          if (!aggregate) continue;
          acc[uid][key].push(aggregate);
        }
        return acc;
      }, {} as Record<TParent, NewRow>)
    ) as Prettify<NewRow>[];
  };

/** Data-first version of aggregate.
 *  Intended to be used separate from the query builder or ad-hoc.
 *
 * @example
 * ```ts
 * const rows = await db.select()…
 * const aggregated = aggregateRows({ rows, pkey: 'id', fields: { posts: 'post' } });
 * ```
 *  */
export const aggregateRows = <
  TRow extends Record<PropertyKey, any>,
  TParent extends keyof TRow,
  TChildren extends Record<string, FlatKey<TRow>>
>(params: {
  rows: TRow[];
  pkey: TParent;
  fields: TChildren;
}) => aggregate(params)(params.rows);
