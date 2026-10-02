import assert from "node:assert/strict";
import { test } from "node:test";
import { practiceExamTimeLimit } from "../src/lib/practice-exam-timing";

test("all standard topic practice exams get a 15-minute whole-exam budget", () => {
  for (const timeLimit of [45, 90, 600, 1800, 0, null]) {
    assert.equal(practiceExamTimeLimit(
      { title: "Cerebellum Practice Exam", timeLimit },
      { name: "Cerebellum", category: "Neuroscience" },
    ), 900);
    assert.equal(practiceExamTimeLimit(
      { title: "Biological Bases Practice Exam", timeLimit },
      { name: "Biological Bases of Behavior", category: "EPPP Part 1" },
    ), 900);
  }
});

test("full-length sitting budgets remain unchanged regardless of identifying field", () => {
  const ordinary = { title: "Exam", timeLimit: 15300 };
  assert.equal(practiceExamTimeLimit({ ...ordinary, title: "EPPP Part 1 — Full-Length Exam" }, undefined), 15300);
  assert.equal(practiceExamTimeLimit(ordinary, { name: "Full Length Exam", category: "EPPP" }), 15300);
  assert.equal(practiceExamTimeLimit(ordinary, { name: "Part 2", category: "EPPP Part 2: Full-Length Exams" }), 15300);
});

test("new standard practice exams do not depend on saved metadata", () => {
  assert.equal(practiceExamTimeLimit({ title: "New Practice Exam", timeLimit: null }, undefined), 900);
});