import { db } from "./index";
import { studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable, quizQuestionsTable } from "./schema";
import { eq } from "drizzle-orm";

async function completeStatsTopic() {
  const topicId = 21;

  const studyGuideContent = `# Quantitative Statistics & Research Methods — Study Guide

## 1. Foundations of Research Methods

Research methods are systematic processes for gathering evidence to support theoretical claims. A **valid claim** asserts that "X and ONLY X causes/is associated with Y." An **invalid claim** introduces confounds (Z) — alternative explanations that distort or invalidate the claim.

**Key terms:**
- **Research Design:** Setting up the comparison structure (what varies vs. what doesn't)
- **Research Method:** How data are collected and observations controlled
- **Data:** Observations of what is varying — did something happen, and how much?
- **Effect size** is preferred over p-value: p tells you IF an effect exists; effect size tells you HOW LARGE it is

---

## 2. Internal vs. External Validity

| Concept | Definition |
|---|---|
| **Internal Validity** | X and ONLY X causes Y — all alternatives ruled out |
| **External Validity** | Findings can be generalized to other populations/settings |
| **Statistical Conclusion Validity** | Accuracy of statistical conclusions (Type I & II errors) |

**Key rule:** Never criticize a study for lack of external validity — it can never be fully achieved.

**Type I Error (false positive):** Concluding an effect exists when it does NOT. Caused by fishing, overly large samples, or inflated alpha.

**Type II Error (false negative):** Concluding no effect exists when it DOES. Caused by insufficient sample size (underpowered study).

---

## 3. Threats to Internal Validity

| Threat | Description |
|---|---|
| **Attrition/Dropout** | Those who stayed differ from those who left |
| **Maturation** | Participants improve naturally over time |
| **Regression to the Mean** | Extreme scores naturally move toward average |
| **History** | External events occur alongside treatment |
| **Demand Characteristics** | Participants/researchers alter behavior based on expectations |
| **Selection Bias** | Groups were formed non-equivalently before study began |
| **Cohort Effects** | Generation-based differences (e.g., Seattle Longitudinal Study) |
| **Participant Practice Effects** | Getting better from repeated testing, not treatment |
| **Autocorrelation** | Time-point scores automatically correlate — not truly statistically related |

---

## 4. Research Designs

### Between-Groups (Cross-Sectional/Factorial)
- Compares distinct groups at one time point
- Uses ANOVA (one DV), MANOVA (multiple DVs), ANCOVA (with covariate control)
- **Factorial Design:** Multiple IVs — examines main effects AND interactions
- **ANCOVA:** Statistically removes covariates (extraneous variables related to DV)

### Within-Subjects (Repeated Measures/Longitudinal)
- Same participants measured multiple times — each serves as their own control
- Controls for individual differences and extraneous variables
- **ABAB Design:** Baseline-Treatment-Baseline-Treatment (not used when withdrawal is unethical)
- **Multiple Baseline Design:** Sequential treatment across settings/tasks/subjects
- **Counterbalancing:** ACT of rearranging order to control carry-over effects
- **Latin-Square Design:** USE of predetermined counterbalancing order
- **Solomon Four-Group Design:** Controls for pre-test practice effects

### Mixed Design
- Combines between-groups AND within-subjects components
- Analyzed with: Split-plot ANOVA, Repeated Measures ANOVA + Between-Group Effect, HLM

### Experimental Designs
- **RCT (Gold Standard):** Random SELECTION + Random ASSIGNMENT eliminates known and unknown confounds
- **Quasi-Experimental:** No random assignment — lower internal validity; primary threat = selection bias
- **Matching:** Balances groups by pairing participants on key variables (Basic or Propensity Score)
- **Block/Stratified Randomization:** Ensures equal representation of demographic strata in each group

---

## 5. Descriptive Designs

| Design | Purpose |
|---|---|
| Surveys | Document nature/frequency of psychological variables |
| Correlations | Explore associations — direction and strength |
| Regressions | Identify predictors; multiple known variables |
| Trend Analysis | Linear vs. curvilinear relationships |
| Path Analysis | Multiple pathways from X to Y |
| SEM | Latent traits (circles) from observable indicators (boxes) |

---

## 6. Moderators vs. Mediators

**MODERATORS** — CHANGE the X-Y relationship
- Creates an interaction effect between X and moderator on Y
- Parallel lines on graph = NO moderation; Crossing lines = MODERATION
- Can be categorical (groups) or continuous (range)

**MEDIATORS** — EXPLAIN the X-Y relationship (the WHY)
- Temporal order: X → Mediator → Y
- Always theoretical; not a single statistical test
- Must first establish X-Y relationship exists before testing mediation

**Examples:**
- Mindfulness (X) → Feeling grounded (M) → Reduced PTSD (Y) — MEDIATOR
- Job stress → Burnout, moderated by supervisory status — MODERATOR

---

## 7. Reliability

| Type | What It Measures | Method |
|---|---|---|
| Cronbach's Alpha (α) | Internal consistency of items | Correlation of item intercorrelations |
| Spearman-Brown | Split-half reliability (corrected) | Split test, correlate halves, correct |
| Kuder-Richardson (KR-20) | Dichotomous item consistency | For 0/1 scored items |
| Test-Retest | Stability over time (traits only) | ICC, paired t-test |
| Inter-Rater | Observer agreement | Cohen's kappa, % agreement |

**Reliability coefficient:** 0–1 scale. ≥.80 = good; <.60 = concerning.

**SEM = SD × √(1 − rxx)** → 95% CI = score ± 2(SEM)

**Rater errors:** Consensual Observer Drift, Halo Effect, Central Tendency, Unclear Categories

**Target inter-rater reliability:** κ ≥ .80

---

## 8. Validity (Psychometrics)

| Type | What It Establishes |
|---|---|
| **Construct** | Overall — does it measure the intended construct? (umbrella) |
| **Content** | Items cover all domains of the construct (table of contents) |
| **Face** | Items "look right" superficially |
| **Convergent** | Moderate correlation with similar constructs |
| **Discriminant/Divergent** | Low correlation with different constructs (r = .3–.5) |
| **Criterion/Concurrent** | Agreement with a concurrent gold standard |
| **Criterion/Predictive** | Predicts a future criterion |

**Key rule:** Validity always involves 2 variables; reliability involves 1.

---

## 9. Sample Size & Power Analysis

**Statistical Power = Probability of correctly rejecting the null when it is false**

**Power = .80 (80%) is the standard target.**

**A priori power analysis requires:**
1. Alpha level (α = .05)
2. Anticipated effect size (small = .3–.4; medium = .4–.6; large = .6–.9)
3. Desired power level (.80)

**To increase power:** Increase sample size | Increase alpha level | Increase effect size

**Underpowered** (n too small) → Type II error risk
**Overpowered** (n too large) → Type I error risk (fishing)

**General rule of thumb:** n > 30 (approximates normal distribution)

---

## 10. Sampling Methods

| Method | Description |
|---|---|
| Random Selection | Everyone has equal chance — reduces selection bias |
| Convenience Sampling | Whoever is available |
| Stratified Sampling | Ensures balance across subgroups (e.g., gender) |
| Snowball Sampling | Participant refers others (consent required) |

**Sampling Error vs. Bias:** Error = chance (unavoidable); Bias = systematic (mitigable)

---

## 11. Data Collection Methods

| Method | Pros | Cons |
|---|---|---|
| Self-Report | Easy, captures internal states | Distortion, over/under-estimation |
| Rating Scales | Multiple informants | Informants lack full insight |
| Third-Party Observation | Objective behavior | Psychological variables not always visible |
| Physical Measurement | Objectivity | Costly, not always feasible |

---

## Key Formulas

| Formula | Description |
|---|---|
| SEM = SD × √(1 − rxx) | Standard error of measurement |
| 95% CI = X ± 2(SEM) | 95% confidence interval for a score |
| Error variance = 1 − rxx | Proportion of score variance due to error |
| Power = .80; α = .05 | Standard power analysis parameters |`;

  const [studyGuide] = await db
    .insert(studyGuidesTable)
    .values({
      topicId,
      title: "Quantitative Statistics & Research Methods — Complete Study Guide",
      content: studyGuideContent,
    })
    .returning();
  console.log(`✓ Study guide created id=${studyGuide.id}`);

  const [practiceExam] = await db
    .insert(practiceExamsTable)
    .values({
      topicId,
      title: "Quantitative Statistics & Research Methods Practice Exam",
      timeLimit: 90,
      passingScore: 70,
    })
    .returning();
  console.log(`✓ Practice exam created id=${practiceExam.id}`);

  const questions = await db
    .select({ id: quizQuestionsTable.id })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.topicId, topicId));

  const examQRows = questions.map((q, i) => ({
    examId: practiceExam.id,
    questionId: q.id,
    questionOrder: i + 1,
  }));

  await db.insert(practiceExamQuestionsTable).values(examQRows);
  console.log(`✓ Linked ${examQRows.length} questions to practice exam`);

  console.log(`\n✅ Topic ${topicId} fully seeded!`);
}

completeStatsTopic()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); });
