import { describe, expect, test } from "bun:test";
import { takeFirst, takeFirstOrThrow } from "./take";
import type { Expect, Equal } from "type-testing";

describe("takeFirst", () => {
  test("takes optional first element from array", async () => {
    const numberArray = [1, 2, 3];
    const stringArray = [1, 2, 3];
    const objArray = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const firstNumber = takeFirst(numberArray);
    expect(firstNumber).toBe(1);
    type TestNumber = Expect<Equal<typeof firstNumber, number | undefined>>;

    const firstString = takeFirst(stringArray);
    expect(firstString).toBe(1);
    type TestString = Expect<Equal<typeof firstString, number | undefined>>;

    const firstObj = takeFirst(objArray);
    expect(firstObj).toEqual({ id: 1 });
    type TestObject = Expect<
      Equal<typeof firstObj, { id: number } | undefined>
    >;
  });
});

describe("takeFirstOrThrow", () => {
  test("Returns non-nullable value", () => {
    const numberArray = [1, 2, 3];
    const stringArray = [1, 2, 3];
    const objArray = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const firstNumber = takeFirstOrThrow(numberArray);
    expect(firstNumber).toBe(1);
    type TestNumber = Expect<Equal<typeof firstNumber, number>>;

    const firstString = takeFirstOrThrow(stringArray);
    expect(firstString).toBe(1);
    type TestString = Expect<Equal<typeof firstString, number>>;

    const firstObj = takeFirstOrThrow(objArray);
    expect(firstObj).toEqual({ id: 1 });
    type TestObject = Expect<Equal<typeof firstObj, { id: number }>>;
  });

  test("throws if no elements in array", async () => {
    const emptyArray: never[] = [];
    expect(() => takeFirstOrThrow(emptyArray)).toThrowError();
  });

  test("custom error message", () => {
    const emptyArray: never[] = [];
    expect(() =>
      takeFirstOrThrow(emptyArray, "Custom error message")
    ).toThrowError("Custom error message");
  });

  test("Custom error", () => {
    class CustomError extends Error {}
    const emptyArray: never[] = [];
    expect(() => takeFirstOrThrow(emptyArray, new CustomError())).toThrowError(
      CustomError
    );
  });
});
