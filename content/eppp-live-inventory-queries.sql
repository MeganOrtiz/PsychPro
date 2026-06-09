-- PsychPro EPPP Live Inventory Queries
-- Created: June 8, 2026
--
-- Purpose:
-- Run these against the live/staging PsychPro Postgres database before importing
-- more EPPP content. They identify why some Claude-created topics appear on
-- the Courses page and some do not.
--
-- Key app behavior:
-- - /topics API returns rows from topics.
-- - The Courses page groups lessons by topics.category.
-- - The newer mastery system uses courses plus topics.course_id.
-- - A topic can appear in /topics without being linked to courses.
-- - A course wrapper can exist without every intended topic linked by course_id.

-- 1. Inventory the Claude-reported live topics.
select
  t.id,
  t.name,
  t.category,
  t.course_id,
  c.name as linked_course_name,
  count(distinct f.id) as flashcard_count,
  count(distinct q.id) as quiz_question_count,
  count(distinct sg.id) as study_guide_count,
  count(distinct pe.id) as practice_exam_count,
  count(distinct peq.id) as practice_exam_question_count
from topics t
left join courses c on c.id = t.course_id
left join flashcards f on f.topic_id = t.id
left join quiz_questions q on q.topic_id = t.id
left join study_guides sg on sg.topic_id = t.id
left join practice_exams pe on pe.topic_id = t.id
left join practice_exam_questions peq on peq.exam_id = pe.id
where t.id between 62 and 81
group by t.id, t.name, t.category, t.course_id, c.name
order by t.id;

-- 2. Show all course/category groupings used by the visible Courses page.
select
  coalesce(nullif(t.category, ''), 'Other') as visible_course_group,
  count(*) as lesson_count,
  min(t.id) as first_topic_id,
  max(t.id) as last_topic_id
from topics t
group by coalesce(nullif(t.category, ''), 'Other')
order by visible_course_group;

-- 3. Find topics that have content but no course_id link.
-- These should still appear on /topics, but may not participate in the newer mastery system.
select
  t.id,
  t.name,
  t.category,
  t.course_id,
  count(distinct f.id) as flashcard_count,
  count(distinct q.id) as quiz_question_count,
  count(distinct sg.id) as study_guide_count,
  count(distinct pe.id) as practice_exam_count
from topics t
left join flashcards f on f.topic_id = t.id
left join quiz_questions q on q.topic_id = t.id
left join study_guides sg on sg.topic_id = t.id
left join practice_exams pe on pe.topic_id = t.id
where t.course_id is null
group by t.id, t.name, t.category, t.course_id
order by t.category, t.name;

-- 4. Find course wrappers and their linked lesson counts.
select
  c.id,
  c.name,
  c.description,
  c.display_order,
  count(t.id) as linked_lesson_count,
  me.id as mastery_exam_id,
  me.title as mastery_exam_title,
  me.question_count as mastery_question_count,
  count(meq.question_id) as mastery_pool_size
from courses c
left join topics t on t.course_id = c.id
left join mastery_exams me on me.course_id = c.id
left join mastery_exam_questions meq on meq.mastery_exam_id = me.id
group by c.id, c.name, c.description, c.display_order, me.id, me.title, me.question_count
order by c.display_order, c.name;

-- 5. Find topics likely created for EPPP but not in the 62-81 range.
select
  t.id,
  t.name,
  t.category,
  t.course_id,
  c.name as linked_course_name
from topics t
left join courses c on c.id = t.course_id
where
  t.name ilike '%EPPP%'
  or t.category ilike '%EPPP%'
  or t.category ilike '%Ethic%'
  or t.category ilike '%Development%'
  or t.category ilike '%Cognitive%'
  or t.category ilike '%Social%'
  or t.category ilike '%Biological%'
  or t.category ilike '%Assessment%'
  or t.category ilike '%Treatment%'
  or t.category ilike '%Research%'
order by t.category, t.id;

-- 6. First-pass content ownership classification.
-- This does not replace product-owner review. It is a triage view that shows
-- which rows are clearly EPPP, clearly main PsychPro, or ambiguous.
select
  t.id,
  t.name,
  t.category,
  t.course_id,
  c.name as linked_course_name,
  case
    when t.id between 62 and 81 then 'EPPP Primary - reported Claude live topic'
    when t.category ilike '%EPPP%' then 'EPPP Primary'
    when t.category ilike '%Ethic%'
      or t.category ilike '%Legal%'
      or t.category ilike '%Professional Issues%'
      or t.category ilike '%Growth%'
      or t.category ilike '%Lifespan%'
      or t.category ilike '%Cognitive-Affective%'
      or t.category ilike '%Social%Culture%'
      or t.category ilike '%Biological Bases%'
      or t.category ilike '%Assessment%Diagnosis%'
      or t.category ilike '%Treatment%Intervention%'
      or t.category ilike '%Research Methods%'
    then 'EPPP Primary - category match'
    when t.category in (
      'Foundations',
      'Neuroanatomy',
      'Neuroscience',
      'Neuropsychology',
      'Neuropsychological Assessment'
    ) then 'Main PsychPro / EPPP Support'
    when t.category in (
      'Clinical',
      'Assessment',
      'Psychotherapy',
      'Research & Statistics'
    ) then 'Needs Review - overlaps EPPP and main PsychPro'
    else 'Needs Review - uncategorized or unknown grouping'
  end as recommended_bucket,
  count(distinct f.id) as flashcard_count,
  count(distinct q.id) as quiz_question_count,
  count(distinct sg.id) as study_guide_count,
  count(distinct pe.id) as practice_exam_count
from topics t
left join courses c on c.id = t.course_id
left join flashcards f on f.topic_id = t.id
left join quiz_questions q on q.topic_id = t.id
left join study_guides sg on sg.topic_id = t.id
left join practice_exams pe on pe.topic_id = t.id
group by t.id, t.name, t.category, t.course_id, c.name
order by recommended_bucket, t.category, t.id;
