# drizzle-toolbelt

## 1.2.0

### Minor Changes

- Add `transform` method with data-first and data-last overloads

## 1.1.1

### Patch Changes

- Now correctly serving output files

## 1.1.0

### Minor Changes

- 8e71ed1: Remove `aggregateRows`, made `aggregate` overload to handle the logic.

### Patch Changes

- 8e71ed1: `takeFirstOrThrow` is now a curry with a default error.
  Simplified the API to no longer accept strings for error messages.

## 1.0.0

### Major Changes

- 3d39849: Released initial version with `takeFirst`, `takeFirstOrThrow`, `aggregate` and `aggregateRows` utilities
