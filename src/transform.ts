import type { Prettify } from './utils';

export function transform<
	TRow extends Record<PropertyKey, any>,
	TTransform extends Partial<{ [K in keyof TRow]: (row: TRow) => any }>,
>(params: {
	rows: TRow[];
	fields: TTransform;
}): Prettify<
	Omit<TRow, keyof TTransform> & {
		[K in keyof TTransform]: TTransform[K] extends (params: any) => infer Ret ? Ret : never;
	}
>[];

export function transform<
	TRow extends Record<PropertyKey, any>,
	TTransform extends Partial<{ [K in keyof TRow]: (row: TRow) => any }>,
>(params: {
	fields: TTransform;
}): (rows: TRow[]) => Prettify<
	Omit<TRow, keyof TTransform> & {
		[K in keyof TTransform]: TTransform[K] extends (params: any) => infer Ret ? Ret : never;
	}
>[];

export function transform<
	TRow extends Record<PropertyKey, any>,
	TTransform extends Partial<{ [K in keyof TRow]: (row: TRow) => any }>,
>(params: {
	rows?: TRow[];
	fields: TTransform;
}) {
	// if rows is missing, build a data-last function
	if (params.rows === undefined) return (rows: TRow[]) => transform({ rows, ...params });

	for (const row of params.rows) {
		for (const key in params.fields) {
			const transform = params.fields[key];
			row[key] = transform?.(row);
		}
	}

	return params.rows;
}
