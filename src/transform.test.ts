import { describe, test, expect } from 'bun:test';
import { transform } from './transform';
import { aggregate } from './aggregate';

describe('transform', () => {
	test('data-first', async () => {
		const rows = [
			{ id: 1, name: 'salem', age: 8, post: { id: 1, title: '1' } },
			{ id: 1, name: 'salem', age: 8, post: { id: 4, title: '4' } },
			{ id: 2, name: 'mimo', age: 7, post: { id: 2, title: '2' } },
			{ id: 3, name: 'tapi', age: 6, post: { id: 3, title: '3' } },
		];

		const transformed = transform({
			rows,
			fields: {
				name: (row) => row.name.toUpperCase(),
				post: (row) => ({ id: row.post.id, title: +row.post.title }),
			},
		});

		expect(transformed).toEqual([
			{ id: 1, name: 'SALEM', age: 8, post: { id: 1, title: 1 } },
			{ id: 1, name: 'SALEM', age: 8, post: { id: 4, title: 4 } },
			{ id: 2, name: 'MIMO', age: 7, post: { id: 2, title: 2 } },
			{ id: 3, name: 'TAPI', age: 6, post: { id: 3, title: 3 } },
		]);
	});

	test('data-last', async () => {
		const getRows = async () => [
			{ id: 1, name: 'salem', age: 8, post: { id: 1, title: '1' } },
			{ id: 1, name: 'salem', age: 8, post: { id: 4, title: '4' } },
			{ id: 2, name: 'mimo', age: 7, post: { id: 2, title: '2' } },
			{ id: 3, name: 'tapi', age: 6, post: { id: 3, title: '3' } },
		];

		const transformed = await getRows().then(
			transform({
				fields: {
					age: (row) => row.age + 1,
				},
			}),
		);

		expect(transformed).toEqual([
			{ id: 1, name: 'salem', age: 9, post: { id: 1, title: '1' } },
			{ id: 1, name: 'salem', age: 9, post: { id: 4, title: '4' } },
			{ id: 2, name: 'mimo', age: 8, post: { id: 2, title: '2' } },
			{ id: 3, name: 'tapi', age: 7, post: { id: 3, title: '3' } },
		]);
	});

	test('with aggregate', async () => {
		const getRows = async () => [
			{ id: 1, name: 'salem', age: 8, post: { id: 1, title: '1' } },
			{ id: 1, name: 'salem', age: 8, post: { id: 4, title: '4' } },
			{ id: 2, name: 'mimo', age: 7, post: { id: 2, title: '2' } },
			{ id: 3, name: 'tapi', age: 6, post: { id: 3, title: '3' } },
		];

		const transformed = await getRows()
			.then(
				aggregate({
					pkey: 'id',
					fields: { posts: 'post.id' },
				}),
			)
			.then(
				transform({
					fields: {
						age: (row) => row.age + 1,
					},
				}),
			);

		expect(transformed).toEqual([
			{
				id: 1,
				name: 'salem',
				age: 9,
				posts: [
					{ id: 1, title: '1' },
					{ id: 4, title: '4' },
				],
			},
			{ id: 2, name: 'mimo', age: 8, posts: [{ id: 2, title: '2' }] },
			{ id: 3, name: 'tapi', age: 7, posts: [{ id: 3, title: '3' }] },
		]);
	});
});
