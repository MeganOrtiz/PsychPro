import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTopicId } from "../src/lib/topicId";

test("valid topic IDs preserve their exact integer value", () => {
  for (const [raw, expected] of [["1", 1], ["42", 42], ["001", 1], ["2147483647", 2147483647]] as const) {
    assert.equal(parseTopicId(raw), expected);
  }
});

test("invalid topic IDs cannot reach PostgreSQL or silently select a different topic", () => {
  for (const raw of [
    "sample", "1abc", "1.5", "1e2", "0x10", "-1", "0", "", " ", " 1 ",
    "2147483648", "9999999999999999999999999999", undefined, null, ["1"], 1,
  ]) {
    assert.equal(parseTopicId(raw), null, String(raw));
  }
});
