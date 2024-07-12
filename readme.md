# Drizzle Toolbelt

Set of tools for [drizzle-orm](https://github.com/drizzle-team/drizzle-orm).

## Installation

```bash
npm i drizzle-toolbelt
```

## Table of Contents

- [Drizzle Toolbelt](#drizzle-toolbelt)
  - [Installation](#installation)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
    - [`takeFirst`](#takefirst)
    - [`takeFirstOrThrow`](#takefirstorthrow)
    - [`aggregate`](#aggregate)
      - [Data-last](#data-last)
      - [Data-first](#data-first)
    - [`transform`](#transform)
      - [Data-last](#data-last-1)
      - [Data-first](#data-first-1)
  - [Contributing](#contributing)
  - [License](#license)

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

---

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

---

### `aggregate`

Aggregates rows from a query.

#### Data-last

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
  // `post` was removed
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

const usersWithPosts = aggregate({ rows, pkey: 'id', fields: { posts: 'post.id' }});
 ```

---

### `transform`

Transforms rows in a slightly more performant way than spreading the properties (in-place changes). Data-first and data-last overloads are available.

#### Data-last

Example:
```ts
import { db } from "./db";
import { users } from "./schema";
import { transform } from "drizzle-toolbelt";

const users = await db.select({
  id: users.id,
  name: users.name,
})
  .from(users)
  .then(transform({
    fields: {
      name: (row) => row.name.toUpperCase(),
    }
  }))
```


#### Data-first

You may choose to pass rows in the arguments to call `transform` in a stand-alone way.

```ts
import { db } from "./db";
import { users } from "./schema";
import { transform } from "drizzle-toolbelt";

const users = await db.select({
  id: users.id,
  name: users.name,
}).from(users);

const usersWithNameUppercase = transform({
  rows,
  fields: {
    name: (row) => row.name.toUpperCase(),
  }});
```

## Contributing

This project is open to contributions. Feel free to open an issue or a pull request.

## License

MIT