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

Takes first element from array or throws if no results.

```ts
import { db } from "./db";
import { users } from "./schema";
import { takeFirstOrThrow } from "drizzle-toolbelt";


const firstUserOrThrow = await db.select().from(users)
 .then(takeFirstOrThrow, "No users found");

const firstUserOrThrowCustom = await db.select().from(users)
 .then(takeFirstOrThrow, new UnauthorizedError("You cannot view this page."));
 ```

### `aggregate`

Aggregates rows from a query.

Example:
```ts
import { db } from "./db";
import { users } from "./schema";
import { aggregate } from "drizzle-toolbelt";


const usersPosts = await db.select({
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
  posts: {id: number, …otherPostProperties}[];
}
```

### `aggregateRows`

Data-first version of `aggregate` to be used stand-alone.

```ts
import { db } from "./db";
import { users } from "./schema";
import { aggregateRows } from "drizzle-toolbelt";


const usersCount = await db.select().from(users)
 .then(aggregateRows("count"));
 ```
 
## License

MIT