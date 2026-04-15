import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
} from "./schema";

async function addFoundationsStatsTopic() {
  console.log("Seeding Foundations in Statistics topic...");

  const [topic] = await db
    .insert(topicsTable)
    .values({
      name: "Foundations in Statistics",
      category: "Research & Statistics",
      description:
        "Core statistical concepts including variable types, distributions, central tendency, variability, hypothesis testing, t-tests, ANOVA, correlation, regression, and chi-square.",
    })
    .returning();

  const topicId = topic.id;
  console.log(`✓ Created topic id=${topicId}`);

  // ============================================================
  // FLASHCARDS (55)
  // ============================================================
  const flashcards = [
    // Foundations
    {
      question: "What is statistics?",
      answer: "The study of variation — determining what makes A different from B using numbers/data that represent variation observed through measurement.",
      difficulty: "easy",
    },
    {
      question: "What is the core structure of any statistical comparison?",
      answer: "A ratio comparing a pattern (prediction) versus error (random chance). We want the pattern to be large relative to the error.",
      difficulty: "easy",
    },
    {
      question: "What is a population parameter?",
      answer: "A characteristic of a variable that is to be discovered. It is the true value for the entire population, which is unknown and described by mean, SD, or frequency count.",
      difficulty: "easy",
    },
    {
      question: "What is the difference between a population and a sample?",
      answer: "A population is everyone — the 'truth' that is unknown. A sample is the 'guess' (biopsy of the population) used in inferential statistics to estimate the population.",
      difficulty: "easy",
    },
    {
      question: "What determines which statistical analysis is used?",
      answer: "The types of variables (independent and dependent) determine which statistical analysis is appropriate.",
      difficulty: "easy",
    },
    // Variable Types
    {
      question: "What is a discontinuous/nominal/categorical variable?",
      answer: "A variable that does NOT vary by level — it represents distinct categories with no inherent order or numeric meaning (e.g., gender, ethnicity).",
      difficulty: "easy",
    },
    {
      question: "What is a continuous variable?",
      answer: "A variable that varies by level, expressed as frequency (number count/amount) or intensity (mild–severe). Types include ordinal, interval, and ratio.",
      difficulty: "easy",
    },
    {
      question: "What distinguishes an ordinal variable?",
      answer: "Ordinal variables are ranked (e.g., 1st, 2nd, 3rd place) with unequal intervals between values, no set zero, and require additional information to interpret meaning.",
      difficulty: "medium",
    },
    {
      question: "What distinguishes an interval variable from ordinal?",
      answer: "Interval variables have equal distance between values (e.g., Likert scale) but still lack a definitive zero point, making ratios meaningless.",
      difficulty: "medium",
    },
    {
      question: "What distinguishes a ratio variable?",
      answer: "Ratio variables have equal intervals AND a definitive zero point (e.g., height, weight, distance), so no additional information is needed to interpret variation.",
      difficulty: "medium",
    },
    // Distributions
    {
      question: "What does a normal distribution represent statistically?",
      answer: "Random chance. It establishes what is expected vs. unexpected and serves as the baseline for determining significance in continuous variables.",
      difficulty: "easy",
    },
    {
      question: "What is a positive skew?",
      answer: "A distribution where more values fall to the right (long tail on right), with Mean > Mode. Order: Mode–Median–Mean.",
      difficulty: "medium",
    },
    {
      question: "What is a negative skew?",
      answer: "A distribution where more values fall to the left (long tail on left), with Mode > Mean. Order: Mean–Median–Mode.",
      difficulty: "medium",
    },
    {
      question: "What is a key rule about SD and skewness?",
      answer: "The SD should never be greater than the mean. Skewness >5.0 indicates a problematic distribution.",
      difficulty: "medium",
    },
    // Central Tendency
    {
      question: "What is central tendency?",
      answer: "A statistic (value) that tells where scores of a sample are converging — it shows the center of a distribution.",
      difficulty: "easy",
    },
    {
      question: "What is the mean and when is it problematic?",
      answer: "The mean is the sum of all values divided by the number of values. It is influenced by outliers, which pull it toward the extreme value and misrepresent overall performance.",
      difficulty: "easy",
    },
    {
      question: "What is the median and when is it preferred?",
      answer: "The median has equal numbers of scores above and below it. It is NOT influenced by outliers and is preferred when ignoring extreme scores, though it may not detect skewness.",
      difficulty: "easy",
    },
    {
      question: "What is the mode?",
      answer: "The most frequent number in the distribution. It is the only measure of central tendency that can be used with nominal data.",
      difficulty: "easy",
    },
    // Variability
    {
      question: "What is variability?",
      answer: "The spread of scores — the distance from the mean and from what you expect to happen. It describes how spread out the distribution is.",
      difficulty: "easy",
    },
    {
      question: "What are deviation scores?",
      answer: "A set of values that indicate how much each score spreads above or below the mean. The sum of all deviation scores always equals 0.",
      difficulty: "medium",
    },
    {
      question: "What is variance?",
      answer: "The mean sum of squares (SS) — the average of the squared deviation scores. It represents the area underneath the curve.",
      difficulty: "medium",
    },
    {
      question: "What is standard deviation?",
      answer: "The square root of the variance — the average deviation of scores from the mean. Taking the square root makes units equidistant regardless of area size.",
      difficulty: "easy",
    },
    {
      question: "What percentages of scores fall within each SD of the mean?",
      answer: "1 SD = 34% of scores; 2 SD = 14% of scores; 3 SD = 2% of scores (on each side of the mean).",
      difficulty: "medium",
    },
    {
      question: "What is homogeneity vs. heterogeneity of variance?",
      answer: "Homogeneity = low variability (scores clustered close together). Heterogeneity = high variability (scores spread widely apart).",
      difficulty: "medium",
    },
    // Standard Scores
    {
      question: "What is a z-score?",
      answer: "A population-based standard score: z = (x − μ) / σ. It describes how far a score is from the mean in SD units and allows comparison across different measurement systems.",
      difficulty: "medium",
    },
    {
      question: "What is a T-score?",
      answer: "A sample-based standard score: T = (x − μ) / (σ/√n). It is localized to the current sample context, with a mean of 50 and SD of 10.",
      difficulty: "medium",
    },
    {
      question: "What do percentiles communicate?",
      answer: "Percentiles show the location of a score and how many scores fall above and below it in the distribution.",
      difficulty: "easy",
    },
    // Sampling & Standard Error
    {
      question: "What is the standard error of the mean?",
      answer: "The amount of discrepancy between the sample mean and the population mean. It should be small (close to 0) and decreases as sample size increases.",
      difficulty: "medium",
    },
    {
      question: "What is the Central Limit Theorem?",
      answer: "If you sample randomly and repeatedly, the sampling distribution of sample means approaches a normal distribution as sample size grows, and the sample mean approaches the population mean.",
      difficulty: "medium",
    },
    {
      question: "What is the standard error of measurement (SEM)?",
      answer: "An index of the amount of error expected around an obtained score due to test unreliability. Used to construct confidence intervals: 95% CI = score ± 2(SEM).",
      difficulty: "medium",
    },
    // Hypothesis Testing
    {
      question: "What is a null hypothesis?",
      answer: "The hypothesis of no significant difference (Ho). Accepting the null means concluding that results are due to random chance.",
      difficulty: "easy",
    },
    {
      question: "What is a Type I error?",
      answer: "A false positive — rejecting the null hypothesis when it is true. Caused by experimenter-wise error (testing too many things). Results that fall under p<.05 can automatically be Type I.",
      difficulty: "medium",
    },
    {
      question: "What is a Type II error?",
      answer: "A false negative — accepting the null hypothesis when it is false. Caused by insufficient sample size (underpowered study). Results over p>.05 can automatically be Type II.",
      difficulty: "medium",
    },
    {
      question: "How are Type I and Type II errors fixed?",
      answer: "Through replication — redoing the entire experiment to confirm or disconfirm the original finding.",
      difficulty: "easy",
    },
    {
      question: "What does a confidence interval tell you about significance?",
      answer: "If the CI includes 0 → not significant. If the CI does NOT include 0 → significant.",
      difficulty: "medium",
    },
    // Effect Size & Power
    {
      question: "What is effect size?",
      answer: "The magnitude of difference between groups or strength of relationship between two variables. Measured in standard deviation units. Small=.2, Medium=.5, Large=.8 (Cohen's benchmarks).",
      difficulty: "medium",
    },
    {
      question: "What do Cohen's d and Hedges' g measure?",
      answer: "Both measure group effect size in SD units. Cohen's d is population-based; Hedges' g adjusts for estimated population SD (better for smaller samples).",
      difficulty: "hard",
    },
    {
      question: "What does statistical power mean?",
      answer: "The likelihood of detecting an effect if one truly exists. Standard power = .80. Power addresses the Type II error. Addresses whether you have enough chances to find what you're looking for.",
      difficulty: "medium",
    },
    {
      question: "How can statistical power be increased?",
      answer: "1) Increase sample size, 2) Increase the alpha level (e.g., .05 → .10), or 3) Increase the effect size ('stack the deck').",
      difficulty: "medium",
    },
    {
      question: "What is the difference between significance and effect size?",
      answer: "Significance (p-value) only answers yes/no — did something happen? Effect size answers 'by how much?' — how large is the impact of the IV on the DV?",
      difficulty: "medium",
    },
    // T-tests
    {
      question: "What does a t-test measure?",
      answer: "Whether the means of two groups are statistically different from each other. The IV is categorical (2 groups) and the DV is always continuous.",
      difficulty: "easy",
    },
    {
      question: "What are the three main types of t-tests?",
      answer: "1) Single-sample t-test (one group vs. normative mean, df=n−1), 2) Independent samples t-test (two separate groups, df=n−2), 3) Paired/correlated t-test (one group at 2 time points, df=n−1).",
      difficulty: "medium",
    },
    {
      question: "What is Levene's test used for?",
      answer: "To check for equality/homogeneity of variance between groups. If significant → NO homogeneity of variance → the t-test result cannot be trusted and must be adjusted.",
      difficulty: "hard",
    },
    {
      question: "What are degrees of freedom?",
      answer: "The number of observations that are free to vary — calculated as sample size minus the number of parameters being estimated. Larger samples = more df.",
      difficulty: "medium",
    },
    // ANOVA
    {
      question: "When is ANOVA used instead of a t-test?",
      answer: "When the IV has three or more categorical groups (and the DV is continuous). ANOVA avoids inflating Type I error that multiple t-tests would cause.",
      difficulty: "easy",
    },
    {
      question: "What is the F-ratio in ANOVA?",
      answer: "Between-groups variation (signal/numerator) divided by within-groups variation (error/denominator). Want between > within for significance.",
      difficulty: "medium",
    },
    {
      question: "What are post-hoc comparisons in ANOVA?",
      answer: "Tests run after a significant F-test to identify WHICH specific groups differ. Types include Tukey, Sidak, and Bonferroni — all adjust for Type I error inflation.",
      difficulty: "medium",
    },
    {
      question: "What is ANCOVA?",
      answer: "Analysis of Covariance — an ANOVA that includes covariates (variables related to the DV but not the main IV). It statistically removes their effect to isolate the IV's impact.",
      difficulty: "hard",
    },
    {
      question: "What is MANOVA?",
      answer: "Multiple Analysis of Variance — used when there are multiple DVs. It avoids multiple-experimentwise error that running many ANOVAs would create.",
      difficulty: "hard",
    },
    // Correlations
    {
      question: "What does a correlation coefficient (r) tell you?",
      answer: "The degree of association between two continuous variables. Ranges from −1 (perfect negative) to +1 (perfect positive). r = 0 means no relationship.",
      difficulty: "easy",
    },
    {
      question: "What is the coefficient of determination (r²)?",
      answer: "The squared correlation coefficient — the proportion of shared variance between two variables. For example, r=.44 → r²=.19, meaning 19% of variance in Y is explained by X.",
      difficulty: "medium",
    },
    {
      question: "What is the difference between Pearson and Spearman correlations?",
      answer: "Pearson: parametric, for interval/ratio data. Spearman: nonparametric, for ordinal/ranked data.",
      difficulty: "medium",
    },
    {
      question: "What is homoscedasticity in correlations?",
      answer: "All values around the best-fit line are the same distance from it (rectangular shape) — indicates a strong, consistent correlation.",
      difficulty: "hard",
    },
    // Regression
    {
      question: "What is regression?",
      answer: "A statistical method examining the relationship between multiple IVs and one continuous outcome variable. Uses the equation: Y' = a + bX₁ + bX₂ ... + e.",
      difficulty: "medium",
    },
    {
      question: "What is hierarchical regression?",
      answer: "A regression approach where variables are entered in predetermined blocks: Block 1 = known demographics, Block 2 = known important predictors, Block 3 = predictors of interest.",
      difficulty: "hard",
    },
    // Chi-Square
    {
      question: "When is chi-square used?",
      answer: "Chi-square is a nonparametric test used to compare observed vs. expected proportions/frequencies across categorical groups. It has no assumptions about distribution.",
      difficulty: "medium",
    },
    {
      question: "What are sensitivity and specificity?",
      answer: "Sensitivity = true positive rate (correctly identifies those who HAVE the condition). Specificity = true negative rate (correctly identifies those who do NOT have the condition).",
      difficulty: "hard",
    },
  ];

  const insertedFlashcards = await db
    .insert(flashcardsTable)
    .values(flashcards.map((f) => ({ ...f, topicId })))
    .returning();
  console.log(`✓ Inserted ${insertedFlashcards.length} flashcards`);

  // ============================================================
  // QUIZ QUESTIONS — Regular (10)
  // ============================================================
  const regularQuestions = [
    {
      question: "Which measure of central tendency is NOT influenced by outliers?",
      optionA: "Mean",
      optionB: "Median",
      optionC: "Mode",
      optionD: "Variance",
      correctAnswer: "B",
      explanation: "The median is not influenced by outliers because it only depends on the middle value, not the magnitude of extreme scores.",
      examOnly: false,
    },
    {
      question: "What does a p-value of .03 indicate?",
      optionA: "There is a 3% chance the effect is real",
      optionB: "There is a 3% probability this result occurred by random chance",
      optionC: "The effect size is small",
      optionD: "The null hypothesis is definitely false",
      correctAnswer: "B",
      explanation: "A p-value of .03 means there is a 3% probability of observing these results by random chance alone, which is below the conventional .05 threshold.",
      examOnly: false,
    },
    {
      question: "Which variable type has equal intervals AND a true zero point?",
      optionA: "Ordinal",
      optionB: "Nominal",
      optionC: "Interval",
      optionD: "Ratio",
      correctAnswer: "D",
      explanation: "Ratio variables have equal intervals between values AND a definitive zero point (e.g., height, weight). This allows meaningful ratio comparisons.",
      examOnly: false,
    },
    {
      question: "A researcher finds p = .04 but the effect size is d = .12. What is the best interpretation?",
      optionA: "The finding is practically significant and important",
      optionB: "The finding is statistically significant but practically trivial",
      optionC: "The study has a Type II error",
      optionD: "The finding is not significant at all",
      correctAnswer: "B",
      explanation: "p < .05 means statistical significance, but d = .12 is well below the small effect threshold (.2), indicating the actual impact is practically trivial — often a sign of an overpowered study.",
      examOnly: false,
    },
    {
      question: "Which type of error occurs when you reject the null hypothesis but it is actually true?",
      optionA: "Type II error",
      optionB: "Sampling error",
      optionC: "Type I error",
      optionD: "Standard error",
      correctAnswer: "C",
      explanation: "A Type I error is a false positive — rejecting the null when it is true. It is related to alpha level and experimenter-wise error from testing too many hypotheses.",
      examOnly: false,
    },
    {
      question: "In a positively skewed distribution, which is true?",
      optionA: "Mean < Mode",
      optionB: "The tail extends to the left",
      optionC: "Mean > Median > Mode",
      optionD: "Mode > Mean",
      correctAnswer: "C",
      explanation: "In a positive skew, the tail extends to the right. The order is Mode–Median–Mean, meaning the mean is pulled highest by extreme high values.",
      examOnly: false,
    },
    {
      question: "What is the ANOVA threshold for significance when N ≥ 30?",
      optionA: "t = 2.00",
      optionB: "F = 1.96",
      optionC: "χ² = 3.84",
      optionD: "z = 1.645",
      correctAnswer: "B",
      explanation: "The ANOVA significance threshold is F = 1.96 when N ≥ 30 and α = .05.",
      examOnly: false,
    },
    {
      question: "What does the Central Limit Theorem state?",
      optionA: "The population is always normally distributed",
      optionB: "As sample size increases, the sampling distribution of means approaches normal",
      optionC: "Random sampling eliminates all error",
      optionD: "The mean always equals the median in a large sample",
      correctAnswer: "B",
      explanation: "The CLT states that the distribution of sample means approaches a normal distribution as sample size grows, regardless of the original population's shape.",
      examOnly: false,
    },
    {
      question: "Which correlation type is used for ordinal (ranked) data?",
      optionA: "Pearson",
      optionB: "Phi",
      optionC: "Spearman",
      optionD: "Eta",
      correctAnswer: "C",
      explanation: "Spearman correlation is a nonparametric alternative to Pearson, designed for ordinal/ranked data where equal intervals cannot be assumed.",
      examOnly: false,
    },
    {
      question: "What does r² (coefficient of determination) indicate?",
      optionA: "The significance of the correlation",
      optionB: "The direction of the relationship",
      optionC: "The proportion of shared variance between two variables",
      optionD: "The standard deviation of residuals",
      correctAnswer: "C",
      explanation: "r² is the squared correlation coefficient and indicates what proportion of variance in Y is accounted for by variance in X (shared variance).",
      examOnly: false,
    },
  ];

  // ============================================================
  // EXAM-ONLY QUESTIONS (40)
  // ============================================================
  const examOnlyQuestions = [
    {
      question: "The sum of all deviation scores in a distribution always equals:",
      optionA: "1",
      optionB: "The mean",
      optionC: "0",
      optionD: "The standard deviation",
      correctAnswer: "C",
      explanation: "Deviation scores are distances from the mean, and by definition they always sum to zero because the mean is their balance point.",
      examOnly: true,
    },
    {
      question: "Which standard score is population-based and allows comparison across different measurement systems?",
      optionA: "T-score",
      optionB: "Percentile",
      optionC: "Stanine",
      optionD: "z-score",
      correctAnswer: "D",
      explanation: "The z-score is population-based (uses μ and σ) and can be used to compare scores across different measurement systems by converting to a common SD unit.",
      examOnly: true,
    },
    {
      question: "A T-score has a mean of ___ and a standard deviation of ___.",
      optionA: "100 and 15",
      optionB: "50 and 10",
      optionC: "0 and 1",
      optionD: "10 and 3",
      correctAnswer: "B",
      explanation: "T-scores are sample-based standard scores with a mean of 50 and SD of 10, used in psychological assessment contexts.",
      examOnly: true,
    },
    {
      question: "Variance is mathematically defined as the:",
      optionA: "Square root of the standard deviation",
      optionB: "Sum of raw scores divided by N",
      optionC: "Mean sum of squares",
      optionD: "Range divided by 6",
      correctAnswer: "C",
      explanation: "Variance is the mean sum of squares (SS) — the average of the squared deviation scores from the mean.",
      examOnly: true,
    },
    {
      question: "What does the standard error of the mean represent?",
      optionA: "The reliability of individual test scores",
      optionB: "The discrepancy between the sample mean and population mean",
      optionC: "The spread of scores within one group",
      optionD: "The correlation between IV and DV",
      correctAnswer: "B",
      explanation: "The standard error of the mean quantifies how much the sample mean is likely to deviate from the true population mean. It decreases as sample size increases.",
      examOnly: true,
    },
    {
      question: "Which interval on the bell curve contains approximately 68% of scores?",
      optionA: "Within 2 SDs of the mean",
      optionB: "Within 1 SD of the mean (both sides)",
      optionC: "Within 3 SDs of the mean",
      optionD: "Between the mean and median",
      correctAnswer: "B",
      explanation: "1 SD on each side of the mean = 34% × 2 = 68% of scores. This is the core of the empirical rule (68-95-99.7).",
      examOnly: true,
    },
    {
      question: "An outlier in a dataset primarily affects which measure of central tendency?",
      optionA: "Median",
      optionB: "Mode",
      optionC: "Mean",
      optionD: "Percentile rank",
      correctAnswer: "C",
      explanation: "The mean is pulled in the direction of the outlier because it uses all values in its calculation, distorting the overall representation.",
      examOnly: true,
    },
    {
      question: "The standard error of the estimate involves:",
      optionA: "Only the dependent variable",
      optionB: "Both the IV and DV, determining how one score relates to another",
      optionC: "Only measurement error from test unreliability",
      optionD: "The distance between sample and population means",
      correctAnswer: "B",
      explanation: "The standard error of the estimate involves both IV and DV and describes how accurately the IV predicts the DV (the error in regression predictions).",
      examOnly: true,
    },
    {
      question: "What is experimenter-wise error?",
      optionA: "Error due to equipment malfunction",
      optionB: "The inflation of Type II error by running too few analyses",
      optionC: "Increased likelihood of finding significance when testing many hypotheses",
      optionD: "Error introduced by biased sampling",
      correctAnswer: "C",
      explanation: "Experimenter-wise (or familywise) error is the increased probability of a Type I error when multiple tests are conducted — the more you test, the more likely you'll find something by chance.",
      examOnly: true,
    },
    {
      question: "If a confidence interval for a mean difference is [−3.2, 8.5], what can you conclude?",
      optionA: "The result is significant at p < .05",
      optionB: "The result is not significant because the CI includes 0",
      optionC: "The effect size is large",
      optionD: "The sample is too large",
      correctAnswer: "B",
      explanation: "When a confidence interval includes 0, the difference could be zero — meaning there is no statistically significant difference.",
      examOnly: true,
    },
    {
      question: "Effect size is independent of which factor?",
      optionA: "The magnitude of the difference",
      optionB: "Standard deviation",
      optionC: "Sample size",
      optionD: "The measurement instrument",
      correctAnswer: "C",
      explanation: "Effect size is NOT influenced by sample size — it reflects the true magnitude of the effect regardless of how many participants were studied.",
      examOnly: true,
    },
    {
      question: "Cohen's benchmarks for effect sizes are: Small = ___, Medium = ___, Large = ___",
      optionA: ".1, .3, .5",
      optionB: ".2, .5, .8",
      optionC: ".3, .6, .9",
      optionD: ".5, 1.0, 1.5",
      correctAnswer: "B",
      explanation: "Cohen's conventional benchmarks are: small = .2, medium = .5, large = .8 — measured in standard deviation units.",
      examOnly: true,
    },
    {
      question: "How is shared variance calculated from a correlation?",
      optionA: "r × 2",
      optionB: "√r",
      optionC: "r²",
      optionD: "r / SD",
      correctAnswer: "C",
      explanation: "Shared variance = r² (coefficient of determination). For example, r = .50 → r² = .25, meaning 25% of variance in Y is explained by X.",
      examOnly: true,
    },
    {
      question: "The degrees of freedom for an independent samples t-test with n total participants is:",
      optionA: "n − 1",
      optionB: "n − 2",
      optionC: "n − 3",
      optionD: "2n − 1",
      correctAnswer: "B",
      explanation: "For an independent samples t-test comparing two groups, df = n − 2 (one parameter estimated per group).",
      examOnly: true,
    },
    {
      question: "Which t-test compares one group to a normative mean?",
      optionA: "Paired t-test",
      optionB: "Independent samples t-test",
      optionC: "Single-sample t-test",
      optionD: "Point biserial",
      correctAnswer: "C",
      explanation: "The single-sample t-test compares one group's mean to a known or normative population mean, with df = n − 1.",
      examOnly: true,
    },
    {
      question: "A paired (correlated) t-test is used when:",
      optionA: "Two different independent groups are compared",
      optionB: "One group is compared to a normative mean",
      optionC: "One group is measured at two different time points",
      optionD: "Three or more groups are compared",
      correctAnswer: "C",
      explanation: "The paired t-test (correlated samples t-test) measures the same group at two time points — each participant serves as their own control.",
      examOnly: true,
    },
    {
      question: "What is the primary purpose of post-hoc comparisons after a significant ANOVA F-test?",
      optionA: "To determine effect sizes",
      optionB: "To identify WHICH specific groups are different",
      optionC: "To check for normality",
      optionD: "To calculate degrees of freedom",
      correctAnswer: "B",
      explanation: "The F-test tells us that SOME group difference exists. Post-hoc tests (Tukey, Bonferroni, Sidak) identify the specific group pairs that differ while controlling for Type I error.",
      examOnly: true,
    },
    {
      question: "A 2-factor ANOVA examines:",
      optionA: "Two DVs with one IV",
      optionB: "Two IVs and their main effects plus interaction",
      optionC: "Two groups on one IV",
      optionD: "Two time points with one group",
      correctAnswer: "B",
      explanation: "A 2-factor (factorial) ANOVA has 2 IVs and examines both main effects (each IV independently) plus the interaction effect between them.",
      examOnly: true,
    },
    {
      question: "In ANOVA, between-groups variation represents the:",
      optionA: "Error / denominator",
      optionB: "Random chance variation",
      optionC: "Signal / numerator — the pattern we want to detect",
      optionD: "Variation of individual scores around their group mean",
      correctAnswer: "C",
      explanation: "Between-groups variation is the numerator of the F-ratio, representing the signal (differences among group means) that we want to be large relative to error.",
      examOnly: true,
    },
    {
      question: "Why is MANOVA used instead of multiple ANOVAs?",
      optionA: "It has fewer assumptions",
      optionB: "It handles ordinal data better",
      optionC: "It avoids inflating Type I error across multiple DVs",
      optionD: "It requires less statistical power",
      correctAnswer: "C",
      explanation: "Running multiple ANOVAs inflates the experimentwise Type I error rate. MANOVA simultaneously analyzes multiple DVs and controls that error inflation.",
      examOnly: true,
    },
    {
      question: "A strong correlation on a scatterplot is indicated by:",
      optionA: "A wide, fan-shaped spread of points",
      optionB: "Points clustered closely around the best-fit line",
      optionC: "Points forming a curved pattern",
      optionD: "Equally distributed points across all quadrants",
      correctAnswer: "B",
      explanation: "Strong correlations show homoscedasticity — a rectangular shape with values close to the best-fit line. Wide fans indicate heteroscedasticity and weak correlation.",
      examOnly: true,
    },
    {
      question: "Which correlation type is used when BOTH variables are artificially dichotomous?",
      optionA: "Phi",
      optionB: "Point biserial",
      optionC: "Tetrachoric",
      optionD: "Biserial",
      correctAnswer: "C",
      explanation: "Tetrachoric correlation is used when both the IV and DV are artificial dichotomies (e.g., positive/negative school climate for each variable).",
      examOnly: true,
    },
    {
      question: "In regression, what does the standardized beta coefficient represent?",
      optionA: "The y-intercept",
      optionB: "The unstandardized slope",
      optionC: "The effect size for predictor relationships",
      optionD: "The error term",
      correctAnswer: "C",
      explanation: "The standardized beta is the effect size for the relationship between a predictor and the outcome — it IS the effect size, just standardized on a −1 to +1 scale.",
      examOnly: true,
    },
    {
      question: "Multicollinearity in regression occurs when:",
      optionA: "The DV has multiple categories",
      optionB: "Predictor variables are highly correlated with each other",
      optionC: "Sample size is too small",
      optionD: "The regression residuals are non-normal",
      correctAnswer: "B",
      explanation: "Multicollinearity is a problem in regression when predictor (IV) variables are highly correlated with each other, making it difficult to isolate each IV's unique contribution.",
      examOnly: true,
    },
    {
      question: "In hierarchical regression, the THIRD block typically contains:",
      optionA: "Known demographic covariates",
      optionB: "Established important predictors",
      optionC: "The predictors of primary interest to the researcher",
      optionD: "All variables simultaneously",
      correctAnswer: "C",
      explanation: "Hierarchical regression organizes predictors by theory: Block 1 = known demographics, Block 2 = established predictors, Block 3 = the researcher's new predictors of interest.",
      examOnly: true,
    },
    {
      question: "Chi-square is used to compare:",
      optionA: "Means of three or more continuous groups",
      optionB: "Observed vs. expected proportions/frequencies across categorical groups",
      optionC: "Correlations between two interval variables",
      optionD: "A sample mean against a population mean",
      correctAnswer: "B",
      explanation: "Chi-square is a nonparametric test for comparing observed frequencies against expected proportions across categorical groups — it has no distributional assumptions.",
      examOnly: true,
    },
    {
      question: "What is Cramer's V used for?",
      optionA: "Effect size for 2×2 chi-square tables only",
      optionB: "Effect size for chi-square tables larger than 2×2",
      optionC: "Testing homogeneity of variance",
      optionD: "Adjusting t-test results for unequal variances",
      correctAnswer: "B",
      explanation: "Cramer's V is the effect size measure for chi-square tables with more than 2 categories per variable. Phi coefficient is used for 2×2 tables.",
      examOnly: true,
    },
    {
      question: "Sensitivity in diagnostic testing refers to:",
      optionA: "Correctly identifying those who do NOT have the condition",
      optionB: "The probability of a false positive",
      optionC: "Correctly identifying those who DO have the condition (true positive rate)",
      optionD: "The correlation between test scores and diagnosis",
      correctAnswer: "C",
      explanation: "Sensitivity = true positive rate — how well a test correctly identifies people who have the condition. High sensitivity means few false negatives.",
      examOnly: true,
    },
    {
      question: "Specificity in diagnostic testing refers to:",
      optionA: "True positive rate",
      optionB: "Correctly identifying those who do NOT have the condition (true negative rate)",
      optionC: "The probability of a Type I error",
      optionD: "The percentage of correct diagnoses overall",
      correctAnswer: "B",
      explanation: "Specificity = true negative rate — how well a test correctly identifies people who do NOT have the condition. High specificity means few false positives.",
      examOnly: true,
    },
    {
      question: "A researcher uses Levene's test and finds p = .02. What does this mean?",
      optionA: "The groups have equal variance — proceed normally",
      optionB: "The groups do NOT have equal variance — the t-test result must be adjusted",
      optionC: "The means are significantly different",
      optionD: "The sample is large enough to proceed",
      correctAnswer: "B",
      explanation: "A significant Levene's test (p < .05) indicates heterogeneity of variance — the groups differ in spread, so standard t-test results cannot be trusted without adjustment.",
      examOnly: true,
    },
    {
      question: "Which property of chi-square is always true?",
      optionA: "It can be negative",
      optionB: "It ranges from −1 to +1",
      optionC: "It is always positive; if χ² = 0, expected = observed",
      optionD: "It follows a normal distribution",
      correctAnswer: "C",
      explanation: "Chi-square (χ²) is always positive because it is based on squared differences. A χ² of 0 means the observed data perfectly match expected proportions.",
      examOnly: true,
    },
    {
      question: "What is an omnibus test?",
      optionA: "A test that identifies exactly where group differences lie",
      optionB: "A test of multiple DVs simultaneously",
      optionC: "A general test that indicates significance exists but not where",
      optionD: "A nonparametric alternative to t-tests",
      correctAnswer: "C",
      explanation: "An omnibus test (like ANOVA's F-test or chi-square) indicates that SOMETHING is significant overall but does not specify which groups or categories differ.",
      examOnly: true,
    },
    {
      question: "Which of the following INCREASES statistical power?",
      optionA: "Decreasing sample size",
      optionB: "Lowering the alpha from .10 to .05",
      optionC: "Increasing sample size",
      optionD: "Using a one-tailed test instead of two-tailed",
      correctAnswer: "C",
      explanation: "The most direct way to increase power is to increase sample size. More observations = more ability to detect a true effect.",
      examOnly: true,
    },
    {
      question: "The formula Y' = a + bX₁ + bX₂ + e represents:",
      optionA: "ANOVA",
      optionB: "Multiple regression",
      optionC: "Chi-square",
      optionD: "Factor analysis",
      correctAnswer: "B",
      explanation: "This is the multiple regression equation: Y' = predicted outcome, a = y-intercept, b = slope for each predictor, e = error term.",
      examOnly: true,
    },
    {
      question: "Kappa chi-square is designed to:",
      optionA: "Test correlation between two continuous variables",
      optionB: "Adjust hit rates for correct outcomes due to chance",
      optionC: "Compare means across three groups",
      optionD: "Test for multicollinearity",
      correctAnswer: "B",
      explanation: "Kappa chi-square adjusts observed hit rates by removing the proportion expected by chance alone — often used in diagnostic accuracy and inter-rater agreement.",
      examOnly: true,
    },
    {
      question: "What is the point biserial correlation used for?",
      optionA: "Two continuously measured variables",
      optionB: "An artificial dichotomy IV and continuous DV",
      optionC: "A true dichotomy IV (e.g., male vs. female) and continuous DV",
      optionD: "Both variables being ordinal",
      correctAnswer: "C",
      explanation: "Point biserial correlation is used when the IV is a TRUE dichotomy (e.g., biological sex) and the DV is continuous. It is mathematically equivalent to Pearson r.",
      examOnly: true,
    },
    {
      question: "The standard deviation is the square root of variance because:",
      optionA: "It converts the scale back to normal curve percentages",
      optionB: "It makes units equidistant regardless of area size",
      optionC: "It removes the influence of outliers",
      optionD: "It standardizes scores to a mean of 0",
      correctAnswer: "B",
      explanation: "Taking the square root of variance makes the unit of measurement equidistant — each SD unit represents the same distance from the mean regardless of the distribution's total spread.",
      examOnly: true,
    },
    {
      question: "A distribution where SD is greater than the mean indicates:",
      optionA: "High reliability",
      optionB: "A perfectly normal distribution",
      optionC: "A problematic, likely non-normal distribution",
      optionD: "A large effect size",
      correctAnswer: "C",
      explanation: "A basic diagnostic rule: the SD should never exceed the mean. When it does, it signals a skewed or otherwise non-normal distribution that may invalidate parametric analyses.",
      examOnly: true,
    },
    {
      question: "In a regression, the 'b' coefficient (unstandardized slope) is interpreted as:",
      optionA: "The y-intercept when all IVs = 0",
      optionB: "The change in Y for a one-unit change in X, in the original metric of X",
      optionC: "The shared variance between X and Y",
      optionD: "The correlation between X and Y",
      correctAnswer: "B",
      explanation: "The unstandardized slope (b) tells you how many units Y changes per one-unit change in X, on the original scale of measurement.",
      examOnly: true,
    },
    {
      question: "Which measure of effect size is used for nonparametric chi-square when the table is 2×2?",
      optionA: "Cohen's d",
      optionB: "Hedges' g",
      optionC: "Cramer's V",
      optionD: "Phi coefficient",
      correctAnswer: "D",
      explanation: "The Phi coefficient is the effect size measure for a 2×2 chi-square table. Cramer's V is used for larger tables.",
      examOnly: true,
    },
  ];

  const allQuestions = [...regularQuestions, ...examOnlyQuestions].map((q) => ({
    ...q,
    topicId,
  }));

  const insertedQs = await db.insert(quizQuestionsTable).values(allQuestions).returning();
  console.log(
    `✓ Inserted ${insertedQs.length} quiz questions (${regularQuestions.length} regular + ${examOnlyQuestions.length} exam-only)`
  );

  // ============================================================
  // STUDY GUIDE
  // ============================================================
  const studyGuideContent = `# Foundations in Statistics — Study Guide

## 1. What Is Statistics?

**Statistics** = the study of variation. The core question: *What makes A different from B?*

Numbers and data represent variation, determined through observation.

The structure of all statistical reasoning:
- **Comparison**: always a ratio — **Pattern vs. Error (random chance)**
- We want to find patterns and distinguish them from random chance
- Three types of comparisons: correlations (relationships), group comparisons (one group higher/lower), and significance tests

---

## 2. Key Terms

| Term | Definition |
|---|---|
| **Population** | Everyone — the "truth" that is unknown |
| **Sample** | A "biopsy" of the population — our best guess |
| **Population Parameter** | The true characteristic to be discovered (mean, SD, frequency) |
| **Inferential Statistics** | Using samples to estimate population parameters |

**Challenge:** What sample is representative of the entire population?

---

## 3. Variable Types

### Step 1: Identify Your Variables
- **Independent (IV):** Manipulated — the cause
- **Dependent (DV):** Outcome — the effect
- Variable type determines the correct statistical analysis

### Step 2: Classify by Type

| Type | Properties | Example |
|---|---|---|
| **Nominal/Categorical** | No levels, no order | Gender, ethnicity |
| **Ordinal/Rank** | Ordered, unequal intervals, no true 0 | Class rank |
| **Interval** | Equal intervals, NO true 0 | Likert scale |
| **Ratio** | Equal intervals, TRUE 0 | Height, weight |

**Memory tip:** NOIR (Nominal → Ordinal → Interval → Ratio) — precision increases along this scale.

---

## 4. Distributions

### Normal Distribution
- Represents random chance
- Sets the baseline for significance testing
- Used with continuous variables (ordinal, interval, ratio)
- X-axis = nominal variable; Y-axis = frequency

### Skewed Distributions

| Type | Tail Direction | Order of Central Tendency |
|---|---|---|
| **Positive skew** | Right | Mode – Median – **Mean** |
| **Negative skew** | Left | **Mean** – Median – Mode |

**Rule:** SD should never be greater than the mean. Skewness > 5.0 = problematic.

---

## 5. Central Tendency

| Measure | Definition | Influenced by Outliers? |
|---|---|---|
| **Mean** | Sum ÷ N | YES — pulled toward outlier |
| **Median** | Middle value | No |
| **Mode** | Most frequent value | No |

Use median when extreme scores exist. Mean is best for normal distributions.

---

## 6. Variability

**Variability** = spread of scores; distance from the mean.

| Concept | Formula/Description |
|---|---|
| **Deviation score** | Each score minus the mean; always sum to 0 |
| **Variance** | Mean sum of squares (SS) |
| **Standard deviation** | √Variance — average distance from mean |

### Bell Curve Percentages
- ±1 SD = **34%** on each side (68% total)
- ±2 SD = **14%** on each side (95% total)
- ±3 SD = **2%** on each side (99.7% total)

**Homogeneity** = low variability | **Heterogeneity** = high variability

---

## 7. Standard Scores

| Score | Formula | Basis | Mean | SD |
|---|---|---|---|---|
| **z-score** | (x − μ) / σ | Population | 0 | 1 |
| **T-score** | (x − μ) / (σ/√n) | Sample | 50 | 10 |
| **Percentile** | Rank position | — | 50th | — |

z-scores allow comparison across different measurement systems.

---

## 8. Sampling and Standard Error

| Concept | Definition |
|---|---|
| **Sampling distribution** | Distribution of sample means |
| **Standard error of the mean** | Discrepancy between sample mean and population mean |
| **SEM** | SD × √(1 − rxx); used for confidence intervals |
| **Standard error of the estimate** | Error in regression predictions |

**Central Limit Theorem:** With random sampling, the distribution of sample means approaches normal as N increases, and sample mean approaches population mean.

---

## 9. Hypothesis Testing

| Hypothesis | Statement |
|---|---|
| **Null (Ho)** | No significant difference — results are due to chance |
| **Alternative (Ha)** | Significant difference exists |

### Error Types

| Error | Type | Cause | Fix |
|---|---|---|---|
| **Type I** | False positive | Too many tests (experimenter-wise error) | Replication |
| **Type II** | False negative | Sample too small (underpowered) | Replication |

**Confidence intervals:** CI includes 0 → not significant. CI excludes 0 → significant.

---

## 10. Effect Sizes and Power

| Concept | Description |
|---|---|
| **Effect size** | Magnitude of difference in SD units |
| **Small** | .2 |
| **Medium** | .5 |
| **Large** | .8 |
| **Cohen's d** | Population-based group effect |
| **Hedges' g** | Adjusted for sample size |
| **Power** | Probability of detecting a true effect (target: .80) |

**Effect size is NOT influenced by sample size.**

To increase power: increase N | increase alpha | increase effect size

---

## 11. Inferential Statistics

### T-tests

| Type | Use | df |
|---|---|---|
| Single-sample | 1 group vs. normative mean | n − 1 |
| Independent | 2 separate groups | n − 2 |
| Paired/correlated | 1 group, 2 time points | n − 1 |

**Levene's test:** If significant → unequal variances → adjust t-test.

### ANOVA (3+ groups, continuous DV)

- F-ratio = Between-groups (signal) ÷ Within-groups (error)
- Want between > within for significance
- F = 1.96 threshold when N ≥ 30, α = .05
- **Post-hoc tests** (Tukey, Bonferroni, Sidak): identify specific group differences

| Variant | Extra Feature |
|---|---|
| Factorial ANOVA | Multiple IVs + interaction effects |
| ANCOVA | Adds covariates to statistically control extraneous variables |
| MANOVA | Multiple DVs — avoids Type I error inflation |

---

## 12. Correlations

- Both variables continuous (ordinal, interval, ratio)
- r ranges from −1 to +1
- **r² (coefficient of determination)** = shared variance
- r = .44 → r² = .19 → 19% shared variance; .20 considered good

### Correlation Types

| Type | Data | Parametric? |
|---|---|---|
| Pearson | Interval/Ratio | Yes |
| Spearman | Ordinal | No |
| Tetrachoric | Both artificially dichotomous | — |
| Phi | Both truly dichotomous | — |
| Biserial | IV artificially dichotomous, DV continuous | — |
| Point Biserial | IV truly dichotomous, DV continuous | — |

**Homoscedasticity** (rectangular scatter) = strong correlation  
**Heteroscedasticity** (fanning out) = weak correlation

---

## 13. Regression

**Equation:** Y' = a + bX₁ + bX₂ + … + e

| Term | Meaning |
|---|---|
| Y' | Predicted outcome |
| a | y-intercept |
| b | Slope (unstandardized: original metric; standardized: −1 to +1) |
| e | Error term |

**Hierarchical regression blocks:**  
1 → Demographics | 2 → Known predictors | 3 → New predictors of interest

**Stepwise:** Forward (add one at a time) or Backward (remove based on p-value)

**Key issue:** Multicollinearity — predictor variables that are highly correlated with each other.

---

## 14. Chi-Square (Nonparametric)

- Tests observed vs. expected proportions across categorical groups
- **No distributional assumptions**
- χ² is always positive; χ² = 0 means expected = observed
- Larger χ² → higher likelihood of significance

### Effect Sizes for Chi-Square
- 2×2 table → **Phi coefficient**
- Larger tables → **Cramer's V**

### Sensitivity vs. Specificity

| Concept | Meaning | Error Opposite |
|---|---|---|
| Sensitivity | True positive rate | Opposite of Type I |
| Specificity | True negative rate | Opposite of Type II |`;

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

  const allQsFromDb = await db
    .select({ id: quizQuestionsTable.id })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.topicId, topicId));

  const examQRows = allQsFromDb.map((q, i) => ({
    examId: practiceExam.id,
    questionId: q.id,
    questionOrder: i + 1,
  }));

  await db.insert(practiceExamQuestionsTable).values(examQRows);
  console.log(`✓ Linked ${examQRows.length} questions to practice exam`);

  console.log(`\n✅ Foundations in Statistics (topic ${topicId}) fully seeded!`);
}

addFoundationsStatsTopic()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
