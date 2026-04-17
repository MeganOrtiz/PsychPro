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

async function addQualitativeTopic() {
  console.log("Seeding Qualitative Research Designs topic...");

  const [topic] = await db
    .insert(topicsTable)
    .values({
      name: "Qualitative Research Designs",
      category: "Research & Statistics",
      description:
        "Core qualitative research designs including phenomenology, grounded theory, ethnography, case study, and narrative research. Covers methodology, data collection, analysis, and rigor.",
    })
    .returning();

  const topicId = topic.id;
  console.log(`✓ Created topic id=${topicId}`);

  // ============================================================
  // FLASHCARDS (56)
  // ============================================================
  const flashcards = [
    // Overview
    {
      question: "What is the core focus of qualitative research?",
      answer: "Understanding meaning, experience, and context rather than measuring variables. It explores subjective experiences, social processes, cultural meanings, and lived realities.",
      difficulty: "easy",
    },
    {
      question: "How does qualitative research differ from quantitative research?",
      answer: "Qualitative explores 'how' and 'why' through meaning and experience (words, themes, narratives). Quantitative measures 'how much' through numbers, variables, and statistical analysis.",
      difficulty: "easy",
    },
    {
      question: "What are the five major qualitative research designs?",
      answer: "1) Phenomenology, 2) Grounded Theory, 3) Ethnography, 4) Case Study, 5) Narrative Research.",
      difficulty: "easy",
    },
    {
      question: "What is the general purpose of qualitative research?",
      answer: "To understand meaning, lived experience, and context — exploring subjective and social phenomena that cannot be captured by numbers alone.",
      difficulty: "easy",
    },
    // Phenomenology
    {
      question: "What is the purpose of phenomenological research?",
      answer: "To understand lived experiences and the essence of a phenomenon — capturing what it is truly like to experience something.",
      difficulty: "easy",
    },
    {
      question: "What is the key research question in phenomenology?",
      answer: "What is it like to experience this? (Focuses on the subjective, first-person experience of a phenomenon.)",
      difficulty: "easy",
    },
    {
      question: "What is the focus of phenomenological research?",
      answer: "Subjective experience and meaning-making — how individuals perceive and give meaning to a particular experience.",
      difficulty: "easy",
    },
    {
      question: "What methods are used in phenomenological research?",
      answer: "In-depth interviews, narratives, and journaling — methods that allow participants to describe experiences in their own words.",
      difficulty: "easy",
    },
    {
      question: "How is data analyzed in phenomenology?",
      answer: "By identifying themes and describing the essence of the experience — extracting the core meaning shared across participants.",
      difficulty: "medium",
    },
    {
      question: "What are the strengths and limitations of phenomenology?",
      answer: "Strengths: Deep insight into experiences. Limitations: Subjective and relies on small samples, limiting generalizability.",
      difficulty: "medium",
    },
    {
      question: "What is phenomenological reduction (epoché)?",
      answer: "The process of bracketing (setting aside) the researcher's own assumptions and prior knowledge to focus purely on participants' descriptions of experience.",
      difficulty: "hard",
    },
    // Grounded Theory
    {
      question: "What is the purpose of grounded theory?",
      answer: "To develop a new theory grounded in data — building theory inductively from the ground up rather than testing existing theory.",
      difficulty: "easy",
    },
    {
      question: "What is the key research question in grounded theory?",
      answer: "What process explains what is happening? (Focus is on social processes and behaviors.)",
      difficulty: "easy",
    },
    {
      question: "What methods are used in grounded theory?",
      answer: "Iterative interviews and theoretical sampling — data collection continues until theoretical saturation is reached (no new themes emerge).",
      difficulty: "medium",
    },
    {
      question: "What are the three stages of coding in grounded theory?",
      answer: "1) Open coding: initial labeling of concepts, 2) Axial coding: connecting categories, 3) Selective coding: building the core theoretical model.",
      difficulty: "hard",
    },
    {
      question: "What is the outcome of grounded theory research?",
      answer: "A theoretical model — a new theory that explains a social process or behavior, derived entirely from the data collected.",
      difficulty: "medium",
    },
    {
      question: "What is theoretical saturation in grounded theory?",
      answer: "The point at which no new information or themes are emerging from additional data collection, signaling that sampling can stop.",
      difficulty: "hard",
    },
    {
      question: "What are the strengths and limitations of grounded theory?",
      answer: "Strengths: Generates theory directly from real-world data. Limitations: Very time-intensive due to iterative data collection and analysis.",
      difficulty: "medium",
    },
    {
      question: "What is theoretical sampling in grounded theory?",
      answer: "Selecting participants based on emerging theory — as initial data analysis reveals concepts, new participants are chosen to develop and refine those concepts.",
      difficulty: "hard",
    },
    // Ethnography
    {
      question: "What is the purpose of ethnographic research?",
      answer: "To study cultures and groups in their natural settings — understanding the shared patterns of life within a community or group.",
      difficulty: "easy",
    },
    {
      question: "What is the key research question in ethnography?",
      answer: "What are the shared patterns of this group? (Focus on culture and social norms.)",
      difficulty: "easy",
    },
    {
      question: "What methods are used in ethnographic research?",
      answer: "Observation, field notes, and interviews — conducted in the natural setting of the group being studied.",
      difficulty: "easy",
    },
    {
      question: "How is data analyzed in ethnography?",
      answer: "By identifying cultural themes — recurring patterns of behavior, belief, and meaning that characterize the group.",
      difficulty: "medium",
    },
    {
      question: "What are the strengths and limitations of ethnography?",
      answer: "Strengths: High ecological validity — studies behavior in natural context. Limitations: Time-consuming and carries a risk of researcher bias/subjectivity.",
      difficulty: "medium",
    },
    {
      question: "What is participant observation in ethnography?",
      answer: "A method where the researcher immerses themselves in the group's activities to observe and record behavior from within, gaining insider perspective.",
      difficulty: "medium",
    },
    {
      question: "What is ecological validity?",
      answer: "The degree to which research findings reflect real-world conditions and behaviors. Ethnography has high ecological validity because it studies people in their natural environment.",
      difficulty: "medium",
    },
    // Case Study
    {
      question: "What is the purpose of case study research?",
      answer: "To conduct an in-depth analysis of a single case or bounded system — understanding it holistically within its real-world context.",
      difficulty: "easy",
    },
    {
      question: "What is the key research question in case study research?",
      answer: "How and why does this case function? (Focus on detailed contextual understanding.)",
      difficulty: "easy",
    },
    {
      question: "What methods are used in case study research?",
      answer: "Multiple data sources — interviews, documents, observations, and artifacts are triangulated to build a comprehensive picture of the case.",
      difficulty: "medium",
    },
    {
      question: "How is data analyzed in case study research?",
      answer: "Through pattern matching and synthesis — comparing patterns found in the data against predicted patterns, and synthesizing multiple sources.",
      difficulty: "medium",
    },
    {
      question: "What are the strengths and limitations of case study research?",
      answer: "Strengths: Provides a holistic, in-depth view of a complex phenomenon. Limitations: Limited generalizability — findings may not apply beyond the specific case.",
      difficulty: "medium",
    },
    {
      question: "What is triangulation in case study research?",
      answer: "Using multiple data sources (interviews, documents, observations) to cross-check and verify findings, increasing trustworthiness.",
      difficulty: "medium",
    },
    {
      question: "What is a 'bounded system' in case study research?",
      answer: "The defined unit of analysis — a specific person, organization, program, or event that is studied within its particular context and boundaries.",
      difficulty: "hard",
    },
    // Narrative Research
    {
      question: "What is the purpose of narrative research?",
      answer: "To explore how individuals construct life stories and make meaning through their personal narratives and identity.",
      difficulty: "easy",
    },
    {
      question: "What is the key research question in narrative research?",
      answer: "How do people make meaning through stories? (Focus on personal narratives and identity formation.)",
      difficulty: "easy",
    },
    {
      question: "What methods are used in narrative research?",
      answer: "Interviews and life histories — extended conversations where participants recount their experiences in story form.",
      difficulty: "easy",
    },
    {
      question: "How is data analyzed in narrative research?",
      answer: "Through chronological and thematic interpretation — organizing the story across time and identifying recurring themes within it.",
      difficulty: "medium",
    },
    {
      question: "What are the strengths and limitations of narrative research?",
      answer: "Strengths: Rich personal insight into individual experience and identity. Limitations: Highly subjective and dependent on memory, which can be unreliable.",
      difficulty: "medium",
    },
    // Rigor & Trustworthiness
    {
      question: "What is the qualitative equivalent of internal validity?",
      answer: "Credibility — the degree to which the findings accurately represent participants' perspectives and experiences.",
      difficulty: "hard",
    },
    {
      question: "What is the qualitative equivalent of external validity/generalizability?",
      answer: "Transferability — the degree to which findings can be applied to other contexts or populations.",
      difficulty: "hard",
    },
    {
      question: "What is the qualitative equivalent of reliability?",
      answer: "Dependability — the consistency of findings over time; whether the study could be replicated with similar results.",
      difficulty: "hard",
    },
    {
      question: "What is confirmability in qualitative research?",
      answer: "The qualitative equivalent of objectivity — ensuring findings reflect participants' perspectives rather than researcher bias. Established through an audit trail.",
      difficulty: "hard",
    },
    {
      question: "What is member checking?",
      answer: "A credibility strategy where researchers return findings to participants for verification — checking that interpretations accurately reflect participants' intended meaning.",
      difficulty: "medium",
    },
    {
      question: "What is reflexivity in qualitative research?",
      answer: "The researcher's ongoing self-awareness and examination of how their background, assumptions, and position may influence the research process and findings.",
      difficulty: "hard",
    },
    // Sampling & Data Collection
    {
      question: "What is purposive sampling in qualitative research?",
      answer: "Selecting participants specifically because they have direct knowledge or experience of the phenomenon being studied — not randomly chosen.",
      difficulty: "medium",
    },
    {
      question: "What is snowball sampling?",
      answer: "A recruitment method where current participants refer others with similar experiences — useful for accessing hard-to-reach populations.",
      difficulty: "medium",
    },
    {
      question: "Why are qualitative sample sizes small compared to quantitative studies?",
      answer: "Because depth of understanding matters more than statistical representation. Sampling continues until saturation — when no new themes emerge.",
      difficulty: "easy",
    },
    {
      question: "What is data saturation?",
      answer: "The point at which no new information, themes, or insights are emerging from additional data collection — signaling that sampling is complete.",
      difficulty: "medium",
    },
    {
      question: "What is the primary data collection tool in qualitative research?",
      answer: "The researcher themselves — acting as the primary instrument of data collection through observation, interviews, and interpretation.",
      difficulty: "medium",
    },
    // Analysis
    {
      question: "What is thematic analysis?",
      answer: "A qualitative data analysis method that identifies, analyzes, and reports patterns (themes) within data, applicable across multiple qualitative designs.",
      difficulty: "medium",
    },
    {
      question: "What is coding in qualitative research?",
      answer: "The process of labeling meaningful segments of data with descriptive tags — the foundation of qualitative data analysis.",
      difficulty: "easy",
    },
    {
      question: "What is a thick description in qualitative research?",
      answer: "A detailed, rich account of context and meaning that allows readers to judge whether findings might transfer to their own setting (supports transferability).",
      difficulty: "hard",
    },
    // Comparisons
    {
      question: "Summary: What is each qualitative design best summarized as?",
      answer: "Phenomenology = Experience | Grounded Theory = Process → Theory | Ethnography = Culture | Case Study = In-depth Context | Narrative Research = Life Story",
      difficulty: "easy",
    },
    {
      question: "Which qualitative design produces a new theoretical model?",
      answer: "Grounded Theory — it builds theory inductively from iterative data collection and coding.",
      difficulty: "easy",
    },
    {
      question: "Which qualitative design has the highest ecological validity?",
      answer: "Ethnography — it studies people in their natural environment, producing findings most reflective of real-world behavior.",
      difficulty: "medium",
    },
    {
      question: "Which qualitative design is most appropriate for exploring an individual's life story?",
      answer: "Narrative Research — it focuses on personal narratives, identity, and how individuals construct meaning through their life stories.",
      difficulty: "easy",
    },
  ];

  const insertedFlashcards = await db
    .insert(flashcardsTable)
    .values(flashcards.map((f) => ({ ...f, topicId })))
    .returning();
  console.log(`✓ Inserted ${insertedFlashcards.length} flashcards`);

  // ============================================================
  // REGULAR QUIZ QUESTIONS (10)
  // ============================================================
  const regularQuestions = [
    {
      question: "What is the key research question in phenomenology?",
      optionA: "What process explains what is happening?",
      optionB: "What are the shared patterns of this group?",
      optionC: "What is it like to experience this?",
      optionD: "How and why does this case function?",
      correctAnswer: "C",
      explanation: "Phenomenology asks 'What is it like to experience this?' — it focuses on understanding the lived, subjective experience of a phenomenon.",
      examOnly: false,
    },
    {
      question: "Which qualitative design produces a theoretical model as its outcome?",
      optionA: "Phenomenology",
      optionB: "Ethnography",
      optionC: "Narrative Research",
      optionD: "Grounded Theory",
      correctAnswer: "D",
      explanation: "Grounded Theory is designed to develop theory grounded in data through iterative interviews and coding. Its defining outcome is a new theoretical model.",
      examOnly: false,
    },
    {
      question: "What is the primary focus of ethnographic research?",
      optionA: "Individual lived experience",
      optionB: "Life histories and personal narratives",
      optionC: "Culture and shared patterns within a group",
      optionD: "In-depth analysis of a single bounded system",
      correctAnswer: "C",
      explanation: "Ethnography focuses on understanding the shared cultural patterns, norms, and practices of a specific group in their natural setting.",
      examOnly: false,
    },
    {
      question: "Which qualitative design is MOST limited in generalizability?",
      optionA: "Grounded Theory",
      optionB: "Ethnography",
      optionC: "Case Study",
      optionD: "Phenomenology",
      correctAnswer: "C",
      explanation: "Case studies focus on a single case or bounded system, which inherently limits the ability to generalize findings to other contexts or populations.",
      examOnly: false,
    },
    {
      question: "In qualitative research, 'credibility' is the equivalent of which quantitative concept?",
      optionA: "External validity",
      optionB: "Internal validity",
      optionC: "Reliability",
      optionD: "Objectivity",
      correctAnswer: "B",
      explanation: "Credibility in qualitative research corresponds to internal validity in quantitative research — both address whether findings accurately represent reality.",
      examOnly: false,
    },
    {
      question: "What are the three stages of coding in Grounded Theory?",
      optionA: "Descriptive, analytical, interpretive",
      optionB: "Inductive, deductive, abductive",
      optionC: "Open, axial, and selective coding",
      optionD: "Thematic, narrative, and pattern coding",
      correctAnswer: "C",
      explanation: "Grounded Theory uses open coding (initial labeling), axial coding (connecting categories), and selective coding (building the core theoretical model).",
      examOnly: false,
    },
    {
      question: "Which sampling strategy is most common in qualitative research?",
      optionA: "Random sampling",
      optionB: "Stratified sampling",
      optionC: "Purposive sampling",
      optionD: "Quota sampling",
      correctAnswer: "C",
      explanation: "Purposive sampling selects participants specifically because they have knowledge or experience of the phenomenon — depth and relevance matter more than random representation.",
      examOnly: false,
    },
    {
      question: "What is member checking used for?",
      optionA: "Ensuring a large enough sample size",
      optionB: "Verifying that research interpretations accurately reflect participants' perspectives",
      optionC: "Testing statistical significance",
      optionD: "Removing researcher bias through blinding",
      correctAnswer: "B",
      explanation: "Member checking is a credibility strategy where researchers return findings to participants for verification that the interpretations correctly reflect their intended meaning.",
      examOnly: false,
    },
    {
      question: "Data collection in qualitative research stops when:",
      optionA: "The researcher has interviewed at least 30 participants",
      optionB: "Statistical significance is achieved",
      optionC: "Data saturation is reached — no new themes are emerging",
      optionD: "The study protocol time limit is reached",
      correctAnswer: "C",
      explanation: "Qualitative sampling continues until data saturation — the point at which additional data collection yields no new information, themes, or insights.",
      examOnly: false,
    },
    {
      question: "Which qualitative design uses multiple data sources (interviews, documents, observations) to study one case?",
      optionA: "Phenomenology",
      optionB: "Grounded Theory",
      optionC: "Narrative Research",
      optionD: "Case Study",
      correctAnswer: "D",
      explanation: "Case study research relies on triangulating multiple data sources to build a comprehensive, holistic understanding of a single bounded system.",
      examOnly: false,
    },
  ];

  // ============================================================
  // EXAM-ONLY QUESTIONS (40)
  // ============================================================
  const examOnlyQuestions = [
    {
      question: "Phenomenological research primarily uses which data collection method?",
      optionA: "Standardized questionnaires",
      optionB: "In-depth interviews, narratives, and journaling",
      optionC: "Structured observation in lab settings",
      optionD: "Randomized controlled experiments",
      correctAnswer: "B",
      explanation: "Phenomenology relies on in-depth interviews, narratives, and journaling to allow participants to describe their experiences in their own words.",
      examOnly: true,
    },
    {
      question: "What is bracketing (epoché) in phenomenological research?",
      optionA: "Selecting participants through random sampling",
      optionB: "The final stage of thematic analysis",
      optionC: "Setting aside the researcher's assumptions to focus purely on participants' experiences",
      optionD: "Identifying negative cases to disconfirm findings",
      correctAnswer: "C",
      explanation: "Epoché/bracketing is the phenomenological practice of suspending the researcher's prior assumptions and knowledge to remain open to participants' descriptions.",
      examOnly: true,
    },
    {
      question: "Grounded Theory differs from other qualitative designs primarily because it:",
      optionA: "Studies single cases in depth",
      optionB: "Focuses on cultural patterns within groups",
      optionC: "Generates a new theoretical model from the data",
      optionD: "Uses standardized interview protocols",
      correctAnswer: "C",
      explanation: "The defining feature of Grounded Theory is that its goal is to produce a new theory built inductively from collected data — not to describe experience or culture.",
      examOnly: true,
    },
    {
      question: "In Grounded Theory, theoretical sampling means:",
      optionA: "Randomly selecting participants from the target population",
      optionB: "Selecting participants based on their relevance to emerging theoretical concepts",
      optionC: "Using stratified sampling to match population demographics",
      optionD: "Sampling until n > 30 is reached",
      correctAnswer: "B",
      explanation: "Theoretical sampling directs data collection based on what is emerging from the analysis — new participants are chosen to develop, refine, or confirm theoretical categories.",
      examOnly: true,
    },
    {
      question: "Which grounded theory coding stage connects categories to subcategories?",
      optionA: "Open coding",
      optionB: "Selective coding",
      optionC: "Axial coding",
      optionD: "Interpretive coding",
      correctAnswer: "C",
      explanation: "Axial coding is the second stage — it examines relationships between categories, connecting them to subcategories to build a more organized framework.",
      examOnly: true,
    },
    {
      question: "Ethnography is best suited for studying:",
      optionA: "Individual cognitive processes",
      optionB: "Statistical differences between groups",
      optionC: "Shared cultural practices and norms within a group",
      optionD: "A single unusual event or case",
      correctAnswer: "C",
      explanation: "Ethnography's core focus is culture — the shared values, practices, norms, and meanings of a group, observed in their natural setting.",
      examOnly: true,
    },
    {
      question: "What is participant observation?",
      optionA: "Asking participants to observe each other",
      optionB: "The researcher immersing themselves in the group to observe from within",
      optionC: "Blind observation using hidden cameras",
      optionD: "Observing participants through a one-way mirror",
      correctAnswer: "B",
      explanation: "Participant observation involves the researcher actively participating in the group's activities while simultaneously observing and recording data from an insider position.",
      examOnly: true,
    },
    {
      question: "What is the main risk in ethnographic research?",
      optionA: "Using too large a sample",
      optionB: "Over-reliance on standardized tests",
      optionC: "Researcher bias from immersion in the group",
      optionD: "Failure to achieve statistical significance",
      correctAnswer: "C",
      explanation: "Ethnography's main limitation is bias risk — extended immersion in a group can lead the researcher to 'go native' and lose objectivity.",
      examOnly: true,
    },
    {
      question: "A case study examines:",
      optionA: "Multiple random samples from a population",
      optionB: "A single bounded system or case in depth",
      optionC: "Cultural themes across multiple groups",
      optionD: "A theoretical model built from data",
      correctAnswer: "B",
      explanation: "Case study research is defined by its focus on a single bounded system — one person, program, organization, or event studied holistically in context.",
      examOnly: true,
    },
    {
      question: "Pattern matching in case study analysis involves:",
      optionA: "Matching participant responses to pre-existing diagnostic criteria",
      optionB: "Comparing observed patterns in data to predicted theoretical patterns",
      optionC: "Randomly assigning patterns to categories",
      optionD: "Using software to find statistical patterns",
      correctAnswer: "B",
      explanation: "Pattern matching compares the patterns found in the case's data against patterns that were predicted by theory — a key analytic technique in case study research.",
      examOnly: true,
    },
    {
      question: "Narrative research focuses on:",
      optionA: "Statistical relationships between life events",
      optionB: "Cultural practices of communities",
      optionC: "How individuals construct meaning through personal stories",
      optionD: "Developing theories from behavioral observations",
      correctAnswer: "C",
      explanation: "Narrative research explores personal stories — how individuals narrate their experiences, construct identity, and make sense of their lives over time.",
      examOnly: true,
    },
    {
      question: "A key limitation of narrative research is:",
      optionA: "Small sample sizes",
      optionB: "Subjectivity and reliance on potentially unreliable memory",
      optionC: "Lack of ecological validity",
      optionD: "Requiring large datasets",
      correctAnswer: "B",
      explanation: "Narrative research is highly subjective and depends on participants' memories, which can be selective, distorted, or reconstructed over time.",
      examOnly: true,
    },
    {
      question: "Narrative research data is analyzed through:",
      optionA: "Open, axial, and selective coding",
      optionB: "Factor analysis",
      optionC: "Chronological and thematic interpretation",
      optionD: "Descriptive statistics",
      correctAnswer: "C",
      explanation: "Narrative data is interpreted both chronologically (how the story unfolds over time) and thematically (recurring topics and meanings within the narrative).",
      examOnly: true,
    },
    {
      question: "Which qualitative design is the BEST match for understanding what grief feels like for cancer survivors?",
      optionA: "Grounded Theory",
      optionB: "Case Study",
      optionC: "Phenomenology",
      optionD: "Ethnography",
      correctAnswer: "C",
      explanation: "Phenomenology is designed to capture the essence of a lived experience — making it the best fit for understanding what grief feels like from the inside.",
      examOnly: true,
    },
    {
      question: "A researcher wants to study how a community of deaf adults communicates and builds identity. The best design is:",
      optionA: "Phenomenology",
      optionB: "Ethnography",
      optionC: "Grounded Theory",
      optionD: "Case Study",
      correctAnswer: "B",
      explanation: "Ethnography is designed to study cultural groups in their natural setting — observing shared communication practices and identity within a community.",
      examOnly: true,
    },
    {
      question: "A researcher wants to understand the process by which adults recover from addiction. The best design is:",
      optionA: "Narrative Research",
      optionB: "Case Study",
      optionC: "Grounded Theory",
      optionD: "Phenomenology",
      correctAnswer: "C",
      explanation: "Grounded Theory focuses on social processes (the 'how' of a process), making it ideal for understanding the process of recovery and developing a theory about it.",
      examOnly: true,
    },
    {
      question: "A researcher wants to document one veteran's full life history and mental health journey. The best design is:",
      optionA: "Phenomenology",
      optionB: "Grounded Theory",
      optionC: "Narrative Research",
      optionD: "Ethnography",
      correctAnswer: "C",
      explanation: "Narrative research is designed to explore individual life histories — how a person constructs meaning across their experiences over time.",
      examOnly: true,
    },
    {
      question: "A researcher conducts a detailed study of one outpatient therapy clinic — its structure, outcomes, and culture. The best design is:",
      optionA: "Grounded Theory",
      optionB: "Phenomenology",
      optionC: "Ethnography",
      optionD: "Case Study",
      correctAnswer: "D",
      explanation: "Case study research is designed for in-depth examination of a single bounded system (here, one clinic) using multiple data sources.",
      examOnly: true,
    },
    {
      question: "Transferability in qualitative research is achieved through:",
      optionA: "Large random samples",
      optionB: "Statistical power analysis",
      optionC: "Thick description of context",
      optionD: "Replication across labs",
      correctAnswer: "C",
      explanation: "Transferability (qualitative generalizability) is enabled through thick description — detailed contextual information that lets readers judge whether findings apply to their own settings.",
      examOnly: true,
    },
    {
      question: "Dependability in qualitative research refers to:",
      optionA: "Whether findings represent participants' true perspectives",
      optionB: "Consistency of findings over time — the qualitative equivalent of reliability",
      optionC: "Whether findings transfer to other populations",
      optionD: "Absence of researcher bias",
      correctAnswer: "B",
      explanation: "Dependability is the qualitative equivalent of reliability — it asks whether the findings would be consistent if the study were conducted again under similar conditions.",
      examOnly: true,
    },
    {
      question: "An audit trail in qualitative research supports:",
      optionA: "Transferability",
      optionB: "Credibility",
      optionC: "Confirmability",
      optionD: "Dependability",
      correctAnswer: "C",
      explanation: "An audit trail (documented record of all decisions and raw data) supports confirmability — allowing others to trace how conclusions were reached and verify they reflect data, not researcher bias.",
      examOnly: true,
    },
    {
      question: "Reflexivity requires the researcher to:",
      optionA: "Remain completely objective and emotionally detached",
      optionB: "Examine how their own background and assumptions may shape the research",
      optionC: "Use structured protocols to eliminate personal influence",
      optionD: "Only collect data through surveys",
      correctAnswer: "B",
      explanation: "Reflexivity is the ongoing, transparent examination of the researcher's own position, biases, and influence on the research process and interpretation.",
      examOnly: true,
    },
    {
      question: "Why are qualitative samples small?",
      optionA: "Because qualitative studies are less rigorous",
      optionB: "Because qualitative methods are too expensive for large samples",
      optionC: "Because depth of understanding matters more than statistical representation",
      optionD: "Because qualitative data cannot be collected from more than 10 people",
      correctAnswer: "C",
      explanation: "Qualitative research prioritizes depth and richness of data over statistical representation. Sampling stops at saturation — when new data no longer adds insight.",
      examOnly: true,
    },
    {
      question: "What is snowball sampling particularly useful for in qualitative research?",
      optionA: "Ensuring representative population demographics",
      optionB: "Increasing statistical power",
      optionC: "Accessing hard-to-reach or hidden populations",
      optionD: "Random selection of participants",
      correctAnswer: "C",
      explanation: "Snowball sampling (where participants refer others) is especially useful for reaching populations that are difficult to access, such as those with stigmatized conditions.",
      examOnly: true,
    },
    {
      question: "The researcher as the 'primary instrument' in qualitative research means:",
      optionA: "The researcher must use standardized tests",
      optionB: "The researcher's observations and interpretations are the main data collection tool",
      optionC: "Researchers must be licensed clinicians",
      optionD: "The researcher administers surveys as the main measure",
      correctAnswer: "B",
      explanation: "In qualitative research, the researcher is the instrument — their observations, judgments, and interpretations are central to data collection and analysis.",
      examOnly: true,
    },
    {
      question: "Triangulation improves qualitative research by:",
      optionA: "Increasing sample size through three-stage recruitment",
      optionB: "Using three different statistical tests",
      optionC: "Cross-verifying findings using multiple data sources or methods",
      optionD: "Applying three layers of coding to the data",
      correctAnswer: "C",
      explanation: "Triangulation uses multiple data sources, methods, or researchers to corroborate findings — increasing the credibility and trustworthiness of conclusions.",
      examOnly: true,
    },
    {
      question: "Which concept in qualitative research is the equivalent of objectivity in quantitative research?",
      optionA: "Credibility",
      optionB: "Transferability",
      optionC: "Dependability",
      optionD: "Confirmability",
      correctAnswer: "D",
      explanation: "Confirmability is the qualitative analog of objectivity — it asks whether findings reflect participants' realities rather than the researcher's biases.",
      examOnly: true,
    },
    {
      question: "A thick description in qualitative research serves to:",
      optionA: "Increase statistical power",
      optionB: "Ensure random selection of participants",
      optionC: "Enable readers to judge whether findings transfer to their setting",
      optionD: "Satisfy the requirement for large sample sizes",
      correctAnswer: "C",
      explanation: "Thick description provides rich contextual detail about the setting, participants, and processes — allowing others to judge the transferability of findings.",
      examOnly: true,
    },
    {
      question: "Qualitative data analysis typically begins with:",
      optionA: "Computing descriptive statistics",
      optionB: "Coding — labeling meaningful segments of data",
      optionC: "Factor analysis",
      optionD: "Structural equation modeling",
      correctAnswer: "B",
      explanation: "Qualitative analysis begins with coding — reading through data and assigning descriptive labels to meaningful segments, which then form the basis of theme development.",
      examOnly: true,
    },
    {
      question: "Which of the following is a key strength shared by ALL qualitative designs?",
      optionA: "High statistical power",
      optionB: "Ability to generalize to large populations",
      optionC: "Deep, contextual understanding of human experience",
      optionD: "Controlled experimental conditions",
      correctAnswer: "C",
      explanation: "All qualitative designs share the strength of producing deep, rich, contextually grounded understanding of human experience that quantitative methods cannot capture.",
      examOnly: true,
    },
    {
      question: "Which qualitative design has the highest ecological validity?",
      optionA: "Phenomenology",
      optionB: "Grounded Theory",
      optionC: "Narrative Research",
      optionD: "Ethnography",
      correctAnswer: "D",
      explanation: "Ethnography is conducted in natural settings, producing findings that most accurately reflect real-world behaviors and cultural patterns — giving it the highest ecological validity.",
      examOnly: true,
    },
    {
      question: "Case Study, Ethnography, and Narrative Research all differ from Phenomenology in that they:",
      optionA: "Do not explore subjective experience",
      optionB: "Can include multiple participants and data sources beyond individual experience",
      optionC: "Use quantitative data exclusively",
      optionD: "Are hypothesis-driven",
      correctAnswer: "B",
      explanation: "Phenomenology focuses purely on the essence of individual lived experience. The other designs can incorporate groups, contexts, systems, and multiple data sources.",
      examOnly: true,
    },
    {
      question: "Grounded Theory data collection is described as 'iterative' because:",
      optionA: "It repeats the same questions for each participant",
      optionB: "Data collection and analysis happen simultaneously, with findings shaping further sampling",
      optionC: "Interviews are conducted three times per participant",
      optionD: "The same participants are interviewed at multiple time points",
      correctAnswer: "B",
      explanation: "Grounded Theory is iterative because data collection and analysis occur concurrently — emerging concepts guide who is sampled next and what questions are asked.",
      examOnly: true,
    },
    {
      question: "The key research question in case study research is:",
      optionA: "What is it like to experience this?",
      optionB: "What process explains what is happening?",
      optionC: "How and why does this case function?",
      optionD: "What are the shared cultural patterns of this group?",
      correctAnswer: "C",
      explanation: "Case study research asks 'How and why does this case function?' — focusing on detailed, contextual understanding of a specific bounded system.",
      examOnly: true,
    },
    {
      question: "Narrative research data analysis focuses on:",
      optionA: "Cultural theme identification",
      optionB: "Open, axial, and selective coding",
      optionC: "Chronological and thematic interpretation of personal stories",
      optionD: "Pattern matching against theoretical predictions",
      correctAnswer: "C",
      explanation: "Narrative analysis examines both the timeline of events (chronological) and recurring topics or meanings within the story (thematic).",
      examOnly: true,
    },
    {
      question: "If a researcher finds no new themes after 15 interviews, they should:",
      optionA: "Continue until they reach 30 interviews",
      optionB: "Perform a power analysis",
      optionC: "Stop data collection — saturation has been reached",
      optionD: "Switch to a quantitative design",
      correctAnswer: "C",
      explanation: "Data saturation — when no new information is emerging — is the indicator to stop sampling in qualitative research, regardless of the absolute number of participants.",
      examOnly: true,
    },
    {
      question: "Which qualitative design most directly addresses 'What is the process by which people change?'",
      optionA: "Case Study",
      optionB: "Grounded Theory",
      optionC: "Phenomenology",
      optionD: "Narrative Research",
      correctAnswer: "B",
      explanation: "Grounded Theory is designed to explain social processes — the 'how' and 'why' of behavioral change — and generates a theoretical model to describe it.",
      examOnly: true,
    },
    {
      question: "Field notes in ethnographic research are primarily used to:",
      optionA: "Record standardized questionnaire responses",
      optionB: "Document observations of cultural behaviors and interactions in the natural setting",
      optionC: "Track demographic data about participants",
      optionD: "Record inter-rater reliability scores",
      correctAnswer: "B",
      explanation: "Field notes are detailed written records of observations in the natural setting — capturing behaviors, interactions, context, and the researcher's reflections during ethnographic fieldwork.",
      examOnly: true,
    },
    {
      question: "A life history interview is most closely associated with which qualitative design?",
      optionA: "Phenomenology",
      optionB: "Ethnography",
      optionC: "Grounded Theory",
      optionD: "Narrative Research",
      correctAnswer: "D",
      explanation: "Life history interviews are a hallmark of narrative research — they capture the full arc of a person's experiences and how they construct meaning across their lifetime.",
      examOnly: true,
    },
    {
      question: "What distinguishes qualitative 'trustworthiness' from quantitative 'validity and reliability'?",
      optionA: "Trustworthiness uses statistical methods; validity does not",
      optionB: "Trustworthiness reflects the interpretive, subjective nature of qualitative inquiry using different criteria (credibility, transferability, dependability, confirmability)",
      optionC: "Trustworthiness is only concerned with sample size",
      optionD: "They are the same concept with different labels",
      correctAnswer: "B",
      explanation: "Trustworthiness acknowledges the interpretive nature of qualitative research and uses four parallel but distinct criteria (credibility, transferability, dependability, confirmability) instead of quantitative validity/reliability.",
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
  const studyGuideContent = `# Qualitative Research Designs — Study Guide

## Overview

**Qualitative research** focuses on understanding meaning, experience, and context rather than measuring variables numerically. It explores:
- Subjective experiences
- Social processes
- Cultural meanings
- Lived realities

**Key distinction from quantitative:** Qualitative asks *how* and *why*; quantitative asks *how much* and *how often*.

---

## Quick Reference Summary

| Design | Core Question | Focus | Outcome |
|---|---|---|---|
| **Phenomenology** | What is it like to experience this? | Lived experience | Essence of experience |
| **Grounded Theory** | What process explains this? | Social processes | New theoretical model |
| **Ethnography** | What are the shared patterns? | Culture & norms | Cultural themes |
| **Case Study** | How/why does this case work? | One bounded system | In-depth contextual understanding |
| **Narrative Research** | How do people make meaning through stories? | Personal narratives | Life story interpretation |

---

## 1. Phenomenology

**Purpose:** Understand lived experiences and the essence of a phenomenon.

**Key Question:** *What is it like to experience this?*

**Focus:** Subjective experience and meaning-making

**Methods:**
- In-depth interviews
- Narratives
- Journaling

**Analysis:** Identify themes → describe the essence of the experience

**Key Concept — Bracketing (Epoché):** The researcher sets aside their own assumptions and prior knowledge to remain open to participants' descriptions.

| Strengths | Limitations |
|---|---|
| Deep insight into subjective experience | Highly subjective |
| Captures the "inside" perspective | Small samples limit generalizability |

---

## 2. Grounded Theory

**Purpose:** Develop theory grounded in data — build theory inductively.

**Key Question:** *What process explains what is happening?*

**Focus:** Social processes and behaviors

**Methods:**
- Iterative interviews
- Theoretical sampling (sampling based on emerging concepts)
- Continues until **theoretical saturation** (no new themes)

**Three Stages of Coding:**

| Stage | Description |
|---|---|
| **Open coding** | Initial labeling of all meaningful concepts |
| **Axial coding** | Connecting categories and subcategories |
| **Selective coding** | Building the core theoretical model |

**Outcome:** A new theoretical model explaining the social process.

| Strengths | Limitations |
|---|---|
| Generates real-world theory | Very time-intensive |
| Grounded in participants' reality | Requires iterative data collection |

---

## 3. Ethnography

**Purpose:** Study cultures and groups in natural settings.

**Key Question:** *What are the shared patterns of this group?*

**Focus:** Culture and social norms

**Methods:**
- Observation (especially **participant observation** — immersion in the group)
- Field notes
- Interviews

**Analysis:** Identify cultural themes — recurring shared patterns of meaning and behavior.

**Key Concept — Ecological Validity:** Ethnography has HIGH ecological validity because it studies people in their real-world environment.

| Strengths | Limitations |
|---|---|
| High ecological validity | Very time-consuming |
| Rich cultural understanding | Risk of researcher bias ("going native") |

---

## 4. Case Study

**Purpose:** In-depth analysis of a single case or bounded system.

**Key Question:** *How and why does this case function?*

**Focus:** Detailed contextual understanding of one entity (person, program, organization, event)

**Methods:**
- Multiple data sources (interviews + documents + observations)
- **Triangulation** — cross-checking across sources

**Analysis:** Pattern matching (comparing observed patterns to predicted patterns) + synthesis

| Strengths | Limitations |
|---|---|
| Holistic, in-depth view | Limited generalizability |
| Context-rich findings | One case may be atypical |

---

## 5. Narrative Research

**Purpose:** Explore how individuals construct life stories and make meaning.

**Key Question:** *How do people make meaning through stories?*

**Focus:** Personal narratives and identity

**Methods:**
- Interviews
- Life histories

**Analysis:** Chronological and thematic interpretation

| Strengths | Limitations |
|---|---|
| Rich personal insight | Highly subjective |
| Captures identity and meaning-making | Memory-based — potential distortion |

---

## 6. Rigor & Trustworthiness

Qualitative research uses **trustworthiness** as its standard of rigor — parallel to quantitative validity/reliability.

| Qualitative Criterion | Quantitative Equivalent | How to Establish |
|---|---|---|
| **Credibility** | Internal validity | Member checking, prolonged engagement, triangulation |
| **Transferability** | External validity/generalizability | Thick description |
| **Dependability** | Reliability | Audit trail, overlap methods |
| **Confirmability** | Objectivity | Audit trail, reflexivity |

### Key Strategies
- **Member checking:** Return findings to participants for verification
- **Thick description:** Rich contextual details enabling readers to judge transferability
- **Triangulation:** Multiple data sources, methods, or researchers cross-check findings
- **Reflexivity:** Researcher examines their own influence on the research
- **Audit trail:** Documented record of all research decisions and raw data

---

## 7. Sampling in Qualitative Research

| Type | Description |
|---|---|
| **Purposive** | Selected for direct relevance to the phenomenon |
| **Snowball** | Participants refer others — useful for hard-to-reach groups |
| **Theoretical** | Selected based on emerging theory (Grounded Theory) |

**Why small samples?** Depth > representation. Sample until **data saturation** — when no new themes emerge.

**The researcher as instrument:** In qualitative research, the researcher IS the primary data collection tool — their observations and interpretations are central.

---

## 8. Data Analysis

| Method | Description |
|---|---|
| **Coding** | Labeling meaningful data segments with descriptive tags |
| **Thematic analysis** | Identifying recurring patterns/themes across data |
| **Chronological interpretation** | Organizing narrative data across time |
| **Pattern matching** | Comparing observed patterns to theoretical predictions (case study) |

---

## 9. Design Selection Guide

| Research Goal | Best Design |
|---|---|
| Understanding the lived experience of a phenomenon | Phenomenology |
| Building a theory about a social process | Grounded Theory |
| Understanding a cultural group's practices | Ethnography |
| In-depth study of one system or program | Case Study |
| Capturing an individual's life story | Narrative Research |`;

  const [studyGuide] = await db
    .insert(studyGuidesTable)
    .values({
      topicId,
      title: "Qualitative Research Designs — Complete Study Guide",
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
      title: "Qualitative Research Designs Practice Exam",
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

  console.log(`\n✅ Qualitative Research Designs (topic ${topicId}) fully seeded!`);
}

addQualitativeTopic()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
