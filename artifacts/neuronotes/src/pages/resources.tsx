import { useMemo, useState } from "react";
import {
  ExternalLink,
  BookOpen,
  Stethoscope,
  Brain,
  Microscope,
  Scale,
  Pill,
  Library,
  GraduationCap,
  Search,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { STUDY_PALETTE } from "@/lib/study-theme";
import { PageTitle } from "@/components/brand/page-title";

type Resource = {
  name: string;
  url: string;
  description: string;
};

type Section = {
  title: string;
  icon: typeof BookOpen;
  blurb: string;
  resources: Resource[];
};

const SECTIONS: Section[] = [
  {
    title: "Diagnostic Classification Systems",
    icon: BookOpen,
    blurb: "Primary diagnostic frameworks referenced throughout the psychiatric and neurocognitive disorders content.",
    resources: [
      {
        name: "DSM-5-TR (American Psychiatric Association)",
        url: "https://www.psychiatry.org/psychiatrists/practice/dsm",
        description: "Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision — primary source for psychiatric diagnostic criteria, specifiers, and severity ratings.",
      },
      {
        name: "ICD-11 (World Health Organization)",
        url: "https://icd.who.int/en",
        description: "International Classification of Diseases, 11th Revision — international diagnostic standard, including the Mental, Behavioural and Neurodevelopmental Disorders chapter.",
      },
      {
        name: "RDoC — Research Domain Criteria (NIMH)",
        url: "https://www.nimh.nih.gov/research/research-funded-by-nimh/rdoc",
        description: "Transdiagnostic research framework organizing psychopathology around neural circuits and behavioral domains rather than DSM categories.",
      },
    ],
  },
  {
    title: "Professional Practice & Ethics",
    icon: Scale,
    blurb: "Ethical guidelines and professional standards referenced in clinical practice content.",
    resources: [
      {
        name: "APA Ethics Code",
        url: "https://www.apa.org/ethics/code",
        description: "American Psychological Association Ethical Principles of Psychologists and Code of Conduct — including Standard 9 on assessment.",
      },
      {
        name: "AACN — American Academy of Clinical Neuropsychology",
        url: "https://theaacn.org/",
        description: "Professional organization for clinical neuropsychologists; practice guidelines and position papers on assessment standards.",
      },
      {
        name: "INS — International Neuropsychological Society",
        url: "https://www.the-ins.org/",
        description: "International scientific society for the study of brain–behavior relationships; conferences and Journal of the International Neuropsychological Society.",
      },
    ],
  },
  {
    title: "Neuroscience & Neuroanatomy",
    icon: Brain,
    blurb: "Foundational neuroscience and neuroanatomy resources behind the central, peripheral, and enteric nervous system content.",
    resources: [
      {
        name: "NINDS — National Institute of Neurological Disorders and Stroke",
        url: "https://www.ninds.nih.gov/",
        description: "NIH institute focused on neurological disease research; disorder fact sheets, clinical trial information, and brain basics.",
      },
      {
        name: "Society for Neuroscience",
        url: "https://www.sfn.org/",
        description: "Largest professional society for neuroscientists worldwide; publishes JNeurosci and eNeuro.",
      },
      {
        name: "BrainFacts.org",
        url: "https://www.brainfacts.org/",
        description: "Public-information initiative from the Society for Neuroscience covering neuroanatomy, brain function, and disorders.",
      },
      {
        name: "Human Connectome Project",
        url: "https://www.humanconnectome.org/",
        description: "Open neuroimaging dataset and atlas of structural and functional brain networks — referenced in brain networks and connectivity content.",
      },
    ],
  },
  {
    title: "Mental Health & Clinical Resources",
    icon: Stethoscope,
    blurb: "Clinical reference materials for psychiatric disorders, treatments, and patient resources.",
    resources: [
      {
        name: "NIMH — National Institute of Mental Health",
        url: "https://www.nimh.nih.gov/health/topics",
        description: "Comprehensive disorder summaries, statistics, treatment options, and clinical research updates from the lead U.S. mental health research agency.",
      },
      {
        name: "SAMHSA — Substance Abuse and Mental Health Services Administration",
        url: "https://www.samhsa.gov/",
        description: "Federal agency for behavioral health; treatment locator, disorder resources, and the 988 Suicide & Crisis Lifeline.",
      },
      {
        name: "988 Suicide & Crisis Lifeline",
        url: "https://988lifeline.org/",
        description: "Free, confidential 24/7 crisis support — call or text 988 in the United States.",
      },
      {
        name: "PsychDB",
        url: "https://www.psychdb.com/",
        description: "Open-access clinical reference for residents — diagnostic criteria, treatment frameworks, and pharmacology summaries.",
      },
    ],
  },
  {
    title: "Pharmacology & Drug References",
    icon: Pill,
    blurb: "Authoritative drug labeling and pharmacology references for psychotropic medications discussed in the treatment sections.",
    resources: [
      {
        name: "DailyMed (NIH/NLM)",
        url: "https://dailymed.nlm.nih.gov/dailymed/",
        description: "FDA-approved drug labeling database — current package inserts, indications, dosing, warnings, and drug interactions.",
      },
      {
        name: "MedlinePlus Drugs & Supplements",
        url: "https://medlineplus.gov/druginformation.html",
        description: "Patient-facing drug information from the National Library of Medicine.",
      },
      {
        name: "Stahl's Essential Psychopharmacology (reference)",
        url: "https://www.cambridge.org/core/books/stahls-essential-psychopharmacology/",
        description: "Cambridge's landing page for Stephen Stahl's reference work — the standard textbook for clinical psychopharmacology mechanisms.",
      },
    ],
  },
  {
    title: "Board & Licensure Exams",
    icon: GraduationCap,
    blurb: "Information on the major credentialing exams that PsychPro content supports.",
    resources: [
      {
        name: "EPPP (ASPPB)",
        url: "https://www.asppb.net/page/EPPP_1_About",
        description: "Examination for Professional Practice in Psychology — required for licensure as a psychologist in most US/Canadian jurisdictions.",
      },
      {
        name: "ABPN — Psychiatry Certification",
        url: "https://www.abpn.com/become-certified/taking-a-subspecialty-exam/psychiatry/",
        description: "American Board of Psychiatry and Neurology certification information for psychiatrists.",
      },
      {
        name: "ABCN — Clinical Neuropsychology",
        url: "https://abcn.theabpp.org/",
        description: "American Board of Clinical Neuropsychology — credentialing pathway for board certification in clinical neuropsychology.",
      },
    ],
  },
  {
    title: "Research & Evidence Base",
    icon: Microscope,
    blurb: "Primary research databases for verifying citations and exploring the evidence base behind any topic.",
    resources: [
      {
        name: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/",
        description: "Free biomedical literature database from the U.S. National Library of Medicine — over 36 million citations.",
      },
      {
        name: "Cochrane Library",
        url: "https://www.cochranelibrary.com/",
        description: "Systematic reviews and meta-analyses of healthcare interventions — gold standard for evidence-based medicine.",
      },
      {
        name: "Google Scholar",
        url: "https://scholar.google.com/",
        description: "Free academic search engine spanning peer-reviewed articles, theses, books, and conference proceedings.",
      },
      {
        name: "PsycINFO (APA)",
        url: "https://www.apa.org/pubs/databases/psycinfo",
        description: "APA's flagship abstracting database covering peer-reviewed literature in psychology and behavioral sciences.",
      },
    ],
  },
];

export default function ResourcesPage() {
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS
      .map(s => ({
        ...s,
        resources: s.resources.filter(
          r =>
            r.name.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q),
        ),
      }))
      .filter(s => s.resources.length > 0);
  }, [query]);

  return (
    <div className="min-h-full study-page-bg" data-testid="resources-page">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <PageTitle
        title="Resources & References"
        icon={Library}
        subtitle="The primary sources, clinical frameworks, and research databases that inform PsychPro's study content. All links open in a new tab."
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-resources"
        />
      </div>

      {filteredSections.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-sm text-muted-foreground" data-testid="resources-empty">
          No resources match "{query}".
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.title} data-testid={`section-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground">{section.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{section.blurb}</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {section.resources.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all"
                      data-testid={`resource-link-${r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {r.name}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {r.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div
        className="mt-10 p-5 bg-card border border-border rounded-xl flex gap-3"
        style={{ borderLeft: `3px solid ${STUDY_PALETTE.tealDeep}` }}
      >
        <Info
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: STUDY_PALETTE.tealDeep }}
        />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">A note on scope.</span> PsychPro's content is built from publicly available diagnostic frameworks, peer-reviewed neuroscience, and clinical practice references. It is intended as an educational study aid for students and clinicians — not a substitute for clinical judgment, supervision, or the original source materials. Always consult primary sources and current guidelines for clinical decision-making.
        </p>
      </div>
      </div>
    </div>
  );
}
