import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

const ANCHOR = `fMRI: underactivation of left temporoparietal circuits; compensatory overactivation of frontal (Broca's) and right-hemisphere regions.`;

const ADDITION = `

### Major Types of Dyslexia

#### Phonological Dyslexia (Most Common)
The core deficit is **phonological processing** — the sound structure of language. Children show weak phonemic awareness (blending, segmenting), difficulty mapping letters to sounds, impaired decoding of unfamiliar words, and reliance on memorization rather than rules.

Reading is slow and effortful, with poor decoding of nonwords (e.g., "lat," "mip") and frequent phonetic errors (e.g., "ship" → "sip"). Neurally, there is **left temporoparietal dysfunction** in the phonological network and reduced activation in inferior frontal and posterior regions. Functionally, children show early reading delays, struggle with phonics-based instruction, and tend to avoid reading-intensive tasks.

#### Surface Dyslexia (Orthographic Dyslexia)
The core deficit is **orthographic processing** — visual word recognition. Children have difficulty storing and retrieving whole-word representations, weak sight-word recognition, and over-rely on phonological decoding.

Reading shows particular difficulty with irregular words (e.g., "yacht," "colonel") and **regularization errors** (e.g., "pint" pronounced like "mint"). Reading is slow despite intact decoding. The neural correlate is the left occipitotemporal region, particularly the **Visual Word Form Area**. Functionally, fluency is reduced, spelling of irregular words is a major challenge, and reading remains labor-intensive even with age.

#### Rapid Naming Deficit (RAN Dyslexia)
The core deficit is **processing speed and automaticity of retrieval**. Children show slow rapid automatized naming of letters, numbers, and colors, inefficient access to phonological representations, and reduced automaticity overall.

Reading is slow and labored — the problem is fluency rather than accuracy. Neurally, there is distributed network inefficiency, particularly in frontal–occipitotemporal connectivity. Functionally, reading may be accurate but never automatic; children fatigue with sustained reading and comprehension suffers because of the slowed rate.

#### Double Deficit Dyslexia
Combined **phonological and rapid naming** deficits. Reading shows poor decoding *and* slow fluency, making this the most severe and persistent presentation. It is associated with poorer prognosis and requires intensive, multi-component intervention.

#### Visual (Visual-Attentional) Dyslexia
The core deficit is **visual attention span and orthographic processing efficiency**. Children have difficulty processing multiple letters simultaneously, show a reduced visual attention span, and make letter position errors.

Reading shows skipping of words or lines, reversals or transpositions (e.g., "form" → "from"), and difficulty tracking text. Neurally, parietal–occipital regions in the visual attention network are implicated. This subtype is less universally accepted as a core form of dyslexia and often overlaps with attentional and executive weaknesses, particularly ADHD.

#### Deep Dyslexia (Rare; Predominantly Acquired)
The core deficit is in **semantic processing** — a breakdown in mapping orthography to meaning. The hallmark is **semantic errors** (e.g., reading "dog" as "cat"), with difficulty reading abstract words and relatively preserved performance on concrete words. Deep dyslexia is most often seen in acquired dyslexia following brain injury and is rare in developmental presentations.`;

async function run() {
  const result = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 19));
  let content = result[0].content;

  if (!content.includes(ANCHOR)) {
    console.error("❌ Anchor not found.");
    process.exit(1);
  }

  content = content.replace(ANCHOR, ANCHOR + ADDITION);
  await db.update(studyGuidesTable).set({ content }).where(eq(studyGuidesTable.id, 19));
  console.log("✅ Major Types of Dyslexia section added.");
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
