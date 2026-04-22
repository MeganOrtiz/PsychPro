import { db } from "./index";
import { studyGuidesTable } from "./schema";
import { eq } from "drizzle-orm";

const FIND = `### Substance-Specific Highlights

| Substance | Intoxication | Withdrawal | Key Notes |
|---|---|---|---|
| **Alcohol** | Slurred speech, incoordination, nystagmus, attention/memory impairment, stupor/coma | Tremor, autonomic hyperactivity, anxiety, GI upset, transient hallucinations, **seizures, delirium tremens (DTs)** | Withdrawal can be fatal — benzodiazepine taper (CIWA-Ar guides dosing); thiamine before glucose to prevent Wernicke's encephalopathy |
| **Opioid** | **Pupillary constriction** (miosis), drowsiness, slurred speech, attention/memory impairment | Dysphoria, nausea, muscle aches, lacrimation/rhinorrhea, **pupillary dilation**, piloerection, sweating, diarrhea, yawning, fever, insomnia | **Overdose triad: miosis, respiratory depression, coma — give naloxone**, expect repeat dosing with fentanyl. MAT (methadone, buprenorphine/naloxone, naltrexone) reduces overdose mortality; never discontinue MAT during hospitalization without planning |
| **Sedative/Hypnotic/Anxiolytic** | Resembles alcohol intoxication | Autonomic hyperactivity, tremor, insomnia, nausea, hallucinations/illusions, agitation, anxiety, **grand mal seizures** | **Withdrawal can be fatal** — long-acting BZD cross-taper in monitored setting |
| **Stimulants** (cocaine, amphetamine) | Tachycardia/bradycardia, pupillary dilation, BP changes, sweating, nausea, agitation, chest pain, arrhythmias, seizures | "Crash" — dysphoria, fatigue, vivid unpleasant dreams, insomnia/hypersomnia, increased appetite, psychomotor changes | **Hyperthermia, rhabdomyolysis, MI** are fatal risks; benzodiazepines first-line for agitation; **avoid pure beta-blockade** (unopposed alpha effect → hypertensive crisis). Suicide risk during crash. No FDA-approved pharmacotherapy for stimulant use disorder; **contingency management** has strongest evidence |
| **Cannabis** | Conjunctival injection, increased appetite, dry mouth, tachycardia, perceptual changes | Irritability, anxiety, sleep difficulty, decreased appetite, restlessness, depressed mood, somatic symptoms (DSM-5 added) | Adolescent use is a risk factor for psychosis |
| **Hallucinogen** | Perceptual changes (hallucinations, synesthesia), depersonalization, derealization, ideas of reference, autonomic arousal | No characteristic withdrawal syndrome | **Hallucinogen Persisting Perception Disorder (HPPD)** — flashbacks |
| **Inhalant** | Dizziness, nystagmus, incoordination, slurred speech, lethargy, tremor, blurred vision, euphoria | None recognized | Sudden sniffing death syndrome (cardiac arrhythmia) |
| **Tobacco** | (No DSM-5 intoxication category) | Irritability, anxiety, concentration difficulty, increased appetite, restlessness, depressed mood, insomnia | First-line: **varenicline, combination NRT, bupropion**; counseling + pharmacotherapy > either alone |
| **Caffeine** | Restlessness, nervousness, excitement, insomnia, flushed face, diuresis, GI disturbance, muscle twitching, rambling speech, tachycardia/arrhythmia, periods of inexhaustibility, psychomotor agitation | Headache, fatigue, dysphoric mood, concentration difficulty, flu-like symptoms | **No DSM-5 caffeine use disorder** (only intoxication and withdrawal); proposed for further study |`;

const REPLACE = `### Substance-Specific Highlights

#### Alcohol

- **Intoxication:** Slurred speech, incoordination, nystagmus, attention and memory impairment, stupor or coma
- **Withdrawal:** Tremor, autonomic hyperactivity, anxiety, GI upset, transient hallucinations, **seizures, delirium tremens (DTs)**
- **Clinical pearls:** Withdrawal can be fatal — long-acting benzodiazepine taper in a monitored setting. Always give **thiamine before glucose** to prevent Wernicke's encephalopathy.

#### Opioids

- **Intoxication:** **Pupillary constriction (miosis)**, drowsiness, slurred speech, attention and memory impairment
- **Withdrawal:** Dysphoria, nausea, muscle aches, lacrimation, rhinorrhea, **pupillary dilation**, piloerection, sweating, diarrhea, yawning, fever, insomnia. Uncomfortable but not life-threatening in adults.
- **Clinical pearls:**
  - **Overdose triad:** miosis + respiratory depression + coma → **give naloxone**; expect repeat dosing with fentanyl exposures
  - **Medications for opioid use disorder (MOUD):** methadone, buprenorphine/naloxone, naltrexone — all reduce overdose mortality
  - **Never discontinue MOUD during hospitalization** without a continuation plan

#### Sedatives, Hypnotics, and Anxiolytics

- **Intoxication:** Resembles alcohol intoxication — slurred speech, incoordination, sedation
- **Withdrawal:** Autonomic hyperactivity, tremor, insomnia, nausea, hallucinations or illusions, agitation, anxiety, **grand mal seizures**
- **Clinical pearls:** **Withdrawal can be fatal.** Manage with a long-acting benzodiazepine cross-taper in a monitored setting.

#### Stimulants (cocaine, amphetamine, methamphetamine)

- **Intoxication:** Tachycardia or bradycardia, pupillary dilation, BP changes, sweating, nausea, agitation, chest pain, arrhythmias, seizures
- **Withdrawal:** "Crash" — dysphoria, fatigue, vivid unpleasant dreams, insomnia or hypersomnia, increased appetite, psychomotor changes
- **Clinical pearls:**
  - **Hyperthermia, rhabdomyolysis, and MI** are fatal risks during intoxication
  - Benzodiazepines are first-line for agitation
  - **Avoid pure beta-blockade** — unopposed alpha effect → hypertensive crisis
  - Suicide risk is elevated during the post-binge crash
  - **No FDA-approved pharmacotherapy** for stimulant use disorder; **contingency management** has the strongest evidence base

#### Cannabis

- **Intoxication:** Conjunctival injection, increased appetite, dry mouth, tachycardia, perceptual changes
- **Withdrawal:** Irritability, anxiety, sleep difficulty, decreased appetite, restlessness, depressed mood, somatic symptoms (added in DSM-5)
- **Clinical pearls:** Adolescent use is a risk factor for later psychosis, particularly with high-potency THC products.

#### Hallucinogens

- **Intoxication:** Perceptual changes (hallucinations, synesthesia), depersonalization, derealization, ideas of reference, autonomic arousal
- **Withdrawal:** No characteristic withdrawal syndrome
- **Clinical pearls:** **Hallucinogen Persisting Perception Disorder (HPPD)** — recurrent perceptual disturbances ("flashbacks") after hallucinogen use ceases.

#### Inhalants

- **Intoxication:** Dizziness, nystagmus, incoordination, slurred speech, lethargy, tremor, blurred vision, euphoria
- **Withdrawal:** None formally recognized
- **Clinical pearls:** **Sudden sniffing death syndrome** — fatal cardiac arrhythmia, especially with halogenated hydrocarbons.

#### Tobacco / Nicotine

- **Intoxication:** No DSM-5 intoxication category for tobacco
- **Withdrawal:** Irritability, anxiety, concentration difficulty, increased appetite, restlessness, depressed mood, insomnia
- **Clinical pearls:** First-line treatments are **varenicline**, **combination nicotine replacement therapy**, and **bupropion**. Counseling plus pharmacotherapy outperforms either alone.

#### Caffeine

- **Intoxication:** Restlessness, nervousness, excitement, insomnia, flushed face, diuresis, GI disturbance, muscle twitching, rambling speech, tachycardia or arrhythmia, periods of inexhaustibility, psychomotor agitation
- **Withdrawal:** Headache, fatigue, dysphoric mood, concentration difficulty, flu-like symptoms
- **Clinical pearls:** **There is no DSM-5 caffeine use disorder** — only intoxication and withdrawal. Caffeine use disorder is included in DSM-5 Section III (proposed for further study).`;

async function main() {
  const [row] = await db
    .select({ content: studyGuidesTable.content })
    .from(studyGuidesTable)
    .where(eq(studyGuidesTable.id, 10));
  if (!row) throw new Error("Study guide id=10 not found");

  if (!row.content.includes(FIND)) {
    throw new Error("❌ Substance-Specific Highlights table not found in expected form");
  }

  const updated = row.content.replace(FIND, REPLACE);
  await db
    .update(studyGuidesTable)
    .set({ content: updated })
    .where(eq(studyGuidesTable.id, 10));

  console.log(`✅ Substance-Specific Highlights restructured. Guide: ${row.content.length} → ${updated.length} chars.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
