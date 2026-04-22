import { db } from "./index";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

interface FC { question: string; answer: string; difficulty: "easy" | "medium" | "hard" }
interface QQ {
  question: string; optionA: string; optionB: string; optionC: string; optionD: string;
  correctAnswer: "A" | "B" | "C" | "D"; explanation: string; examOnly?: boolean;
}
interface TopicData {
  name: string;
  description: string;
  guide: string;
  flashcards: FC[];
  questions: QQ[];
}

const topics: TopicData[] = [
  // ==================== TOPIC 1: FOUNDATIONS ====================
  {
    name: "Foundations of Psychotherapy",
    description: "Historical traditions, common factors, evidence-based practice, the therapeutic frame, ethics, and case formulation — the conceptual scaffolding shared across all psychotherapeutic approaches.",
    guide: `## Overview

Psychotherapy is the systematic use of a therapeutic relationship and psychological methods to help individuals change patterns of thinking, feeling, and behavior. Over 500 named approaches exist, but they share common structures, mechanisms, and foundational principles.

## Historical Development

**Pre-Freudian roots**
- Mesmerism and moral treatment (Pinel, Tuke)
- Cathartic method (Breuer with "Anna O.")
- Nancy School hypnosis (Charcot, Bernheim)

**Major eras**
- Psychoanalytic revolution (1890s–1930s): Freud — free association, transference, the unconscious
- Behaviorism (1920s–1950s): Watson, Pavlov, Skinner — observable behavior and contingencies
- Humanistic movement (1950s–1960s): Rogers, Maslow, Perls — growth, subjectivity, relationship
- Cognitive revolution (1960s–1980s): Beck, Ellis — cognition mediates emotion
- Third wave and integration (1980s–present): Linehan, Hayes, Kabat-Zinn — mindfulness and acceptance

## The Five Major Theoretical Traditions

**Psychoanalytic / Psychodynamic**
- Behavior shaped by unconscious processes, early experience, intrapsychic conflict
- Change through insight, working through, corrective relational experience

**Humanistic / Existential / Experiential**
- Humans are inherently growth-oriented
- Distress arises from blocked actualization or unprocessed emotion
- The relationship itself is curative

**Behavioral**
- Behavior is learned and can be unlearned through conditioning
- Focus on observable behavior and environmental contingencies

**Cognitive**
- Cognitions mediate emotional and behavioral responses
- Identifying and modifying distorted thinking is the primary mechanism

**Systemic / Relational**
- Problems are embedded in interpersonal, family, and cultural systems
- Change in one part of the system produces change in others

## Common Factors

Wampold's contextual model demonstrates that a substantial portion of outcome variance is accounted for by factors common across all bona fide psychotherapies — not by the specific techniques that differentiate them.

**The Dodo Bird Verdict**
- Most bona fide psychotherapies produce roughly equivalent outcomes
- First articulated by Luborsky and colleagues (1975); replicated across hundreds of meta-analyses

**Wampold's common factors**
- Therapeutic alliance: the strongest single predictor of outcome (r ≈ .28); Bordin's three components are bond, goals, and tasks
- Empathy: accurate empathic understanding of the client's experience
- Positive regard: warmth and acceptance regardless of client behavior
- Therapist allegiance: therapist belief in the treatment they deliver
- Hope and expectancy: client belief that therapy will help
- Coherent rationale: a credible explanation of the problem and how treatment helps
- Healing rituals: techniques that embody the rationale and provide structure

The therapeutic alliance is the most robust predictor of outcome — stronger than the specific technique, the diagnosis, or the therapist's years of experience.

## Evidence-Based Practice in Psychology (EBPP)

Three pillars (APA Presidential Task Force, 2006):

**Best available research**
- RCTs, meta-analyses, systematic reviews
- EST lists use Chambless criteria: well-established, probably efficacious, experimental

**Clinical expertise**
- The therapist's accumulated skill in assessment, formulation, relationship, and technique

**Patient factors**
- Preferences, values, culture, severity, comorbidities, readiness for change

**Effect size benchmarks** (Cohen, 1988): d = 0.20 small, 0.50 medium, 0.80 large
Psychotherapy overall produces a mean effect of approximately d = 0.80 vs. no treatment. Number needed to treat is roughly 2–3 for most conditions, comparable to effective medications. Long-term follow-up studies generally favor psychotherapy over medication for depression and anxiety because gains are better maintained.

## The Therapeutic Frame and Setting

**The frame**
- Consistent structure: session length, frequency, fee, cancellation policy, confidentiality, physical space, role boundaries
- Provides safety and predictability — especially important in attachment trauma

**Confidentiality and its limits**
- Duty to protect (Tarasoff)
- Mandatory reporting of child, elder, and dependent adult abuse
- Imminent danger requiring hospitalization
- Court orders

**Informed consent**
- Nature, limits, alternatives, confidentiality, right to withdraw — provided before treatment begins

**Boundaries and dual relationships**
- Multiple relationships that impair objectivity or exploit the relationship are prohibited
- Sexual relationships with current or former clients are strictly unethical

**Competence**
- Practice only within demonstrated competence; seek consultation when needed

**Critical consideration**
- Tarasoff duty: when a client makes a credible, specific threat against an identifiable third party, the therapist has a legal and ethical duty to take reasonable protective steps. State laws vary — know your jurisdiction.

## Case Formulation

A working hypothesis about the mechanisms underlying presenting problems and the factors that maintain them — the bridge between assessment and treatment planning. Components include:

**Presenting problems**
- Specific, observable difficulties bringing the client to treatment

**Predisposing factors**
- Historical, biological, developmental vulnerabilities (diathesis)

**Precipitating factors**
- Stressors or events that triggered the current episode

**Perpetuating factors**
- Cognitive, behavioral, interpersonal, or systemic factors maintaining the problem

**Protective factors**
- Strengths, resources, resilience

**Treatment implications**
- How the formulation guides intervention selection`,
    flashcards: [
      { question: "What is the single strongest predictor of psychotherapy outcome across all modalities?", answer: "The therapeutic alliance (r ≈ .28). It is stronger than specific technique, diagnosis, or therapist experience. Bordin (1979) defined three components: bond, goals, and tasks.", difficulty: "easy" },
      { question: "What is the Dodo Bird Verdict?", answer: "The meta-analytic finding (first articulated by Luborsky et al., 1975) that most bona fide psychotherapies produce roughly equivalent outcomes — suggesting common factors account for more variance than specific techniques.", difficulty: "medium" },
      { question: "Name Wampold's seven common factors of psychotherapy.", answer: "Therapeutic alliance, empathy, positive regard, therapist allegiance, hope/expectancy, coherent rationale, and healing rituals.", difficulty: "hard" },
      { question: "What are the three pillars of evidence-based practice in psychology (EBPP)?", answer: "(1) Best available research evidence (RCTs, meta-analyses); (2) Clinical expertise; (3) Patient characteristics, culture, and preferences. (APA Presidential Task Force, 2006)", difficulty: "easy" },
      { question: "What is the approximate mean effect size of psychotherapy versus no treatment?", answer: "Approximately d = 0.80 — a large effect by Cohen's (1988) benchmarks (d = 0.20 small, 0.50 medium, 0.80 large). NNT is approximately 2–3 for most conditions.", difficulty: "medium" },
      { question: "What are the Chambless criteria for empirically supported treatments?", answer: "Three tiers: (1) Well-established — supported by 2+ between-group RCTs from independent labs OR 9+ single-case design studies; (2) Probably efficacious — supported by 2+ RCTs or 3+ single-case designs; (3) Experimental.", difficulty: "hard" },
      { question: "What is the Tarasoff duty?", answer: "The legal/ethical duty to take reasonable steps to protect an identifiable third party when a client makes a credible, specific threat against them. Steps may include warning the victim, notifying law enforcement, or initiating hospitalization. State laws vary.", difficulty: "medium" },
      { question: "What are the three components of Bordin's working alliance?", answer: "(1) Bond — the affective quality of the relationship; (2) Goals — agreement on therapy objectives; (3) Tasks — agreement on the activities of therapy.", difficulty: "medium" },
      { question: "What is a case formulation?", answer: "A clinician's working hypothesis about the psychological mechanisms underlying a client's presenting problems and the factors that maintain them. It bridges assessment and treatment planning and guides intervention selection.", difficulty: "easy" },
      { question: "What are the 5 P's of case formulation?", answer: "Presenting problems, Predisposing factors (diathesis), Precipitating factors (triggers), Perpetuating factors (maintaining mechanisms), and Protective factors (strengths and resilience).", difficulty: "medium" },
      { question: "Name the five major theoretical traditions in psychotherapy.", answer: "(1) Psychoanalytic/Psychodynamic; (2) Humanistic/Existential/Experiential; (3) Behavioral; (4) Cognitive; (5) Systemic/Relational.", difficulty: "easy" },
      { question: "Why does long-term follow-up generally favor psychotherapy over medication for depression and anxiety?", answer: "Therapy gains are better maintained because patients acquire transferable skills, insight, or relational capacities that continue to function after treatment ends — whereas medication effects depend on continued use.", difficulty: "hard" },
    ],
    questions: [
      { question: "Which factor is the single strongest predictor of psychotherapy outcome?", optionA: "Therapist's years of experience", optionB: "Specific technique used", optionC: "The therapeutic alliance", optionD: "Client's diagnosis", correctAnswer: "C", explanation: "Meta-analyses consistently find the therapeutic alliance (r ≈ .28) is a stronger predictor of outcome than technique, diagnosis, or therapist experience." },
      { question: "Bordin's working alliance model identifies which three components?", optionA: "Trust, transference, technique", optionB: "Bond, goals, tasks", optionC: "Empathy, congruence, regard", optionD: "Insight, support, structure", correctAnswer: "B", explanation: "Bordin (1979) operationalized the alliance as the bond between client and therapist, agreement on goals, and agreement on tasks." },
      { question: "The Dodo Bird Verdict refers to:", optionA: "The need to discard outdated therapies", optionB: "The finding that most bona fide therapies produce roughly equivalent outcomes", optionC: "The superiority of behavioral approaches", optionD: "The unreliability of psychotherapy research", correctAnswer: "B", explanation: "Coined from Alice in Wonderland, the Dodo Bird verdict (Luborsky et al., 1975) summarizes the robust meta-analytic finding of approximate equivalence across legitimate therapies." },
      { question: "According to Cohen's benchmarks, an effect size of d = 0.80 is:", optionA: "Small", optionB: "Medium", optionC: "Large", optionD: "Trivial", correctAnswer: "C", explanation: "Cohen (1988): d = 0.20 small, 0.50 medium, 0.80 large. Psychotherapy overall produces ~d = 0.80 vs. no treatment." },
      { question: "Evidence-based practice in psychology (EBPP) integrates which three pillars?", optionA: "Theory, technique, supervision", optionB: "Research evidence, clinical expertise, patient characteristics", optionC: "Diagnosis, treatment, monitoring", optionD: "Assessment, formulation, intervention", correctAnswer: "B", explanation: "The 2006 APA Presidential Task Force defined EBPP as the integration of best available research, clinical expertise, and patient values/culture/preferences." },
      { question: "The Tarasoff duty applies when:", optionA: "A client expresses suicidal thoughts", optionB: "A client makes a credible, specific threat against an identifiable third party", optionC: "A client refuses medication", optionD: "A client has a history of violence", correctAnswer: "B", explanation: "Tarasoff requires reasonable protective action only when there is a credible, specific threat against an identifiable victim — not for vague hostility or general history." },
      { question: "Which is NOT one of the five P's of case formulation?", optionA: "Predisposing factors", optionB: "Precipitating factors", optionC: "Perpetuating factors", optionD: "Pharmacological factors", correctAnswer: "D", explanation: "The 5 P's are: Presenting problems, Predisposing, Precipitating, Perpetuating, and Protective factors. Pharmacology may inform treatment but is not part of the formulation framework itself." },
      { question: "Wampold's contextual model emphasizes that outcome variance is largely accounted for by:", optionA: "Specific techniques unique to each approach", optionB: "Common factors shared across bona fide therapies", optionC: "Diagnostic precision", optionD: "Length of treatment", correctAnswer: "B", explanation: "The contextual model holds that common factors (alliance, empathy, expectancy, rationale) account for most of the variance, while specific technique effects are small after controlling for these." },
      { question: "Which is a primary limit of confidentiality?", optionA: "Client requests a referral", optionB: "Mandatory reporting of suspected child abuse", optionC: "Family member contacts the therapist", optionD: "Client misses an appointment", correctAnswer: "B", explanation: "Mandated reporting (child, elder, dependent adult abuse), Tarasoff duty, imminent danger requiring hospitalization, and court orders are the primary limits of confidentiality." },
      { question: "The 'frame' in psychotherapy refers to:", optionA: "The diagnostic formulation", optionB: "The consistent structural elements (session length, fee, frequency, boundaries)", optionC: "The cognitive model", optionD: "The therapy room decor", correctAnswer: "B", explanation: "The frame encompasses the consistent structural and procedural elements that provide safety, predictability, and containment — particularly important for clients with attachment disturbance." },
      { question: "Which historical figure is most associated with originating the cognitive revolution in psychotherapy?", optionA: "Carl Rogers", optionB: "B. F. Skinner", optionC: "Aaron Beck", optionD: "Marsha Linehan", correctAnswer: "C", explanation: "Aaron Beck's cognitive therapy for depression (1963) and Albert Ellis's REBT (1955) launched the cognitive revolution. Rogers led the humanistic movement; Skinner the behavioral; Linehan the third wave.", examOnly: true },
      { question: "Long-term follow-up studies generally favor psychotherapy over medication for depression and anxiety because:", optionA: "Therapy is cheaper", optionB: "Patients prefer therapy", optionC: "Therapy gains are better maintained after treatment ends", optionD: "Medications have severe side effects", correctAnswer: "C", explanation: "Skills, insight, and relational capacities acquired in therapy continue to function after treatment ends, whereas medication effects depend on continued use. This produces more durable long-term outcomes for therapy.", examOnly: true },
      { question: "Which approach holds that 'change occurs not when one tries to be different but when one becomes more fully what one is'?", optionA: "REBT's rational disputation", optionB: "Beck's cognitive restructuring", optionC: "Beisser's paradoxical theory of change (Gestalt)", optionD: "Skinner's operant shaping", correctAnswer: "C", explanation: "The paradoxical theory of change (Beisser, 1970) is foundational to Gestalt and is echoed in person-centered, ACT, and other acceptance-based approaches.", examOnly: true },
      { question: "The therapist effect refers to the finding that:", optionA: "Therapists' theoretical orientations determine outcome", optionB: "The specific therapist accounts for more outcome variance than the type of treatment", optionC: "Therapists become less effective with experience", optionD: "Therapist gender predicts outcome", correctAnswer: "B", explanation: "Wampold & Imel (2015): between-therapist variance is 5–9% of outcome — comparable to or greater than treatment differences. Choosing an effective therapist matters at least as much as choosing an evidence-based treatment.", examOnly: true },
      { question: "A coherent rationale for treatment is therapeutically helpful because:", optionA: "It must be scientifically accurate to work", optionB: "It mobilizes hope, expectancy, and a credible explanation that organizes the client's experience and the healing rituals", optionC: "It replaces the need for empathy", optionD: "It is required by ethical codes", correctAnswer: "B", explanation: "Per the contextual model, the rationale need not be literally accurate but must be credible and culturally congruent — it provides the meaning structure within which healing rituals operate.", examOnly: true },
    ],
  },

  // ==================== TOPIC 2: PSYCHOANALYTIC ====================
  {
    name: "Psychoanalytic and Psychodynamic Approaches",
    description: "Freudian psychoanalysis, ego psychology, object relations, self psychology, and contemporary relational/intersubjective approaches — including defenses, transference, and short-term psychodynamic therapy.",
    guide: `## Overview

Psychoanalytic and psychodynamic therapies share the view that unconscious processes, early developmental experiences, and internalized relational patterns are central determinants of psychological functioning. Together they constitute the oldest and most theoretically elaborated psychotherapeutic tradition.

## Freudian Psychoanalysis

**Developer**
- Sigmund Freud (1856–1939); classical period 1900–1939

**Core models of mind**
- Topographic model (1900): conscious, preconscious, unconscious
- Structural model (1923): id (entirely unconscious, pleasure principle), ego (reality principle, partly conscious), superego (internalized morality, partly conscious)
- The structural model did not replace the topographic — both are used

**Theory of change**
- Making the unconscious conscious; lifting repression so the ego can resolve conflicts adaptively
- Working through transference and resistance is central

**Key techniques**
- Free association (the "fundamental rule")
- Dream interpretation: manifest vs. latent content; dream work uses condensation, displacement, symbolization, secondary revision
- Analysis of transference and countertransference
- Interpretation of resistance
- Analysis of slips (parapraxes)

**Goals**
- Structural personality change through insight
- Capacity for "love and work" (lieben und arbeiten)

## Defense Mechanisms

Unconscious strategies the ego uses to manage anxiety. First catalogued by Freud, elaborated by Anna Freud (1936); Vaillant (1977) organized them hierarchically.

**Primitive defenses**
- Splitting — inability to hold ambivalence; people seen as all-good or all-bad (borderline organization)
- Projective identification — projecting an aspect of self into another, who comes to feel/enact the projection (Klein)
- Denial — refusing to acknowledge painful reality
- Projection — attributing one's unacceptable content to others

**Neurotic defenses**
- Repression — the foundational defense; involuntary exclusion from awareness
- Reaction formation — converting an impulse into its opposite
- Rationalization — providing acceptable reasons for unacceptable motives
- Displacement — redirecting affect to a safer target
- Intellectualization — using abstract thinking to distance from emotion
- Undoing — symbolic acts to nullify a prior thought or action
- Regression — return to earlier modes of functioning

**Mature defenses**
- Sublimation — channeling impulses into socially valued activity
- Humor, altruism, suppression (conscious postponement)

## Transference and Countertransference

**Transference**
- The patient's unconscious displacement onto the therapist of feelings and patterns from early relationships
- Working through transference enables insight into how relational history shapes present experience

**Countertransference**
- Originally seen as the therapist's interference; now also viewed as valuable clinical information about the patient's relational world (intersubjective view)

## Psychosexual Stages (Freud)

**Stages**
- **Oral** (0–18 months): dependency, trust
- **Anal** (18 months–3 years): control, autonomy
- **Phallic** (3–6 years): Oedipus complex, gender identity
- **Latency** (6–12 years)
- **Genital** (12+ years)

Fixation at any stage produces characteristic personality traits. Empirical support is limited; the framework remains historically and clinically important.

## Ego Psychology

**Developers**
- Anna Freud, Heinz Hartmann, Margaret Mahler

**Core ideas**
- The ego has autonomous functions (conflict-free ego sphere — Hartmann)
- Healthy development = progressive ego mastery and adaptation
- Mahler's separation-individuation: normal autism → symbiosis → differentiation → practicing → rapprochement → object constancy
- Rapprochement (18–24 mo) — toddler refuels with mother while asserting autonomy; disruption theorized to contribute to borderline pathology

## Object Relations

**Developers**
- Klein, Winnicott, Fairbairn, Guntrip; Kernberg integrated with ego psychology

**Core ideas**
- Primary motivation is object-seeking, not drive discharge
- The mind is structured by internalized representations of self and others (internal objects)
- Pathology reflects split, hostile, or depriving internal objects

**Key concepts**
- Holding environment (Winnicott): the therapist provides containment for split/fragmented experience
- Transitional objects and transitional space (Winnicott)
- Movement from paranoid-schizoid position (splitting, persecutory anxiety) to depressive position (whole objects, ambivalence, concern)

**Kernberg's levels of personality organization**
- Neurotic — integrated identity, mature defenses, intact reality testing
- Borderline — identity diffusion, primitive defenses, intact reality testing under non-stress
- Psychotic — identity diffusion, primitive defenses, loss of reality testing

## Self Psychology

**Developer**
- Heinz Kohut (1913–1981)

**Core ideas**
- Central need is a cohesive, positive sense of self
- The self develops through selfobjects providing three functions: mirroring, idealizing, twinship
- Narcissistic pathology = developmental failure in selfobject provision
- Transmuting internalization — optimal empathic failures gradually build self-regulation

**Therapeutic stance**
- Sustained empathic attunement is both technique and mechanism of change
- The relationship IS the therapy

## Relational and Intersubjective Approaches

**Developers**
- Mitchell, Greenberg, Benjamin, Aron (1983–present)

**Core ideas**
- The mind is fundamentally relational; therapy is a two-person psychology
- Both patient and therapist bring their subjectivity
- Enactments — moments when both unconsciously replicate patient's relational patterns — are valuable clinical events
- Judicious self-disclosure and mutual recognition (Benjamin) are valued

## Short-Term Psychodynamic Psychotherapy (STPP)

**Developers**
- Malan, Sifneos, Davanloo (ISTDP), Luborsky

**Core ideas**
- Psychodynamic principles in a focused, time-limited format (12–40 sessions)
- Active confrontation of defenses
- Malan's two triangles
- Triangle of conflict: impulse/feeling → anxiety → defense
- Triangle of persons: current → past → transference

**Evidence**
- Driessen et al. (2015) meta-analysis: d = 0.97 for depression at post-treatment
- Strong support across common mental health problems`,
    flashcards: [
      { question: "What is the difference between Freud's topographic and structural models of mind?", answer: "Topographic (1900): conscious, preconscious, unconscious — describes accessibility to awareness. Structural (1923): id, ego, superego — describes functional agencies. Both are used; the structural did not replace the topographic.", difficulty: "medium" },
      { question: "What is the 'fundamental rule' of psychoanalysis?", answer: "Free association — saying everything that comes to mind without censorship, judgment, or selection. Departures from this rule (resistance) become important clinical material.", difficulty: "easy" },
      { question: "What is splitting and which level of personality organization is it characteristic of?", answer: "Inability to hold ambivalent feelings simultaneously; people and situations are perceived as all-good or all-bad. Characteristic of borderline personality organization (Kernberg).", difficulty: "medium" },
      { question: "What is projective identification?", answer: "A primitive defense (Klein): the individual projects a disowned part of the self into another person, then identifies with that person; the recipient may actually come to feel or enact the projected content. Central to borderline pathology and countertransference dynamics.", difficulty: "hard" },
      { question: "Name Vaillant's three levels of defenses with examples.", answer: "Primitive (denial, splitting, projective identification); Neurotic (repression, displacement, reaction formation, rationalization, intellectualization); Mature (sublimation, humor, altruism, suppression).", difficulty: "hard" },
      { question: "What is transference?", answer: "The patient's unconscious displacement onto the therapist of feelings, attitudes, and relational patterns originating in earlier (typically parental) relationships. Working through transference is central to psychodynamic technique.", difficulty: "easy" },
      { question: "What are Mahler's subphases of separation-individuation?", answer: "Normal autism → symbiosis → differentiation → practicing → rapprochement (18–24 mo, theorized as critical for borderline vulnerability) → object constancy.", difficulty: "hard" },
      { question: "What are the three selfobject functions in Kohut's self psychology?", answer: "(1) Mirroring — affirming and admiring the self; (2) Idealizing — allowing merger with an idealized other; (3) Twinship/alter ego — feeling similar to and belonging with others.", difficulty: "medium" },
      { question: "What is Winnicott's 'holding environment'?", answer: "The therapeutic provision (analogous to the 'good enough mother') of containment, reliability, and survival of the patient's destructiveness — within which split/fragmented internal objects can be integrated.", difficulty: "medium" },
      { question: "What are Kernberg's three levels of personality organization?", answer: "Neurotic (integrated identity, mature defenses, intact reality testing); Borderline (identity diffusion, primitive defenses, intact reality testing under non-stress); Psychotic (identity diffusion, primitive defenses, loss of reality testing).", difficulty: "medium" },
      { question: "What are Malan's two triangles in STPP?", answer: "Triangle of Conflict: impulse/feeling → anxiety → defense. Triangle of Persons: current relationships → past relationships → transference. The therapist interprets connections across the vertices of both triangles.", difficulty: "hard" },
      { question: "What does the 'paranoid-schizoid' versus 'depressive' position refer to (Klein)?", answer: "Paranoid-schizoid: experiencing self/others as split into all-good and all-bad (persecutory anxiety). Depressive: integrating good and bad into whole objects, tolerating ambivalence, and feeling concern/guilt — a developmental achievement.", difficulty: "hard" },
    ],
    questions: [
      { question: "Which defense is characterized by the inability to hold ambivalent feelings, with people seen as all-good or all-bad?", optionA: "Repression", optionB: "Splitting", optionC: "Reaction formation", optionD: "Rationalization", correctAnswer: "B", explanation: "Splitting is a primitive defense central to borderline personality organization. Repression and rationalization are neurotic-level." },
      { question: "Which is Freud's 'fundamental rule'?", optionA: "Dream interpretation", optionB: "Free association", optionC: "Transference analysis", optionD: "Resistance interpretation", correctAnswer: "B", explanation: "Free association — saying everything that comes to mind without censorship — is the fundamental rule. The other items are techniques but not the foundational instruction." },
      { question: "Mahler's rapprochement subphase occurs at approximately what age?", optionA: "0–6 months", optionB: "6–18 months", optionC: "18–24 months", optionD: "3–5 years", correctAnswer: "C", explanation: "Rapprochement (18–24 months) is the toddler's return to mother for emotional refueling while asserting autonomy. Disruption is theorized to contribute to borderline vulnerability." },
      { question: "Kohut's self psychology emphasizes which therapeutic stance?", optionA: "Neutrality and abstinence", optionB: "Sustained empathic attunement", optionC: "Active confrontation of defenses", optionD: "Behavioral exposure", correctAnswer: "B", explanation: "Kohut shifted from classical neutrality to empathic attunement (vicarious introspection) as both the technique and the mechanism of change." },
      { question: "Which is a mature defense in Vaillant's hierarchy?", optionA: "Splitting", optionB: "Reaction formation", optionC: "Sublimation", optionD: "Projection", correctAnswer: "C", explanation: "Sublimation (channeling impulses into socially valued activity) is mature. Splitting/projection are primitive; reaction formation is neurotic." },
      { question: "Object relations theory holds that the primary human motivation is:", optionA: "Drive discharge", optionB: "Self-actualization", optionC: "Object-seeking (relationship-seeking)", optionD: "Mastery and competence", correctAnswer: "C", explanation: "Object relations theorists (Klein, Fairbairn, Winnicott) reframed motivation from Freudian drive discharge to a fundamental need for relationship — 'the libido is object-seeking.'" },
      { question: "Kernberg's borderline personality organization is characterized by:", optionA: "Mature defenses and integrated identity", optionB: "Identity diffusion, primitive defenses, intact reality testing under non-stress", optionC: "Loss of reality testing", optionD: "Absence of any object relations", correctAnswer: "B", explanation: "Borderline organization (Kernberg) features identity diffusion, primitive defenses (especially splitting), but reality testing remains intact except under acute stress — distinguishing it from psychotic organization." },
      { question: "Malan's Triangle of Conflict consists of:", optionA: "Past, present, transference", optionB: "Id, ego, superego", optionC: "Impulse/feeling, anxiety, defense", optionD: "Mirroring, idealizing, twinship", correctAnswer: "C", explanation: "The Triangle of Conflict (impulse/feeling → anxiety → defense) is paired with the Triangle of Persons (current → past → transference) in Malan's STPP." },
      { question: "Projective identification differs from simple projection in that:", optionA: "It is a mature defense", optionB: "The recipient is induced to actually feel or enact the projected content", optionC: "It is conscious", optionD: "It involves only positive content", correctAnswer: "B", explanation: "Klein's projective identification is interpersonal — the projected content is communicated and the recipient is drawn into experiencing it. This is central to borderline transference and countertransference." },
      { question: "Contemporary relational psychoanalysis differs from classical psychoanalysis primarily in:", optionA: "Its emphasis on drive theory", optionB: "Its view of therapy as a two-person, intersubjective process", optionC: "Its rejection of unconscious processes", optionD: "Its focus on behavioral techniques", correctAnswer: "B", explanation: "Relational analysts (Mitchell, Benjamin, Aron) replaced the one-person 'blank screen' model with a two-person psychology in which both participants bring subjectivity and co-construct the analytic field." },
      { question: "The 'sleeper effect' in psychodynamic outcome research refers to:", optionA: "Improvement that emerges only after multiple years", optionB: "Continued growth of treatment gains after psychodynamic therapy ends", optionC: "Late-emerging side effects", optionD: "Delayed onset of transference", correctAnswer: "B", explanation: "Long-term follow-up studies (e.g., Leichsenring & Leibing, 2003) suggest that psychodynamic gains often continue to grow after termination — possibly reflecting internalized analytic functions.", examOnly: true },
      { question: "The 'good enough mother' (Winnicott) is best understood as:", optionA: "A perfect parent who meets every need", optionB: "A caregiver whose responsiveness gradually fails in tolerable, manageable ways that promote development", optionC: "A self-sacrificing parent", optionD: "An overly attuned parent who prevents frustration", correctAnswer: "B", explanation: "Winnicott's 'good enough mother' provides high attunement initially, then fails the infant in graduated, tolerable ways — analogous to Kohut's 'optimal frustration' enabling transmuting internalization.", examOnly: true },
      { question: "Which is a key feature of intensive short-term dynamic psychotherapy (ISTDP)?", optionA: "Slow, supportive exploration", optionB: "Active confrontation of defenses against feeling", optionC: "Rejection of transference work", optionD: "Use of homework assignments", correctAnswer: "B", explanation: "Davanloo's ISTDP uses active, sustained confrontation of defenses to access core emotion (rage, grief, guilt) believed to be the engine of change. Distinct from supportive dynamic approaches.", examOnly: true },
      { question: "The 'depressive position' (Klein) is characterized by:", optionA: "Severe depressive symptoms", optionB: "Splitting of objects into all-good and all-bad", optionC: "Capacity to integrate ambivalent feelings toward whole objects, with concern and guilt", optionD: "Loss of reality testing", correctAnswer: "C", explanation: "The depressive position is a developmental achievement (after the paranoid-schizoid position) — recognizing that the loved and hated object are the same, with capacity for ambivalence, concern, and reparation. Despite the name, it is healthier than paranoid-schizoid functioning.", examOnly: true },
      { question: "An 'enactment' in contemporary relational psychoanalysis is best described as:", optionA: "A countertransference error to be eliminated", optionB: "A moment when both patient and therapist unconsciously co-create a relational pattern from the patient's history", optionC: "A planned therapeutic role play", optionD: "A boundary violation", correctAnswer: "B", explanation: "Enactments are inevitable in two-person work — both parties unconsciously participate in recreating the patient's patterns. They are not failures but valuable clinical events to be recognized and worked through.", examOnly: true },
    ],
  },

  // ==================== TOPIC 3: JUNG ====================
  {
    name: "Analytical Psychology — Jung",
    description: "Carl Jung's analytical psychology — the personal and collective unconscious, archetypes, individuation, the Shadow, Anima/Animus, the Self, and Jungian techniques including active imagination and amplification.",
    guide: `## Overview

Carl Gustav Jung's analytical psychology (1875–1961) represents one of the most ambitious mappings of the human psyche. After breaking from Freud in 1913, Jung developed a framework centered on the collective unconscious, archetypes, individuation, and the teleological (future-oriented) dimension of psychological development.

## Core Assumptions

**Two layers of the unconscious**
- Personal unconscious — repressed personal material
- Collective unconscious — a deeper shared layer containing archetypes (universal, primordial patterns of experience)

**Libido**
- Not primarily sexual (departing from Freud) but a general psychic energy

**Teleology**
- The psyche is self-regulating and oriented toward wholeness and individuation
- Symptoms often contain prospective meaning, not just historical causation

## Theory of Change

**Individuation**
- The lifelong process of becoming a more complete, differentiated, integrated person
- Involves confronting and integrating the Shadow
- Achieving a relationship with the Self (the archetype of wholeness)

The therapist serves as a guide and "fellow traveler" rather than an interpreter from above.

## Key Techniques

**Active imagination**
- Engaging directly with unconscious figures and contents through inner dialogue, art, or movement
- A waking-state method for accessing unconscious material

**Amplification**
- Exploring personal associations to a symbol or dream image plus universal mythological/cultural parallels
- Distinct from Freudian free association, which moves outward from the image

**Dream analysis (Jungian)**
- Dreams have prospective meaning and are symbolically compensatory
- Not just disguised wish-fulfillment

**Other**
- Sandtray work
- Attention to synchronicity (meaningful coincidence)
- Analysis of the individuation journey

## The Major Archetypes

Universal, inherited patterns of psychic experience that appear across cultures in myth, religion, art, and dreams. Archetypes are not images but predispositions to form certain images and experiences.

**The Self**
- Archetype of wholeness, totality, the center of the total psyche (conscious + unconscious)
- Distinct from the ego (center of consciousness)
- Often symbolized by the mandala, circle, wise old man/woman
- The goal of individuation

**The Shadow**
- The personal and collective unconscious aspects the ego refuses to acknowledge
- Includes positive potential that has been denied, not just "the bad parts"
- Projected outward, produces scapegoating and prejudice
- Integrated, adds depth, creativity, and authenticity

**Anima / Animus**
- The contrasexual archetype
- Anima — feminine aspects of a man's psyche
- Animus — masculine aspects of a woman's psyche
- Often projected onto romantic partners

**The Persona**
- The social mask presented to the world
- Necessary for functioning, but identification with it produces a "persona personality" at the cost of genuine selfhood

**Other major archetypes**
- The Great Mother, the Hero, the Trickster, the Wise Old Man, the Child

## Psychological Types

Jung (1921) proposed two attitudinal types and four functions:

**Attitudes**
- Introversion (energy directed inward)
- Extraversion (energy directed outward)

**Functions**
- Thinking and Feeling (rational/judging)
- Sensing and Intuiting (irrational/perceiving)

The dominant function and attitude define conscious typology; the inferior function is least developed and most unconscious — often a source of vulnerability and projection. Jung's typology directly inspired the MBTI (which lacks empirical support as a psychometric instrument but remains widely used in non-clinical settings).

## Synchronicity

Meaningful coincidences — acausal connections between psychic events and external events that share meaning but lack causal connection. Jung viewed synchronicity as a principle complementary to causality, reflecting an underlying unus mundus.

**Critical consideration**
- Clinically, synchronicity should not be used to encourage magical thinking in patients prone to psychosis or ideas of reference

## Therapeutic Relationship

**The wounded healer**
- The analyst's own analyzed unconscious is the primary instrument
- Jung was among the first to require personal analysis of the analyst
- The relationship is more collegial and mutual than classical Freudian analysis

## Indications and Limitations

**Best indicated for**
- Existential and spiritual crises
- Mid-life transition and meaning-making
- Creativity and vocation questions
- Patients in the second half of life
- Dream-rich presenters

**Limitations**
- Limited RCT evidence; Jungian analysis is typically long-term and resists manualization
- Theoretical constructs difficult to operationalize
- Risk of escapism into myth at the expense of practical problem-solving
- The collective unconscious is not empirically testable`,
    flashcards: [
      { question: "What are the two layers of the unconscious in Jungian theory?", answer: "(1) Personal unconscious — repressed personal material (similar to Freud's unconscious); (2) Collective unconscious — a deeper layer shared across humanity, containing archetypes.", difficulty: "easy" },
      { question: "What is the Self in Jungian theory?", answer: "The archetype of wholeness and totality — the center of the total psyche (conscious + unconscious). Distinct from the ego (center of consciousness only). The Self is the goal of individuation, often symbolized by the mandala.", difficulty: "medium" },
      { question: "What is the Shadow?", answer: "The personal and collective unconscious aspects of the self that the ego refuses to acknowledge — including positive potential that has been denied, not just negative content. Projected outward, the Shadow produces scapegoating and prejudice.", difficulty: "medium" },
      { question: "What is individuation?", answer: "The lifelong process of becoming a more complete, differentiated, and integrated person by integrating unconscious contents into consciousness — particularly through confronting the Shadow and developing a relationship with the Self.", difficulty: "easy" },
      { question: "What is active imagination?", answer: "A Jungian technique of engaging unconscious figures and contents directly through inner dialogue, art, or movement in a waking state — creating a deliberate channel for unconscious material to enter consciousness.", difficulty: "medium" },
      { question: "What is amplification and how does it differ from Freudian free association?", answer: "Amplification explores personal associations to a symbol PLUS universal mythological and cultural parallels — moving outward to wider meaning. Free association tracks the patient's idiosyncratic chain of associations from the symbol.", difficulty: "hard" },
      { question: "What are the Anima and Animus?", answer: "Contrasexual archetypes: Anima = feminine aspects of a man's psyche; Animus = masculine aspects of a woman's psyche. They mediate between ego and the deeper unconscious and are often projected onto romantic partners.", difficulty: "medium" },
      { question: "What is the Persona?", answer: "The social mask — the face presented to the world. The Persona is necessary for social functioning, but identification with it at the expense of individuation produces a 'persona personality' disconnected from inner reality.", difficulty: "easy" },
      { question: "What did Jung mean by libido (in contrast to Freud)?", answer: "General psychic energy — not primarily sexual. This was a major theoretical break from Freud and contributed to their 1913 split.", difficulty: "medium" },
      { question: "What is synchronicity?", answer: "Jung's term for meaningful coincidence — an acausal connection between an internal psychic event and an external event that share meaning. Jung viewed it as a principle complementary to causality.", difficulty: "medium" },
      { question: "What are Jung's two attitudes and four functions?", answer: "Attitudes: introversion and extraversion. Functions: thinking, feeling, sensing, intuiting. The dominant attitude/function defines conscious typology; the inferior function is least developed and most unconscious.", difficulty: "hard" },
      { question: "What is the 'wounded healer' concept?", answer: "Jung's view that the analyst's own analyzed unconscious is the primary therapeutic instrument — and that the analyst's woundedness, when worked with, is the source of empathy and healing capacity. Jung was among the first to require analysts to undergo their own analysis.", difficulty: "medium" },
    ],
    questions: [
      { question: "Which is NOT one of Jung's major archetypes?", optionA: "The Shadow", optionB: "The Anima/Animus", optionC: "The Superego", optionD: "The Self", correctAnswer: "C", explanation: "The Superego is Freud's structural concept, not a Jungian archetype. Major Jungian archetypes include the Self, Shadow, Anima/Animus, Persona, Great Mother, Trickster, and Hero." },
      { question: "Individuation refers to:", optionA: "Becoming socially independent", optionB: "The lifelong process of integrating unconscious contents toward wholeness", optionC: "Diagnosing personality disorders", optionD: "Resolving the Oedipus complex", correctAnswer: "B", explanation: "Individuation is the central goal of Jungian therapy — the lifelong differentiation and integration of conscious and unconscious that brings one closer to the Self." },
      { question: "Active imagination is:", optionA: "Free association on the analyst's couch", optionB: "Behavioral imagery rehearsal", optionC: "A waking method of engaging unconscious figures through inner dialogue, art, or movement", optionD: "A relaxation technique", correctAnswer: "C", explanation: "Active imagination is Jung's deliberate, conscious engagement with unconscious imagery — a uniquely Jungian technique distinct from free association." },
      { question: "The Self in Jungian theory is:", optionA: "Identical to the ego", optionB: "The archetype of wholeness and the center of the total psyche", optionC: "The same as the persona", optionD: "Equivalent to Freud's superego", correctAnswer: "B", explanation: "The Self is the archetype of totality — encompassing both conscious and unconscious. The ego is only the center of consciousness." },
      { question: "Jung's view of dreams differs from Freud's primarily in:", optionA: "Rejecting the unconscious entirely", optionB: "Emphasizing prospective and compensatory meaning, not only disguised wish-fulfillment", optionC: "Believing dreams are random neural noise", optionD: "Using only manifest content", correctAnswer: "B", explanation: "Jung viewed dreams as having prospective (future-oriented) meaning and as compensating for the one-sidedness of conscious attitudes — distinct from Freud's wish-fulfillment model." },
      { question: "Which describes the Persona?", optionA: "A clinical disorder of identity", optionB: "The social mask presented to the world", optionC: "The contrasexual archetype", optionD: "The deepest unconscious archetype", correctAnswer: "B", explanation: "The Persona is the social mask. It is necessary for social functioning, but exclusive identification with the Persona blocks individuation." },
      { question: "Jung's theoretical break from Freud centered partly on:", optionA: "Whether the unconscious exists", optionB: "Whether libido is primarily sexual or a general psychic energy", optionC: "The use of free association", optionD: "Whether dreams have meaning", correctAnswer: "B", explanation: "Jung's broader concept of libido as general psychic energy (not primarily sexual) was a key theoretical disagreement contributing to the 1913 split." },
      { question: "Synchronicity, according to Jung, is:", optionA: "A causal sequence of events", optionB: "A meaningful but acausal coincidence between psychic and external events", optionC: "A type of transference", optionD: "A defense mechanism", correctAnswer: "B", explanation: "Synchronicity is Jung's term for acausal but meaningful coincidence — proposed as complementary to causality." },
      { question: "Integration of the Shadow involves:", optionA: "Acting out unconscious impulses", optionB: "Acknowledging and owning disowned aspects of the self, including positive potential", optionC: "Suppressing negative content", optionD: "Eliminating shadow material entirely", correctAnswer: "B", explanation: "Shadow integration is acknowledging — not enacting — disowned content. The Shadow includes positive denied potential, not just 'bad parts.'" },
      { question: "The MBTI is derived from which Jungian framework?", optionA: "The collective unconscious", optionB: "Jung's psychological types (attitudes and functions)", optionC: "Active imagination", optionD: "Synchronicity", correctAnswer: "B", explanation: "The MBTI was directly inspired by Jung's typology of attitudes (I/E) and functions (thinking, feeling, sensing, intuiting). The MBTI lacks robust psychometric support as an assessment instrument." },
      { question: "Jung's 'wounded healer' refers to:", optionA: "A therapist who has been physically injured", optionB: "The idea that the analyst's own analyzed wounds are the source of empathic and therapeutic capacity", optionC: "A patient who heals their own therapist", optionD: "A specific archetype of recovery", correctAnswer: "B", explanation: "The wounded healer is Jung's image of the therapist whose own depth work — including engagement with their own woundedness — becomes the therapeutic instrument.", examOnly: true },
      { question: "Amplification differs from free association in that:", optionA: "It requires hypnosis", optionB: "It moves outward to universal mythological and cultural parallels in addition to personal associations", optionC: "It bypasses the unconscious", optionD: "It is used only with dreams", correctAnswer: "B", explanation: "Amplification adds collective and mythological context to personal associations — opening the symbol to its archetypal dimensions, in contrast to the chain-of-personal-associations method of free association.", examOnly: true },
      { question: "Which presentation is most classically suited to Jungian work?", optionA: "Acute panic disorder requiring rapid symptom relief", optionB: "Mid-life crisis with questions of meaning and vocation", optionC: "Severe ADHD in childhood", optionD: "Acute psychosis", correctAnswer: "B", explanation: "Jung explicitly described his approach as best suited to the second half of life — meaning-making, individuation, and existential/spiritual concerns. Acute symptoms typically warrant more focused, evidence-based interventions.", examOnly: true },
      { question: "The collective unconscious is best described as:", optionA: "Shared cultural memory accessible by introspection", optionB: "A deeper layer of unconscious containing universal archetypal predispositions inherited across humanity", optionC: "The combined unconscious of a therapy group", optionD: "Suppressed societal trauma", correctAnswer: "B", explanation: "The collective unconscious contains archetypes — inherited predispositions to form certain images and experiences — distinguishing it from the personal unconscious, which contains individually repressed material.", examOnly: true },
      { question: "Synchronicity is clinically risky to emphasize with which patient?", optionA: "A patient working through grief", optionB: "A patient prone to psychotic ideas of reference", optionC: "A patient in mid-life transition", optionD: "A patient with creative vocation questions", correctAnswer: "B", explanation: "Highlighting meaningful coincidences can reinforce ideas of reference and magical thinking in patients with psychotic vulnerability — a key clinical caution.", examOnly: true },
    ],
  },

  // ==================== TOPIC 4: ADLERIAN, HUMANISTIC, EXISTENTIAL ====================
  {
    name: "Adlerian, Humanistic, and Existential Approaches",
    description: "Adlerian individual psychology, person-centered therapy (Rogers), existential therapy (Yalom), and logotherapy (Frankl) — approaches united by emphasis on subjectivity, growth, freedom, and meaning.",
    guide: `## Overview

Four philosophically related traditions emphasize subjective experience, growth, meaning, and the dignity of the person — challenging both psychoanalytic determinism and behavioral reductionism.

## Adlerian Individual Psychology

**Developer**
- Alfred Adler (1870–1937)

**Core assumptions**
- Humans are social, purposive, creative, and unified ("indivisible")
- Primary motivation: striving for superiority/perfection (mastery, completion)
- Inferiority feelings are universal; neurosis develops when they overwhelm
- Social interest (Gemeinschaftsgefühl — feeling of community) is the criterion of psychological health
- All behavior is purposeful and goal-directed

**Theory of change**
- The "4 Rs": Relationship, Assessment, Insight, Reorientation
- Encouragement is both stance and master technique

**Key techniques**
- Lifestyle analysis — birth order, early recollections, family atmosphere
- Early recollections analysis — earliest memories reflect current goals
- "The Question" — "How would your life be different if you didn't have this problem?"
- Acting "as if"
- Catching oneself
- Task-setting

**Lifestyle and the fictional final goal**
- Lifestyle is the unique pattern of beliefs/goals/strategies developed by age 4–5
- Fictional final goal: idealized image of completeness, usually unconscious

**Birth order tendencies (statistical, not deterministic)**
- Firstborn: may experience "dethronement" → controlling, achievement-oriented
- Second: competitive, ambitious
- Youngest: pampered → entitled or achieving
- Only: adult-oriented, may lack peer cooperation

## Person-Centered Therapy

**Developer**
- Carl Rogers (1902–1987)

**Core assumptions**
- Humans have an inherent actualizing tendency
- Distress arises when conditions of worth lead to denial/distortion of organismic experience
- Incongruence between real self (organismic experience) and ideal self (introjected conditions)
- The client is the expert on their own experience

**The three core conditions (necessary AND sufficient)**
- Congruence/genuineness — therapist is authentic, not playing a role
- Unconditional positive regard — warm, non-judgmental acceptance
- Accurate empathic understanding — reflecting back so precisely the client feels truly understood

**Theory of change**
- Providing the core conditions creates a climate in which the actualizing tendency resumes its course

**Goals**
- Greater congruence between self-concept and experience
- Reduced conditions of worth
- Self-trust and self-direction
- Openness to experience

**Evidence**
- Rogers pioneered empirical psychotherapy research (recording sessions in the 1940s)
- Elliott et al. (2013) meta-analysis: large pre-post effects (d = 0.99) for person-centered/experiential therapies

## Existential Therapy

**Developers**
- Binswanger, Boss (European); May, Yalom (American)
- Drawing on Kierkegaard, Heidegger, Sartre, Buber

**Yalom's four ultimate concerns**
- Death — inevitability of one's own death
- Freedom — burden of radical choice and responsibility
- Existential isolation — unbridgeable gap between self and others
- Meaninglessness — absence of inherent meaning in the universe

**Theory of change**
- Authentic engagement with existential givens — particularly death awareness — paradoxically increases aliveness and grounds authentic choice
- Awakening experiences (loss, diagnosis, transitions) can serve as catalysts
- The therapeutic relationship as I-Thou encounter (Buber)

**Key techniques**
- Exploration of the existential givens as they manifest in the client's life
- Phenomenological exploration (bracketing assumptions)
- Existential confrontation (e.g., death awareness exercises)
- Use of the relationship as authentic encounter

**Critical consideration**
- Confronting existential themes can overwhelm vulnerable clients; pacing and timing matter

## Logotherapy

**Developer**
- Viktor Frankl (1905–1997); crystallized during his Holocaust experience

**Core assumptions**
- Primary motivation is the will to meaning
- Existential frustration (inability to find meaning) and existential vacuum (pervasive emptiness) are root sources of suffering
- Even in unavoidable suffering, humans retain the freedom to choose their attitude

**Three avenues to meaning**
- Creative/productive values (work, contribution)
- Experiential values (love, beauty)
- Attitudinal values (stance toward unavoidable suffering)

**Key techniques**
- Paradoxical intention — prescribing the feared symptom (predates CBT symptom prescription)
- Dereflection — redirecting attention away from self-focus toward meaning (used for hyperreflection, performance anxiety)
- Socratic dialogue to uncover values

**Evidence**
- Breitbart's Meaning-Centered Psychotherapy (manualized adaptation for cancer patients) shows reduced demoralization and depression with strong RCT support`,
    flashcards: [
      { question: "What is Adler's term for social interest, and why is it clinically important?", answer: "Gemeinschaftsgefühl — feeling of community, concern for others. Adler considered it the criterion of psychological health; treatment aims to increase it.", difficulty: "medium" },
      { question: "What is Adler's 'Question' and what does it differentiate?", answer: "'How would your life be different if you didn't have this problem?' — used to differentiate functional (psychogenic) from organic/somatic symptoms. If the answer is 'nothing would change,' organic etiology is more likely.", difficulty: "hard" },
      { question: "What is the 'lifestyle' in Adlerian theory?", answer: "The individual's unique pattern of beliefs, goals, and strategies for moving through life — a cognitive-motivational schema developed by age 4–5 that shapes adult functioning.", difficulty: "medium" },
      { question: "Name Rogers' three core conditions.", answer: "(1) Congruence (genuineness — therapist is authentic, not playing a role); (2) Unconditional positive regard (warm, non-judgmental acceptance); (3) Accurate empathic understanding.", difficulty: "easy" },
      { question: "What does Rogers mean by 'conditions of worth'?", answer: "Internalized contingencies imposed by significant others ('I am lovable only if I succeed/please/perform') that lead the person to deny or distort organismic experience incongruent with the conditions — producing incongruence between real self and ideal self.", difficulty: "hard" },
      { question: "What did Rogers claim about the core conditions?", answer: "That they are NECESSARY AND SUFFICIENT for therapeutic change — a radical claim distinguishing person-centered theory from common factors and other models.", difficulty: "medium" },
      { question: "Name Yalom's four ultimate concerns.", answer: "Death, freedom (and responsibility), existential isolation, and meaninglessness.", difficulty: "easy" },
      { question: "What is Buber's I-Thou encounter and its therapeutic relevance?", answer: "An authentic, mutual encounter between two whole persons (vs. I-It, where the other is treated as object). Existential therapists use I-Thou as a model for the therapeutic relationship — presence as the primary therapeutic instrument.", difficulty: "medium" },
      { question: "What is paradoxical intention?", answer: "Frankl's technique of instructing the client to deliberately try to produce the feared symptom (e.g., 'try as hard as you can to blush/stutter'). Removes anticipatory anxiety because one cannot voluntarily produce an involuntary response. Predates CBT symptom prescription.", difficulty: "medium" },
      { question: "What is dereflection?", answer: "Frankl's technique of redirecting attention away from excessive self-focus (hyperreflection) toward meaning, values, or external focus. Used for performance anxiety and hyperreflection-driven symptoms.", difficulty: "hard" },
      { question: "Name Frankl's three avenues to meaning.", answer: "(1) Creative/productive values (work, contribution); (2) Experiential values (love, beauty, relationships); (3) Attitudinal values (the stance one takes toward unavoidable suffering).", difficulty: "medium" },
      { question: "What is the 'actualizing tendency' (Rogers)?", answer: "An inherent forward-moving drive in all organisms toward growth, fulfillment, and the realization of potential. Rogers viewed it as the engine of therapeutic change once incongruence is reduced.", difficulty: "easy" },
    ],
    questions: [
      { question: "Adler's master technique is:", optionA: "Free association", optionB: "Encouragement", optionC: "Disputation", optionD: "Empty chair work", correctAnswer: "B", explanation: "Encouragement — conveying genuine confidence in the client's abilities — is both Adler's relational stance and his primary technique." },
      { question: "Rogers' core conditions are:", optionA: "Congruence, unconditional positive regard, empathy", optionB: "Trust, hope, responsibility", optionC: "Insight, working through, transference", optionD: "Acceptance, mindfulness, defusion", correctAnswer: "A", explanation: "Rogers identified congruence (genuineness), unconditional positive regard, and accurate empathic understanding as the necessary and sufficient conditions for therapeutic change." },
      { question: "Yalom's four ultimate concerns are:", optionA: "Anxiety, depression, anger, shame", optionB: "Death, freedom, isolation, meaninglessness", optionC: "Love, work, play, prayer", optionD: "Trust, autonomy, initiative, industry", correctAnswer: "B", explanation: "Yalom's ultimate concerns are death, freedom (and responsibility), existential isolation, and meaninglessness — the existential givens that all humans confront." },
      { question: "Frankl's paradoxical intention works by:", optionA: "Increasing the patient's anxiety until habituation occurs", optionB: "Removing anticipatory anxiety through deliberately attempting the feared symptom", optionC: "Replacing the feared symptom with a substitute", optionD: "Distracting from the symptom", correctAnswer: "B", explanation: "Paradoxical intention removes the anticipatory anxiety that maintains the symptom — one cannot voluntarily produce an involuntary response. It predates and influenced CBT symptom prescription." },
      { question: "Adler's 'social interest' (Gemeinschaftsgefühl) is the criterion of:", optionA: "Diagnosis", optionB: "Psychological health", optionC: "Treatment intensity", optionD: "Forensic risk", correctAnswer: "B", explanation: "Adler proposed Gemeinschaftsgefühl — feeling of community/concern for others — as the marker of psychological health, with neurosis representing failure of social interest." },
      { question: "The actualizing tendency (Rogers) is:", optionA: "A learned motivation", optionB: "An inherent organismic drive toward growth and fulfillment", optionC: "A defense mechanism", optionD: "A diagnostic category", correctAnswer: "B", explanation: "The actualizing tendency is an inherent forward-moving drive that, once incongruence is reduced, drives natural growth — not a learned or defensive process." },
      { question: "Frankl's three avenues to meaning include all EXCEPT:", optionA: "Creative/productive values", optionB: "Experiential values", optionC: "Attitudinal values", optionD: "Material values", correctAnswer: "D", explanation: "Frankl's three avenues are creative (work), experiential (love, beauty), and attitudinal (stance toward unavoidable suffering). Material values are not part of his framework." },
      { question: "Buber's I-Thou encounter is contrasted with:", optionA: "I-Self", optionB: "I-It", optionC: "I-We", optionD: "I-Other", correctAnswer: "B", explanation: "I-Thou (mutual encounter between whole persons) is contrasted with I-It (treating the other as object/means). Existential therapy aims for I-Thou in the therapeutic relationship." },
      { question: "Rogers claimed that the core conditions are:", optionA: "Helpful but insufficient", optionB: "Necessary and sufficient for therapeutic change", optionC: "Useful only with mild presentations", optionD: "Required only at the start of therapy", correctAnswer: "B", explanation: "Rogers' radical claim was that the core conditions are necessary AND sufficient — distinguishing person-centered theory from common factors models that view them as necessary but not sufficient." },
      { question: "Adlerian lifestyle analysis examines:", optionA: "Sleep and exercise habits", optionB: "Birth order, early recollections, family atmosphere", optionC: "Diet and medication compliance", optionD: "Cognitive distortions", correctAnswer: "B", explanation: "Lifestyle analysis examines the developmental context shaping the client's lifestyle and fictional final goal — including birth order, early recollections, family atmosphere, and parenting style." },
      { question: "Dereflection (Frankl) is most useful for:", optionA: "Acute psychosis", optionB: "Hyperreflection and performance anxiety", optionC: "Substance use disorders", optionD: "Chronic pain", correctAnswer: "B", explanation: "Dereflection redirects attention away from excessive self-focus — particularly useful when the symptom is maintained by hyperreflection (sexual performance anxiety, sleep onset, public performance).", examOnly: true },
      { question: "Existential isolation, in Yalom's framework, refers to:", optionA: "Social loneliness", optionB: "The unbridgeable gap between self and others — the fundamental aloneness of conscious existence", optionC: "Avoidant personality", optionD: "Cultural marginalization", correctAnswer: "B", explanation: "Existential isolation is ontological — the inescapable separateness of conscious individuals — distinct from social loneliness, which can be remedied by company.", examOnly: true },
      { question: "The Adlerian 'fictional final goal' is:", optionA: "A diagnostic prediction", optionB: "An idealized, usually unconscious image of completeness that organizes the personality", optionC: "A therapy contract goal", optionD: "A coping mechanism", correctAnswer: "B", explanation: "The fictional final goal is the unconscious idealized image (e.g., 'I will be safe when I am perfect/admired/in control') around which the lifestyle is organized.", examOnly: true },
      { question: "Person-centered therapy is least likely to be sufficient as a sole intervention for:", optionA: "Adjustment difficulties", optionB: "Self-esteem concerns", optionC: "Acute OCD with severe rituals", optionD: "Identity exploration", correctAnswer: "C", explanation: "Acute OCD typically requires structured exposure with response prevention. Person-centered conditions are foundational but often insufficient alone for severe presentations requiring specific techniques.", examOnly: true },
      { question: "Frankl's concept of 'tragic optimism' refers to:", optionA: "Naive positivity in the face of suffering", optionB: "The capacity to find meaning, growth, and constructive action in the face of unavoidable suffering, guilt, and death", optionC: "Denial of negative experience", optionD: "Forced gratitude", correctAnswer: "B", explanation: "Tragic optimism is the existential stance Frankl developed in response to his Holocaust experience — meaning-making and constructive action remain possible even within tragedy, suffering, and death.", examOnly: true },
    ],
  },

  // ==================== TOPIC 5: GESTALT/EFT ====================
  {
    name: "Gestalt, Experiential, and Emotion-Focused Therapy",
    description: "Gestalt therapy (Perls) and emotion-focused therapy (Greenberg) — approaches privileging present-moment experience, emotional processing, and the body. Includes empty chair, two-chair, and EFT emotion categories.",
    guide: `## Overview

Gestalt therapy and its empirically validated descendant, emotion-focused therapy (EFT), share a commitment to immediate, present-moment experience as the primary focus of inquiry — privileging the here-and-now, the body, emotion, and the contact between organism and environment.

## Gestalt Therapy

**Developers**
- Fritz Perls (1893–1970), Laura Perls, Paul Goodman

**Core assumptions**
- Humans are whole, unified organisms
- Health = full contact with present experience
- The Gestalt is the meaningful figure that emerges from the ground of experience
- Distress reflects interruptions to contact — at the boundary between organism and environment

**Contact boundary disturbances**
- Confluence — no boundary; merger with the environment or other
- Introjection — swallowing whole; uncritically absorbing others' values
- Projection — disowning and attributing to others
- Retroflection — turning impulses back against the self
- Deflection — avoiding direct contact
- Desensitization — diminished awareness of sensation

**Theory of change — the paradoxical theory (Beisser, 1970)**
- Change occurs not when one tries to be different but when one becomes more fully what one is
- Awareness of present experience allows organismic self-regulation to resume

**Key techniques**
- Empty chair — dialoguing with an absent person or part of the self (the signature Gestalt intervention)
- Two-chair — externalizing an internal conflict; dialogue between parts (e.g., self-critic vs. experiencing self)
- Body awareness and tracking
- Working with dreams experientially — the client becomes each element
- Exaggeration — amplifying a gesture or expression to heighten awareness
- "Stay with that feeling"
- I-language — owning experience rather than disowning through "it" or "you"

**Therapeutic relationship**
- I-Thou contact (Buber)
- The therapist is authentic and present
- Quality of contact between therapist and client models healthy relating

**Best indicated for**
- Alexithymia and emotional avoidance
- Unfinished business with significant others
- Self-criticism and internal conflict
- Experiential avoidance

## Emotion-Focused Therapy (EFT for Individuals)

**Developers**
- Leslie Greenberg, Laura Rice, Robert Elliott

**Core assumptions**
- Emotions are the primary system of meaning-making and action readiness
- Distress reflects dysfunctional emotion schemes (learned affective-cognitive-motivational structures)
- Healthy emotional functioning requires both emotional awareness (access) and emotional regulation (not being overwhelmed)

**Theory of change — two pathways**
- Accessing adaptive emotions that have been blocked (e.g., adaptive anger underlying depression)
- Transforming maladaptive emotions by bringing them into contact with adaptive emotions ("emotion transforms emotion")
- Sequence: arriving (awareness) → leaving (regulation) → transforming (change)

**Four types of emotional response**
- Primary adaptive — direct, healthy responses (e.g., grief at loss); work = access and allow
- Primary maladaptive — learned conditioned responses (e.g., shame); work = transform with adaptive emotion
- Secondary reactive — responses to primary emotions (e.g., anger covering fear); work = explore what is underneath
- Instrumental — used to influence others; work = confront and explore function

**Key techniques**
- Two-chair dialogue for self-critical splits
- Empty chair for unfinished business with significant others
- Systematic evocative unfolding for puzzling emotional reactions
- Empathic exploration

**Goals**
- Increased emotional awareness and literacy
- Transformation of maladaptive emotion schemes
- Resolution of self-criticism and unfinished business
- Increased narrative coherence

**Evidence**
- Greenberg & Watson (1998) RCT: EFT superior to person-centered for depression at follow-up
- Elliott et al. (2013) meta-analysis: large effects across conditions
- Particularly effective for self-criticism, unresolved grief, interpersonal injury

**Critical consideration**
- Empty chair work can be activating; careful pacing prevents retraumatization`,
    flashcards: [
      { question: "What is the paradoxical theory of change (Beisser, 1970)?", answer: "Change occurs not when one tries to be different but when one becomes more fully what one is. Foundational to Gestalt and echoed across person-centered, ACT, and other acceptance-based approaches.", difficulty: "medium" },
      { question: "Name four contact boundary disturbances in Gestalt theory.", answer: "Confluence (merger), introjection (swallowing whole), projection (disowning to others), retroflection (turning against self), deflection (avoiding contact), and desensitization (numbing).", difficulty: "hard" },
      { question: "What is the empty chair technique used for?", answer: "Dialoguing with an absent person (often for unfinished business — grief, unresolved anger toward a parent) or with a part of the self. The signature Gestalt intervention; widely adopted across orientations.", difficulty: "easy" },
      { question: "What is the two-chair technique used for?", answer: "Externalizing an internal conflict (typically self-critic vs. experiencing self) onto two chairs and facilitating dialogue between the parts — used in both Gestalt and EFT for self-critical splits.", difficulty: "medium" },
      { question: "Name EFT's four types of emotional response.", answer: "(1) Primary adaptive — healthy direct responses; access and allow. (2) Primary maladaptive — learned conditioned (e.g., shame); transform. (3) Secondary reactive — covers primary (e.g., anger over fear); explore underneath. (4) Instrumental — used to influence others; confront the function.", difficulty: "hard" },
      { question: "What does 'emotion transforms emotion' mean in EFT?", answer: "Maladaptive emotions (e.g., shame, fear) are not changed by reasoning or suppression but by bringing them into contact with an adaptive emotion (e.g., adaptive anger, compassion, grief) — the new emotion transforms the old.", difficulty: "hard" },
      { question: "What is 'unfinished business' in Gestalt and EFT?", answer: "Incomplete emotional gestalts from past relationships (typically with significant others, living or deceased) that intrude on present awareness and maintain symptoms. Often addressed with empty chair work.", difficulty: "medium" },
      { question: "What is retroflection?", answer: "A contact boundary disturbance: turning back against the self what one originally wanted to do to or get from the environment (e.g., self-criticism instead of expressing anger; self-soothing instead of seeking comfort).", difficulty: "medium" },
      { question: "What does Gestalt mean by 'I-language'?", answer: "Owning experience by speaking in first person ('I feel anxious') rather than disowning through impersonal forms ('It's stressful') or projection ('You feel...'). A core technique for awareness and responsibility.", difficulty: "easy" },
      { question: "What is an emotion scheme in EFT?", answer: "A learned affective-cognitive-motivational structure that organizes emotional responses to particular cues. Maladaptive schemes (e.g., shame in response to vulnerability) are the targets of EFT change.", difficulty: "hard" },
      { question: "What is the EFT sequence of emotional processing?", answer: "Arriving (emotional awareness) → leaving (emotional regulation) → transforming (emotional change through accessing adaptive emotion or restructuring meaning).", difficulty: "medium" },
      { question: "For which presentation is EFT particularly well-supported?", answer: "Depression — especially with self-criticism — and unresolved interpersonal injury/grief. Greenberg & Watson (1998) RCT showed EFT superior to person-centered therapy for depression at follow-up.", difficulty: "medium" },
    ],
    questions: [
      { question: "The paradoxical theory of change (Beisser) holds that:", optionA: "Change requires sustained willpower against resistance", optionB: "Change occurs when one becomes more fully what one is", optionC: "Change requires symptom prescription", optionD: "Change is impossible without medication", correctAnswer: "B", explanation: "The paradoxical theory is foundational to Gestalt: deeper acceptance of what is — not effortful change — enables transformation." },
      { question: "Which is NOT a Gestalt contact boundary disturbance?", optionA: "Confluence", optionB: "Introjection", optionC: "Sublimation", optionD: "Retroflection", correctAnswer: "C", explanation: "Sublimation is a Freudian defense, not a Gestalt contact boundary disturbance. The Gestalt list includes confluence, introjection, projection, retroflection, deflection, desensitization." },
      { question: "Two-chair dialogue is most useful for:", optionA: "Exposure to feared situations", optionB: "Self-critical splits between parts of the self", optionC: "Cognitive restructuring", optionD: "Behavioral activation", correctAnswer: "B", explanation: "Two-chair work externalizes an internal conflict (e.g., harsh self-critic vs. experiencing self) for direct dialogue — meta-analyses show large effects for self-criticism." },
      { question: "Empty chair work is classically used for:", optionA: "Skill rehearsal", optionB: "Unfinished business with significant others", optionC: "Behavioral activation", optionD: "Diagnostic interviewing", correctAnswer: "B", explanation: "Empty chair allows dialogue with absent figures (deceased parents, ex-partners) for unfinished emotional business — often producing emotional resolution unavailable through verbal exploration alone." },
      { question: "In EFT, primary maladaptive emotion is best addressed by:", optionA: "Suppression", optionB: "Bringing it into contact with an adaptive emotion", optionC: "Cognitive disputation", optionD: "Behavioral exposure", correctAnswer: "B", explanation: "EFT's central principle: 'emotion transforms emotion.' Maladaptive shame, for example, is transformed by accessing adaptive anger or self-compassion." },
      { question: "Which describes secondary reactive emotion in EFT?", optionA: "An instrumental performance", optionB: "A direct healthy response to a current event", optionC: "An emotion covering an underlying primary emotion (e.g., anger over fear)", optionD: "A learned conditioned response", correctAnswer: "C", explanation: "Secondary reactive emotions cover or react to a more primary emotion. The clinical work is exploring what lies underneath." },
      { question: "Retroflection involves:", optionA: "Projecting onto others", optionB: "Turning impulses back against the self", optionC: "Merging with the environment", optionD: "Numbing sensation", correctAnswer: "B", explanation: "Retroflection turns against the self what one originally wanted to do to (or receive from) the environment — e.g., self-attack instead of expressing anger outward." },
      { question: "Which is a hallmark indication for EFT?", optionA: "Active psychosis", optionB: "Depression with prominent self-criticism and unresolved interpersonal injury", optionC: "Acute substance withdrawal", optionD: "Specific phobia", correctAnswer: "B", explanation: "EFT has its strongest evidence for depression with self-criticism and for unresolved relational injury — areas where chair work targets the emotional process directly." },
      { question: "Which of the following is the core mechanism of change in EFT?", optionA: "Cognitive restructuring", optionB: "Transformation of maladaptive emotion through contact with adaptive emotion", optionC: "Behavioral activation", optionD: "Insight into transference", correctAnswer: "B", explanation: "EFT operationalizes the Gestalt tradition into emotion-transformation as the core mechanism — distinct from cognitive change or behavioral change." },
      { question: "I-language in Gestalt promotes:", optionA: "Disowning of experience", optionB: "Projection", optionC: "Ownership of experience and increased responsibility", optionD: "Detachment", correctAnswer: "C", explanation: "Speaking in first person ('I feel') promotes owning experience; using 'it' or 'you' tends to disown or project the experience." },
      { question: "Confluence as a contact disturbance manifests as:", optionA: "Rigid emotional distance", optionB: "Loss of boundary, merger with the environment or other", optionC: "Internalized self-attack", optionD: "Avoidance of present-moment awareness", correctAnswer: "B", explanation: "Confluence is the absence of differentiation between self and environment/other — common in enmeshed relationships and in some dissociative states.", examOnly: true },
      { question: "Greenberg's EFT outcome research demonstrates:", optionA: "Equivalence with placebo", optionB: "Significant superiority over person-centered therapy for depression at follow-up", optionC: "Superiority over PE for PTSD", optionD: "No durable effects", correctAnswer: "B", explanation: "Greenberg & Watson (1998) and subsequent trials show EFT producing durable gains, often outperforming person-centered therapy for depression at follow-up — establishing EFT as an empirically supported humanistic treatment.", examOnly: true },
      { question: "Instrumental emotion in EFT refers to:", optionA: "An adaptive response to a current event", optionB: "Emotional expression used (often outside awareness) to influence others", optionC: "Emotion that arises from the body", optionD: "Emotion in response to mindfulness", correctAnswer: "B", explanation: "Instrumental emotions function to elicit a response from another (e.g., 'crocodile tears,' performative anger). The clinical work is to explore the function rather than process the emotion as primary.", examOnly: true },
      { question: "The 'systematic evocative unfolding' task in EFT is used for:", optionA: "Schema activation", optionB: "Puzzling or unexpected emotional reactions to specific events", optionC: "Skills training", optionD: "Relapse prevention", correctAnswer: "B", explanation: "Evocative unfolding is used when a client reports a reaction that does not fit the situation, walking through the moment in detail to access the implicit meaning structure that produced the response.", examOnly: true },
      { question: "Empty chair work is contraindicated or requires careful pacing in:", optionA: "Mild depression", optionB: "Clients with high dissociative vulnerability or unstable trauma", optionC: "Adjustment disorders", optionD: "Mid-life transitions", correctAnswer: "B", explanation: "Activating chair work can destabilize clients with high dissociative vulnerability or unprocessed acute trauma. Stabilization and resourcing should precede any expressive work.", examOnly: true },
    ],
  },

  // ==================== TOPIC 6: BEHAVIOR THERAPY ====================
  {
    name: "Behavior Therapy and Applied Behavior Analysis",
    description: "Classical and operant conditioning, systematic desensitization, exposure with response prevention (ERP), applied behavior analysis (ABA), and behavioral activation (BA).",
    guide: `## Overview

Behavior therapy emerged from applying learning theory — primarily classical and operant conditioning — to clinical problems. Its commitment to observable behavior, empirical validation, and systematic assessment distinguishes it from psychodynamic and humanistic traditions.

## Classical (Respondent) Conditioning

Pavlov demonstrated that a neutral stimulus (CS) repeatedly paired with an unconditioned stimulus (US) acquires the ability to elicit the conditioned response (CR).

**Key processes**
- Acquisition — CS-US pairings establish the CR; strongest when CS precedes US, contiguous, salient
- Extinction — repeated CS without US gradually reduces the CR
- Spontaneous recovery — CR temporarily reappears after rest (relevant to relapse)
- Stimulus generalization — CR elicited by similar stimuli
- Stimulus discrimination — CR specific to the CS
- Higher-order conditioning — a previously conditioned CS pairs with a new neutral stimulus

**Key historical demonstration**
- Watson's Little Albert (1920): a white rat (CS) paired with a loud noise (US) produced fear (CR) in an infant; fear generalized to other white furry objects — opening the door to behavior therapy

## Operant (Instrumental) Conditioning

Skinner, building on Thorndike's Law of Effect, showed that behavior is shaped by consequences.

**Reinforcement and punishment**
- Positive reinforcement — present a rewarding stimulus → behavior increases
- Negative reinforcement — remove an aversive stimulus → behavior increases (NOT punishment; common confusion)
- Positive punishment — present an aversive stimulus → behavior decreases
- Negative punishment — remove a rewarding stimulus → behavior decreases (e.g., time-out)
- Extinction (operant) — withhold reinforcement → behavior decreases (with a temporary extinction burst)

**Schedules of reinforcement**
- Fixed ratio (FR) — reinforcement after a fixed number of responses; high stable rates
- Variable ratio (VR) — reinforcement after a variable number; highest rates and most resistant to extinction (gambling, social media)
- Fixed interval (FI) — reinforcement for first response after fixed time; scalloped pattern
- Variable interval (VI) — first response after variable time; moderate stable rates

**Other operant concepts**
- Shaping — reinforcing successive approximations to a target behavior
- Chaining — linking a behavior sequence (forward or backward)

## Systematic Desensitization

**Developer**
- Joseph Wolpe

**Core assumption**
- Reciprocal inhibition — a response incompatible with anxiety (deep muscle relaxation) cannot coexist with it; pairing feared stimuli with relaxation extinguishes the anxiety CR

**Three components**
- Construction of an anxiety hierarchy (8–15 items rated 0–100 SUDs)
- Training in deep muscle relaxation (Jacobson PMR)
- Pairing each hierarchy item with relaxation, beginning with least distressing

**Status**
- Largely superseded by exposure therapy without relaxation; the active ingredient appears to be exposure, not the reciprocal inhibition

## Exposure Therapy and ERP

**Developers**
- Wolpe (in vivo); Meyer (ERP for OCD, 1966); Foa & Kozak (emotional processing theory, 1986); Craske (inhibitory learning, 2014)

**Core assumption**
- Fear is maintained by avoidance
- Exposure violates threat expectations and produces inhibitory learning — new safety memory that competes with the fear memory

**Key techniques**
- Construction of an exposure hierarchy
- Graduated exposure or flooding
- In-vivo, imaginal, or interoceptive exposure
- Response prevention (ERP) — refraining from compulsions during/after exposure
- Optimizing exposure: maximize threat expectancy violation, vary contexts, build self-efficacy

**Indications**
- OCD (ERP is first-line; among strongest evidence in clinical psychology, d ≈ 1.5–2.0)
- Specific phobia
- PTSD
- Panic disorder
- Social anxiety, agoraphobia, health anxiety

## Applied Behavior Analysis (ABA)

**Developers**
- Skinner (foundational); Baer/Wolf/Risley (1968); Lovaas (autism application)

**Core ideas**
- All behavior is shaped by environmental consequences
- The ABC model: Antecedent → Behavior → Consequence
- Functional behavior assessment (FBA) identifies the function of problem behavior (attention, escape, tangible, automatic/sensory) to design function-based interventions

**Key techniques**
- Discrete trial training (DTT)
- Natural environment training (NET)
- Functional communication training (FCT) — teaching a communicative replacement for problem behavior
- Differential reinforcement (DRO, DRI, DRA)
- Token economies
- Behavior intervention plans (BIP)

**Applications**
- Autism spectrum disorder (strongest evidence base; Lovaas 1987)
- Intellectual disability
- Brain injury rehabilitation
- Behavioral aspects of eating disorders, OCD, ADHD

**Critical consideration**
- Diversity of ABA approaches (discrete trial vs. naturalistic) and ongoing ethical discussion regarding historical practices

## Behavioral Activation (BA)

**Developers**
- Ferster, Lewinsohn, Martell/Addis/Jacobson

**Core assumption**
- Depression is maintained by behavioral withdrawal and avoidance — reduced positive reinforcement creates a downward spiral
- Behavioral change precedes mood change ("outside-in" model)

**Key techniques**
- Activity monitoring and scheduling
- Identifying avoided activities and their functions
- TRAP (Trigger → Response → Avoidance) and TRAC (Trigger → Response → Alternative Coping)
- Graded task assignment
- Behavioral experiments

**Evidence**
- Jacobson et al. (1996) component analysis: BA alone as effective as full CBT for depression
- Dimidjian et al. (2006): BA equivalent to antidepressants and superior to CT for severe depression
- Highly cost-effective; can be delivered by paraprofessionals`,
    flashcards: [
      { question: "What is negative reinforcement and how does it differ from punishment?", answer: "Negative reinforcement = removing an aversive stimulus following a behavior, which INCREASES the behavior (e.g., escape and avoidance learning). Punishment DECREASES behavior. The 'negative' refers to subtraction, not effect.", difficulty: "medium" },
      { question: "Which schedule of reinforcement produces the highest, most extinction-resistant response rates?", answer: "Variable ratio (VR) — reinforcement after an unpredictable number of responses. Underlies gambling and social media engagement.", difficulty: "easy" },
      { question: "What is reciprocal inhibition (Wolpe)?", answer: "A response incompatible with anxiety (such as deep muscle relaxation) cannot coexist with anxiety; pairing the feared stimulus with relaxation extinguishes the anxiety CR. The theoretical basis for systematic desensitization (largely superseded by inhibitory learning theory).", difficulty: "medium" },
      { question: "What is the inhibitory learning model of exposure (Craske)?", answer: "Exposure does not erase the original fear memory but creates a new safety memory that competes with and inhibits it. Optimal exposure maximizes violation of threat expectancy, varies contexts, and builds self-efficacy.", difficulty: "hard" },
      { question: "What is ERP and why is it the first-line treatment for OCD?", answer: "Exposure with Response Prevention — exposure to obsession-triggering cues while preventing the compulsive ritual that normally reduces anxiety. Effect sizes ~d = 1.5–2.0 vs. waitlist; among the strongest evidence in clinical psychology.", difficulty: "medium" },
      { question: "What is the ABC model in ABA?", answer: "Antecedent → Behavior → Consequence. The framework for behavioral analysis: identify what triggers the behavior and what consequence maintains it, then modify either side to change the behavior.", difficulty: "easy" },
      { question: "What is functional behavior assessment (FBA)?", answer: "Systematic identification of the function (purpose) a problem behavior serves — typically attention, escape, tangible, or automatic/sensory reinforcement. Function-based interventions then target the underlying purpose with adaptive replacement behaviors.", difficulty: "medium" },
      { question: "What is functional communication training (FCT)?", answer: "Teaching a communicative replacement (e.g., a sign, picture, or word) that produces the same reinforcer as the problem behavior — often used to replace self-injury or aggression with a functional communicative request.", difficulty: "medium" },
      { question: "What is the core premise of behavioral activation (BA) for depression?", answer: "Depression is maintained by behavioral avoidance and withdrawal that reduce contact with positive reinforcement. Action precedes motivation — engaging in valued activities disrupts the avoidance cycle and improves mood.", difficulty: "easy" },
      { question: "What did Jacobson et al. (1996) demonstrate about BA?", answer: "In a component analysis dismantling study, behavioral activation alone was as effective as full CBT for depression — challenging the necessity of cognitive components. Dimidjian et al. (2006) extended this to severe depression.", difficulty: "hard" },
      { question: "What is shaping?", answer: "Reinforcing successive approximations of a target behavior — used to establish behaviors not currently in the repertoire. Foundational to skill acquisition in ABA, animal training, and rehabilitation.", difficulty: "easy" },
      { question: "What is an 'extinction burst'?", answer: "A temporary increase in the frequency, intensity, or variability of a behavior immediately after reinforcement is withheld. Common in early behavioral intervention; often misinterpreted as treatment failure.", difficulty: "medium" },
    ],
    questions: [
      { question: "Which schedule produces the highest, most extinction-resistant response rate?", optionA: "Fixed ratio", optionB: "Variable ratio", optionC: "Fixed interval", optionD: "Variable interval", correctAnswer: "B", explanation: "Variable ratio (VR) — unpredictable reinforcement after a number of responses — produces the highest rates and the greatest resistance to extinction. Gambling and social media exploit this." },
      { question: "Negative reinforcement:", optionA: "Decreases behavior by adding an aversive stimulus", optionB: "Increases behavior by removing an aversive stimulus", optionC: "Decreases behavior by removing a positive stimulus", optionD: "Has no effect on behavior", correctAnswer: "B", explanation: "Negative reinforcement increases behavior through removal of an aversive stimulus (escape/avoidance). Often confused with punishment, which decreases behavior." },
      { question: "ERP for OCD primarily works by:", optionA: "Suppressing intrusive thoughts", optionB: "Preventing rituals so anxiety extinguishes and inhibitory learning occurs", optionC: "Replacing thoughts with positive ones", optionD: "Providing insight into the origins of obsessions", correctAnswer: "B", explanation: "Compulsive rituals are negatively reinforced by transient anxiety reduction. Preventing the ritual after exposure allows new safety learning that competes with the fear memory." },
      { question: "The active ingredient in systematic desensitization appears to be:", optionA: "Relaxation", optionB: "Hierarchy construction", optionC: "Exposure to the feared stimulus", optionD: "Cognitive restructuring", correctAnswer: "C", explanation: "Exposure therapy without relaxation achieves comparable or superior results, suggesting exposure is the necessary ingredient, not relaxation. Reciprocal inhibition has been largely replaced by inhibitory learning theory." },
      { question: "The ABC model in ABA stands for:", optionA: "Affect, Behavior, Cognition", optionB: "Antecedent, Behavior, Consequence", optionC: "Activating event, Belief, Consequence", optionD: "Acceptance, Behavior, Commitment", correctAnswer: "B", explanation: "ABA's ABC model is Antecedent-Behavior-Consequence. (Note: REBT's ABC is Activating event-Belief-Consequence — different framework.)" },
      { question: "Functional behavior assessment identifies:", optionA: "Diagnostic categories", optionB: "The function or purpose a problem behavior serves", optionC: "Cognitive distortions", optionD: "Family system dynamics", correctAnswer: "B", explanation: "FBA identifies the function of problem behavior — typically attention, escape, tangible, or automatic/sensory — to design function-based replacement interventions." },
      { question: "Behavioral activation for depression is based on the principle that:", optionA: "Cognitive change must precede behavioral change", optionB: "Action precedes motivation; engagement disrupts the avoidance cycle", optionC: "Insight is the engine of change", optionD: "Medication is required first", correctAnswer: "B", explanation: "BA reverses the depressed client's belief that motivation must come first. 'Outside-in' change: behavioral engagement with valued activities precedes and produces mood improvement." },
      { question: "Which technique reinforces successive approximations of a target behavior?", optionA: "Chaining", optionB: "Shaping", optionC: "Prompting", optionD: "Differential reinforcement", correctAnswer: "B", explanation: "Shaping reinforces increasingly close approximations of the target behavior — fundamental to skill acquisition in ABA and rehabilitation." },
      { question: "An extinction burst is:", optionA: "A type of reinforcement", optionB: "A temporary increase in behavior immediately after reinforcement is withdrawn", optionC: "A relapse", optionD: "A measurement error", correctAnswer: "B", explanation: "When reinforcement is suddenly withheld, the behavior often temporarily increases in frequency, intensity, or variability before decreasing. Caregivers must be prepared so they don't accidentally reinforce the burst." },
      { question: "For OCD, the strongest first-line behavioral treatment is:", optionA: "Systematic desensitization", optionB: "Behavioral activation", optionC: "Exposure with response prevention (ERP)", optionD: "Token economy", correctAnswer: "C", explanation: "ERP has effect sizes of ~d = 1.5–2.0 versus waitlist for OCD — among the strongest in all of clinical psychology. It is recommended as first-line with or without medication." },
      { question: "Higher-order conditioning is:", optionA: "Teaching complex motor skills through chaining", optionB: "Pairing a previously conditioned CS with a new neutral stimulus, establishing a second-order CR", optionC: "Reinforcement of multiple behaviors simultaneously", optionD: "Teaching abstract concepts", correctAnswer: "B", explanation: "Higher-order conditioning extends classical conditioning beyond direct CS-US pairings — important for understanding how complex fear networks develop in trauma and anxiety.", examOnly: true },
      { question: "The Jacobson (1996) component analysis of CBT for depression demonstrated that:", optionA: "Cognitive components account for most of CBT's effect", optionB: "Behavioral activation alone was as effective as full CBT", optionC: "Medication was superior to all psychotherapy", optionD: "Therapy was no better than placebo", correctAnswer: "B", explanation: "Jacobson et al. (1996) and Dimidjian et al. (2006) showed that BA alone matched or exceeded full CBT for depression — challenging the necessity of formal cognitive restructuring.", examOnly: true },
      { question: "Functional communication training (FCT) involves:", optionA: "Teaching speech to nonverbal individuals", optionB: "Replacing problem behavior with a communicative response that produces the same reinforcer", optionC: "Group skills training", optionD: "Cognitive remediation", correctAnswer: "B", explanation: "FCT uses FBA results to teach a functionally equivalent communicative replacement (sign, picture, word) that produces the same reinforcer as the problem behavior — often eliminating the problem behavior entirely.", examOnly: true },
      { question: "Inhibitory learning theory (Craske) holds that exposure works by:", optionA: "Erasing the original fear memory", optionB: "Creating new safety learning that inhibits but does not erase the fear memory", optionC: "Strengthening the fear", optionD: "Producing physical adaptation only", correctAnswer: "B", explanation: "Inhibitory learning theory replaced habituation models: the fear memory persists but is competed with by new safety learning. This explains spontaneous recovery and informs strategies (varied contexts, expectancy violation) to strengthen new learning.", examOnly: true },
      { question: "Differential reinforcement of incompatible behavior (DRI) involves:", optionA: "Punishing the target behavior", optionB: "Reinforcing a behavior that is physically incompatible with the problem behavior", optionC: "Reinforcing only at variable intervals", optionD: "Withholding all reinforcement", correctAnswer: "B", explanation: "DRI reinforces a behavior that cannot occur simultaneously with the problem behavior (e.g., reinforcing keeping hands in lap, which is incompatible with self-hitting). DRO reinforces the absence of the behavior; DRA reinforces an alternative behavior.", examOnly: true },
    ],
  },

  // ==================== TOPIC 7: COGNITIVE / CBT / SCHEMA ====================
  {
    name: "Cognitive Therapy, CBT, and Schema Therapy",
    description: "Beck's cognitive therapy and CBT, REBT (Ellis), and schema therapy (Young) — including cognitive distortions, the cognitive triad, the ABCDE model, and early maladaptive schemas.",
    guide: `## Overview

The cognitive revolution — initiated by Aaron Beck (1963) and Albert Ellis (1955) — shifted the therapeutic focus to the role of cognition in maintaining distress. CBT is now the most extensively researched and widely practiced psychotherapy in the world.

## Beck's Cognitive Therapy / CBT

**Developer**
- Aaron T. Beck (1921–2021); further developed by Judith Beck and others

**Core assumptions — the cognitive model**
- Thoughts mediate between events and emotional/behavioral responses
- Three levels of cognition
- Automatic thoughts — surface, spontaneous, fleeting
- Intermediate beliefs — rules, attitudes, conditional assumptions ("If X then Y")
- Core beliefs / schemas — fundamental beliefs about self, others, world

**Beck's cognitive triad of depression**
- Negative views of the self ("I am worthless")
- Negative views of the world ("Everything is unfair")
- Negative views of the future ("Nothing will improve")

**Theory of change**
- Identifying and evaluating dysfunctional cognitions through Socratic questioning and behavioral experiments
- Replacing distorted thoughts with more balanced, evidence-based alternatives

**Key techniques**
- Thought record (situation → emotion → automatic thought → evidence for/against → balanced thought → outcome)
- Socratic questioning / guided discovery
- Behavioral experiments — testing beliefs in vivo
- Activity scheduling and graded task assignment
- Downward arrow technique — uncovering core beliefs
- Problem-solving and relapse prevention

**Therapeutic stance**
- Collaborative empiricism — therapist and client work as a team examining evidence; cognitions treated as hypotheses

**Evidence**
- Among the most extensively researched psychotherapies
- Butler et al. (2006) meta-analysis: large effects for depression (d = 0.82), GAD (d = 1.01), social phobia, panic, PTSD, bulimia
- CBT shows durable effects; superior to medication in preventing depressive relapse

## Major Cognitive Distortions

Systematic errors in thinking that maintain emotional distress (Beck; expanded by Burns).

**The classical distortions**
- All-or-nothing (dichotomous) thinking
- Overgeneralization
- Mental filter — focusing exclusively on one negative detail
- Disqualifying the positive
- Mind reading
- Fortune telling
- Catastrophizing / magnification
- Emotional reasoning ("I feel it, therefore it's true")
- Should statements
- Labeling
- Personalization

## Rational Emotive Behavior Therapy (REBT)

**Developer**
- Albert Ellis (1913–2007)

**The ABC model**
- Activating event → Beliefs (rational vs. irrational) → Consequences (emotional/behavioral)
- It is not the event but the belief that causes emotional disturbance

**Irrational beliefs**
- Demandingness (musts, shoulds, oughts)
- Awfulizing
- Low frustration tolerance (LFT)
- Global self- or other-deprecation

**The ABCDE model**
- Add D — Disputation (empirical, logical, pragmatic)
- Add E — new Effective philosophy

**Key techniques and concepts**
- Active disputation of irrational beliefs
- Unconditional self-acceptance (USA), other-acceptance (UOA), life-acceptance (ULA)
- Shame-attacking exercises
- Rational emotive imagery
- Bibliotherapy and humor

**REBT vs. Beck's CT — key distinction**
- Ellis focused on philosophical change (changing the absolutist demandingness)
- Beck focused on empirical change (testing the evidence for specific automatic thoughts)
- Ellis used active confrontation; Beck preferred Socratic guided discovery

## Schema Therapy

**Developer**
- Jeffrey Young — building on Beck's CT

**Core assumptions**
- Early maladaptive schemas (EMS) are deeply held, unconditional beliefs about self and relationships
- Develop in childhood from unmet core emotional needs
- Maintained through schema perpetuation: avoidance, compensation, or surrender

**18 EMS organized into 5 schema domains**
- Disconnection/Rejection — abandonment, mistrust, emotional deprivation, defectiveness, social isolation
- Impaired Autonomy — dependence, vulnerability, enmeshment, failure
- Impaired Limits — entitlement, insufficient self-control
- Other-Directedness — subjugation, self-sacrifice, approval-seeking
- Overvigilance/Inhibition — negativity, emotional inhibition, unrelenting standards, punitiveness

**Schema modes**
- Healthy adult, vulnerable child, angry child, critic, coping modes (avoidant, surrendering, overcompensating)

**Key techniques**
- Schema assessment using a structured self-report worksheet
- Imagery rescripting — reworking traumatic memories to meet unmet childhood needs
- Mode work (chair dialogues between modes)
- Limited reparenting — therapist provides, within professional limits, what was missing in childhood
- Empathic confrontation
- Letter-writing to parents

**Evidence**
- Giesen-Bloo et al. (2006) RCT: schema therapy significantly superior to transference-focused psychotherapy for BPD at 3-year follow-up
- Multiple subsequent RCTs across personality disorders`,
    flashcards: [
      { question: "Name Beck's three levels of cognition.", answer: "(1) Automatic thoughts — surface, spontaneous, fleeting; (2) Intermediate beliefs — conditional rules and assumptions; (3) Core beliefs/schemas — deepest, fundamental beliefs about self, others, world.", difficulty: "easy" },
      { question: "What is Beck's cognitive triad of depression?", answer: "Negative views of (1) the self ('I am worthless'); (2) the world ('Everything is unfair'); (3) the future ('Nothing will improve'). These three interlocking beliefs maintain depressive thinking.", difficulty: "medium" },
      { question: "What is collaborative empiricism?", answer: "Beck's therapeutic stance: therapist and client work as a team examining evidence for and against the client's beliefs — treating cognitions as hypotheses to be tested, not facts to be accepted.", difficulty: "medium" },
      { question: "What is the downward arrow technique?", answer: "A CBT technique for uncovering core beliefs by repeatedly asking 'If that were true, what would it mean about you/others/the world?' until reaching the underlying core belief (e.g., 'I am unlovable,' 'I am defective').", difficulty: "medium" },
      { question: "What is the difference between Ellis's REBT and Beck's CT?", answer: "Ellis focused on philosophical change — disputing absolutist demandingness underlying beliefs. Beck focused on empirical change — testing the evidence for specific automatic thoughts. Ellis was active-confrontational; Beck used Socratic guided discovery.", difficulty: "hard" },
      { question: "What is the REBT ABCDE model?", answer: "Activating event → Beliefs (rational/irrational) → Consequences (emotional/behavioral) → Disputation of irrational beliefs (empirical, logical, pragmatic) → new Effective philosophy.", difficulty: "medium" },
      { question: "Name three primary categories of irrational belief in REBT.", answer: "(1) Demandingness ('musts/shoulds/oughts'); (2) Awfulizing/catastrophizing; (3) Low frustration tolerance (LFT); plus global self- or other-deprecation.", difficulty: "hard" },
      { question: "What is unconditional self-acceptance (USA) in REBT?", answer: "Accepting oneself as a fallible human being whose worth is not contingent on performance, others' approval, or specific qualities. The REBT alternative to conditional self-rating.", difficulty: "medium" },
      { question: "What is an early maladaptive schema (EMS) in schema therapy?", answer: "A deeply held, pervasive, unconditional belief and feeling about self and relationships, developed in childhood from unmet core emotional needs and maintained through schema perpetuation (avoidance, compensation, surrender).", difficulty: "medium" },
      { question: "Name the five schema domains in Young's framework.", answer: "(1) Disconnection/Rejection; (2) Impaired Autonomy; (3) Impaired Limits; (4) Other-Directedness; (5) Overvigilance/Inhibition.", difficulty: "hard" },
      { question: "What is 'limited reparenting' in schema therapy?", answer: "The therapist provides — within professional limits — the empathy, validation, safety, and nurturing the client did not receive in childhood. The most distinctive departure of schema therapy from standard CBT.", difficulty: "medium" },
      { question: "What is imagery rescripting?", answer: "A schema therapy technique in which traumatic childhood memories are revisited and reworked imaginally — the adult self (or therapist as protective figure) intervenes to meet the unmet need or stop the harm. Used for shame, abuse, and neglect-related schemas.", difficulty: "hard" },
    ],
    questions: [
      { question: "Beck's cognitive triad of depression includes negative views of:", optionA: "Self, others, future", optionB: "Self, world, future", optionC: "Self, body, others", optionD: "Past, present, future", correctAnswer: "B", explanation: "Beck's cognitive triad is negative views of the self, the world, and the future — three interlocking depressive beliefs that maintain the disorder." },
      { question: "Which is NOT one of Beck's three levels of cognition?", optionA: "Automatic thoughts", optionB: "Intermediate beliefs", optionC: "Core beliefs / schemas", optionD: "Unconscious wishes", correctAnswer: "D", explanation: "Beck's three levels are automatic thoughts (surface), intermediate beliefs (conditional rules), and core beliefs/schemas. Unconscious wishes are a psychoanalytic concept." },
      { question: "Which technique is used to uncover core beliefs underlying automatic thoughts?", optionA: "Free association", optionB: "Downward arrow", optionC: "Empty chair", optionD: "Active imagination", correctAnswer: "B", explanation: "The downward arrow technique repeatedly asks 'If that were true, what would it mean?' until the underlying core belief is reached." },
      { question: "REBT's ABC model adds D and E for:", optionA: "Diagnosis and Etiology", optionB: "Disputation and Effective new philosophy", optionC: "Discharge and Education", optionD: "Discrimination and Extinction", correctAnswer: "B", explanation: "The ABCDE model: Activating event → Beliefs → Consequences → Disputation → Effective new philosophy. D and E represent the change steps." },
      { question: "REBT's hallmark intervention is:", optionA: "Empathic reflection", optionB: "Active disputation of irrational beliefs", optionC: "Free association", optionD: "Behavioral activation", correctAnswer: "B", explanation: "Ellis used active, sometimes confrontational disputation of demandingness, awfulizing, and LFT — distinguishing REBT from Beck's Socratic guided discovery." },
      { question: "Which is the cognitive distortion 'I feel anxious, so something must be wrong'?", optionA: "Catastrophizing", optionB: "Mind reading", optionC: "Emotional reasoning", optionD: "Should statement", correctAnswer: "C", explanation: "Emotional reasoning treats feelings as evidence for facts about reality — 'I feel it, therefore it must be true.'" },
      { question: "Schema therapy's 'limited reparenting' refers to:", optionA: "Telling clients how to behave like adults", optionB: "Therapist providing — within professional limits — what the client's caregivers failed to provide", optionC: "Family therapy with parents", optionD: "Genogram work", correctAnswer: "B", explanation: "Limited reparenting is schema therapy's most distinctive departure from standard CBT — explicitly using the therapy relationship as a corrective developmental experience." },
      { question: "Which is NOT one of Young's five schema domains?", optionA: "Disconnection/Rejection", optionB: "Impaired Autonomy", optionC: "Cognitive Distortions", optionD: "Overvigilance/Inhibition", correctAnswer: "C", explanation: "Young's five domains are Disconnection/Rejection, Impaired Autonomy, Impaired Limits, Other-Directedness, Overvigilance/Inhibition. Cognitive distortions are a Beck/Burns concept, not a schema domain." },
      { question: "Beck's collaborative empiricism treats client cognitions as:", optionA: "Symptoms to be eliminated", optionB: "Hypotheses to be tested", optionC: "Truths to be accepted", optionD: "Defenses to be interpreted", correctAnswer: "B", explanation: "Collaborative empiricism — therapist and client work as a team to examine evidence for and against beliefs treated as hypotheses." },
      { question: "Imagery rescripting (schema therapy) involves:", optionA: "Visualizing future success", optionB: "Reworking traumatic childhood memories so the unmet need is met or harm is stopped", optionC: "Hypnotic age regression", optionD: "Dream interpretation", correctAnswer: "B", explanation: "Imagery rescripting accesses childhood memory imaginally and inserts an adult self or protective figure to meet the unmet need or stop the harm — particularly powerful for shame, abuse, and neglect schemas." },
      { question: "The key distinction between Ellis's REBT and Beck's CT is:", optionA: "Ellis emphasizes philosophical change (demandingness); Beck emphasizes empirical change (testing evidence)", optionB: "Ellis uses behavioral techniques; Beck does not", optionC: "Ellis treats only depression; Beck treats anxiety", optionD: "Ellis avoided homework", correctAnswer: "A", explanation: "Ellis targeted the absolutist 'musts' underlying beliefs (philosophical change) with active disputation. Beck targeted specific automatic thoughts with Socratic guided discovery and evidence-testing.", examOnly: true },
      { question: "Schema modes in schema therapy include all EXCEPT:", optionA: "Healthy adult", optionB: "Vulnerable child", optionC: "Cognitive distortions", optionD: "Detached protector", correctAnswer: "C", explanation: "Schema modes are dynamic states such as healthy adult, vulnerable child, angry child, critic modes (punitive, demanding), and coping modes (compliant surrenderer, detached protector, overcompensator). Cognitive distortions are surface thinking errors, not modes.", examOnly: true },
      { question: "Behavioral experiments in CBT are used to:", optionA: "Provide reinforcement", optionB: "Test the empirical accuracy of specific beliefs in real-world situations", optionC: "Practice relaxation", optionD: "Build the alliance", correctAnswer: "B", explanation: "Behavioral experiments operationalize collaborative empiricism — clients run real-world tests of their predictions ('If I speak up, people will mock me') to gather data that updates their beliefs.", examOnly: true },
      { question: "CBT shows particularly durable post-treatment effects in depression because:", optionA: "It produces complete remission", optionB: "It teaches skills (cognitive monitoring, behavioral experiments) that the client continues to use after treatment", optionC: "It is always combined with medication", optionD: "It works only for severe depression", correctAnswer: "B", explanation: "Skills acquisition produces lasting cognitive and behavioral change — explaining why CBT outperforms medication on relapse prevention even after treatment ends.", examOnly: true },
      { question: "Schema therapy was shown by Giesen-Bloo et al. (2006) to be superior to which comparator for BPD?", optionA: "DBT", optionB: "Treatment as usual", optionC: "Transference-focused psychotherapy (TFP)", optionD: "Medication", correctAnswer: "C", explanation: "The Giesen-Bloo (2006) RCT showed schema therapy significantly superior to transference-focused psychotherapy for BPD at 3-year follow-up — establishing schema therapy as a major evidence-based treatment for personality pathology.", examOnly: true },
    ],
  },

  // ==================== TOPIC 8: THIRD WAVE ====================
  {
    name: "Acceptance, Mindfulness, and Third-Wave Approaches",
    description: "DBT (Linehan), ACT (Hayes), MBCT (Segal/Williams/Teasdale), and CFT (Gilbert) — the third wave of CBT focused on the relationship to inner experience rather than its content.",
    guide: `## Overview

The "third wave" of CBT shifted the primary therapeutic target from changing the content of cognitions and feelings to changing the client's relationship to inner experience — through mindfulness, acceptance, defusion, and values-based action.

## Dialectical Behavior Therapy (DBT)

**Developer**
- Marsha Linehan (b. 1943)

**Biosocial theory of BPD**
- Borderline pathology arises from a transaction between biological emotional sensitivity/reactivity and an invalidating environment
- Emotional dysregulation is the core problem
- Self-harm and impulsive behaviors are attempts to regulate unbearable emotions

**The central dialectic**
- Acceptance (mindfulness, validation) AND change (CBT, problem-solving) — both required, neither alone sufficient

**The four skills modules**
- Mindfulness — the core skill (observe, describe, participate)
- Distress tolerance — TIPP, ACCEPTS, IMPROVE, pros/cons
- Emotion regulation — PLEASE, opposite action, checking the facts
- Interpersonal effectiveness — DEAR MAN, GIVE, FAST

**Standard DBT components**
- Individual therapy
- Skills training group
- Phone coaching for skill generalization
- Therapist consultation team

**Validation strategies**
- Six levels of validation (from listening attentively to treating the response as valid given context)

**Behavioral chain analysis**
- Detailed sequential analysis of problem behavior episodes

**Evidence**
- Multiple RCTs (Linehan 1991, 1999, 2006) show DBT superior to TAU for BPD on suicidality, NSSI, hospitalization
- Strongest evidence base for BPD of any treatment

## Acceptance and Commitment Therapy (ACT)

**Developer**
- Steven Hayes — based on Relational Frame Theory (RFT)

**Core idea**
- Suffering arises from psychological inflexibility — fusion with unhelpful thoughts, experiential avoidance, and acting against values
- Goal: psychological flexibility — contacting present experience and acting in service of values

**The Hexaflex (six core processes)**
- Acceptance (vs. experiential avoidance)
- Defusion (vs. cognitive fusion)
- Present moment (vs. dominance of past/future)
- Self-as-context (vs. attachment to conceptualized self)
- Values clarification
- Committed action

**Key techniques**
- Defusion exercises (leaves on a stream, naming the story, "I'm having the thought that...")
- Acceptance/expansion metaphors (beach ball, tug of war with monster)
- Values clarification (Tombstone exercise, bull's eye, valued life)
- Mindfulness exercises
- Committed action and willingness experiments
- Clean vs. dirty discomfort distinction

**Evidence**
- A-Tjak et al. (2015) meta-analysis: ACT superior to waitlist (d = 0.82) and equivalent to established treatments
- Particularly well-supported for chronic pain, depression, anxiety

**Slogan**
- "Feel what you feel, think what you think, and do what matters"

## Mindfulness-Based Cognitive Therapy (MBCT)

**Developers**
- Segal, Williams, Teasdale — building on Kabat-Zinn's MBSR

**Core assumption — differential activation hypothesis (Teasdale)**
- Depressive relapse is triggered by ruminative cognitive-affective processing reactivated by mild dysphoric mood
- Mindfulness disrupts ruminative processing through "decentering" — relating to thoughts as mental events, not facts

**Format**
- 8-week group program (2 hours/week)
- Body scan, sitting meditation, mindful movement/yoga
- Three-minute breathing space
- Mood awareness and early warning signs

**Primary indication**
- Prevention of depressive relapse in patients with 3+ prior episodes
- NOT primarily for acute depression

**Evidence**
- Teasdale et al. (2000), Segal et al. (2010): reduces depressive relapse ~50% in 3+ episode patients
- NICE guidelines recommend MBCT for recurrent depression

## Compassion-Focused Therapy (CFT)

**Developer**
- Paul Gilbert

**Three evolved emotion-regulation systems**
- Threat system — detect and respond to danger (anxiety, anger, disgust); fast, defensive
- Drive/seeking system — pursuit of resources and achievement; positive arousal
- Soothing/contentment system — safeness, affiliation, calm; activated by kindness and attachment

**Core idea**
- Many problems (especially shame-based) reflect overactive threat and underactive soothing systems
- Self-criticism activates the threat system
- Self-compassion activates the soothing system and builds resilience

**Definition of compassion**
- Sensitivity to suffering + commitment to alleviating it (applied to self or other)

**Key techniques**
- Compassionate mind training (CMT)
- Compassionate imagery — ideal compassionate figure; compassionate self
- Chair work with the self-critic
- Compassionate letter writing
- Soothing rhythm breathing
- Psychoeducation on the "tricky brain" — evolved threat system in modern complexity

**Best indicated for**
- Shame-based presentations
- Depression with high self-criticism
- Eating disorders, complex trauma, BPD, perfectionism

**Evidence**
- Leaviss & Uttley (2015) systematic review: significant reductions in self-criticism, shame, anxiety, depression
- Growing RCT base`,
    flashcards: [
      { question: "What is the central dialectic in DBT?", answer: "Acceptance and change. Pure change feels invalidating; pure acceptance fails to address suffering. The dialectical balance — validation + skills/problem-solving — is therapeutic.", difficulty: "easy" },
      { question: "What is Linehan's biosocial theory of BPD?", answer: "BPD arises from the transaction between biological emotional sensitivity/reactivity and a chronically invalidating environment, producing pervasive emotional dysregulation. This reframes BPD as a learned dysregulation problem rather than a character defect.", difficulty: "medium" },
      { question: "Name DBT's four skills modules.", answer: "(1) Mindfulness (the core skill); (2) Distress tolerance; (3) Emotion regulation; (4) Interpersonal effectiveness.", difficulty: "easy" },
      { question: "What does DEAR MAN stand for in DBT?", answer: "Describe, Express, Assert, Reinforce, (stay) Mindful, Appear confident, Negotiate. A DBT interpersonal effectiveness skill for asking for what you want or saying no.", difficulty: "hard" },
      { question: "What is the ACT Hexaflex?", answer: "Six core processes targeting psychological flexibility: Acceptance, Defusion, Present moment, Self-as-context, Values, Committed action.", difficulty: "medium" },
      { question: "What is cognitive defusion?", answer: "Changing the relationship to thoughts (treating them as mental events) rather than changing their content. Techniques: 'I'm having the thought that...,' leaves on a stream, naming the story.", difficulty: "medium" },
      { question: "What is psychological flexibility (ACT)?", answer: "The ability to contact the present moment as a conscious human being and to change or persist in behavior in service of chosen values — even in the presence of difficult thoughts and feelings.", difficulty: "medium" },
      { question: "What is the differential activation hypothesis (MBCT)?", answer: "Teasdale's account of depressive relapse: in previously depressed patients, mild dysphoric mood reactivates the depressogenic cognitive style (rumination, hopelessness), escalating to full relapse. Mindfulness disrupts this reactivation through decentering.", difficulty: "hard" },
      { question: "What is the primary evidence-based indication for MBCT?", answer: "Prevention of depressive relapse in patients with 3+ prior depressive episodes — reducing relapse by approximately 50% vs. TAU. Not primarily indicated for acute depression.", difficulty: "medium" },
      { question: "Name CFT's three evolved emotion-regulation systems.", answer: "(1) Threat system (anxiety, anger; fast, defensive); (2) Drive/seeking system (pursuit, achievement; positive arousal); (3) Soothing/contentment system (safeness, affiliation; activated by kindness and attachment).", difficulty: "hard" },
      { question: "What is Gilbert's definition of compassion?", answer: "Sensitivity to suffering (in self or others) combined with a commitment to alleviating it. Compassion is not the same as kindness or pity — it has both noticing and action components.", difficulty: "medium" },
      { question: "Why is self-criticism counterproductive according to CFT?", answer: "Self-criticism activates the threat system (cortisol, narrowed attention, rumination) — producing the opposite of what is needed for clear thinking, motivation, and resilience. Self-compassion activates the soothing system instead.", difficulty: "medium" },
    ],
    questions: [
      { question: "DBT's central dialectic is between:", optionA: "Past and future", optionB: "Acceptance and change", optionC: "Emotion and reason", optionD: "Therapist and client", correctAnswer: "B", explanation: "DBT integrates acceptance (validation, mindfulness) and change (CBT, problem-solving). Either alone is insufficient — both together are therapeutic." },
      { question: "Linehan's biosocial theory of BPD attributes the disorder to:", optionA: "Genetic causes alone", optionB: "Childhood trauma alone", optionC: "Transaction between biological emotional sensitivity and an invalidating environment", optionD: "Disordered attachment alone", correctAnswer: "C", explanation: "Biosocial theory: gene-environment interaction between biological reactivity/sensitivity and chronic invalidation produces pervasive emotional dysregulation — a learned, transactional account, not a character defect." },
      { question: "Which is NOT a DBT skills module?", optionA: "Mindfulness", optionB: "Distress tolerance", optionC: "Cognitive restructuring", optionD: "Interpersonal effectiveness", correctAnswer: "C", explanation: "DBT's four modules are mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness. Cognitive restructuring is a CBT (not specifically DBT) technique." },
      { question: "ACT's primary goal is:", optionA: "Symptom elimination", optionB: "Insight into the unconscious", optionC: "Psychological flexibility — values-based action even in the presence of difficult inner experience", optionD: "Behavioral activation only", correctAnswer: "C", explanation: "ACT explicitly targets psychological flexibility — the ability to act in service of values regardless of what thoughts/feelings are present — rather than symptom reduction." },
      { question: "Cognitive defusion in ACT involves:", optionA: "Disputing the content of thoughts", optionB: "Changing the relationship to thoughts so they are observed as mental events", optionC: "Suppressing thoughts", optionD: "Replacing thoughts with positives", correctAnswer: "B", explanation: "Defusion changes the relationship to thoughts (e.g., 'I'm having the thought that I'm a failure') rather than the content — distinct from CBT cognitive restructuring." },
      { question: "MBCT is primarily indicated for:", optionA: "Acute psychosis", optionB: "Acute first-episode depression", optionC: "Prevention of depressive relapse in patients with 3+ prior episodes", optionD: "Specific phobia", correctAnswer: "C", explanation: "MBCT's strongest evidence is for relapse prevention in recurrent depression. For acute depression, CBT or BA are typically preferred." },
      { question: "The Hexaflex includes all EXCEPT:", optionA: "Acceptance", optionB: "Defusion", optionC: "Cognitive restructuring", optionD: "Values", correctAnswer: "C", explanation: "The Hexaflex: Acceptance, Defusion, Present moment, Self-as-context, Values, Committed action. Cognitive restructuring is a second-wave (Beck) technique that ACT explicitly does not use." },
      { question: "CFT's three evolved emotion regulation systems are:", optionA: "Cognitive, affective, behavioral", optionB: "Threat, drive, soothing", optionC: "Sympathetic, parasympathetic, enteric", optionD: "Id, ego, superego", correctAnswer: "B", explanation: "Gilbert's CFT framework: threat (defensive), drive (achievement-seeking), and soothing (safeness/affiliation). Many problems reflect overactive threat and underactive soothing." },
      { question: "Self-criticism is counterproductive in CFT because:", optionA: "It is socially unacceptable", optionB: "It activates the threat system, producing cortisol and narrowed attention", optionC: "It reduces motivation by definition", optionD: "It is a form of laziness", correctAnswer: "B", explanation: "Self-criticism functions as an internal threat — activating cortisol, narrowed attention, and rumination, which impair the very capacities (clear thinking, motivation) it is intended to produce." },
      { question: "DBT phone coaching is provided primarily for:", optionA: "Crisis hotline services", optionB: "Skill generalization between sessions", optionC: "Diagnosis", optionD: "Medication management", correctAnswer: "B", explanation: "Phone coaching helps clients apply DBT skills in real-world moments. It is not crisis hotline work — it is brief, skills-focused coaching to generalize learning." },
      { question: "ACT is grounded in which behavioral science?", optionA: "Operant conditioning theory", optionB: "Relational Frame Theory (RFT)", optionC: "Polyvagal theory", optionD: "Attachment theory", correctAnswer: "B", explanation: "RFT is ACT's underlying behavioral science of human language and cognition — explaining how relational framing produces both human achievement and psychological suffering.", examOnly: true },
      { question: "The ACT 'self-as-context' refers to:", optionA: "Diagnostic conceptualization", optionB: "The observing self that notices thoughts and feelings without being defined by them", optionC: "The conceptualized self / self-narrative", optionD: "Cultural identity", correctAnswer: "B", explanation: "Self-as-context is the transcendent, observing perspective ('I am the one noticing my thoughts') — distinct from the conceptualized self ('I am a failure'). Defusion from the conceptualized self is therapeutic.", examOnly: true },
      { question: "Linehan's six levels of validation range from:", optionA: "Sympathy to advice-giving", optionB: "Listening attentively to treating the response as valid given the context and history", optionC: "Diagnosis to treatment planning", optionD: "Reflection to interpretation", correctAnswer: "B", explanation: "The six levels move from basic attention through accurate reflection, articulation of unstated emotions, validation by history, validation by current context, and treating the person as 'radically genuine.'", examOnly: true },
      { question: "MBCT's mechanism of action is best described as:", optionA: "Behavioral activation", optionB: "Decentering — disengaging from depressogenic thinking by relating to thoughts as mental events", optionC: "Suppression of negative thoughts", optionD: "Pharmacological augmentation", correctAnswer: "B", explanation: "Decentering disrupts the reactivation of depressogenic processing by mild dysphoric mood — preventing escalation to full relapse. This is distinct from cognitive restructuring or behavioral activation.", examOnly: true },
      { question: "Compassionate mind training (CMT) is most distinctively useful for clients with:", optionA: "Mild adjustment difficulties", optionB: "High shame and self-attacking", optionC: "Acute mania", optionD: "Specific phobia", correctAnswer: "B", explanation: "CFT/CMT is specifically designed for shame-based presentations and harsh self-criticism, where standard cognitive techniques can paradoxically intensify self-attack. Self-compassion activates the soothing system as a counter to threat.", examOnly: true },
    ],
  },

  // ==================== TOPIC 9: FAMILY/SYSTEMS/COUPLES ====================
  {
    name: "Family, Systems, and Couples Therapies",
    description: "Bowen family systems, structural therapy (Minuchin), strategic and Milan approaches, narrative therapy (White & Epston), and emotionally focused couples therapy (Sue Johnson).",
    guide: `## Overview

Systems approaches shifted the unit of analysis from the individual to the relational system — the family, couple, or social network — in which the presenting problem is embedded. This chapter covers the major systemic schools and couples approaches.

## Bowen Family Systems Theory

**Developer**
- Murray Bowen (1913–1990)

**Eight interlocking concepts**
- Differentiation of self — the cornerstone; capacity to maintain a clear self while remaining emotionally connected
- Triangles — the basic unit; anxious dyads triangle in a third
- Nuclear family emotional system
- Family projection process
- Multigenerational transmission process
- Emotional cutoff
- Sibling position
- Societal emotional process

**Theory of change**
- Increasing differentiation through "I position" statements rather than reactivity or fusion
- Working on the self within the family of origin

**Key techniques**
- Genogram — the signature multigenerational family map
- Coaching the individual on differentiation
- Identifying triangles and de-triangling
- "I position" work
- Reducing emotional reactivity

**Therapeutic stance**
- The therapist is a coach, not a participant in the emotional system
- Maintains own differentiation; avoids triangulation

**Solid self vs. pseudo-self**
- Solid self — non-negotiable, principled, not changed by relational pressure
- Pseudo-self — taken on from others to reduce anxiety; negotiated away under pressure

## Structural Family Therapy

**Developer**
- Salvador Minuchin (1921–2017)

**Core concepts**
- Family structure — the invisible rules governing relating
- Subsystems — spousal, parental, sibling
- Boundaries — clear, enmeshed, or disengaged
- Hierarchy, triangulation, detouring, parentification

**Theory of change**
- Restructuring dysfunctional family patterns changes individual symptoms
- The therapist joins the family, maps structure, and intervenes from within

**Key techniques**
- Joining — accommodating the family's style to gain trust and leadership
- Mapping family structure
- Enactment — having the family demonstrate their problem in session
- Boundary marking
- Reframing
- Unbalancing — temporarily taking sides to challenge dysfunctional hierarchy

**Indications**
- Child and adolescent presenting problems
- Eating disorders (especially adolescent anorexia — Minuchin's original work)
- Family enmeshment and disengagement

**Evidence**
- The Maudsley/Family-Based Treatment for adolescent anorexia (descended from structural work) is the most evidence-based treatment for adolescent AN

## Strategic and Milan Approaches

**Developers**
- Strategic: Jay Haley, Cloe Madanes
- Milan: Selvini Palazzoli, Boscolo, Cecchin, Prata

**Core idea**
- Symptoms are strategic — they serve a function in the family system (homeostasis, regulating closeness, protecting a fragile member)
- The therapist's task is to disrupt the symptom-maintaining sequence, not to produce insight

**Strategic techniques**
- Directives (straightforward and paradoxical)
- Symptom prescription
- Restraining (cautioning against change to reduce resistance)
- Reframing
- Ordeal therapy (Haley)

**Milan techniques**
- Hypothesizing
- Circular questioning — mapping differences in perception ("Who is most upset when X happens?")
- Neutrality — therapist takes no side
- Positive connotation — reframing symptoms as well-intentioned
- End-of-session ritual or message

**Cybernetic loop thinking**
- Problems are circular sequences of interaction, not linear causation

## Narrative Therapy

**Developers**
- Michael White (1948–2008) and David Epston

**Core ideas**
- People make sense of their lives through stories
- Dominant problem-saturated stories — often internalized from oppressive cultural discourses — subjugate alternative stories of competence
- The person is not the problem; the problem is the problem
- Identity is narratively constructed and open to re-authoring

**Key techniques**
- Externalization — naming the problem as separate from the person ("The Anxiety," "The Binge")
- Unique outcome questioning — finding exceptions to the problem story
- Re-authoring conversations — thickening the alternative story
- Witnessing practices (therapeutic letters, outsider witness groups)
- Definitional ceremonies

**Therapeutic stance**
- Curious, respectful, non-blaming, non-expert
- The person is the expert on their own life

**Best indicated for**
- Any presentation, especially where shame and self-blame are prominent
- Trauma, eating disorders, substance use
- Children and adolescents

## Emotionally Focused Couples Therapy (EFT-C)

**Developer**
- Sue Johnson (with Les Greenberg, 1985)

**Core assumption — attachment-based**
- Couple distress is fundamentally an attachment disruption
- Negative interactional cycles (pursue-withdraw, attack-defend) are driven by underlying attachment insecurity
- Attachment security — the conviction the partner will be accessible and responsive — is the foundation of healthy intimacy

**Three stages of change**
- Cycle de-escalation — identifying the negative cycle and underlying emotions
- Restructuring the bond — partners reach for and respond to attachment needs (softening events: withdrawer re-engages; pursuer expresses vulnerability)
- Consolidation — integrating new patterns

**Key techniques**
- Tracking and reflecting the interactional cycle
- Heightening emotional experience
- Empathic reflection of underlying attachment emotions
- Enactments — directing partners to share directly with each other
- Restructuring interactions to promote accessibility and responsiveness

**Evidence**
- Johnson et al. (1999) meta-analysis: d = 1.3 for relationship satisfaction
- 70–73% of couples move from distressed to non-distressed range
- Gains maintained at 2-year follow-up`,
    flashcards: [
      { question: "What is differentiation of self in Bowen theory?", answer: "The capacity to maintain a clear, well-defined sense of self while remaining in meaningful emotional contact with the family of origin. Two-dimensional: solid self (principled, non-negotiable) vs. pseudo-self (negotiated away under pressure).", difficulty: "medium" },
      { question: "What is a triangle in Bowen theory?", answer: "The basic unit of relational tension: when a two-person system becomes anxious, it triangles in a third party (a child, an in-law, an affair partner) to dilute the dyadic anxiety. De-triangling is a key intervention.", difficulty: "medium" },
      { question: "What is the genogram?", answer: "A multigenerational family map (typically three generations) showing relationships, key events, and emotional patterns. The signature Bowenian assessment tool — also widely used across systemic orientations.", difficulty: "easy" },
      { question: "What is enmeshment vs. disengagement in structural family therapy?", answer: "Enmeshment: overinvolvement, diffuse boundaries, suppressed individuation. Disengagement: rigid boundaries, emotional isolation, lack of involvement. Both reflect dysfunctional structure; healthy boundaries are clear and flexible.", difficulty: "medium" },
      { question: "What is 'joining' in structural family therapy?", answer: "Minuchin's term for the therapist's accommodation to the family's style, language, and pace to gain entry, trust, and leadership — a prerequisite to the structural interventions that follow.", difficulty: "easy" },
      { question: "What is enactment in structural therapy?", answer: "Having the family demonstrate their problem in session (e.g., asking the parents to discuss a discipline disagreement in front of the therapist) — providing direct observation of structure and an opportunity for live intervention.", difficulty: "medium" },
      { question: "What is circular questioning (Milan)?", answer: "Asking questions about differences in perception between family members (e.g., 'Who is most upset when Dad drinks? What does Mom do then?'). Maps relational patterns without confrontation and creates self-observation.", difficulty: "hard" },
      { question: "What is positive connotation (Milan)?", answer: "Reframing the symptomatic behavior as well-intentioned within the family system (e.g., 'Your child's behavior is protecting the family by drawing attention away from the marital tension'). Reduces resistance and reframes the system, not the individual.", difficulty: "hard" },
      { question: "What is externalization in narrative therapy?", answer: "Treating the problem as a separate entity from the person ('The Anxiety,' 'The Binge') rather than as an intrinsic property. 'The person is not the problem; the problem is the problem.' Liberates the person to take a stance against it.", difficulty: "medium" },
      { question: "What is a unique outcome (narrative therapy)?", answer: "An exception to the problem story — a moment when the problem could have been present but was not, or when the person resisted it. Forms the raw material for re-authoring a preferred narrative.", difficulty: "medium" },
      { question: "What are the three stages of change in EFT-C (Johnson)?", answer: "(1) Cycle de-escalation; (2) Restructuring the bond (softening events: withdrawer re-engages, pursuer expresses vulnerability); (3) Consolidation of new patterns.", difficulty: "medium" },
      { question: "What is the attachment basis of EFT-C?", answer: "Couple distress is fundamentally an attachment disruption. Negative interactional cycles (pursue-withdraw, attack-defend) are driven by underlying attachment insecurity and unmet needs for emotional safety, accessibility, and responsiveness.", difficulty: "medium" },
    ],
    questions: [
      { question: "Differentiation of self (Bowen) refers to:", optionA: "Achieving total emotional independence", optionB: "Maintaining a clear self while remaining emotionally connected", optionC: "Cutting off from family of origin", optionD: "Therapist's neutrality", correctAnswer: "B", explanation: "Differentiation balances autonomy and connection — high differentiation enables both genuine intimacy AND principled selfhood, not emotional isolation." },
      { question: "A 'triangle' in Bowen theory is:", optionA: "A diagnostic category", optionB: "A relational unit in which two-person anxiety is diluted by drawing in a third party", optionC: "A treatment plan", optionD: "A communication exercise", correctAnswer: "B", explanation: "Anxious dyads stabilize themselves by triangulating a third (child, in-law, affair). Identifying and de-triangling these patterns is core Bowenian work." },
      { question: "Structural family therapy was developed by:", optionA: "Murray Bowen", optionB: "Salvador Minuchin", optionC: "Jay Haley", optionD: "Michael White", correctAnswer: "B", explanation: "Minuchin developed structural family therapy in the 1960s, with influential work on adolescent anorexia and on minority families." },
      { question: "Enmeshment in structural therapy refers to:", optionA: "Healthy emotional closeness", optionB: "Diffuse boundaries with overinvolvement and suppressed individuation", optionC: "Rigid boundaries with emotional isolation", optionD: "Therapeutic alliance", correctAnswer: "B", explanation: "Enmeshment = diffuse boundaries with overinvolvement; disengagement = rigid boundaries with isolation. Both are dysfunctional structural patterns." },
      { question: "Milan circular questioning maps:", optionA: "The therapist's interpretations", optionB: "Differences in perception between family members about relationships and behavior", optionC: "Diagnostic symptoms", optionD: "Cognitive distortions", correctAnswer: "B", explanation: "Circular questioning ('Who is most upset when X? What does Y do then?') reveals systemic patterns without confronting any individual — generating systemic hypotheses." },
      { question: "Strategic family therapists may use 'symptom prescription' to:", optionA: "Encourage the symptom indefinitely", optionB: "Disrupt the involuntary nature of the symptom by making it voluntary", optionC: "Document baseline severity", optionD: "Replace medication", correctAnswer: "B", explanation: "Prescribing the symptom (a paradoxical directive) makes the involuntary voluntary, undermining the symptom's function and the family's reaction to it." },
      { question: "The narrative therapy slogan is:", optionA: "Insight is curative", optionB: "The person is not the problem; the problem is the problem", optionC: "Action precedes motivation", optionD: "Acceptance and change", correctAnswer: "B", explanation: "White and Epston externalize the problem from the person — opening space to take a stance against it rather than identifying with a problem identity." },
      { question: "EFT-C views couple distress as fundamentally:", optionA: "A communication skill deficit", optionB: "An attachment disruption with negative interactional cycles", optionC: "A power imbalance", optionD: "A cognitive distortion", correctAnswer: "B", explanation: "Sue Johnson's EFT-C reframes couple distress as attachment disruption — pursue-withdraw and attack-defend cycles driven by underlying attachment insecurity." },
      { question: "Which is a 'softening event' in EFT-C?", optionA: "The therapist offering reassurance", optionB: "The withdrawer re-engaging or the pursuer expressing vulnerability", optionC: "The couple agreeing to a contract", optionD: "Reducing session frequency", correctAnswer: "B", explanation: "Softening events are the key change moments in Stage 2 — when previously stuck partners reach toward each other emotionally, restructuring the bond." },
      { question: "Bowen's recommended therapeutic stance is:", optionA: "Active confrontation", optionB: "Coach who maintains personal differentiation and avoids being triangulated", optionC: "Empathic reflection", optionD: "Joining the family system", correctAnswer: "B", explanation: "The Bowenian therapist is a coach who works on the self — staying differentiated and out of the family's emotional triangles." },
      { question: "Maudsley/Family-Based Treatment for adolescent anorexia descends from which tradition?", optionA: "Bowenian", optionB: "Structural family therapy", optionC: "Narrative therapy", optionD: "Strategic", correctAnswer: "B", explanation: "FBT descends from Minuchin's structural work and is the most evidence-based treatment for adolescent AN, with parents temporarily taking charge of refeeding before returning autonomy.", examOnly: true },
      { question: "Positive connotation (Milan) reframes the symptom as:", optionA: "A character defect", optionB: "Well-intentioned within the family system", optionC: "Random and meaningless", optionD: "Genetically determined", correctAnswer: "B", explanation: "Positive connotation reframes symptomatic behavior as serving a positive function for the system (e.g., protecting the family) — reducing defensiveness and inviting systemic reflection.", examOnly: true },
      { question: "EFT-C effect sizes (Johnson) for relationship satisfaction are:", optionA: "Small (~d = 0.2)", optionB: "Among the largest in the couples literature (d ≈ 1.3)", optionC: "Equivalent to placebo", optionD: "Negative", correctAnswer: "B", explanation: "Johnson et al. (1999) meta-analysis showed d ≈ 1.3 — among the largest in couples therapy outcome research, with 70–73% moving from distressed to non-distressed range.", examOnly: true },
      { question: "A 'unique outcome' in narrative therapy is best described as:", optionA: "An unusual diagnostic feature", optionB: "An exception to the problem story — a moment when the problem could have been present but was not", optionC: "A cognitive distortion", optionD: "A treatment goal", correctAnswer: "B", explanation: "Unique outcomes (sparkling moments) provide the raw material for re-authoring a preferred narrative — the person's competence and resistance to the problem story.", examOnly: true },
      { question: "Pseudo-self (Bowen) is characterized by:", optionA: "Principled, non-negotiable beliefs", optionB: "Beliefs and positions taken on from others to reduce anxiety, negotiated away under pressure", optionC: "Healthy autonomy", optionD: "Conscious deception", correctAnswer: "B", explanation: "Pseudo-self is shaped by relational pressure rather than genuine reflection — abandoned under stress. Solid self holds firm under pressure. Differentiation work expands solid self.", examOnly: true },
    ],
  },

  // ==================== TOPIC 10: TRAUMA ====================
  {
    name: "Trauma-Focused Approaches",
    description: "Prolonged Exposure (Foa), Cognitive Processing Therapy (Resick), EMDR (Shapiro), TF-CBT (Cohen/Mannarino/Deblinger), and somatic approaches (Levine, Ogden).",
    guide: `## Overview

Trauma is among the most prevalent and impairing of human experiences — approximately 70% of people globally will experience at least one traumatic event. Trauma-focused psychotherapy has one of the strongest evidence bases in clinical psychology. All effective trauma therapies share a common feature: systematic engagement with trauma-related material rather than avoidance.

## Prolonged Exposure (PE)

**Developer**
- Edna Foa — based on Foa & Kozak's emotional processing theory (1986)

**Core assumption**
- PTSD is maintained by pathological fear structures activated by trauma-related stimuli, driving avoidance
- Activation + corrective information modifies the fear structure
- Inhibitory learning processes update the trauma memory

**Two procedures**
- In-vivo exposure — systematic, graduated approach to avoided but objectively safe trauma-related situations
- Imaginal exposure — prolonged, detailed narration of the trauma memory in the present tense (40–60 min) repeatedly across sessions, until within-session and between-session habituation occur

**Other components**
- Psychoeducation about PTSD and the rationale for exposure
- Breathing retraining
- Audio recordings of imaginal exposure for homework
- Post-imaginal processing discussion

**Evidence**
- Tier 1 recommendation across all international PTSD guidelines (VA/DoD, APA, ISTSS)
- Multiple RCTs with d = 1.0–1.5 vs. waitlist
- 80% of completers achieve clinically significant improvement

## Cognitive Processing Therapy (CPT)

**Developer**
- Patricia Resick

**Core assumption**
- PTSD is maintained by "stuck points" — maladaptive beliefs about the meaning of the trauma
- Assimilation — distorting the memory to fit pre-existing schemas ("It was my fault")
- Over-accommodation — changing prior beliefs too much ("I can never trust anyone")

**Five stuck point themes**
- Safety, Trust, Power/Control, Esteem, Intimacy

**Key techniques**
- Psychoeducation about PTSD and the cognitive model
- Impact statement — writing about the meaning of the trauma
- Written trauma account (in CPT-C; optional in CPT)
- ABC worksheets (situation-belief-consequence)
- Challenging questions worksheet
- Patterns of problematic thinking
- Final impact statement comparing pre- and post-treatment beliefs

**Evidence**
- Tier 1 recommendation alongside PE
- Resick et al. (2002, 2008) RCTs: large effects
- CPT ≈ PE in efficacy across most populations
- Effective in group and individual formats

## Eye Movement Desensitization and Reprocessing (EMDR)

**Developer**
- Francine Shapiro

**Core assumption — Adaptive Information Processing (AIP) model**
- Trauma memories are stored in isolation from adaptive memory networks, with their original emotions, body sensations, and beliefs
- EMDR processing integrates these isolated memories into adaptive memory networks
- The role of bilateral stimulation (eye movements, tapping, tones) is the subject of ongoing research — orienting response, working memory taxation, or REM-like processing

**Eight-phase protocol**
- History/treatment planning
- Preparation
- Assessment of the target memory
- Desensitization (with bilateral stimulation)
- Installation of positive cognition
- Body scan
- Closure
- Reevaluation

**Evidence**
- Tier 1 recommendation across PTSD guidelines
- Equivalent efficacy to PE/CPT in most comparisons
- Mechanism of bilateral stimulation remains debated

## Trauma-Focused CBT (TF-CBT)

**Developers**
- Judith Cohen, Anthony Mannarino, Esther Deblinger

**Core assumption**
- Childhood trauma requires treatment of both child and non-offending caregiver
- Trauma-related cognitions (self-blame, shame, distorted beliefs) must be directly addressed

**PRACTICE components**
- Psychoeducation
- Relaxation
- Affective modulation
- Cognitive coping
- Trauma narrative development and processing (the centerpiece exposure element)
- In-vivo mastery
- Conjoint child-parent sessions
- Enhancing safety

**Evidence**
- Multiple RCTs showing TF-CBT superior to child-centered therapy
- Cohen et al. (2004) pivotal RCT
- Disseminated through the National Child Traumatic Stress Network (NCTSN)

## Somatic Approaches: Somatic Experiencing and Sensorimotor Psychotherapy

**Developers**
- Peter Levine (SE); Pat Ogden (Sensorimotor)

**Core assumption**
- Trauma is fundamentally a physiological event — a dysregulated nervous system response (incomplete defensive actions) stored in the body
- Cognitive and exposure approaches may fail to address somatic aspects
- The body completes thwarted defensive responses through titrated, mindful attention to sensation

**Key techniques**
- SE: tracking bodily sensation (interoception), titration (small steps), pendulation (between activation and resource), resourcing, completion of defensive actions, working with the felt sense (Gendlin)
- Sensorimotor: mindfulness of body sensation, noticing impulses, exploring truncated defensive actions, two-phase treatment (stabilization first)

**Polyvagal theory framework (Porges)**
- Three hierarchical autonomic response modes
- Ventral vagal — social engagement, safety
- Sympathetic — mobilization, fight/flight
- Dorsal vagal — immobilization, freeze/collapse
- Trauma dysregulates these systems; somatic therapy aims to restore ventral vagal regulation

**Evidence**
- Growing evidence base, fewer RCTs than PE/CPT/EMDR
- Brom et al. (2017) RCT: SE superior to waitlist with large effects

## Critical Considerations

**All trauma-focused work**
- Stabilization (safety, regulation skills) precedes any expressive trauma processing in complex/dissociative presentations
- Suicidality, severe substance use, and acute safety concerns may require sequencing or adaptation
- The therapist's own trauma awareness and self-care are essential to this work`,
    flashcards: [
      { question: "What are the two main procedures in Prolonged Exposure (PE)?", answer: "(1) In-vivo exposure — systematic graduated approach to avoided but objectively safe trauma-related situations; (2) Imaginal exposure — prolonged (40–60 min), detailed, present-tense narration of the trauma memory, repeated until habituation within and between sessions.", difficulty: "easy" },
      { question: "What is the inhibitory learning model relevant to PE?", answer: "Exposure does not erase the original fear memory but creates new safety learning that competes with and inhibits it. Optimal exposure maximizes violation of threat expectancy, varies contexts, and builds self-efficacy.", difficulty: "medium" },
      { question: "What are 'stuck points' in CPT?", answer: "Maladaptive beliefs about the trauma and its meaning that maintain PTSD by blocking emotional processing. Two types: assimilated ('It was my fault') and over-accommodated ('I can never trust anyone').", difficulty: "medium" },
      { question: "Name CPT's five stuck point themes.", answer: "Safety, Trust, Power/Control, Esteem, Intimacy. Systematically addressed in the latter half of CPT.", difficulty: "hard" },
      { question: "What is the difference between assimilation and over-accommodation in CPT?", answer: "Assimilation: distorting the trauma memory to fit pre-existing schemas (e.g., 'It must have been my fault'). Over-accommodation: changing prior beliefs too far in response to the trauma (e.g., 'I can never trust anyone, anywhere').", difficulty: "hard" },
      { question: "What is the AIP model in EMDR?", answer: "Adaptive Information Processing — Shapiro's account that trauma memories are stored in isolation from adaptive memory networks (with original emotions, sensations, beliefs intact). EMDR processing integrates them into the adaptive network.", difficulty: "medium" },
      { question: "Name EMDR's eight phases.", answer: "(1) History; (2) Preparation; (3) Assessment of the target memory; (4) Desensitization; (5) Installation of positive cognition; (6) Body scan; (7) Closure; (8) Reevaluation.", difficulty: "hard" },
      { question: "What does the PRACTICE acronym stand for in TF-CBT?", answer: "Psychoeducation, Relaxation, Affective modulation, Cognitive coping, Trauma narrative, In-vivo mastery, Conjoint child-parent sessions, Enhancing safety.", difficulty: "hard" },
      { question: "Why is caregiver involvement essential in TF-CBT?", answer: "Children's trauma recovery is moderated by the non-offending caregiver's response. TF-CBT involves caregivers in parallel skill-building and conjoint sessions to support the child's emotional safety, validate the trauma narrative, and reinforce coping skills.", difficulty: "medium" },
      { question: "Name the three hierarchical autonomic response modes in Polyvagal theory (Porges).", answer: "(1) Ventral vagal — social engagement, safety; (2) Sympathetic — mobilization, fight/flight; (3) Dorsal vagal — immobilization, freeze/collapse. Trauma dysregulates these systems.", difficulty: "hard" },
      { question: "What is pendulation in Somatic Experiencing?", answer: "Alternating between activation (contact with trauma material/sensation) and resource (sense of safety in the body) — preventing flooding and allowing gradual completion of thwarted defensive responses.", difficulty: "medium" },
      { question: "Which trauma therapies are Tier 1 recommendations across international PTSD guidelines?", answer: "Prolonged Exposure (PE), Cognitive Processing Therapy (CPT), and EMDR. All have effect sizes in the d = 1.0+ range vs. waitlist; PE and CPT have the largest evidence base.", difficulty: "easy" },
    ],
    questions: [
      { question: "Imaginal exposure in PE is typically conducted in:", optionA: "A short summary form", optionB: "Past tense, third person", optionC: "Prolonged (40–60 min), present tense, detailed narration", optionD: "Group format only", correctAnswer: "C", explanation: "PE imaginal exposure uses prolonged, present-tense, detailed narration of the trauma memory — repeated across sessions until within-session and between-session habituation occur." },
      { question: "CPT 'stuck points' are best described as:", optionA: "Behavioral avoidance patterns", optionB: "Maladaptive beliefs about the meaning of the trauma", optionC: "Somatic symptoms", optionD: "Personality traits", correctAnswer: "B", explanation: "Stuck points are assimilated or over-accommodated beliefs about safety, trust, power/control, esteem, or intimacy that maintain PTSD by blocking processing." },
      { question: "Over-accommodation in CPT refers to:", optionA: "Distorting the memory to fit existing schemas", optionB: "Changing prior beliefs too far in response to the trauma", optionC: "Avoiding trauma cues", optionD: "Compliance with treatment", correctAnswer: "B", explanation: "Over-accommodation generalizes the trauma's meaning beyond its scope ('I can never trust anyone'). Assimilation distorts the memory to fit prior beliefs ('It was my fault'). Both are stuck points." },
      { question: "EMDR's AIP model proposes that trauma memories:", optionA: "Are unconscious wishes", optionB: "Are stored in isolation from adaptive memory networks with original emotions and beliefs intact", optionC: "Are entirely fabricated", optionD: "Cannot be processed verbally", correctAnswer: "B", explanation: "Adaptive Information Processing model: trauma memories are functionally isolated from adaptive networks; bilateral stimulation facilitates integration, though the mechanism remains debated." },
      { question: "TF-CBT's PRACTICE includes all EXCEPT:", optionA: "Trauma narrative", optionB: "Conjoint child-parent sessions", optionC: "Pharmacological treatment", optionD: "Psychoeducation", correctAnswer: "C", explanation: "PRACTICE = Psychoeducation, Relaxation, Affective modulation, Cognitive coping, Trauma narrative, In-vivo mastery, Conjoint child-parent sessions, Enhancing safety. Pharmacology is not part of the protocol." },
      { question: "Which is a Tier 1 evidence-based treatment for adult PTSD?", optionA: "Psychoanalysis", optionB: "Prolonged Exposure (PE)", optionC: "Person-centered therapy", optionD: "Bowenian therapy", correctAnswer: "B", explanation: "PE, CPT, and EMDR are Tier 1 recommendations across VA/DoD, APA, and ISTSS PTSD guidelines." },
      { question: "Polyvagal theory's three response modes are:", optionA: "Threat, drive, soothing", optionB: "Ventral vagal, sympathetic, dorsal vagal", optionC: "Mirror, idealize, twin", optionD: "Acceptance, change, dialectic", correctAnswer: "B", explanation: "Porges's polyvagal theory: ventral vagal (social engagement/safety), sympathetic (mobilization), dorsal vagal (immobilization/freeze). Trauma dysregulates these systems; somatic therapy aims to restore ventral vagal regulation." },
      { question: "Pendulation (Somatic Experiencing) refers to:", optionA: "Bilateral eye movements", optionB: "Alternating between trauma activation and a sense of safety in the body", optionC: "Hypnotic induction", optionD: "Deep muscle relaxation", correctAnswer: "B", explanation: "Pendulation alternates between contact with activating material and contact with internal/external resources — preventing overwhelm and allowing gradual completion of defensive responses." },
      { question: "TF-CBT requires:", optionA: "An adult-only group format", optionB: "A non-offending caregiver who is available and willing to participate", optionC: "Pharmacological augmentation", optionD: "Inpatient setting", correctAnswer: "B", explanation: "TF-CBT is designed for children with a non-offending caregiver who participates in parallel skill-building and conjoint sessions — this involvement is essential to outcomes." },
      { question: "Which is the centerpiece exposure element in TF-CBT?", optionA: "In-vivo exposure", optionB: "Imaginal exposure", optionC: "Trauma narrative development", optionD: "Bilateral stimulation", correctAnswer: "C", explanation: "The trauma narrative — sequential written or artistic account developed gradually with the child — is the exposure element of TF-CBT, distinct from PE's imaginal exposure." },
      { question: "Foa's emotional processing theory holds that PTSD treatment works by:", optionA: "Erasing the trauma memory", optionB: "Activating the fear structure and providing corrective information that updates it", optionC: "Suppressing trauma cues", optionD: "Producing pharmacological adaptation", correctAnswer: "B", explanation: "EPT (Foa & Kozak, 1986) proposed that activating the pathological fear structure plus providing corrective information (successful approach despite fear) modifies the structure. Inhibitory learning theory now extends this account.", examOnly: true },
      { question: "CPT vs. PE — when might CPT be preferred?", optionA: "When in-vivo phobic avoidance is severe", optionB: "When avoidance of the trauma narrative is too high to tolerate prolonged imaginal exposure", optionC: "When dissociation is mild", optionD: "When the trauma is recent", correctAnswer: "B", explanation: "Although CPT and PE have similar overall efficacy, CPT (especially without the written account) may be preferred when patients cannot tolerate the prolonged imaginal exposure of PE.", examOnly: true },
      { question: "The proposed mechanism of EMDR's bilateral stimulation includes all EXCEPT:", optionA: "Working memory taxation", optionB: "REM-like processing", optionC: "Erasure of the trauma memory", optionD: "Orienting response", correctAnswer: "C", explanation: "Proposed mechanisms include working memory taxation, REM-like processing, and orienting response. EMDR integrates the memory into adaptive networks rather than erasing it.", examOnly: true },
      { question: "In complex/dissociative trauma presentations, current best practice typically begins with:", optionA: "Immediate trauma exposure", optionB: "Stabilization — safety, regulation skills, resource-building — before expressive trauma processing", optionC: "Hypnotic age regression", optionD: "Group therapy", correctAnswer: "B", explanation: "The phase-oriented model (e.g., Herman, Cloitre) prioritizes stabilization (Phase 1: safety and skills) before expressive trauma work (Phase 2: processing) and integration (Phase 3) — particularly for complex/dissociative presentations.", examOnly: true },
      { question: "Which finding is consistent across PE, CPT, and EMDR?", optionA: "All require pharmacological adjuncts", optionB: "All involve some form of systematic engagement with trauma material rather than avoidance", optionC: "All require group format", optionD: "All produce equivalent effect sizes only at long-term follow-up", correctAnswer: "B", explanation: "Despite mechanistic differences, all three Tier 1 treatments share systematic engagement with trauma material — confirming that avoidance maintenance is the common therapeutic target.", examOnly: true },
    ],
  },
];

async function seedTopic(t: TopicData) {
  const [topic] = await db.insert(topicsTable).values({
    name: t.name,
    category: "Psychotherapy",
    description: t.description,
  }).returning();

  await db.insert(studyGuidesTable).values({
    topicId: topic.id,
    title: t.name,
    content: t.guide,
  });

  if (t.flashcards.length) {
    await db.insert(flashcardsTable).values(
      t.flashcards.map(f => ({ topicId: topic.id, ...f }))
    );
  }

  const insertedQs = await db.insert(quizQuestionsTable).values(
    t.questions.map(q => ({
      topicId: topic.id,
      question: q.question,
      optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      examOnly: q.examOnly ?? false,
    }))
  ).returning();

  const [exam] = await db.insert(practiceExamsTable).values({
    topicId: topic.id,
    title: `${t.name} — Practice Exam`,
    timeLimit: 1500,
    passingScore: 70,
  }).returning();

  await db.insert(practiceExamQuestionsTable).values(
    insertedQs.map((q, idx) => ({
      examId: exam.id,
      questionId: q.id,
      questionOrder: idx,
    }))
  );

  console.log(`  ✓ ${t.name} (id=${topic.id}): ${t.flashcards.length} flashcards, ${t.questions.length} questions`);
}

async function seed() {
  console.log(`Seeding ${topics.length} Psychotherapy topics...`);
  for (const t of topics) await seedTopic(t);
  console.log("Done.");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
