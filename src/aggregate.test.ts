import { describe, expect, test } from 'bun:test';
import { aggregate } from './aggregate';

describe('aggregate', () => {
	test('aggregates rows', async () => {
		const rows = [
			{ id: 1, name: 'salem', age: 8, post: { id: 1, title: '1' } },
			{ id: 1, name: 'salem', age: 8, post: { id: 4, title: '4' } },
			{ id: 2, name: 'mimo', age: 7, post: { id: 2, title: '2' } },
			{ id: 3, name: 'tapi', age: 6, post: { id: 3, title: '3' } },
		];

		const aggregated = aggregate({
			rows,
			pkey: 'id',
			fields: { posts: 'post.id' },
		});

		expect(aggregated).toEqual([
			{
				id: 1,
				name: 'salem',
				age: 8,
				posts: [
					{ id: 1, title: '1' },
					{ id: 4, title: '4' },
				],
			},
			{ id: 2, name: 'mimo', age: 7, posts: [{ id: 2, title: '2' }] },
			{ id: 3, name: 'tapi', age: 6, posts: [{ id: 3, title: '3' }] },
		]);
	});

	test('errors if wrong path', async () => {
		const rows = [
			{ id: 1, name: 'salem', age: 8, post: { id: 1, title: '1' } },
			{ id: 1, name: 'salem', age: 8, post: { id: 4, title: '4' } },
			{ id: 2, name: 'mimo', age: 7, post: { id: 2, title: '2' } },
			{ id: 3, name: 'tapi', age: 6, post: { id: 3, title: '3' } },
		];

		expect(() =>
			// @ts-expect-error - wrong path, should warn
			aggregate({
				rows,
				pkey: 'id',
				fields: { posts: 'post.non_existent' },
			}),
		).toThrowError();
	});

	test('data-last is typesafe when called in-promise', async () => {
		const getRows = async () => {
			return [
				{ id: 1, name: 'salem', age: 8, post: { id: 1, title: '1' } },
				{ id: 1, name: 'salem', age: 8, post: { id: 4, title: '4' } },
				{ id: 2, name: 'mimo', age: 7, post: { id: 2, title: '2' } },
				{ id: 3, name: 'tapi', age: 6, post: { id: 3, title: '3' } },
			];
		};

		const aggregated = await getRows().then(
			aggregate({
				pkey: 'id',
				fields: { posts: 'post.id' },
			}),
		);

		expect(aggregated).toEqual([
			{
				id: 1,
				name: 'salem',
				age: 8,
				posts: [
					{ id: 1, title: '1' },
					{ id: 4, title: '4' },
				],
			},
			{ id: 2, name: 'mimo', age: 7, posts: [{ id: 2, title: '2' }] },
			{ id: 3, name: 'tapi', age: 6, posts: [{ id: 3, title: '3' }] },
		]);

		expect(
			getRows().then(
				// @ts-expect-error - wrong path, should warn
				aggregate({
					pkey: 'id',
					fields: { posts: 'post.non_existent' },
				}),
			),
		).rejects.toThrowError();
	});
});
