import { db } from "./index";
import { studyGuidesTable } from "./schema";
import { eq } from "drizzle-orm";

type Replacement = { find: string; replace: string; label: string };

const replacements: Replacement[] = [
  {
    label: "Bipolar specifiers → bullets",
    find: `**Specifiers:** with anxious distress; with mixed features; with rapid cycling (≥4 mood episodes in prior 12 months); with melancholic features; with atypical features; with catatonia; with peripartum onset; with seasonal pattern; with psychotic features (mood-congruent or mood-incongruent).`,
    replace: `**Specifiers:**

- With anxious distress
- With mixed features
- With rapid cycling (≥4 mood episodes in the prior 12 months)
- With melancholic features
- With atypical features
- With catatonia
- With peripartum onset
- With seasonal pattern
- With psychotic features (mood-congruent or mood-incongruent)

**Course/severity specifiers:** in partial remission; in full remission; current severity (mild, moderate, severe).`,
  },
  {
    label: "MDD specifiers → bullets",
    find: `**Specifiers:** with anxious distress; with mixed features; with melancholic features; with atypical features; with psychotic features (mood-congruent or mood-incongruent); with catatonia; with peripartum onset (during pregnancy or within 4 weeks postpartum); with seasonal pattern.`,
    replace: `**Specifiers:**

- With anxious distress
- With mixed features
- With melancholic features
- With atypical features
- With psychotic features (mood-congruent or mood-incongruent)
- With catatonia
- With peripartum onset (during pregnancy or within 4 weeks postpartum)
- With seasonal pattern

**Course/severity specifiers:** single vs recurrent episode; in partial remission; in full remission; current severity (mild, moderate, severe).`,
  },
  {
    label: "Persistent Depressive Disorder — add specifier bullets",
    find: `### Persistent Depressive Disorder (Dysthymia)

Depressed mood **most of the day, more days than not, for ≥2 years** (≥1 year in youth, where mood may be irritable), with at least two of: poor appetite/overeating, insomnia/hypersomnia, low energy, low self-esteem, poor concentration, hopelessness. Never asymptomatic >2 months. **DSM-5 combined dysthymia and chronic MDD** under this heading.`,
    replace: `### Persistent Depressive Disorder (Dysthymia)

Depressed mood **most of the day, more days than not, for ≥2 years** (≥1 year in youth, where mood may be irritable), with at least two of: poor appetite/overeating, insomnia/hypersomnia, low energy, low self-esteem, poor concentration, hopelessness. Never asymptomatic >2 months. **DSM-5 combined dysthymia and chronic MDD** under this heading.

**Specifiers:**

- With anxious distress
- With atypical features
- With pure dysthymic syndrome (full MDD criteria not met in preceding 2 years)
- With persistent major depressive episode (full criteria met throughout)
- With intermittent major depressive episodes, with current episode
- With intermittent major depressive episodes, without current episode
- Early onset (<21 years) vs late onset (≥21 years)
- In partial remission; in full remission
- Current severity: mild, moderate, severe`,
  },
  {
    label: "PTSD specifiers → bullets",
    find: `**Specifiers:** with dissociative symptoms (depersonalization or derealization); with delayed expression (full criteria not met until ≥6 months after the event); preschool subtype for children ≤6 years (lower symptom thresholds).`,
    replace: `**Specifiers:**

- With dissociative symptoms — depersonalization (feeling detached from one's body or mental processes)
- With dissociative symptoms — derealization (experience of unreality of surroundings)
- With delayed expression (full criteria not met until ≥6 months after the event)
- Preschool subtype (children ≤6 years; lower symptom thresholds, age-adapted criteria)`,
  },
  {
    label: "OCD insight specifier → bullets",
    find: `Symptoms are time-consuming (>1 hour/day) or cause clinically significant distress/impairment. **Ego-dystonic** — the individual usually recognizes obsessions as excessive (insight specifier ranges from good/fair → poor → absent/delusional).`,
    replace: `Symptoms are time-consuming (>1 hour/day) or cause clinically significant distress/impairment. **Ego-dystonic** — the individual usually recognizes obsessions as excessive.

**Insight specifiers:**

- With good or fair insight (recognizes OCD beliefs are definitely or probably not true, or that they may or may not be true)
- With poor insight (thinks OCD beliefs are probably true)
- With absent insight / delusional beliefs (completely convinced OCD beliefs are true)

**Tic-related specifier:** current or past history of a tic disorder (carries treatment implications — augmentation with antipsychotics often more effective).`,
  },
  {
    label: "Sexual dysfunction specifiers → bullets",
    find: `All require **≥6 months duration** and clinically significant distress. DSM-5 specifiers: lifelong vs acquired; generalized vs situational; mild/moderate/severe based on distress.`,
    replace: `All require **≥6 months duration** and clinically significant distress.

**Specifiers (apply across the sexual dysfunction category):**

- Lifelong (present since first sexual experiences) vs acquired (developed after a period of normal function)
- Generalized (not limited to certain stimulation, situations, or partners) vs situational (occurs only with certain types of stimulation, situations, or partners)
- Current severity: mild, moderate, or severe (based on level of distress)`,
  },
  {
    label: "Paraphilic disorder general specifiers → bullets",
    find: `All paraphilic disorders share two general specifiers: **in a controlled environment** and **in full remission** (≥5 years asymptomatic in an uncontrolled environment).`,
    replace: `**General specifiers (apply to all paraphilic disorders):**

- In a controlled environment (settings restricting opportunity to engage in the paraphilic behavior, e.g., institutional)
- In full remission (no distress, impairment, or recurrent behavior for ≥5 years in an uncontrolled environment)

Pedophilic disorder additionally specifies: exclusive type vs nonexclusive type; sexually attracted to males, females, or both; limited to incest.`,
  },
  {
    label: "SUD course/setting specifiers → bullets",
    find: `**Severity:** mild (2–3), moderate (4–5), severe (6+). **Course specifiers:** early remission (3–12 months without criteria except craving); sustained remission (≥12 months). **Setting specifiers:** in a controlled environment; on maintenance therapy.`,
    replace: `**Severity specifiers:**

- Mild — 2 to 3 symptoms
- Moderate — 4 to 5 symptoms
- Severe — 6 or more symptoms

**Course specifiers:**

- In early remission — none of the criteria (except craving) met for ≥3 months but <12 months
- In sustained remission — none of the criteria (except craving) met for ≥12 months

**Setting specifiers:**

- In a controlled environment (e.g., locked hospital units, residential facilities, incarceration)
- On maintenance therapy (e.g., methadone, buprenorphine, naltrexone for opioid use disorder; nicotine replacement)`,
  },
  {
    label: "Add Schizophrenia specifiers section",
    find: `### Symptom Dimensions`,
    replace: `### Schizophrenia — Specifiers

Apply only after a **1-year duration** (except first episode):

**Course specifiers:**

- First episode, currently in acute episode
- First episode, currently in partial remission
- First episode, currently in full remission
- Multiple episodes, currently in acute episode
- Multiple episodes, currently in partial remission
- Multiple episodes, currently in full remission
- Continuous (symptoms meeting diagnostic criteria remain for the majority of the illness course)
- Unspecified

**Other specifiers:**

- With catatonia (cross-diagnostic specifier)
- Current severity — rated by clinician on a 0–4 scale across the 5 primary symptoms (delusions, hallucinations, disorganized speech, abnormal psychomotor behavior, negative symptoms); severity rating is optional

### Symptom Dimensions`,
  },
  {
    label: "Add Feeding & Eating Disorder specifiers section",
    find: `**Red flag — bulimia:** Severe purging can cause hypokalemia, cardiac arrhythmias, esophageal rupture (Boerhaave syndrome), and dental erosion. Electrolyte monitoring is essential.`,
    replace: `**Red flag — bulimia:** Severe purging can cause hypokalemia, cardiac arrhythmias, esophageal rupture (Boerhaave syndrome), and dental erosion. Electrolyte monitoring is essential.

### Eating Disorder Specifiers

**Anorexia nervosa — subtype specifiers (apply over the past 3 months):**

- Restricting type — weight loss accomplished primarily through dieting, fasting, and/or excessive exercise; no recurrent binge-eating or purging
- Binge-eating/purging type — recurrent episodes of binge-eating and/or purging (self-induced vomiting, laxatives, diuretics, enemas)

**Anorexia nervosa — course/severity specifiers:**

- In partial remission — low body weight criterion no longer met, but fear of weight gain or body image disturbance persists
- In full remission — none of the criteria met for a sustained period
- Current severity (BMI in adults; percentile in children/adolescents):
  - Mild — BMI ≥17 kg/m²
  - Moderate — BMI 16–16.99 kg/m²
  - Severe — BMI 15–15.99 kg/m²
  - Extreme — BMI <15 kg/m²

**Bulimia nervosa — course/severity specifiers:**

- In partial remission; in full remission
- Current severity (based on average frequency of inappropriate compensatory behaviors per week):
  - Mild — 1 to 3 episodes/week
  - Moderate — 4 to 7 episodes/week
  - Severe — 8 to 13 episodes/week
  - Extreme — ≥14 episodes/week

**Binge-eating disorder — course/severity specifiers:**

- In partial remission; in full remission
- Current severity (based on average frequency of binge-eating episodes per week):
  - Mild — 1 to 3 episodes/week
  - Moderate — 4 to 7 episodes/week
  - Severe — 8 to 13 episodes/week
  - Extreme — ≥14 episodes/week`,
  },
];

async function main() {
  const [row] = await db
    .select({ content: studyGuidesTable.content })
    .from(studyGuidesTable)
    .where(eq(studyGuidesTable.id, 10));

  if (!row) {
    throw new Error("Study guide id=10 not found");
  }

  let content = row.content;
  for (const { find, replace, label } of replacements) {
    if (!content.includes(find)) {
      throw new Error(`❌ pattern not found for: ${label}`);
    }
    content = content.replace(find, replace);
    console.log(`✓ ${label}`);
  }

  await db
    .update(studyGuidesTable)
    .set({ content })
    .where(eq(studyGuidesTable.id, 10));

  console.log(`\n✅ Topic 10 study guide updated — ${content.length} chars`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
