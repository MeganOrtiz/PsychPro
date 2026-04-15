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

async function addFoundationsStatsTopic() {
  console.log("Seeding Foundations in Statistics topic...");

  const [topic] = await db
    .insert(topicsTable)
    .values({
      name: "Foundations in Statistics",
      category: "Statistics & Research",
      description:
        "Core statistical concepts including variable types, distributions, central tendency, variability, hypothesis testing, effect sizes, t-tests, ANOVA, correlations, regression, and chi-square.",
    })
    .returning();

  const topicId = topic.id;
  console.log(`✓ Created topic id=${topicId}`);

  // ============================================================
  // FLASHCARDS (55)
  // ============================================================
  const flashcards = [
    // --- Fundamentals ---
    {
      question: "What is statistics, and what is its core purpose?",
      answer:
        "Statistics is the study of variation — it determines how values differ across observations, identifies patterns versus random chance, and makes inferences about populations from samples.",
      difficulty: "easy",
    },
    {
      question: "What is the difference between a population and a sample?",
      answer:
        "A population includes everyone and represents the 'truth' (unknown, untestable in full). A sample is a subset used to make a best guess about the population via inferential statistics.",
      difficulty: "easy",
    },
    {
      question: "What are the three goals of statistics?",
      answer:
        "1) Description — summarize data. 2) Comparison — determine when values differ (pattern vs. error). 3) Estimation — use samples to infer population parameters.",
      difficulty: "easy",
    },
    {
      question: "What is a population parameter?",
      answer:
        "A characteristic of a variable to be discovered in the population, described using mean, SD, or frequency counts. It is unknown and estimated from samples.",
      difficulty: "easy",
    },
    {
      question: "What is the difference between a discontinuous and a continuous variable?",
      answer:
        "Discontinuous (nominal/categorical) variables do not vary by level (e.g., gender). Continuous variables vary by level (e.g., height, test scores) and include ordinal, interval, and ratio types.",
      difficulty: "easy",
    },
    {
      question: "What distinguishes ordinal, interval, and ratio variables?",
      answer:
        "Ordinal: ranked order, unequal intervals, no true zero. Interval: equal intervals but no true zero (e.g., Likert scale). Ratio: equal intervals AND a true zero (e.g., height, weight).",
      difficulty: "medium",
    },
    {
      question: "What is a normal distribution, and why is it important?",
      answer:
        "A bell-shaped curve representing random chance. It establishes a baseline to compare data against and determines what is 'significant' (unexpected) versus expected.",
      difficulty: "easy",
    },
    {
      question: "What is a positive skew, and how does it affect the mean?",
      answer:
        "Positive skew has more values to the right (high end). Mean > Mode; order is Mode-Median-Mean from left to right. The mean is pulled toward the outlier.",
      difficulty: "medium",
    },
    {
      question: "What is a negative skew?",
      answer:
        "Negative skew has more values to the left (low end). Mode > Mean; order is Mean-Median-Mode from left to right.",
      difficulty: "medium",
    },
    // --- Central Tendency ---
    {
      question: "Define mean, median, and mode.",
      answer:
        "Mean: sum of all values ÷ n; influenced by outliers. Median: middle value; NOT influenced by outliers. Mode: most frequent value. Median is preferred when outliers are present.",
      difficulty: "easy",
    },
    {
      question: "When should the median be used instead of the mean?",
      answer:
        "When ignoring extreme scores or when the distribution is skewed — the median is not influenced by outliers, while the mean is pulled toward them.",
      difficulty: "easy",
    },
    // --- Variability & Standard Scores ---
    {
      question: "What are deviation scores, and what is their sum?",
      answer:
        "Deviation scores show how much each score differs from the mean. The sum of all deviation scores always equals 0.",
      difficulty: "medium",
    },
    {
      question: "What is variance?",
      answer:
        "Variance is the mean sum of squares (SS) — the average of squared deviation scores. It represents the area under the curve and the spread of scores.",
      difficulty: "medium",
    },
    {
      question: "What is standard deviation, and what does 1 SD represent?",
      answer:
        "SD is the square root of variance — the average deviation of scores from the mean. 1 SD from the mean encompasses ~34% of scores; 2 SD = ~14%; 3 SD = ~2%.",
      difficulty: "medium",
    },
    {
      question: "What are the three parts of a standard deviation value?",
      answer:
        "1) Sign (+/–): direction from the mean. 2) Actual SD value: where the score falls relative to the SD. 3) Number of SDs in the distribution (usually 3).",
      difficulty: "medium",
    },
    {
      question: "What is the difference between homogeneity and heterogeneity of variance?",
      answer:
        "Homogeneity = low variability, scores clustered near the mean. Heterogeneity = high variability, scores spread widely from the mean.",
      difficulty: "easy",
    },
    {
      question: "What is a z-score?",
      answer:
        "z = (x − µ) / σ. A population-based score expressing how far a raw score is from the population mean in standard deviation units. Allows comparison across different measurement scales.",
      difficulty: "medium",
    },
    {
      question: "What is a T-score (not t-test)?",
      answer:
        "T = (x − µ) / (σ / √n). Sample-based standardized score on a scale with mean = 50 and SD = 10. Used in specific clinical/assessment contexts.",
      difficulty: "medium",
    },
    {
      question: "What do percentiles tell you?",
      answer:
        "Percentiles indicate a score's location in a distribution and how many scores fall above and below it (e.g., 90th percentile = 90% of scores fall below).",
      difficulty: "easy",
    },
    // --- Sampling & Standard Error ---
    {
      question: "What is the Standard Error of the Mean (SEM)?",
      answer:
        "SEM measures the discrepancy between a sample mean and the population mean. It should be small (close to 0 but never 0) and decreases as sample size increases.",
      difficulty: "medium",
    },
    {
      question: "What does the Central Limit Theorem state?",
      answer:
        "As sample size grows, the sampling distribution of sample means approaches a normal distribution. With large random samples, the sample mean approximates the population mean.",
      difficulty: "medium",
    },
    {
      question: "What is the Standard Error of Measurement (SEM in psychometrics)?",
      answer:
        "An index of error around an obtained score due to test unreliability. Used to construct confidence intervals: 95% CI = score ± 2(SEM).",
      difficulty: "medium",
    },
    // --- Probability & Hypothesis Testing ---
    {
      question: "What is a p-value?",
      answer:
        "The probability that an observed result could have occurred by chance alone. A p-value < .05 indicates the result is statistically significant (unlikely due to chance).",
      difficulty: "easy",
    },
    {
      question: "What is the null hypothesis (H₀)?",
      answer:
        "The null hypothesis states there is no significant difference or relationship. Accepting H₀ = no effect found.",
      difficulty: "easy",
    },
    {
      question: "What is a Type I error?",
      answer:
        "Rejecting the null hypothesis when it is actually true — a false positive. It is more likely with multiple tests (experimenter-wise error) and results below p < .05.",
      difficulty: "medium",
    },
    {
      question: "What is a Type II error?",
      answer:
        "Accepting the null hypothesis when it is actually false — a false negative. Results above p > .05. Fixed by increasing statistical power (larger sample size).",
      difficulty: "medium",
    },
    {
      question: "What is experimenter-wise error?",
      answer:
        "The inflation of Type I error that occurs when running multiple statistical tests — the more tests run, the more likely you will find significance by chance alone.",
      difficulty: "medium",
    },
    {
      question: "What is a confidence interval, and what does it mean if it includes 0?",
      answer:
        "A range of values within which the true parameter likely falls. If CI includes 0 → NOT significant. If CI does NOT include 0 → significant.",
      difficulty: "easy",
    },
    // --- Effect Size & Power ---
    {
      question: "What is effect size?",
      answer:
        "The magnitude of the difference between groups or the strength of a relationship, measured in standard deviation units. Does NOT depend on sample size.",
      difficulty: "medium",
    },
    {
      question: "What are small, medium, and large effect sizes (Cohen's conventions)?",
      answer:
        "Small = .2, Medium = .5, Large = .8. These apply to Cohen's d, Hedges' g, and standardized beta coefficients.",
      difficulty: "medium",
    },
    {
      question: "What is the difference between p-value and effect size?",
      answer:
        "p-value answers 'Was there an effect?' (yes/no). Effect size answers 'By how much?' (magnitude). Both should be reported; p-value alone is insufficient.",
      difficulty: "medium",
    },
    {
      question: "What is statistical power?",
      answer:
        "The probability of detecting a real effect when one exists (correctly rejecting the null). Standard target = .80 (80%). Low power → Type II error.",
      difficulty: "medium",
    },
    {
      question: "What are three ways to increase statistical power?",
      answer:
        "1) Increase sample size. 2) Increase alpha level (e.g., .05 → .10). 3) Increase effect size ('stack the deck').",
      difficulty: "medium",
    },
    {
      question: "What is the difference between Cohen's d and Hedges' g?",
      answer:
        "Both measure effect size in SD units. Cohen's d is population-based; Hedges' g adjusts for estimated population SD — preferred for smaller samples.",
      difficulty: "hard",
    },
    // --- t-tests ---
    {
      question: "What are the three types of t-tests?",
      answer:
        "1) Single-sample t-test: 1 group vs. normative mean (df = n−1). 2) Independent samples t-test: 2 independent groups (df = n−2). 3) Paired/correlated t-test: 1 group at 2 time points (df = n−1).",
      difficulty: "medium",
    },
    {
      question: "What variables does an independent t-test require?",
      answer:
        "IV: 2 discrete/categorical groups. DV: continuous (ordinal, interval, or ratio). Tests whether the means of two groups significantly differ.",
      difficulty: "easy",
    },
    {
      question: "What is Levene's test, and when is it used?",
      answer:
        "Levene's test checks the assumption of homogeneity of variance for t-tests. If Levene's IS significant → variances are NOT equal → adjust the t-test.",
      difficulty: "hard",
    },
    {
      question: "What is the t-test formula conceptually?",
      answer:
        "t = (pattern) / (error) = signal / noise. A larger t-value means a larger difference relative to random variation, increasing the likelihood of significance.",
      difficulty: "medium",
    },
    // --- ANOVA ---
    {
      question: "When is ANOVA used instead of a t-test?",
      answer:
        "ANOVA is used when the IV has 3 or more categorical groups. A t-test is limited to 2 groups. ANOVA also controls for Type I error inflation.",
      difficulty: "easy",
    },
    {
      question: "What is the F-ratio in ANOVA?",
      answer:
        "F = between-groups variation / within-groups variation = signal / error. A larger F (between > within) indicates more likely significance.",
      difficulty: "medium",
    },
    {
      question: "Why are post-hoc tests needed after ANOVA?",
      answer:
        "The F-test only tells something is significant; post-hoc tests (Tukey, Bonferroni, Sidak) identify WHICH specific groups differ and correct for Type I error.",
      difficulty: "medium",
    },
    {
      question: "What is ANCOVA?",
      answer:
        "Analysis of Covariance — an ANOVA that statistically controls for one or more covariates (variables related to the DV but not the primary IV of interest).",
      difficulty: "medium",
    },
    {
      question: "What is MANOVA?",
      answer:
        "Multivariate Analysis of Variance — tests multiple IVs and multiple DVs simultaneously, avoiding Type I error inflation from running many separate ANOVAs.",
      difficulty: "medium",
    },
    // --- Correlations ---
    {
      question: "What does a correlation coefficient (r) tell you?",
      answer:
        "r ranges from −1 to +1. It describes the direction (positive/negative) and strength of association between two continuous variables. Both variables are continuous; no IV/DV required.",
      difficulty: "easy",
    },
    {
      question: "What is the coefficient of determination (r²)?",
      answer:
        "r² is the square of the correlation coefficient — the proportion of shared variance between two variables. E.g., r = .44 → r² = .19 → 19% shared variance.",
      difficulty: "medium",
    },
    {
      question: "What is the difference between Pearson and Spearman correlations?",
      answer:
        "Pearson: parametric, for interval/ratio data (e.g., test scores). Spearman: non-parametric, for ordinal data (e.g., rankings). Spearman uses ranked values.",
      difficulty: "medium",
    },
    {
      question: "What is homoscedasticity vs. heteroscedasticity in correlations?",
      answer:
        "Homoscedasticity: values equally spread around the best-fit line (rectangular shape) → strong correlation. Heteroscedasticity: 'fanning out' at ends → weak/distorted correlation.",
      difficulty: "hard",
    },
    {
      question: "What are phi and tetrachoric correlations?",
      answer:
        "Phi: used when both IV and DV are TRUE dichotomies (e.g., gender and handedness). Tetrachoric: used when both are ARTIFICIAL dichotomies (e.g., positive/negative school climate).",
      difficulty: "hard",
    },
    // --- Regression ---
    {
      question: "What is the regression equation?",
      answer:
        "Y' = a + bX₁ + bX₂ + ... + e. Y' = predicted outcome, a = y-intercept, b = slope (unstandardized or standardized beta), e = error term.",
      difficulty: "medium",
    },
    {
      question: "What is hierarchical regression?",
      answer:
        "A regression approach where predictors are entered in theoretically motivated blocks: Block 1 = known demographics, Block 2 = established predictors, Block 3 = new predictors of interest.",
      difficulty: "medium",
    },
    {
      question: "What is stepwise regression?",
      answer:
        "A data-driven regression method. Forward: add variables one at a time. Backward: include all variables then remove based on p-value. Stepwise is always forward OR backward.",
      difficulty: "medium",
    },
    {
      question: "What is multicollinearity?",
      answer:
        "A problem in regression when predictor variables (IVs) are highly correlated with each other, making it difficult to determine each predictor's unique contribution.",
      difficulty: "hard",
    },
    // --- Chi-Square ---
    {
      question: "What is chi-square and when is it used?",
      answer:
        "Chi-square (χ²) is a non-parametric test comparing observed vs. expected proportions across categorical groups. Used when both IV and DV are categorical — no assumptions required.",
      difficulty: "easy",
    },
    {
      question: "What are effect size measures for chi-square?",
      answer:
        "Phi coefficient (for 2×2 tables with two dichotomous variables) and Cramer's V (for tables larger than 2×2).",
      difficulty: "hard",
    },
    {
      question: "What is sensitivity vs. specificity?",
      answer:
        "Sensitivity: true positive rate — how often a test correctly identifies those WITH a condition. Specificity: true negative rate — how often it correctly identifies those WITHOUT.",
      difficulty: "medium",
    },
  ];

  const insertedFlashcards = await db
    .insert(flashcardsTable)
    .values(flashcards.map((f) => ({ ...f, topicId })))
    .returning();
  console.log(`✓ Inserted ${insertedFlashcards.length} flashcards`);

  // ============================================================
  // QUIZ QUESTIONS (10 regular + 40 exam-only = 50 total)
  // ============================================================
  const regularQuestions = [
    {
      question: "Which measure of central tendency is MOST resistant to outliers?",
      optionA: "Mean",
      optionB: "Mode",
      optionC: "Median",
      optionD: "Variance",
      correctAnswer: "C",
      explanation:
        "The median is not influenced by extreme scores because it only depends on rank order. The mean is pulled in the direction of outliers.",
      examOnly: false,
    },
    {
      question: "A study finds p = .03. What does this indicate?",
      optionA: "There is a 3% chance the hypothesis is true",
      optionB: "There is a 3% chance the result occurred by chance alone",
      optionC: "The effect size is small",
      optionD: "The null hypothesis is proven correct",
      correctAnswer: "B",
      explanation:
        "p = .03 means there is a 3% probability the observed result would occur by chance alone, indicating statistical significance (p < .05).",
      examOnly: false,
    },
    {
      question: "A researcher concludes there is a significant effect when in fact there is none. This is a:",
      optionA: "Type II error",
      optionB: "Sampling error",
      optionC: "Type I error",
      optionD: "Power failure",
      correctAnswer: "C",
      explanation:
        "Type I error (false positive) = rejecting the null hypothesis when it is actually true. The researcher found 'significance' that doesn't exist.",
      examOnly: false,
    },
    {
      question: "Which level of variable measurement has a true zero and equal intervals?",
      optionA: "Nominal",
      optionB: "Ordinal",
      optionC: "Interval",
      optionD: "Ratio",
      correctAnswer: "D",
      explanation:
        "Ratio variables have equal intervals AND a true zero (e.g., height, weight), allowing meaningful comparisons of absolute magnitude.",
      examOnly: false,
    },
    {
      question: "Effect size differs from p-value in that effect size:",
      optionA: "Determines whether results are statistically significant",
      optionB: "Indicates the magnitude of a finding regardless of sample size",
      optionC: "Is always larger than the p-value",
      optionD: "Only applies to non-parametric tests",
      correctAnswer: "B",
      explanation:
        "Effect size measures HOW LARGE an effect is (magnitude), while p-value only answers whether an effect exists. Effect size is not influenced by sample size.",
      examOnly: false,
    },
    {
      question: "When is ANOVA preferred over multiple t-tests?",
      optionA: "When the DV is categorical",
      optionB: "When there are 3 or more groups, to control for Type I error",
      optionC: "When the sample size is less than 30",
      optionD: "When the IV is continuous",
      correctAnswer: "B",
      explanation:
        "ANOVA handles 3+ groups while controlling for the inflation of Type I error (experimenter-wise error) that results from running multiple separate t-tests.",
      examOnly: false,
    },
    {
      question: "Which correlation type is appropriate for two ordinal (ranked) variables?",
      optionA: "Pearson",
      optionB: "Phi",
      optionC: "Spearman",
      optionD: "Tetrachoric",
      correctAnswer: "C",
      explanation:
        "Spearman correlation is non-parametric and designed for ordinal (ranked) data. Pearson is for interval/ratio (parametric) data.",
      examOnly: false,
    },
    {
      question: "The Central Limit Theorem states that as sample size increases:",
      optionA: "Effect size decreases",
      optionB: "The sampling distribution of means approaches a normal distribution",
      optionC: "Type II errors become more frequent",
      optionD: "The population variance doubles",
      correctAnswer: "B",
      explanation:
        "The Central Limit Theorem ensures that with sufficient random sampling, the distribution of sample means will be approximately normal, regardless of population shape.",
      examOnly: false,
    },
    {
      question: "In a regression equation (Y' = a + bX + e), what does 'b' represent?",
      optionA: "The y-intercept",
      optionB: "The error term",
      optionC: "The slope (regression coefficient)",
      optionD: "The correlation coefficient",
      correctAnswer: "C",
      explanation:
        "'b' is the slope (regression coefficient), indicating how much Y changes for each one-unit change in X. It can be unstandardized or standardized (beta).",
      examOnly: false,
    },
    {
      question: "Chi-square is most appropriate when:",
      optionA: "Both IV and DV are continuous",
      optionB: "The DV is ratio-level",
      optionC: "Comparing proportions across categorical groups",
      optionD: "Testing mean differences between two groups",
      correctAnswer: "C",
      explanation:
        "Chi-square is a non-parametric test comparing observed vs. expected frequencies/proportions across categorical variables. No parametric assumptions are required.",
      examOnly: false,
    },
  ];

  const examOnlyQuestions = [
    {
      question: "A distribution where Mean > Mode is BEST described as:",
      optionA: "Negatively skewed",
      optionB: "Positively skewed",
      optionC: "Normally distributed",
      optionD: "Bimodal",
      correctAnswer: "B",
      explanation:
        "In a positive skew, the mean is pulled to the right by high-value outliers, making Mean > Mode. Order from left to right: Mode-Median-Mean.",
      examOnly: true,
    },
    {
      question: "Which statement about standard deviation is TRUE?",
      optionA: "The SD should never be greater than the mean",
      optionB: "SD is the square of variance",
      optionC: "SD is unaffected by outliers",
      optionD: "SD is the same as the standard error",
      correctAnswer: "A",
      explanation:
        "A general rule is that SD should never exceed the mean — if it does, it is a red flag suggesting extreme outliers or a non-normal distribution.",
      examOnly: true,
    },
    {
      question: "A z-score of +2.0 indicates that a raw score is:",
      optionA: "Two points above the mean",
      optionB: "Two standard deviations above the mean",
      optionC: "At the 50th percentile",
      optionD: "Below the population mean",
      correctAnswer: "B",
      explanation:
        "z-scores are expressed in standard deviation units from the population mean. z = +2.0 means 2 SDs above the mean, encompassing approximately 97.7% of scores below it.",
      examOnly: true,
    },
    {
      question: "Standard Error of the Mean (SEM) is BEST described as:",
      optionA: "The reliability coefficient of a test",
      optionB: "The discrepancy between sample mean and population mean",
      optionC: "The average distance between data points",
      optionD: "A measure of skewness",
      correctAnswer: "B",
      explanation:
        "SEM quantifies how much the sample mean is likely to deviate from the true population mean. It decreases as sample size increases.",
      examOnly: true,
    },
    {
      question: "Which of the following would INCREASE statistical power?",
      optionA: "Decreasing the alpha level from .05 to .01",
      optionB: "Reducing the sample size",
      optionC: "Using a one-tailed instead of two-tailed test",
      optionD: "Increasing the sample size",
      correctAnswer: "D",
      explanation:
        "Increasing sample size is the primary way to increase statistical power. Power = P(detecting real effect). More data = more precision = less Type II error.",
      examOnly: true,
    },
    {
      question: "A researcher wants to test if three different therapy types differ in effectiveness. The MOST appropriate test is:",
      optionA: "Independent t-test",
      optionB: "Chi-square",
      optionC: "One-way ANOVA",
      optionD: "Pearson correlation",
      correctAnswer: "C",
      explanation:
        "One-way ANOVA compares the means of 3 or more groups (categorical IV) on a continuous DV, controlling for Type I error across multiple comparisons.",
      examOnly: true,
    },
    {
      question: "What is the purpose of post-hoc tests in ANOVA?",
      optionA: "To check normality assumptions",
      optionB: "To identify which specific group pairs differ after a significant F-test",
      optionC: "To calculate the effect size",
      optionD: "To test homogeneity of variance",
      correctAnswer: "B",
      explanation:
        "The omnibus F-test tells you SOMETHING is significant but not where. Post-hoc tests (Tukey, Bonferroni, Sidak) locate the specific group differences while correcting for multiple comparisons.",
      examOnly: true,
    },
    {
      question: "r² = .25 in a correlation study. What does this mean?",
      optionA: "There is no significant correlation",
      optionB: "25% of the variance in Y is accounted for by X",
      optionC: "The p-value is .25",
      optionD: "The correlation coefficient is .625",
      correctAnswer: "B",
      explanation:
        "r² (coefficient of determination) = shared variance. r² = .25 means 25% of the variability in Y is explained by X; 75% is unexplained (error).",
      examOnly: true,
    },
    {
      question: "When the confidence interval for a mean difference INCLUDES zero, this indicates:",
      optionA: "A large effect size",
      optionB: "High statistical power",
      optionC: "No statistically significant difference",
      optionD: "A Type II error has occurred",
      correctAnswer: "C",
      explanation:
        "If the CI includes 0, zero is a plausible value for the true effect — meaning the difference may not exist. This corresponds to a non-significant result.",
      examOnly: true,
    },
    {
      question: "A paired t-test (correlated samples) differs from an independent t-test because it:",
      optionA: "Uses three or more groups",
      optionB: "Tests the same participants at two time points",
      optionC: "Requires a categorical DV",
      optionD: "Has df = n − 2",
      correctAnswer: "B",
      explanation:
        "A paired t-test tests one group at two time points (pre/post). Each participant serves as their own control. df = n − 1 (not n − 2, which is for independent samples).",
      examOnly: true,
    },
    {
      question: "A Likert scale (e.g., 1–5) is BEST classified as which variable type?",
      optionA: "Ratio",
      optionB: "Nominal",
      optionC: "Interval",
      optionD: "Dichotomous",
      correctAnswer: "C",
      explanation:
        "Likert scales have equal intervals between values but no true zero, making them interval-level. They are NOT ratio because 0 doesn't mean 'none of the construct.'",
      examOnly: true,
    },
    {
      question: "Which test is NON-parametric and requires NO distributional assumptions?",
      optionA: "Independent t-test",
      optionB: "One-way ANOVA",
      optionC: "Pearson correlation",
      optionD: "Chi-square",
      correctAnswer: "D",
      explanation:
        "Chi-square is non-parametric — it makes no assumptions about the population distribution (normality, homogeneity of variance). It compares observed vs. expected frequencies.",
      examOnly: true,
    },
    {
      question: "In regression, what does the error term 'e' represent?",
      optionA: "The mean of Y",
      optionB: "The y-intercept",
      optionC: "Variance in Y not explained by the predictors",
      optionD: "The standardized beta coefficient",
      correctAnswer: "C",
      explanation:
        "The error term (e or residual) captures all variability in the outcome (Y) that the predictors (IVs) fail to explain. Minimizing residuals improves model fit.",
      examOnly: true,
    },
    {
      question: "Which scenario BEST illustrates a Type II error?",
      optionA: "Concluding a drug works when it actually doesn't",
      optionB: "Failing to detect an effective drug because the study was underpowered",
      optionC: "Running too many statistical tests",
      optionD: "Reporting a confidence interval that includes zero",
      correctAnswer: "B",
      explanation:
        "Type II error (false negative) = failing to detect a real effect. Underpowered studies (too small n) are the most common cause — not enough data to find what's there.",
      examOnly: true,
    },
    {
      question: "Cohen's d of .8 indicates a:",
      optionA: "Small effect",
      optionB: "Medium effect",
      optionC: "Large effect",
      optionD: "Trivial effect",
      correctAnswer: "C",
      explanation:
        "By Cohen's conventions: small = .2, medium = .5, large = .8. d = .8 means the groups differ by nearly one full standard deviation.",
      examOnly: true,
    },
    {
      question: "Levene's test is significant in an independent t-test. What should the researcher do?",
      optionA: "Reject the null hypothesis",
      optionB: "Accept the finding as valid",
      optionC: "Adjust the t-test because the homogeneity of variance assumption is violated",
      optionD: "Use a chi-square instead",
      correctAnswer: "C",
      explanation:
        "Significant Levene's test = unequal variances between groups. The t-test must be adjusted (e.g., Welch's t-test) because the standard t-test assumes equal variances.",
      examOnly: true,
    },
    {
      question: "What does multicollinearity in regression refer to?",
      optionA: "Having too many DVs",
      optionB: "Predictor variables that are highly correlated with each other",
      optionC: "Non-normal residual distribution",
      optionD: "A curvilinear relationship between X and Y",
      correctAnswer: "B",
      explanation:
        "Multicollinearity occurs when IVs are highly inter-correlated, making it impossible to determine each predictor's unique contribution to the outcome.",
      examOnly: true,
    },
    {
      question: "Degrees of freedom in a single-sample t-test equals:",
      optionA: "n − 2",
      optionB: "n + 1",
      optionC: "n − 1",
      optionD: "2n − 1",
      correctAnswer: "C",
      explanation:
        "For a single-sample t-test, df = n − 1 (sample size minus 1 parameter estimated). For independent samples t-test, df = n − 2.",
      examOnly: true,
    },
    {
      question: "In ANOVA, the 'within-groups' variation represents:",
      optionA: "The signal to be detected",
      optionB: "Random error within each group",
      optionC: "The effect of the IV on the DV",
      optionD: "Between-group mean differences",
      correctAnswer: "B",
      explanation:
        "Within-groups variation = error (random noise within each group around its mean). Between-groups variation = signal (mean differences across groups). F = signal/error.",
      examOnly: true,
    },
    {
      question: "Phi coefficient is used when:",
      optionA: "Both variables are continuous",
      optionB: "Both variables are true dichotomies",
      optionC: "One variable is ordinal and one is interval",
      optionD: "Three or more groups are being compared",
      correctAnswer: "B",
      explanation:
        "Phi is the effect size/correlation for chi-square with a 2×2 table — two true dichotomous variables (e.g., gender × handedness). For larger tables, use Cramer's V.",
      examOnly: true,
    },
    {
      question: "A standardized beta coefficient in regression is BEST interpreted as:",
      optionA: "The same as Cohen's d",
      optionB: "The effect size for that predictor's unique contribution",
      optionC: "The y-intercept of the regression line",
      optionD: "The correlation between residuals",
      correctAnswer: "B",
      explanation:
        "Standardized beta IS the effect size in regression — it converts coefficients to a −1 to +1 scale, allowing direct comparison of predictor strength.",
      examOnly: true,
    },
    {
      question: "Sampling bias differs from sampling error in that:",
      optionA: "Sampling bias is random; sampling error is systematic",
      optionB: "Sampling error is random; sampling bias is systematic",
      optionC: "Both are equally unavoidable",
      optionD: "Sampling error only occurs with large samples",
      correctAnswer: "B",
      explanation:
        "Sampling error = random, unavoidable chance variation. Sampling bias = systematic distortion that consistently misrepresents the population in a particular direction.",
      examOnly: true,
    },
    {
      question: "A researcher squares the correlation coefficient. The resulting value indicates:",
      optionA: "The probability the correlation is significant",
      optionB: "The proportion of shared variance between the two variables",
      optionC: "The direction of the relationship",
      optionD: "Whether to use Pearson or Spearman",
      correctAnswer: "B",
      explanation:
        "r² = coefficient of determination = proportion of shared/explained variance. E.g., r = .50 → r² = .25 → X explains 25% of Y's variance.",
      examOnly: true,
    },
    {
      question: "Which type of t-test requires independence (participants cannot be in both groups)?",
      optionA: "Single-sample t-test",
      optionB: "Paired t-test",
      optionC: "Independent samples t-test",
      optionD: "Point biserial correlation",
      correctAnswer: "C",
      explanation:
        "Independent samples t-test requires that each participant belongs to only ONE group. Violation of this assumption (participants in both groups) invalidates the test.",
      examOnly: true,
    },
    {
      question: "The T-score (assessment scale) has a mean of ___ and SD of ___.",
      optionA: "100 and 15",
      optionB: "50 and 10",
      optionC: "0 and 1",
      optionD: "10 and 3",
      correctAnswer: "B",
      explanation:
        "T-scores (used in clinical assessment, not to be confused with t-tests) have a mean of 50 and SD of 10. A score of 70 = 2 SDs above the mean.",
      examOnly: true,
    },
    {
      question: "Experimenter-wise error inflation is addressed by using:",
      optionA: "A single t-test instead of ANOVA",
      optionB: "ANOVA or post-hoc corrections (Bonferroni, Tukey, Sidak)",
      optionC: "Increasing the sample size",
      optionD: "Lowering the effect size",
      correctAnswer: "B",
      explanation:
        "Running multiple t-tests inflates Type I error. ANOVA and post-hoc correction methods control for this by adjusting the alpha threshold across comparisons.",
      examOnly: true,
    },
    {
      question: "In a positively skewed distribution, the correct order of central tendency measures from left to right is:",
      optionA: "Mean - Median - Mode",
      optionB: "Mode - Median - Mean",
      optionC: "Median - Mode - Mean",
      optionD: "Mode - Mean - Median",
      correctAnswer: "B",
      explanation:
        "In positive skew, extreme values pull the mean rightward. Order: Mode (leftmost peak) → Median → Mean (rightmost, most affected by outliers).",
      examOnly: true,
    },
    {
      question: "What is 'regression toward the mean'?",
      optionA: "A bias that increases effect size over time",
      optionB: "The statistical phenomenon where extreme scores move closer to the average on retesting",
      optionC: "A method for handling missing data",
      optionD: "The y-intercept of a regression equation",
      correctAnswer: "B",
      explanation:
        "Regression toward the mean: extremely high or low scores on first measurement tend to be less extreme on second measurement — a natural statistical artifact, not a real effect.",
      examOnly: true,
    },
    {
      question: "Heteroscedasticity in a correlation scatter plot appears as:",
      optionA: "A rectangular cloud of points around the regression line",
      optionB: "A fan-shaped pattern where spread increases at extreme values",
      optionC: "A perfect diagonal line",
      optionD: "Points clustered only near the origin",
      correctAnswer: "B",
      explanation:
        "Heteroscedasticity = unequal variance around the regression line. It looks like a 'fan' or 'cone,' violating the assumption of homoscedasticity and weakening correlation estimates.",
      examOnly: true,
    },
    {
      question: "Which statistic would you report alongside a p-value to provide a complete picture of your findings?",
      optionA: "Sample size only",
      optionB: "Degrees of freedom only",
      optionC: "Effect size and confidence interval",
      optionD: "Standard deviation only",
      correctAnswer: "C",
      explanation:
        "Best practice is to report p-value (significance), effect size (magnitude), and confidence interval (precision). This gives a complete picture beyond just yes/no significance.",
      examOnly: true,
    },
    {
      question: "A point biserial correlation is used when:",
      optionA: "Both variables are continuous",
      optionB: "IV is a true dichotomy and DV is continuous",
      optionC: "Both variables are dichotomous",
      optionD: "IV is continuous and DV is categorical",
      correctAnswer: "B",
      explanation:
        "Point biserial correlation: IV is a TRUE dichotomy (e.g., male/female) and DV is continuous. Biserial correlation is for an ARTIFICIAL dichotomy (e.g., clinical/non-clinical).",
      examOnly: true,
    },
    {
      question: "If χ² = 0, what does this indicate?",
      optionA: "Maximum deviation from expectations",
      optionB: "Expected frequencies equal observed frequencies",
      optionC: "A significant result",
      optionD: "A Type I error occurred",
      correctAnswer: "B",
      explanation:
        "χ² = 0 means observed frequencies perfectly match expected frequencies — no deviation from what was predicted. There is no significant difference.",
      examOnly: true,
    },
    {
      question: "ANCOVA differs from standard ANOVA in that it:",
      optionA: "Uses multiple DVs",
      optionB: "Only compares two groups",
      optionC: "Statistically controls for covariate variables",
      optionD: "Requires non-parametric data",
      correctAnswer: "C",
      explanation:
        "ANCOVA adds covariates — variables correlated with the DV but not of primary interest — and statistically removes their influence before testing the IV effect.",
      examOnly: true,
    },
    {
      question: "Which regression method enters predictors in a theoretically driven sequence?",
      optionA: "Stepwise regression",
      optionB: "Forward regression",
      optionC: "Hierarchical regression",
      optionD: "Backward regression",
      correctAnswer: "C",
      explanation:
        "Hierarchical regression enters predictors in researcher-specified blocks based on theory (demographics first, then known predictors, then novel predictors). Stepwise is data-driven.",
      examOnly: true,
    },
    {
      question: "Sensitivity in diagnostic testing is the equivalent of:",
      optionA: "Avoiding Type I errors",
      optionB: "True positive rate — correctly identifying those WITH the condition",
      optionC: "Specificity of diagnosis",
      optionD: "Effect size of the test",
      correctAnswer: "B",
      explanation:
        "Sensitivity = true positive rate = how often the test correctly says 'yes' when the condition IS present. High sensitivity minimizes false negatives (opposite of Type II error).",
      examOnly: true,
    },
    {
      question: "In an F-ratio, you want the between-groups variance to be ___ relative to within-groups variance.",
      optionA: "Equal",
      optionB: "Smaller",
      optionC: "Larger",
      optionD: "At zero",
      correctAnswer: "C",
      explanation:
        "F = between-groups variation / within-groups variation. A large F (between > within) means the signal exceeds the noise, indicating significant group differences.",
      examOnly: true,
    },
    {
      question: "What is an ordinal variable?",
      optionA: "A variable with equal intervals and a true zero",
      optionB: "A variable that is ranked but with unequal intervals between ranks",
      optionC: "A categorical variable with no order",
      optionD: "A continuous variable with a Gaussian distribution",
      correctAnswer: "B",
      explanation:
        "Ordinal variables have rank order (1st, 2nd, 3rd) but unequal/unknown intervals between ranks. You know the order but not HOW MUCH better one rank is than another.",
      examOnly: true,
    },
    {
      question: "In regression, the x-intercept represents:",
      optionA: "The effect size",
      optionB: "The grand mean of X",
      optionC: "The error term",
      optionD: "The standardized beta",
      correctAnswer: "B",
      explanation:
        "The x-intercept (where the regression line crosses the x-axis) represents the grand mean of X. The y-intercept (a) = predicted Y when all predictors are 0.",
      examOnly: true,
    },
    {
      question: "Which of the following is TRUE about the sum of deviation scores?",
      optionA: "It always equals the variance",
      optionB: "It is always positive",
      optionC: "It always equals zero",
      optionD: "It equals the SD",
      correctAnswer: "C",
      explanation:
        "The sum of deviation scores (Σ(x − mean)) always equals 0 because positive and negative deviations cancel out. This is why variance is computed using squared deviations.",
      examOnly: true,
    },
    {
      question: "A Spearman correlation would be most appropriate for:",
      optionA: "Comparing exam scores (continuous) to age (continuous)",
      optionB: "Comparing ranked class standing to ranked GRE scores",
      optionC: "Comparing gender to income",
      optionD: "Predicting depression from anxiety",
      correctAnswer: "B",
      explanation:
        "Spearman is for ordinal (ranked) data. Ranked class standing and ranked GRE scores are ordinal — Spearman is the non-parametric alternative to Pearson.",
      examOnly: true,
    },
    {
      question: "Which of the following would most likely INFLATE Type I error?",
      optionA: "Using a paired t-test",
      optionB: "Running 10 separate t-tests across the same dataset",
      optionC: "Increasing statistical power",
      optionD: "Using a Bonferroni correction",
      correctAnswer: "B",
      explanation:
        "Multiple testing (fishing) inflates Type I error — the experimenter-wise error rate. Each additional test adds another chance of a spurious 'significant' finding.",
      examOnly: true,
    },
    {
      question: "What does the 'best fit line' in a correlation represent?",
      optionA: "The mode of the distribution",
      optionB: "A line with equal numbers of values above and below it",
      optionC: "The regression line connecting only the highest scores",
      optionD: "The standard deviation of the sample",
      correctAnswer: "B",
      explanation:
        "The best fit line (regression line) is placed so that equal numbers of data points are above and below it, minimizing the total sum of squared residuals (OLS method).",
      examOnly: true,
    },
    {
      question: "A Cramer's V statistic would be used when:",
      optionA: "Both variables are continuous",
      optionB: "Measuring effect size in a chi-square with a table larger than 2×2",
      optionC: "Running a paired t-test",
      optionD: "Controlling for covariates in ANOVA",
      correctAnswer: "B",
      explanation:
        "Cramer's V is the effect size measure for chi-square tests involving tables larger than 2×2 (more than two groups per variable). Phi is used only for 2×2 tables.",
      examOnly: true,
    },
  ];

  const allQs = [...regularQuestions, ...examOnlyQuestions].map((q) => ({
    ...q,
    topicId,
  }));

  const insertedQs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(
    `✓ Inserted ${insertedQs.length} quiz questions (${regularQuestions.length} regular + ${examOnlyQuestions.length} exam-only)`
  );

  // ============================================================
  // STUDY GUIDE
  // ============================================================
  const studyGuideContent = `# Foundations in Statistics — Study Guide

## 1. What Is Statistics?

Statistics is the **study of variation** — what makes values differ across observations. The three goals of statistics are:

1. **Description** — summarize what the data look like
2. **Comparison** — determine when values differ (pattern vs. random error)
3. **Estimation** — use samples to make inferences about the population

**Key distinction:**
- **Population** = everyone / the "truth" (unknown and untestable in full)
- **Sample** = a subset used to make the best guess about the population (inferential statistics)
- **Population parameter** = a characteristic to be estimated (e.g., mean, SD, frequency count)

---

## 2. Variables and Measurement Levels

| Level | Key Feature | Example |
|---|---|---|
| **Nominal/Categorical** | No order; groups only | Gender, diagnosis |
| **Ordinal** | Ranked, but unequal intervals | Class rank, Likert (sometimes) |
| **Interval** | Equal intervals, NO true zero | Temperature (°F), Likert scale |
| **Ratio** | Equal intervals AND true zero | Height, weight, reaction time |

**Rule:** As you move from nominal → ratio, you gain more information and can use more powerful statistics.

---

## 3. Normal Distribution

- Bell-shaped curve representing **random chance**
- Establishes the baseline for determining what is "significant" (unexpected)
- Applies to continuous variables (ordinal, interval, ratio)
- **Skewness:**
  - Positive skew: tail to the right; Mean > Mode; order = Mode-Median-Mean
  - Negative skew: tail to the left; Mode > Mean; order = Mean-Median-Mode

---

## 4. Central Tendency

| Measure | Description | When to Use |
|---|---|---|
| **Mean** | Sum ÷ n; influenced by outliers | Normal distribution, prediction |
| **Median** | Middle value; NOT influenced by outliers | Skewed data; extreme scores |
| **Mode** | Most frequent value | Categorical data; bimodal detection |

---

## 5. Variability and Standard Deviation

- **Deviation scores:** distance of each score from the mean. **Sum always = 0**
- **Variance:** mean of squared deviations (mean SS). Represents spread
- **Standard deviation (SD):** √variance; average deviation from the mean

### Key percentages under the normal curve:
- ±1 SD = 34% on each side (68% total)
- ±2 SD = 14% more on each side (~95% total)
- ±3 SD = 2% more on each side (~99.7% total)

**Red flag:** SD should never be greater than the mean.

### Homogeneity vs. Heterogeneity:
- **Homogeneity:** low variability, scores clustered near the mean
- **Heterogeneity:** high variability, scores spread widely

---

## 6. Standard Scores

| Score | Formula | Scale | Use |
|---|---|---|---|
| **z-score** | (x − µ) / σ | Population-based | Comparing across different measurement systems |
| **T-score** | (x − µ) / (σ/√n) | Sample-based; M=50, SD=10 | Clinical assessment contexts |
| **Percentile** | Rank in distribution | 0–100 | Location relative to peers |

---

## 7. Sampling and Standard Error

- **Sampling distribution:** distribution of many possible sample means
- **Standard Error of the Mean (SEM):** discrepancy between sample mean and population mean. Should be small (never 0). Decreases as n increases
- **Central Limit Theorem:** As n grows, the sampling distribution of means approaches normal — regardless of the population's shape. With large n, sample mean ≈ population mean

---

## 8. Hypothesis Testing and Errors

| | **H₀ True** | **H₀ False** |
|---|---|---|
| **Reject H₀** | Type I Error (false positive) | Correct (power) |
| **Accept H₀** | Correct | Type II Error (false negative) |

- **Type I (α):** false positive; p < .05; experimenter-wise error from multiple testing
- **Type II (β):** false negative; p > .05; caused by insufficient power/sample size
- **Fix:** Replication and adequate sample sizes

### Confidence Intervals:
- CI **includes 0** → NOT significant
- CI **excludes 0** → Significant

---

## 9. Effect Size and Power

| Concept | What it answers |
|---|---|
| **p-value** | Was there an effect? (yes/no) |
| **Effect size** | How big was the effect? (magnitude) |
| **Power** | Could we detect the effect if it existed? |

**Always report: p-value + confidence interval + effect size**

### Effect size levels (Cohen):
| Category | d / β |
|---|---|
| Small | .2 |
| Medium | .5 |
| Large | .8 |

- **Cohen's d:** population-based
- **Hedges' g:** sample-adjusted (preferred for small n)

### Power (.80 is standard target):
Increasing power requires:
1. Larger sample size ✓ (most common fix)
2. Higher alpha (e.g., .05 → .10)
3. Larger effect size ("stack the deck")

---

## 10. t-Tests

| Type | IV | DV | df |
|---|---|---|---|
| Single-sample | 1 group vs. normative mean | Continuous | n − 1 |
| Independent samples | 2 independent groups | Continuous | n − 2 |
| Paired (correlated) | 1 group × 2 time points | Continuous | n − 1 |

**Assumptions:** Homogeneity of variance (checked with Levene's test), independence.
- **Levene's IS significant** → unequal variances → must adjust the t-test.
- Robust with n > 20.

---

## 11. ANOVA (Analysis of Variance)

- Used for **3 or more groups** (extends t-test, controls Type I error)
- **F = between-groups variation / within-groups variation = signal / error**
- Significance: p < .05, F-threshold ~1.96, n ≥ 30

**Post-hoc tests** (identify WHERE differences are): Tukey, Bonferroni, Sidak

| Variant | Purpose |
|---|---|
| **One-way ANOVA** | One IV with 3+ groups |
| **Factorial ANOVA** | Multiple IVs (main effects + interactions) |
| **ANCOVA** | Adds covariates to statistically control extraneous variables |
| **MANOVA** | Multiple IVs and multiple DVs simultaneously |

---

## 12. Correlations

- Measures association between **two continuous variables** (no IV/DV required)
- **r** ranges from −1 to +1
- **r² (coefficient of determination)** = shared variance (e.g., r = .44 → r² = .19 → 19% shared)
- **Correlation = effect size**

| Type | Data | Parametric? |
|---|---|---|
| Pearson | Interval/Ratio | Yes |
| Spearman | Ordinal/Ranked | No |
| Phi | 2 true dichotomies | — |
| Tetrachoric | 2 artificial dichotomies | — |
| Point biserial | TRUE dichotomy IV + continuous DV | — |
| Biserial | ARTIFICIAL dichotomy IV + continuous DV | — |
| Cramer's V / Contingency | 3+ category variables | — |

**Assumptions:**
- Relationship must be LINEAR (curvilinear → no valid correlation)
- **Homoscedasticity:** equal spread around the regression line (rectangular shape)
- **Heteroscedasticity:** fanning pattern → weak, distorted correlation

---

## 13. Regression

**Equation:** Y' = a + bX₁ + bX₂ + ... + e

| Symbol | Meaning |
|---|---|
| Y' | Predicted outcome |
| a | y-intercept |
| b | Slope (unstandardized) or β (standardized, −1 to +1) |
| e | Error/residual |

**Types:**
- **Hierarchical:** theory-driven blocks (Block 1: demographics; Block 2: known predictors; Block 3: new predictors)
- **Stepwise:** data-driven; Forward (add one at a time) or Backward (remove based on p-value)

**Problems:**
- Multicollinearity: IVs too highly correlated with each other
- Curvilinear X–Y relationship
- Multiple DVs (use MANOVA instead)

**Mediation vs. Moderation:**
- **Mediation:** X → M → Y (third variable EXPLAINS the relationship)
- **Moderation:** X × moderator → Y (third variable CHANGES the relationship)

---

## 14. Chi-Square (Non-Parametric)

- Compares **observed vs. expected proportions** across categorical groups
- **No distributional assumptions** required
- χ² is always positive; χ² = 0 → perfect match (expected = observed)
- Larger χ² → more likely significant

**Effect sizes:**
- **Phi coefficient:** 2×2 table (two true dichotomies)
- **Cramer's V:** tables larger than 2×2

### Sensitivity vs. Specificity:
| Concept | Description |
|---|---|
| Sensitivity | True positive rate — correctly identifies those WITH condition |
| Specificity | True negative rate — correctly identifies those WITHOUT condition |

---

## Key Formulas Summary

| Formula | Description |
|---|---|
| z = (x − µ) / σ | z-score (population) |
| Y' = a + bX + e | Regression equation |
| F = MS_between / MS_within | ANOVA F-ratio |
| r² = (correlation)² | Coefficient of determination |
| SEM = SD × √(1 − rxx) | Standard error of measurement |
| df = n − 1 or n − 2 | Degrees of freedom |`;

  const [studyGuide] = await db
    .insert(studyGuidesTable)
    .values({
      topicId,
      title: "Foundations in Statistics — Complete Study Guide",
      content: studyGuideContent,
    })
    .returning();
  console.log(`✓ Study guide created id=${studyGuide.id}`);

  // ============================================================
  // PRACTICE EXAM
  // ============================================================
  const [practiceExam] = await db
    .insert(practiceExamsTable)
    .values({
      topicId,
      title: "Foundations in Statistics Practice Exam",
      timeLimit: 90,
      passingScore: 70,
    })
    .returning();
  console.log(`✓ Practice exam created id=${practiceExam.id}`);

  const allInsertedQs = await db
    .select({ id: quizQuestionsTable.id })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.topicId, topicId));

  await db.insert(practiceExamQuestionsTable).values(
    allInsertedQs.map((q, i) => ({
      examId: practiceExam.id,
      questionId: q.id,
      questionOrder: i + 1,
    }))
  );
  console.log(`✓ Linked ${allInsertedQs.length} questions to practice exam`);

  console.log(`\n✅ Foundations in Statistics (id=${topicId}) fully seeded!`);
}

addFoundationsStatsTopic()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
