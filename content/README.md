# PsychPro EPPP Mastery Content

This directory contains the source content architecture for the PsychPro EPPP Mastery System.

These files are intentionally kept separate from the existing neuroscience seed in `lib/db/src/seed.ts`. The current app already has a topic/study-guide/flashcard/quiz/practice-exam data model and an MCP uploader at `/api/mcp`; these content files are the source layer that can be converted into database rows or uploaded through MCP.

## Files

- `eppp-mastery-domain-chapters.md`
  - All 8 EPPP Part 1 domains.
  - All 71 ASPPB KN knowledge-base statements.
  - Starter chapter modules with clinical relevance, learning objectives, educational content, key concepts, and practice prompts.

- `eppp-expanded-chapter-model.md`
  - The expanded PsychPro chapter model.
  - Includes the KN7 exemplar for learning principles and clinical behavior change.
  - Does not use the removed "Clinical Pearl" section.

- `eppp-comprehensive-terms-glossary.md`
  - Cross-domain glossary with 408 terms and definitions.
  - Intended for search, study-guide support, AI tutor retrieval, adaptive review, and rationale writing.
  - Not intended to become a standalone flashcard deck.

- `psychpro-visual-learning-library-spec.md`
  - Visual Learning Library system.
  - Defines palette, visual types, domain-to-visual mapping, metadata, and implementation order.

## Current App Integration

PsychPro currently stores educational content in:

- `topics`
- `study_guides`
- `flashcards`
- `quiz_questions`
- `practice_exams`
- `practice_exam_questions`
- `courses`
- `mastery_exams`
- `mastery_exam_questions`

A first dedicated EPPP seed script exists:

```bash
pnpm --filter @workspace/db run seed:eppp
```

The script reads `content/eppp-mastery-domain-chapters.md`, creates the 8 EPPP domains as `courses`, creates the 71 KN chapters as `topics`, and writes the starter chapter bodies as `study_guides`. It does not truncate or replace the existing neuroscience seed.

## Recommended Data Mapping

- Domain = course
- KN chapter = topic/lesson
- Expanded chapter body = study guide
- Chapter-derived cards = flashcards
- Chapter-derived board-style items = quiz questions
- Domain exam = mastery exam
- Visual Library assets = metadata-backed content linked by domain and KN tag

This keeps the existing neuroscience/neuropsychology content intact while allowing the EPPP Mastery System to grow as a first-class course architecture.
