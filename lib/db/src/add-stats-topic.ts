import { db } from "./index";
import {
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
} from "./schema";
import { eq } from "drizzle-orm";

async function addStatsTopic() {
  console.log("Seeding Quantitative Statistics & Research Methods topic...\n");

  // ============================================================
  // TOPIC
  // ============================================================
  const [topic] = await db
    .insert(topicsTable)
    .values({
      name: "Quantitative Statistics & Research Methods",
      description:
        "Research design, validity, reliability, psychometrics, statistical methods, power analysis, and data collection for clinical and applied research.",
      category: "Research & Statistics",
      difficulty: "intermediate",
      flashcardCount: 0,
      questionCount: 0,
    })
    .returning();

  const topicId = topic.id;
  console.log(`✓ Created topic id=${topicId}`);

  // ============================================================
  // FLASHCARDS (51)
  // ============================================================
  const flashcards: (typeof flashcardsTable.$inferInsert)[] = [
    // --- Research Foundations ---
    {
      topicId,
      question: "What is the core purpose of a research method?",
      answer: "To gather evidence (data) through a controlled process that records observations of what varies — enabling support or refutation of a theoretical claim.",
    },
    {
      topicId,
      question: "What is a validity statement?",
      answer: "'I'm right — X and only X causes/is associated with Y.' A valid claim means all alternative explanations (confounds, biases) have been ruled out.",
    },
    {
      topicId,
      question: "What is a confound?",
      answer: "A third variable (Z) that provides an alternative explanation for the relationship between X and Y, thereby invalidating the causal claim. Z is a confound when it causes/is associated with Y instead of (or in addition to) X.",
    },
    {
      topicId,
      question: "What is the difference between a research DESIGN and a research METHOD?",
      answer: "Design = setting up the comparison (what is being compared to what; structuring variation). Method = how data are collected and observations are controlled/recorded.",
    },
    {
      topicId,
      question: "Why is effect size preferred over p-value?",
      answer: "The p-value only tells you whether an effect exists (significant or not); effect size tells you HOW LARGE the effect is. With large samples, even trivial effects become statistically significant. Effect size provides practical/clinical significance.",
    },
    {
      topicId,
      question: "What are the three types of associations between X and Y?",
      answer: "1) Positive: as X increases, Y increases. 2) Negative: as X increases, Y decreases. 3) No relationship: X and Y are unrelated.",
    },
    // --- Internal / External Validity ---
    {
      topicId,
      question: "Define internal validity.",
      answer: "The extent to which a study's observed results are attributable to the variable of interest (X and ONLY X causes Y) — all other possibilities have been ruled out.",
    },
    {
      topicId,
      question: "Define external validity.",
      answer: "The extent to which study findings can be generalized to individuals with characteristics different from those in the study. Note: a study can never fully achieve external validity — never criticize a study for lack of generalizability.",
    },
    {
      topicId,
      question: "What is statistical conclusion validity?",
      answer: "The accuracy of conclusions drawn from statistical tests — whether there is or is not an effect. Threats include: low sample size, fishing for outcomes, ceiling/floor effects, and incorrect interpretation.",
    },
    {
      topicId,
      question: "What is a Type I error?",
      answer: "A false positive — concluding that an effect exists when it does NOT. Controlled by the alpha level (α = .05 means 5% chance of Type I error). Caused by fishing (running too many tests) or overly large samples.",
    },
    {
      topicId,
      question: "What is a Type II error?",
      answer: "A false negative — concluding that no effect exists when it DOES. Caused primarily by insufficient sample size (underpowered study). Addressed by power analysis.",
    },
    // --- Threats to Internal Validity ---
    {
      topicId,
      question: "What is participant attrition as a threat to internal validity?",
      answer: "When participants who drop out of a study are systematically different from those who remain — the difference in outcomes may be due to who stayed, not the treatment.",
    },
    {
      topicId,
      question: "What is regression to the mean?",
      answer: "The tendency for extreme scores to move closer to the group average on re-measurement — NOT because of treatment but due to natural statistical fluctuation. Participants who start very low tend to improve; those who start very high tend to decrease.",
    },
    {
      topicId,
      question: "What are demand characteristics?",
      answer: "When participants figure out the study's purpose and alter their behavior (participant demand) or when researchers unconsciously bias results toward their predictions (researcher demand). Fixed by single-blind (participant) or double-blind (both) designs.",
    },
    {
      topicId,
      question: "What are cohort effects?",
      answer: "Differences between study participants attributable to the time period in which they were born or grew up, rather than to the variable under study. Example: Seattle Longitudinal Intelligence Study — generational differences affect intelligence scores.",
    },
    {
      topicId,
      question: "What is selection bias in research design?",
      answer: "When the process of forming groups introduces systematic differences between groups before the study begins (e.g., volunteers vs. mandated participants), threatening the conclusion that any observed difference is due to treatment.",
    },
    // --- Between-Groups Design ---
    {
      topicId,
      question: "What is a between-groups (cross-sectional/factorial) design?",
      answer: "A design comparing two or more distinct groups at a single point in time. Each group is internally homogeneous; the only distinguishing feature between groups should be the variable of interest.",
    },
    {
      topicId,
      question: "What is ANCOVA (Analysis of Covariance)?",
      answer: "A statistical technique that statistically removes the influence of covariate(s) — extraneous variables known to be related to the DV — from the analysis, allowing a cleaner estimate of the IV's effect on the DV.",
    },
    {
      topicId,
      question: "What is MANOVA, and when is it used?",
      answer: "Multivariate Analysis of Variance — used when there are TWO OR MORE dependent variables (DVs). It controls Type I error by analyzing all DVs simultaneously rather than running multiple ANOVAs (which inflates false positive risk).",
    },
    {
      topicId,
      question: "What is a factorial design?",
      answer: "A between-groups design with multiple independent variables (factors). It allows examination of MAIN EFFECTS (effect of each IV alone) and INTERACTIONS (combined effect of two or more IVs on the DV).",
    },
    // --- Within-Subjects Design ---
    {
      topicId,
      question: "What is a within-subjects (repeated measures) design?",
      answer: "Each participant is measured multiple times (or under all conditions), serving as their own control. This controls for individual differences because extraneous variables are constant across conditions — change is attributed only to the treatment.",
    },
    {
      topicId,
      question: "What is an ABAB design and when is it NOT used?",
      answer: "A single-subject design alternating baseline (A) and treatment (B) phases to demonstrate treatment effects. NOT appropriate when withdrawing treatment raises ethical concerns (e.g., self-harm) because participants may revert to pre-treatment behavior.",
    },
    {
      topicId,
      question: "What is counterbalancing?",
      answer: "Rearranging the ORDER of conditions/treatments across participants to control for carry-over effects and sequential order effects. It is the ACT of addressing exposure effects; Latin-square design is the structured USE of counterbalancing.",
    },
    {
      topicId,
      question: "What is the Solomon Four-Group Design?",
      answer: "A design that examines the effect of the pre-test itself by including groups with and without pre-tests. It controls for PRACTICE EFFECTS — the possibility that participants improve simply from repeated exposure to the measurement instrument.",
    },
    {
      topicId,
      question: "What is autocorrelation as a threat to within-subjects designs?",
      answer: "The tendency for scores at one time point to automatically correlate with scores at another time point (not because they are truly statistically related, but because they share a common baseline). This can falsely suggest a relationship over time.",
    },
    // --- Mixed Design ---
    {
      topicId,
      question: "What is a mixed design?",
      answer: "A research design combining between-groups AND within-subjects components. Analyzed with: split-plot ANOVA, repeated measures ANOVA with between-group effect, SAS Proc Mixed, or Hierarchical Linear Modeling (HLM).",
    },
    // --- Experimental Designs ---
    {
      topicId,
      question: "What is the counterfactual, and how do experimental designs address it?",
      answer: "The counterfactual asks: 'What would a participant be like WITHOUT the treatment?' It is impossible to observe directly. Experimental designs approximate it by comparing a treatment group to a control group.",
    },
    {
      topicId,
      question: "What is a Randomized Controlled Trial (RCT) and why is it the gold standard?",
      answer: "An experimental design using RANDOM ASSIGNMENT to conditions and RANDOM SELECTION from the population. Randomization eliminates known and UNKNOWN confounds by creating equivalent groups — the only difference between groups is the treatment.",
    },
    {
      topicId,
      question: "What is a quasi-experimental design?",
      answer: "A design WITHOUT random assignment — participants remain in naturally occurring groups. Internal validity is LOWER than RCT because groups may differ on pre-existing characteristics. The primary threat is selection bias. Improved by matching techniques.",
    },
    {
      topicId,
      question: "What is block (stratified/cluster) randomization?",
      answer: "A randomization method that groups participants by a key variable (e.g., gender) and then randomly assigns within blocks — ensuring each group has equal representation of that characteristic (e.g., 10 males and 10 females in each group).",
    },
    // --- Descriptive Designs ---
    {
      topicId,
      question: "What is structural equation modeling (SEM)?",
      answer: "A statistical method using observable variables (boxes) as indicators of unobservable LATENT TRAITS (circles — e.g., personality, mental illness constructs). It models complex relationships among latent and observed variables simultaneously.",
    },
    {
      topicId,
      question: "What is path analysis?",
      answer: "A descriptive statistical method examining the MULTIPLE pathways through which a variable can influence an outcome — a complex analysis of all possible direct and indirect paths from X to Y.",
    },
    // --- Moderators and Mediators ---
    {
      topicId,
      question: "What is a MODERATOR, and what does it do?",
      answer: "A third variable that CHANGES (modifies) the strength or direction of the relationship between X and Y. It creates an INTERACTION effect. Graphically: the lines for different levels of the moderator CROSS (non-parallel lines = interaction present).",
    },
    {
      topicId,
      question: "What is a MEDIATOR, and what does it do?",
      answer: "A third variable that EXPLAINS WHY X is related to Y — it is the mechanism through which X exerts its effect on Y. The temporal order is always: X → Mediator → Y. Mediators are always theoretical.",
    },
    {
      topicId,
      question: "How do you tell whether lines on a graph indicate a moderation effect?",
      answer: "Lines that CROSS (or converge) at some point = interaction (moderator effect present). Lines that are PARALLEL = NO interaction (moderator effect absent).",
    },
    {
      topicId,
      question: "Example: X = mindfulness, Y = reduced PTSD symptoms. What could the mediator (M) be?",
      answer: "M = feeling grounded. Mindfulness → feeling grounded → reduced PTSD symptoms. The mediator explains the mechanism by which mindfulness produces its effect.",
    },
    // --- Reliability ---
    {
      topicId,
      question: "What is reliability in psychometrics?",
      answer: "The consistency of scores — does the measure give the same score each time? Good reliability (≥.80) means scores are stable and reflect true variance in the construct, not random error.",
    },
    {
      topicId,
      question: "What is Cronbach's alpha (coefficient alpha)?",
      answer: "A measure of INTERNAL CONSISTENCY — whether all items within a scale are measuring the same construct. A value ≥.80 is acceptable; <.60 raises concern. It requires that responses to one item are related to responses to other items.",
    },
    {
      topicId,
      question: "What is the Standard Error of Measurement (SEM), and how is it calculated?",
      answer: "SEM = SD × √(1 − rxx), where rxx is the reliability coefficient. SEM estimates how much a score fluctuates due to measurement error. The 95% confidence interval for a score = X ± 2(SEM).",
    },
    {
      topicId,
      question: "When is test-retest reliability appropriate?",
      answer: "For measuring TRAITS (stable characteristics not expected to change over time). NOT appropriate for STATES (transient conditions expected to fluctuate). Run intra-class correlation or paired t-test to analyze stability over time.",
    },
    {
      topicId,
      question: "What is inter-rater reliability and how is it assessed?",
      answer: "Agreement between two or more raters observing the same behavior/characteristic. Assessed with: % agreement (hit/miss rates), Cohen's kappa (κ — accounts for chance agreement). Target: ≥.80 kappa or intra-class correlation.",
    },
    {
      topicId,
      question: "What are rater errors in inter-rater reliability?",
      answer: "1) Consensual Observer Drift — raters influence each other's judgments. 2) Halo Effect — one positive/negative rating biases all other ratings. 3) Central Tendency — raters always choose the midpoint. 4) Unclear Rating Categories.",
    },
    {
      topicId,
      question: "What factors INCREASE the reliability coefficient?",
      answer: "1) Longer tests (more items). 2) Wider range of scores (heterogeneous samples, unrestricted range). 3) Appropriate item difficulty (not all easy or all hard). 4) More response options (e.g., more Likert scale points).",
    },
    // --- Validity (Psychometrics) ---
    {
      topicId,
      question: "What is construct validity?",
      answer: "The overarching type of validity — does the instrument TRULY measure the theoretical construct it claims to measure? All other validity types provide evidence for construct validity. It always involves examining relationships between two or more variables/scales.",
    },
    {
      topicId,
      question: "What is convergent validity?",
      answer: "Evidence that an instrument is related to other measures of the SAME or similar constructs (moderate positive correlations). Not too high (instruments would be redundant) and not too low (instruments measure different things).",
    },
    {
      topicId,
      question: "What is discriminant (divergent) validity?",
      answer: "Evidence that an instrument is NOT strongly related to measures of DIFFERENT constructs (low correlations). The instrument should discriminate between constructs that are theoretically distinct. Correlation range: .3–.5.",
    },
    {
      topicId,
      question: "What is criterion/predictive validity?",
      answer: "The extent to which an instrument's scores predict a FUTURE outcome or criterion (correlation .3–.5). Example: using an aptitude test to predict job performance assessed later.",
    },
    {
      topicId,
      question: "What is criterion/concurrent validity?",
      answer: "The extent to which instrument scores agree with a CONCURRENT standard measure, both administered at the same time (correlation .3–.5). Different from predictive validity in that there is no future time element.",
    },
    {
      topicId,
      question: "What is content validity?",
      answer: "Whether the instrument's items adequately COVER all dimensions and domains of the construct (like a 'table of contents'). Evaluated by examining items and subscales to determine if all theoretically important dimensions are represented.",
    },
    // --- Sample Size & Power ---
    {
      topicId,
      question: "What is statistical power?",
      answer: "The probability of correctly REJECTING the null hypothesis when it is false (detecting an effect that truly exists). Target power = .80 (80%). Low power → Type II errors (false negatives). Underpowered study = insufficient sample size.",
    },
    {
      topicId,
      question: "What three things are needed for an a priori power analysis?",
      answer: "1) Alpha level (typically α = .05). 2) Anticipated effect size (small = .3–.4, medium = .4–.6, large = .6–.9). 3) Desired power level (typically .80 or 80%). Power analysis is conducted BEFORE the study (a priori).",
    },
    {
      topicId,
      question: "What are three ways to increase statistical power?",
      answer: "1) Increase sample size (collect more data — but costly). 2) Increase the alpha level (from .05 to .10 — increases Type I error risk). 3) Increase the effect size (design the study to detect a larger effect).",
    },
    {
      topicId,
      question: "What is the difference between sampling error and sampling bias?",
      answer: "Sampling error = random variation due to chance (unavoidable). Sampling bias = systematic, non-random differences in the sample that distort representativeness (can be mitigated through stratified or random sampling).",
    },
    // --- Data Collection ---
    {
      topicId,
      question: "What are the pros and cons of self-report data collection?",
      answer: "Pros: easy to administer, can assess internal states, captures participant's own perspective. Cons: prone to distortion — over/underestimation, social desirability bias, and inaccurate recall.",
    },
    {
      topicId,
      question: "What is Cohen's kappa (κ) and why is it preferable to percent agreement?",
      answer: "Cohen's kappa measures inter-rater agreement CORRECTED for chance agreement. With 4 categories, raters would agree 25% of the time by chance alone — κ accounts for this baseline. Target: κ ≥ .80.",
    },
  ];

  const insertedFlashcards = await db.insert(flashcardsTable).values(flashcards).returning();
  console.log(`✓ Inserted ${insertedFlashcards.length} flashcards`);

  // ============================================================
  // QUIZ QUESTIONS — 10 regular + 40 exam-only = 50 total
  // ============================================================
  const regularQuestions: (typeof quizQuestionsTable.$inferInsert)[] = [
    {
      topicId,
      question: "A researcher concludes a treatment works after conducting 20 statistical tests and finding one significant result. This is BEST described as:",
      optionA: "A Type II error — the researcher failed to detect a true effect",
      optionB: "Fishing — running many tests inflates the chance of a false positive (Type I error)",
      optionC: "Regression to the mean — extreme scores naturally move toward the average",
      optionD: "Autocorrelation — scores at one time point correlate with scores at another",
      correctAnswer: "B",
      explanation: "Running multiple tests dramatically increases the probability of finding at least one 'significant' result by chance alone — a Type I error. This 'fishing for outcomes' is a primary threat to statistical conclusion validity. The more tests conducted, the higher the false positive rate. MANOVA is one solution — it analyzes multiple DVs simultaneously, controlling for inflated Type I error.",
      examOnly: false,
    },
    {
      topicId,
      question: "Internal validity requires that 'X and ONLY X' is associated with Y. Which of the following represents the BEST strategy for establishing internal validity?",
      optionA: "Using a large, heterogeneous sample to maximize generalizability",
      optionB: "Using random assignment to make groups equivalent on all known and unknown variables",
      optionC: "Collecting data from multiple time points using a longitudinal design",
      optionD: "Using a correlation design to explore associations between variables",
      correctAnswer: "B",
      explanation: "Random assignment is the most powerful tool for internal validity. By randomly assigning participants to conditions, all known and unknown pre-existing differences are distributed equally across groups — making the groups equivalent. The ONLY systematic difference between groups is then the treatment variable. This is why the RCT is the gold standard of research designs.",
      examOnly: false,
    },
    {
      topicId,
      question: "A MEDIATOR variable is best described as a variable that:",
      optionA: "Changes the strength or direction of the relationship between X and Y",
      optionB: "Explains WHY or HOW X is related to Y — the mechanism connecting X and Y",
      optionC: "Is controlled statistically using ANCOVA to remove its influence on the DV",
      optionD: "Creates an interaction effect between X and Y",
      correctAnswer: "B",
      explanation: "Mediators EXPLAIN the mechanism through which X produces its effect on Y. The temporal sequence is: X → Mediator → Y. Example: Mindfulness (X) → Feeling grounded (M) → Reduced PTSD symptoms (Y). Moderators, by contrast, CHANGE the strength/direction of the X-Y relationship (creating an interaction). Covariates are controlled variables, not mediators.",
      examOnly: false,
    },
    {
      topicId,
      question: "Cronbach's alpha is a measure of which type of reliability?",
      optionA: "Test-retest reliability — scores are stable across two administrations over time",
      optionB: "Inter-rater reliability — two observers agree on ratings",
      optionC: "Internal consistency — all items within the scale are measuring the same construct",
      optionD: "Alternate forms reliability — two different versions of the test yield equivalent scores",
      correctAnswer: "C",
      explanation: "Cronbach's alpha (coefficient alpha) measures internal consistency — the degree to which responses to all items within a scale are intercorrelated (consistent with each other). A high alpha means that answering one item in a certain way predicts responses on other items — suggesting all items measure the same underlying construct. Target: α ≥ .80. Below .60 is concerning.",
      examOnly: false,
    },
    {
      topicId,
      question: "In a between-groups design, the ANCOVA (Analysis of Covariance) is used primarily to:",
      optionA: "Analyze more than one dependent variable at the same time",
      optionB: "Statistically control for extraneous variables (covariates) that are related to the DV",
      optionC: "Compare more than two groups on a single ordinal dependent variable",
      optionD: "Examine interactions between two or more independent variables",
      correctAnswer: "B",
      explanation: "ANCOVA statistically removes (controls for) the influence of covariates — extraneous variables known to be related to the DV but not the primary variable of interest. This allows a cleaner estimate of the IV's effect. Example: controlling for pre-test scores (covariate) when comparing post-test outcomes between treatment and control groups. MANOVA handles multiple DVs; ANOVA handles one DV.",
      examOnly: false,
    },
    {
      topicId,
      question: "A study follows the same participants from pre-treatment to post-treatment. Scores improve significantly. A colleague argues that participants may have improved on their own without the treatment. This is the threat of:",
      optionA: "Demand characteristics — participants figured out the study's purpose",
      optionB: "History — external events occurred during the study period",
      optionC: "Maturation/Regression to the mean — participants naturally improve or revert to baseline over time",
      optionD: "Selection bias — the groups were not equivalent at the start",
      correctAnswer: "C",
      explanation: "Maturation (natural improvement over time, especially in developmental studies) and regression to the mean (extreme scores move toward average on re-measurement) are major threats to within-subjects designs. Both can mimic treatment effects. The solution is to include a control group that experiences the same time passage WITHOUT the treatment — allowing you to isolate time-based changes from treatment effects.",
      examOnly: false,
    },
    {
      topicId,
      question: "The Standard Error of Measurement (SEM) is calculated as SEM = SD × √(1 − rxx). If a test has SD = 10 and reliability (rxx) = .84, what is the 95% confidence interval around a score of 75?",
      optionA: "75 ± 4 points",
      optionB: "75 ± 8 points",
      optionC: "75 ± 10 points",
      optionD: "75 ± 2 points",
      correctAnswer: "B",
      explanation: "SEM = 10 × √(1 − .84) = 10 × √.16 = 10 × .4 = 4. The 95% confidence interval = score ± 2(SEM) = 75 ± 2(4) = 75 ± 8. So the true score likely falls between 67 and 83 with 95% confidence. Using 2 SEM covers approximately 95% of the normal distribution (two standard deviations). SEM quantifies measurement error in score units.",
      examOnly: false,
    },
    {
      topicId,
      question: "A power analysis conducted BEFORE data collection, requiring alpha level, anticipated effect size, and desired power, is called:",
      optionA: "A post-hoc analysis — conducted after the study is complete",
      optionB: "An a priori analysis — conducted before the study to determine minimum sample size needed",
      optionC: "A sensitivity analysis — conducted to determine the smallest effect detectable given the sample",
      optionD: "A Bayesian analysis — updating prior probabilities with new data",
      correctAnswer: "B",
      explanation: "An a priori power analysis is conducted BEFORE the study begins to determine the minimum sample size needed to detect an effect of a specified size with desired power (typically .80) at a given alpha level (.05). It addresses the Type II error threat from underpowered studies. The three required inputs are: alpha level, anticipated effect size (small = .3–.4, medium = .4–.6, large = .6–.9), and desired power level.",
      examOnly: false,
    },
    {
      topicId,
      question: "Discriminant (divergent) validity is established by demonstrating:",
      optionA: "High correlations between the instrument and conceptually similar measures",
      optionB: "That the instrument predicts a future criterion variable",
      optionC: "Low correlations between the instrument and measures of theoretically DISTINCT constructs",
      optionD: "That the items within the scale are highly intercorrelated",
      correctAnswer: "C",
      explanation: "Discriminant validity demonstrates that an instrument does NOT overlap strongly with measures of different constructs — proving it is measuring something distinct. Desired correlation range: .3–.5 (present but not too strong). Example: depression and life satisfaction should have low correlation — not being depressed ≠ being highly satisfied. If depression and life satisfaction correlated at .90, they would be measuring the same thing.",
      examOnly: false,
    },
    {
      topicId,
      question: "A quasi-experimental study comparing treatment outcomes between adolescents who voluntarily sought therapy vs. those who were mandated to attend therapy lacks internal validity primarily because of:",
      optionA: "Low statistical power — not enough participants in each group",
      optionB: "Attrition — participants dropped out at different rates",
      optionC: "Selection bias — groups were formed by an external process, not random assignment, creating pre-existing differences",
      optionD: "Maturation — participants improved naturally over the course of therapy",
      correctAnswer: "C",
      explanation: "In quasi-experimental designs, participants are left in naturally occurring groups — no random assignment. The primary threat is selection bias: the groups differ on pre-existing characteristics (volunteer vs. mandated participation introduces baseline differences in motivation, distress level, and openness to treatment) that may explain outcomes, rather than the treatment itself. This is why randomization is the gold standard — it eliminates selection bias.",
      examOnly: false,
    },
  ];

  const examOnlyQuestions: (typeof quizQuestionsTable.$inferInsert)[] = [
    // Block 1 (11-20)
    {
      topicId,
      question: "Which of the following BEST describes the difference between reliability and validity in psychometrics?",
      optionA: "Reliability = accuracy; validity = consistency",
      optionB: "Reliability involves ONE variable (does the measure yield consistent scores?); validity involves TWO variables (does the score on one measure predict/relate to something else?)",
      optionC: "Reliability is established through factor analysis; validity through regression analysis",
      optionD: "Both reliability and validity require comparing the instrument to an external criterion",
      correctAnswer: "B",
      explanation: "The key distinction: Reliability (one variable) — does this scale give consistent scores over time and across items? Validity (two variables) — does this score tell me something useful about a different variable/criterion? A measure can be reliable but NOT valid (consistent but measuring the wrong thing), but a valid measure must also be reliable.",
      examOnly: true,
    },
    {
      topicId,
      question: "A researcher finds that after statistically controlling for depression severity (covariate), the effect of a new therapy on anxiety is no longer significant. This BEST demonstrates which analytical approach?",
      optionA: "MANOVA — multiple dependent variables were analyzed simultaneously",
      optionB: "ANCOVA — depression severity was statistically removed as a covariate to control its influence",
      optionC: "Mediation analysis — depression mediates the effect of therapy on anxiety",
      optionD: "Moderation analysis — depression changes the direction of the therapy-anxiety relationship",
      correctAnswer: "B",
      explanation: "ANCOVA (Analysis of Covariance) statistically removes the variance associated with covariates (extraneous variables). Here, depression severity is the covariate; it is 'statistically controlled' or removed. The result shows that once depression is controlled, the therapy effect on anxiety disappears — suggesting the apparent effect may have been confounded by initial depression severity.",
      examOnly: true,
    },
    {
      topicId,
      question: "In a study examining whether gender (male/female) moderates the relationship between academic stress and burnout, the moderator hypothesis for 'male' would be stated as:",
      optionA: "For males, as academic stress increases, burnout will not change, due to gender differences",
      optionB: "For males, as academic stress increases (indicating higher stress), burnout will increase (indicating higher burnout)",
      optionC: "Increased academic stress in males mediates the relationship between burnout and gender",
      optionD: "Males will have lower burnout than females across all levels of academic stress",
      correctAnswer: "B",
      explanation: "The moderator hypothesis for a categorical moderator (gender) describes the X-Y relationship AT EACH LEVEL of the moderator. For categorical moderators: 'For [group], as X increases/decreases [describing direction], Y will increase/decrease [describing direction].' This is done separately for each group. A moderator effect exists if the slopes (relationships) differ across groups.",
      examOnly: true,
    },
    {
      topicId,
      question: "The Spearman-Brown Prophecy Formula is used to:",
      optionA: "Estimate reliability after splitting a test in half and correcting for the shortened length",
      optionB: "Measure test-retest reliability across two administrations",
      optionC: "Calculate inter-rater agreement corrected for chance",
      optionD: "Estimate the reliability of dichotomous items",
      correctAnswer: "A",
      explanation: "The Spearman-Brown formula estimates the reliability of a FULL test from the correlation between two halves (split-half reliability). Since splitting reduces test length (and shorter tests are less reliable), Spearman-Brown corrects upward for this reduction. The Kuder-Richardson Formula 20 (KR-20) handles dichotomous items; Cohen's kappa handles inter-rater agreement.",
      examOnly: true,
    },
    {
      topicId,
      question: "In a multiple baseline design, treatment is applied sequentially across different settings (home, school, therapy). The PRIMARY purpose of this sequential application is to:",
      optionA: "Reduce the cost of implementation by applying treatment in one setting at a time",
      optionB: "Demonstrate that changes occur only when and where treatment is applied, ruling out maturation and history as explanations",
      optionC: "Increase statistical power by generating more data points across settings",
      optionD: "Control for demand characteristics by varying the treatment setting",
      correctAnswer: "B",
      explanation: "The multiple baseline design staggered across settings demonstrates functional control: behavior changes ONLY in the setting where treatment is being implemented — not in untreated settings. This rules out maturation (if it were maturation, all settings would improve simultaneously) and history (a historical event would affect all settings). It is powerful precisely BECAUSE it doesn't require withdrawal of treatment.",
      examOnly: true,
    },
    {
      topicId,
      question: "A study's reliability coefficient is .76. What percentage of score variance is due to ERROR?",
      optionA: "76%",
      optionB: "24%",
      optionC: "56%",
      optionD: "44%",
      correctAnswer: "B",
      explanation: "The reliability coefficient represents the proportion of score variance due to TRUE score variance. If rxx = .76, then 76% is true score variance and 24% (1 − .76 = .24) is ERROR variance. This is below the .80 threshold for good reliability. With 24% error, the scores are not entirely trustworthy as indicators of the true construct level.",
      examOnly: true,
    },
    {
      topicId,
      question: "Random SELECTION differs from random ASSIGNMENT in that:",
      optionA: "Random selection controls internal validity; random assignment controls external validity",
      optionB: "Random selection ensures the sample is representative of the population (external validity); random assignment ensures groups are equivalent (internal validity)",
      optionC: "Random assignment is only possible in within-subjects designs",
      optionD: "Random selection requires stratification; random assignment does not",
      correctAnswer: "B",
      explanation: "Random SELECTION: randomly choosing participants from the population — ensures the SAMPLE is representative of the population → supports external validity/generalizability. Random ASSIGNMENT: randomly allocating participants to conditions — ensures GROUPS are equivalent at baseline → supports internal validity. Both together (as in RCTs) provide the strongest evidence for causal inference.",
      examOnly: true,
    },
    {
      topicId,
      question: "Face validity differs from content validity in that:",
      optionA: "Face validity requires statistical analysis; content validity requires expert review",
      optionB: "Face validity asks whether items LOOK right superficially; content validity evaluates whether all domains of the construct are systematically represented in the items",
      optionC: "Content validity is less important than face validity for clinical instruments",
      optionD: "Face validity involves correlating the instrument with external criteria; content validity involves examining item intercorrelations",
      correctAnswer: "B",
      explanation: "Face validity is a superficial 'eyeballing' — do the questions appear on the surface to measure the right thing? Content validity is a systematic review of whether all dimensions/domains of the construct are represented in the item pool (like checking that a test 'table of contents' covers all relevant chapters). Content validity is more rigorous and theory-based than face validity.",
      examOnly: true,
    },
    {
      topicId,
      question: "When graphing a moderation analysis, PARALLEL lines between the high and low moderator conditions indicate:",
      optionA: "A strong moderation effect — the moderator significantly changes the X-Y relationship",
      optionB: "No moderation (no interaction) — the X-Y relationship is the same regardless of moderator level",
      optionC: "A mediation effect — the third variable explains the X-Y relationship",
      optionD: "A ceiling effect — scores at the top of the range restrict the relationship",
      correctAnswer: "B",
      explanation: "Parallel lines in a moderation graph = NO interaction effect. The X-Y relationship has the same slope (same direction and magnitude) at both high and low levels of the moderator — the moderator does not change the relationship. Crossing or converging lines indicate an INTERACTION — the relationship between X and Y DIFFERS depending on the level of the moderator.",
      examOnly: true,
    },
    {
      topicId,
      question: "According to the document, external validity is best described as:",
      optionA: "Essential for all research and should always be maximized",
      optionB: "Impossible to fully achieve — and studies should never be criticized for lacking generalizability",
      optionC: "The primary goal of clinical trials and RCTs",
      optionD: "Achieved through random assignment of participants to conditions",
      correctAnswer: "B",
      explanation: "External validity (generalizability) can never be fully achieved — no study can sample all possible participant types, settings, and conditions. Because of this, the course explicitly states: NEVER criticize a study for its external validity or generalizability. External validity is limited by homogeneous samples, single settings, and single treatment delivery modes — but these limitations do not invalidate a study's internal findings.",
      examOnly: true,
    },
    // Block 2 (21-30)
    {
      topicId,
      question: "Hierarchical Linear Modeling (HLM) is most appropriate for analyzing which type of data?",
      optionA: "Single time-point between-groups data with one dependent variable",
      optionB: "Nested/clustered data structures (e.g., repeated measures nested within participants, students nested within schools) in mixed designs",
      optionC: "Cross-sectional correlational data examining associations between variables",
      optionD: "Dichotomous outcome variables with multiple predictors",
      correctAnswer: "B",
      explanation: "HLM (also called multilevel modeling or mixed effects modeling) handles NESTED data — where observations are not independent but are clustered within a higher-level unit (e.g., repeated assessments within a person over time, or patients within therapists, or students within classrooms). It is used in mixed designs to analyze both between-group and within-person variation simultaneously. Standard regression violates the independence assumption with nested data.",
      examOnly: true,
    },
    {
      topicId,
      question: "The Kuder-Richardson Formula 20 (KR-20) is the appropriate reliability coefficient when:",
      optionA: "Items have continuous response formats (e.g., Likert scales with multiple points)",
      optionB: "Items are dichotomous (scored 0 or 1 — correct or incorrect) — as in ability tests",
      optionC: "Two forms of the test are administered to the same participants",
      optionD: "The test is administered on two separate occasions to measure stability over time",
      correctAnswer: "B",
      explanation: "KR-20 is a special case of coefficient alpha appropriate for DICHOTOMOUS items (right/wrong, yes/no). It estimates internal consistency reliability when all items are scored 0 or 1. Cronbach's alpha is the generalized version for items with multiple response options. Spearman-Brown is used for split-half reliability; test-retest uses intra-class correlation or paired t-test.",
      examOnly: true,
    },
    {
      topicId,
      question: "A researcher uses inclusion/exclusion criteria when defining their study sample. Exclusion criteria serve which primary function?",
      optionA: "Ensuring sufficient sample size to detect effects",
      optionB: "Removing participant characteristics that could confound internal validity — variables that could provide alternative explanations for outcomes",
      optionC: "Improving external validity by increasing sample heterogeneity",
      optionD: "Reducing costs by limiting data collection to essential variables only",
      correctAnswer: "B",
      explanation: "Exclusion criteria identify characteristics that could act as confounds — if present, you can't determine whether outcomes are due to the intervention or the excluded characteristic. Example: excluding participants currently receiving another therapy prevents the confound of 'doing something in addition to the treatment.' Inclusion criteria define who the study applies to and for whom the findings are meaningful.",
      examOnly: true,
    },
    {
      topicId,
      question: "A participant in a depression treatment study improves dramatically between pre- and post-assessment. The researcher argues this is due to the treatment. A critic notes the participant was ALSO exercising regularly during the treatment period. This represents which threat?",
      optionA: "Attrition — key participants dropped out of the study",
      optionB: "History — an external event (exercise) occurred alongside the treatment and may explain the improvement",
      optionC: "Instrumentation — the measurement tools changed between pre and post assessment",
      optionD: "Regression to the mean — the participant's initial high depression score naturally decreased",
      correctAnswer: "B",
      explanation: "History refers to external events that occur during the study period that could explain changes in the DV — not the treatment itself. The participant 'doing something in addition to treatment' (exercise) is both a History threat and a 'Participant Did Something in Addition to Treatment' threat. To rule this out, a control group that also undergoes the same time period (but not the treatment) would isolate the treatment's unique contribution.",
      examOnly: true,
    },
    {
      topicId,
      question: "Snowball sampling DIFFERS from word-of-mouth recruitment primarily in that:",
      optionA: "Snowball sampling requires IRB approval; word-of-mouth does not",
      optionB: "Snowball sampling requires participant CONSENT before the participant refers others (since referral reveals their participation); word-of-mouth does not require such consent",
      optionC: "Word-of-mouth is appropriate for sensitive topics; snowball sampling is not",
      optionD: "Snowball sampling is used only in quantitative research; word-of-mouth in qualitative",
      correctAnswer: "B",
      explanation: "In snowball sampling, an enrolled participant recruits others — but the ACT of recruiting someone reveals to that potential participant that the recruiter is in the study. For sensitive research topics (HIV status, domestic violence, etc.), revealing participation could harm the recruiter. Therefore, consent is needed before a participant refers others. Word-of-mouth (general announcement) does not implicate any individual as a participant.",
      examOnly: true,
    },
    {
      topicId,
      question: "Structural Equation Modeling (SEM) is designed to analyze which type of variables?",
      optionA: "Only directly observable, measured variables (manifest variables)",
      optionB: "Both observable indicator variables (manifest, shown as boxes) and unobservable latent traits (shown as circles) — constructs inferred from patterns of observed indicators",
      optionC: "Only categorical independent variables in factorial designs",
      optionD: "Time-series data with autocorrelation correction",
      correctAnswer: "B",
      explanation: "SEM models both LATENT traits (unobservable constructs — represented as circles — e.g., intelligence, depression, personality) and MANIFEST variables (observable indicators — represented as boxes — e.g., test scores, questionnaire responses). The latent variable is inferred from the pattern of correlations among its indicators. This allows SEM to model constructs that cannot be directly measured, unlike standard regression.",
      examOnly: true,
    },
    {
      topicId,
      question: "A study uses stratified sampling to ensure equal representation of males and females in the sample. This technique MOST directly reduces which threat?",
      optionA: "Maturation — natural changes over time confound the treatment effect",
      optionB: "Sampling bias — systematic over/under-representation of a demographic group in the sample",
      optionC: "Regression to the mean — extreme scorers move toward average on re-measurement",
      optionD: "Demand characteristics — participants alter behavior when they know the study's purpose",
      correctAnswer: "B",
      explanation: "Stratified sampling selects participants from predefined subgroups (strata — e.g., gender) to ensure the sample has proportional representation of that characteristic. This directly reduces SAMPLING BIAS — the systematic distortion that arises when a group is over- or under-represented. Unlike pure random sampling (which might accidentally produce imbalanced groups), stratified sampling guarantees balance on the stratification variable.",
      examOnly: true,
    },
    {
      topicId,
      question: "When is it NOT necessary to have high external validity in a research study?",
      optionA: "When the study uses a randomized controlled trial design",
      optionB: "When the study is an initial investigation of a topic, tests treatment efficacy in a specific context, or is conducted for a specific organization",
      optionC: "When the study has a sample size large enough to achieve adequate statistical power",
      optionD: "When the study includes both male and female participants equally",
      correctAnswer: "B",
      explanation: "External validity (generalizability) is not always required. It is LESS important when: 1) the study is an initial investigation (efficacy trial — does it work under ideal conditions?), 2) the study serves a specific agency/organization with unique characteristics, 3) the goal is to understand a specific population. External validity becomes critical for effectiveness research (does it work in real-world conditions?) and policy recommendations.",
      examOnly: true,
    },
    {
      topicId,
      question: "The Solomon Four-Group Design specifically controls for which threat to internal validity?",
      optionA: "Selection bias — pre-existing differences between groups",
      optionB: "Practice effects — improvement on the post-test due to familiarity from taking the pre-test",
      optionC: "Attrition — differential dropout between treatment and control groups",
      optionD: "Autocorrelation — scores at one time correlate automatically with scores at another",
      correctAnswer: "B",
      explanation: "The Solomon Four-Group Design addresses PRE-TEST effects by including four groups: 1) pre-test + treatment + post-test, 2) pre-test + control + post-test, 3) no pre-test + treatment + post-test, 4) no pre-test + control + post-test. By comparing groups with and without pre-tests, it determines whether the pre-test itself influences post-test scores (practice effects, sensitization). Particularly useful in educational intervention research.",
      examOnly: true,
    },
    {
      topicId,
      question: "In convergent validity, you want the correlation between two theoretically similar instruments to be:",
      optionA: "Near 1.0 — indicating the instruments are measuring exactly the same construct",
      optionB: "Near 0.0 — indicating the instruments are completely independent",
      optionC: "Moderate — high enough to suggest conceptual overlap but not so high as to make both instruments redundant",
      optionD: "Negative — indicating the constructs are inversely related",
      correctAnswer: "C",
      explanation: "Convergent validity requires MODERATE correlations (not too high, not too low) between conceptually similar instruments. Too high (r → 1.0): the instruments are identical — why use both? Too low (r → 0.0): one or both instruments is NOT measuring the intended construct. A moderate correlation confirms conceptual overlap while also showing each instrument captures something distinct. Example: ACT and SAT should correlate moderately — measuring related but not identical academic abilities.",
      examOnly: true,
    },
    // Block 3 (31-40)
    {
      topicId,
      question: "A study compares anxiety levels in people who chose to do yoga vs. those who chose not to do yoga. Which research design is this, and what is the primary validity concern?",
      optionA: "RCT — randomization eliminates confounds, so internal validity is high",
      optionB: "Quasi-experimental — no random assignment; selection bias threatens internal validity because people who chose yoga may differ systematically from non-choosers",
      optionC: "Within-subjects — participants serve as their own control across conditions",
      optionD: "Descriptive/correlational — no comparison group, so no design is needed",
      correctAnswer: "B",
      explanation: "When participants self-select into conditions (yoga vs. no yoga), there is NO random assignment — this is a quasi-experimental design. The key threat is selection bias: people who choose yoga may differ from non-choosers on motivation, health consciousness, socioeconomic status, baseline anxiety, etc. Any difference in anxiety outcomes may be due to these pre-existing differences rather than yoga itself. Matching can help mitigate this.",
      examOnly: true,
    },
    {
      topicId,
      question: "Effect sizes in power analysis are typically classified as small, medium, or large. According to the course material, a SMALL effect size corresponds to approximately:",
      optionA: ".10 to .20",
      optionB: ".30 to .40",
      optionC: ".60 to .90",
      optionD: ".90 to 1.0",
      correctAnswer: "B",
      explanation: "According to the course: Small effect size = .3–.4, Medium = .4–.6, Large = .6–.9. Effect size quantifies the magnitude of the relationship or difference between groups — independent of sample size. A standard/anticipated effect size for power analysis when prior data are unavailable is typically .3–.4 (small). Detecting a small effect requires a larger sample than detecting a large effect.",
      examOnly: true,
    },
    {
      topicId,
      question: "Consensual Observer Drift is a threat to inter-rater reliability because:",
      optionA: "Individual raters become more lenient over time due to fatigue",
      optionB: "Raters who work together begin to influence each other's ratings, developing a shared but potentially inaccurate rating system",
      optionC: "Raters focus only on the most extreme behavior, ignoring average behavior",
      optionD: "Rating definitions change over the course of the study",
      correctAnswer: "B",
      explanation: "Consensual Observer Drift: when raters work together over time, they begin to unconsciously COORDINATE their ratings — developing shared biases or shortcuts that deviate from the standardized rating criteria. While they may agree with each other (appearing reliable), their agreement reflects their shared drift from the standard, not accurate assessment. Fix: mixing up/rotating raters and conducting reliability checks against blind, independent raters.",
      examOnly: true,
    },
    {
      topicId,
      question: "Why is a control group essential in within-subjects designs to rule out regression to the mean?",
      optionA: "The control group ensures sufficient sample size for detecting effects",
      optionB: "Without a control group, you cannot distinguish whether post-treatment improvement is due to the treatment or to the natural tendency of extreme scores to regress toward the mean over time",
      optionC: "Control groups prevent carry-over effects between conditions",
      optionD: "The control group allows researchers to apply MANOVA rather than ANOVA",
      correctAnswer: "B",
      explanation: "Regression to the mean is a statistical artifact: participants selected because of extreme pre-treatment scores (very high depression, very low functioning) will naturally score closer to average on re-measurement — REGARDLESS of treatment. Without a control group experiencing the same time period (but no treatment), you cannot tell if improvement is due to treatment or to natural regression. A control group regresses too — showing the baseline rate of regression separate from the treatment effect.",
      examOnly: true,
    },
    {
      topicId,
      question: "What is the PRIMARY distinction between a survey/descriptive design and an experimental design?",
      optionA: "Surveys use quantitative data; experiments use qualitative data",
      optionB: "Experimental designs are CAUSAL (try to change something); descriptive designs are OBSERVATIONAL (describe relationships without intervention)",
      optionC: "Descriptive designs always involve longitudinal data collection; experiments use cross-sectional data",
      optionD: "Experimental designs require larger samples than descriptive designs",
      correctAnswer: "B",
      explanation: "Experimental designs manipulate the IV to establish CAUSATION — they actively try to change something. Descriptive designs (surveys, correlations, regressions, SEM) OBSERVE existing relationships without intervention — establishing that X is ASSOCIATED with Y (not necessarily causing it). The key phrase for descriptive designs: 'X and only X is RELATED to Y' — not 'causes.' Only experimental designs (especially RCTs) support causal claims.",
      examOnly: true,
    },
    {
      topicId,
      question: "In a mixed design study tracking depression over time (pre/mid/post) in both a CBT group and a waitlist control group, 'time' is the _____ factor and 'treatment group' is the _____ factor.",
      optionA: "Between-subjects; within-subjects",
      optionB: "Within-subjects; between-subjects",
      optionC: "Covariate; independent variable",
      optionD: "Mediating; moderating",
      correctAnswer: "B",
      explanation: "In a mixed design: 'Time' (pre/mid/post) is a WITHIN-SUBJECTS factor — each participant is measured at all time points. 'Treatment group' (CBT vs. waitlist) is a BETWEEN-SUBJECTS factor — each participant belongs to only one group. The mixed design combines both: tracking change over time (within) AND comparing between groups (between). Analyzed with split-plot ANOVA, repeated measures ANOVA with between-group effect, or HLM.",
      examOnly: true,
    },
    {
      topicId,
      question: "A test is described as 'underpowered.' This means the study is at greatest risk for which type of error, and what is the solution?",
      optionA: "Type I error (false positive) — solution is to increase the alpha level",
      optionB: "Type II error (false negative) — solution is to increase the sample size to detect the effect if it truly exists",
      optionC: "Both Type I and Type II errors equally — solution is to use a two-tailed test",
      optionD: "Statistical conclusion validity — solution is to use a more sensitive instrument",
      correctAnswer: "B",
      explanation: "An underpowered study (too few participants) increases the probability of a TYPE II ERROR — failing to detect a true effect. The study lacks statistical sensitivity. The primary solution is to increase sample size (power = sample size). Power analysis is conducted a priori to determine the minimum N needed for .80 power at the specified alpha and effect size. Paradoxically, overpowered studies (too large N) increase Type I error risk (fishing).",
      examOnly: true,
    },
    {
      topicId,
      question: "Latin-square design is best described as:",
      optionA: "The ACT of rearranging the order of conditions to control for carry-over effects",
      optionB: "A predetermined counterbalancing scheme specifying the order in which conditions are presented to each participant",
      optionC: "A statistical method for analyzing data from between-groups factorial designs",
      optionD: "A way to create equivalent groups by matching participants on key variables",
      correctAnswer: "B",
      explanation: "Latin-square design is the USE of counterbalancing — a predetermined, balanced ordering scheme ensuring that each condition appears in each ordinal position across participants and that each condition is preceded and followed by every other condition. Counterbalancing is the ACT (rearranging order to address carry-over effects); Latin-square is the specific structured method for doing so. This distributes order effects equally across all conditions.",
      examOnly: true,
    },
    {
      topicId,
      question: "A researcher observes that participants in a mindfulness study improved significantly from pre to post on a depression scale. However, the researcher forgot to include a control group. What is the MOST important limitation?",
      optionA: "The study cannot be published without a control group",
      optionB: "Without a control group, it is impossible to rule out maturation, regression to the mean, and history as alternative explanations for the improvement",
      optionC: "The study has low statistical power because the control group is missing",
      optionD: "The reliability of the depression scale cannot be established without a control group",
      correctAnswer: "B",
      explanation: "Without a control group, multiple threats to internal validity cannot be ruled out: 1) Maturation — participants may have improved naturally over time. 2) Regression to the mean — initially high depression scores naturally decrease. 3) History — external events (starting exercise, relationship changes) may have caused improvement. The control group provides the 'counterfactual' — what change would occur without the intervention — allowing isolation of the treatment's specific effect.",
      examOnly: true,
    },
    {
      topicId,
      question: "According to the course material, what is the recommended minimum sample size as a general rule of thumb, and what property of the distribution does this relate to?",
      optionA: "n > 10 per group; relates to the chi-square distribution",
      optionB: "n > 30 total; contributes to approximating a normal distribution (central limit theorem)",
      optionC: "n > 50 per group; relates to statistical power for medium effect sizes",
      optionD: "n > 100 total; required for reliable regression estimates",
      correctAnswer: "B",
      explanation: "The general rule of thumb: n > 30 participants is ideal as a minimum. With n ≥ 30, the sampling distribution of the mean approximates a normal distribution (central limit theorem), allowing use of parametric statistical tests even when the underlying population distribution is non-normal. Note: this is a MINIMUM heuristic — actual required N is determined by formal power analysis based on the specific effect size, alpha, and desired power.",
      examOnly: true,
    },
    // Block 4 (41-50)
    {
      topicId,
      question: "Trend analysis in descriptive research distinguishes between which two types of relationships?",
      optionA: "Causal and correlational relationships",
      optionB: "Straight linear and curvilinear (non-linear) relationships between variables",
      optionC: "Between-groups and within-subjects effects",
      optionD: "Main effects and interaction effects",
      correctAnswer: "B",
      explanation: "Trend analysis examines the SHAPE of the relationship between variables — specifically distinguishing linear (straight line: consistent incremental relationship) from curvilinear (U-shaped, inverted-U, or S-shaped: relationship changes direction or accelerates/decelerates across values). Example: the relationship between arousal and performance is curvilinear (Yerkes-Dodson law) — performance improves with moderate arousal but decreases at extremes.",
      examOnly: true,
    },
    {
      topicId,
      question: "A halo effect in inter-rater reliability occurs when:",
      optionA: "Raters drift toward the midpoint of rating scales, clustering responses near the average",
      optionB: "A rater's overall impression of the person (positive or negative) biases ratings on individual dimensions — all dimensions are rated consistently with the global impression",
      optionC: "Raters who work together begin to use a shared but inaccurate rating system",
      optionD: "Categories are poorly defined, leading to systematic disagreement between raters",
      correctAnswer: "B",
      explanation: "Halo effect: if a rater forms an overall positive impression of a participant, they tend to rate ALL dimensions positively — even dimensions that should be rated independently. Similarly, a negative overall impression leads to uniformly negative ratings. This produces artificially high internal consistency (everything rated the same) but poor validity. Fix: defining specific behavioral anchors for each rating dimension and training raters to evaluate dimensions independently.",
      examOnly: true,
    },
    {
      topicId,
      question: "In psychometrics, 'construct-irrelevant variance' refers to:",
      optionA: "Variance in scores that reflects true differences in the construct being measured",
      optionB: "Variance in scores due to factors OTHER than the construct of interest — essentially measurement error that inflates or deflates scores for reasons unrelated to the construct",
      optionC: "Variance explained by the moderating variable in an interaction effect",
      optionD: "Variance shared between two different constructs measured by the same instrument",
      correctAnswer: "B",
      explanation: "Construct-irrelevant variance is the enemy of reliability and validity. It is score variance caused by something OTHER than the target construct — for example, reading ability on a math test (reading difficulty → construct-irrelevant variance in math scores), test anxiety, poor item clarity, environmental distractions, or inconsistent administration. Good instruments minimize construct-irrelevant variance and maximize construct-relevant variance (true differences in the construct).",
      examOnly: true,
    },
    {
      topicId,
      question: "Which of the following is the MOST ACCURATE definition of data in research?",
      optionA: "Numbers generated by statistical software from participant responses",
      optionB: "Observations of what is varying — evidence of whether something happened, and if so, how much",
      optionC: "Information collected from the most reliable instruments available",
      optionD: "Quantitative measurements that can be analyzed with parametric statistics",
      correctAnswer: "B",
      explanation: "Data = observations of variation. Did something happen or not? If it happened, how much? Data is the evidence collected to support or refute a theoretical claim. Data is NOT limited to numbers — it includes any systematic observation of a variable. The research method is the process for collecting and recording these observations in a controlled way. The quality of data is directly related to the quality of the instruments and methods used.",
      examOnly: true,
    },
    {
      topicId,
      question: "The 95% confidence interval for a test score (X ± 2 SEM) uses 2 × SEM because:",
      optionA: "2 is the conventional multiplier required by the American Psychological Association",
      optionB: "Two standard errors of measurement on either side of the obtained score cover approximately 95% of the normal distribution",
      optionC: "Two SEMs are needed to account for both systematic and random error simultaneously",
      optionD: "The SEM underestimates measurement error, so it must be doubled to compensate",
      correctAnswer: "B",
      explanation: "In a normal distribution, ±1.96 (approximately ±2) standard deviations from the mean encompasses 95% of the distribution. Applying this to the SEM: the obtained score ± 2(SEM) creates a 95% confidence interval for where the person's TRUE score likely falls. This means: if we tested this person 100 times, the true score would fall within this interval in approximately 95 of those administrations.",
      examOnly: true,
    },
    {
      topicId,
      question: "MANOVA controls Type I error better than running separate ANOVAs for each DV because:",
      optionA: "MANOVA uses a more conservative alpha level than ANOVA",
      optionB: "Running multiple ANOVAs inflates the familywise error rate — each test has a 5% chance of false positive, compounding across tests; MANOVA analyzes all DVs simultaneously in one test",
      optionC: "MANOVA requires fewer assumptions than multiple ANOVAs",
      optionD: "MANOVA includes covariates automatically, removing extraneous variance",
      correctAnswer: "B",
      explanation: "With multiple DVs, running separate ANOVAs means each test has a 5% chance of a false positive. With 5 DVs: the probability of at least one false positive = 1 − (0.95)^5 ≈ 23% — far above the intended 5% alpha. MANOVA analyzes all DVs simultaneously in a single multivariate test, maintaining the familywise error rate at 5%. If the multivariate test is significant, follow-up univariate ANOVAs are conducted for each DV.",
      examOnly: true,
    },
    {
      topicId,
      question: "A researcher wants to determine if the relationship between job stress and burnout DEPENDS on whether the employee is a supervisor or non-supervisor. This is BEST analyzed with:",
      optionA: "Mediation analysis — supervisory status explains why stress leads to burnout",
      optionB: "Moderation analysis — supervisory status may change the strength/direction of the stress-burnout relationship",
      optionC: "Path analysis — to examine all possible pathways between job stress and burnout",
      optionD: "Structural equation modeling — to include the latent construct of 'occupational strain'",
      correctAnswer: "B",
      explanation: "When a third variable potentially CHANGES the relationship between X (stress) and Y (burnout) depending on group membership, this is a MODERATOR. 'Does it depend on supervisory status?' = interaction question = moderation. Categorical moderators (supervisor vs. non-supervisor) are entered as interaction terms. Evidence: stress-burnout relationship is steeper for supervisors than non-supervisors (non-parallel lines on interaction plot).",
      examOnly: true,
    },
    {
      topicId,
      question: "Test-retest reliability is INAPPROPRIATE for measuring which type of construct, and why?",
      optionA: "Trait constructs — because traits are stable and scores should remain consistent over time",
      optionB: "State constructs — because states fluctuate naturally, score differences reflect genuine change rather than measurement error",
      optionC: "Latent constructs — because they cannot be directly observed and must be inferred",
      optionD: "Dichotomous constructs — because only Kuder-Richardson can handle yes/no items",
      correctAnswer: "B",
      explanation: "Test-retest reliability is APPROPRIATE for TRAITS (stable characteristics like IQ, personality). It is INAPPROPRIATE for STATES (transient conditions like mood, pain, situational anxiety) because states are SUPPOSED to change over time. Low test-retest correlations for a state measure don't indicate unreliability — they indicate that the construct genuinely fluctuated. Using test-retest for a state would mischaracterize true change as measurement error.",
      examOnly: true,
    },
    {
      topicId,
      question: "A homogeneous sample (all participants very similar on key variables) increases which aspect of research design, and at what cost?",
      optionA: "Increases external validity (generalizability) at the cost of reduced statistical power",
      optionB: "Increases internal validity (reduces confounds from participant variability) at the cost of reduced external validity (limits generalizability)",
      optionC: "Increases statistical power at the cost of increased Type I error rate",
      optionD: "Increases measurement precision at the cost of reduced reliability",
      correctAnswer: "B",
      explanation: "A homogeneous sample (everyone is similar) INCREASES internal validity: fewer individual differences that could act as confounds, making it easier to isolate the treatment effect. However, it DECREASES external validity: findings may not generalize to more diverse populations. This is a fundamental research trade-off. Heterogeneous samples improve generalizability but introduce more confounding variability. Researchers must decide based on their study's goals.",
      examOnly: true,
    },
    {
      topicId,
      question: "Physical measurement as a data collection method is described as having which major advantage AND limitation?",
      optionA: "Advantage: easy to administer; Limitation: only captures self-reported perception",
      optionB: "Advantage: objectivity (free from self-report bias); Limitation: costly and not always feasible for psychological variables, which may not be directly observable",
      optionC: "Advantage: can gather data from multiple informants; Limitation: inter-rater reliability is always low for physical measures",
      optionD: "Advantage: captures internal states; Limitation: participants may distort responses",
      correctAnswer: "B",
      explanation: "Physical measurement (e.g., cortisol levels, heart rate, neuroimaging) is considered objective — the 'body doesn't lie' — avoiding self-report biases. However, limitations include: 1) HIGH COST (expensive equipment, laboratory facilities, personnel), 2) Many psychological constructs (thoughts, emotions, attitudes) are NOT directly observable through physical measurement, 3) Physical measures may not validly capture complex psychological experiences.",
      examOnly: true,
    },
  ];

  const allQs = [...regularQuestions, ...examOnlyQuestions];

  const insertedQs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(`✓ Inserted ${insertedQs.length} quiz questions (${regularQuestions.length} regular + ${examOnlyQuestions.length} exam-only)`);

  // Update topic counts
  await db
    .update(topicsTable)
    .set({
      flashcardCount: insertedFlashcards.length,
      questionCount: regularQuestions.length,
    })
    .where(eq(topicsTable.id, topicId));

  // ============================================================
  // STUDY GUIDE
  // ============================================================
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
- **Factorial Design:** Multiple IVs → examines main effects AND interactions
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
- **RCT (Gold Standard):** Random SELECTION + Random ASSIGNMENT → eliminates all known and unknown confounds
- **Quasi-Experimental:** No random assignment → lower internal validity, primary threat = selection bias
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

**MODERATORS** → CHANGE the X-Y relationship
- Creates an interaction effect between X and moderator on Y
- Parallel lines on graph = NO moderation; Crossing lines = MODERATION
- Can be categorical (groups) or continuous (range)
- Hypothesis: "For [group/level], as X increases, Y will increase/decrease"

**MEDIATORS** → EXPLAIN the X-Y relationship (the WHY)
- Temporal order: X → Mediator → Y
- Always theoretical; not a single statistical test
- Must first establish X-Y relationship exists

**Example:**
- Mindfulness (X) → Feeling grounded (M) → Reduced PTSD (Y) [MEDIATOR]
- Job stress → Burnout, moderated by supervisory status [MODERATOR]

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

**Statistical Power = Probability of correctly rejecting the null hypothesis when false**

**Power = .80 (80%) is the standard target.**

**A priori power analysis requires:**
1. Alpha level (α = .05)
2. Anticipated effect size (small = .3–.4; medium = .4–.6; large = .6–.9)
3. Desired power level (.80)

**To increase power:**
- Increase sample size
- Increase alpha level (from .05 to .10 — increases Type I error risk)
- Increase effect size

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
| Rating Scales | Multiple informants, works when self-report unavailable | Informants lack full insight |
| Third-Party Observation | Objective behavior assessment | Psychological variables not always visible; needs inter-rater reliability |
| Physical Measurement | Objective ("body doesn't lie") | Costly, not always feasible for psychological constructs |

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
  console.log(`✓ Inserted study guide id=${studyGuide.id}`);

  // ============================================================
  // PRACTICE EXAM
  // ============================================================
  const [practiceExam] = await db
    .insert(practiceExamsTable)
    .values({
      topicId,
      title: "Quantitative Statistics & Research Methods Practice Exam",
      timeLimit: 90,
      passingScore: 70,
    })
    .returning();
  console.log(`✓ Created practice exam id=${practiceExam.id}`);

  // Link ALL quiz questions to the practice exam
  const examQRows = insertedQs.map((q, i) => ({
    examId: practiceExam.id,
    questionId: q.id,
    questionOrder: i + 1,
  }));

  await db.insert(practiceExamQuestionsTable).values(examQRows);
  console.log(`✓ Linked ${examQRows.length} questions to practice exam`);

  console.log(`
✅ Quantitative Statistics & Research Methods topic fully seeded!
   Topic ID: ${topicId}
   Flashcards: ${insertedFlashcards.length}
   Quiz questions (regular): ${regularQuestions.length}
   Practice exam questions: ${examQRows.length}
  `);
}

addStatsTopic()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
