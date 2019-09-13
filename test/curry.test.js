import test from "tape";
import { curry2, curry3, curry4 } from "../src/utils";

const add2 = curry2((x, y) => x + y);
const add3 = curry3((x, y, z) => x + y + z);
const add4 = curry4((w, x, y, z) => w + x + y + z);
const setV = curry3((value, field, object) => ({
  ...object,
  field: value
}));

test("curry2", assert => {
  assert.equal(add2(1)(2), 3);
  assert.end();
});

test("curry3", assert => {
  assert.equal(add3(1)(2)(3), 6);
  assert.end();
});

test("curry4", assert => {
  assert.equal(add4(1)(2)(3)(4), 10);
  assert.end();
});

test("curryUnset", assert => {
  assert.equal(setV(undefined, "x", { x: 5 }).x, undefined);
  assert.end();
});
