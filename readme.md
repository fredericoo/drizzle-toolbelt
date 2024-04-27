# Drizzle Toolbelt

Set of tools for [drizzle-orm](https://github.com/drizzle-team/drizzle-orm).

## Installation

```bash
npm i drizzle-toolbelt
```

## Usage

### `takeFirst`

Takes first element from array if it exists.

```ts
import { db } from "./db";
import { users } from "./schema";
import { takeFirst } from "drizzle-toolbelt";


const firstUserOrUndefined = await db.select().from(users)
 .then(takeFirst);
 ```

### `takeFirstOrThrow`

Takes first element from array or throws if length is zero.

**With default error**

```ts
import { db } from "./db";
import { users } from "./schema";
import { takeFirstOrThrow } from "drizzle-toolbelt";

const firstUserOrThrowDefault = await db
  .select()
  .from(users)
  // throw inline
  .then(takeFirstOrThrow());

// or

// prepare errors
const takeFirstOrError = takeFirstOrThrow();
const takeFirstOrUnauthorized = takeFirstOrThrow(new UnauthorizedError("You cannot view this page."));

// and pass it
const firstUserOrThrow = await db
  .select()
  .from(users)
  .then(takeFirstOrError);

const firstUserOrUnauthorized = await db
  .select()
  .from(users)
  .then(takeFirstOrUnauthorized);
```

### `aggregate`

Aggregates rows from a query.

Example:
```ts
import { db } from "./db";
import { users } from "./schema";
import { aggregate } from "drizzle-toolbelt";

const usersWithPosts = await db.select({
  id: users.id,
  post: posts
}).from(users)
.leftJoin(posts.id, eq(posts.author_id, users.id))
.then(aggregate({ pkey: 'id', fields: { posts: 'post.id' } }));
 ```

This will:
- group all users by their id (`pkey`)
- remove the `post` property from the rows
- aggregate all posts in the property `posts` (set in `fields`) by their id (`posts.id`)

The final type will be:

```ts
type Aggregated = {
  id: number;
  // `post` ras removed
  // `posts` was added as an array of `post`
  posts: { id: number, …otherPostProperties }[]; 
}
```

#### Data-first

You may choose to pass rows in the arguments to call `aggregate` in a stand-alone way.

```ts
import { db } from "./db";
import { users } from "./schema";
import { aggregate } from "drizzle-toolbelt";

const usersRows = await db.select({
  id: users.id,
  post: posts
}).from(users)
.leftJoin(posts.id, eq(posts.author_id, users.id))

const usersWithPosts = aggregateRows({rows, pkey: 'id', fields: { posts: 'post.id' }});
 ```

## Contributing

This project is open to contributions. Feel free to open an issue or a pull request.

## License

MIT