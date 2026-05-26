import { openai } from "@workspace/integrations-openai-ai-server";
console.log("Testing gpt-5.2 with a minimal completion...");
try {
  const r = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 200,
    messages: [
      { role: "system", content: "You output JSON only." },
      { role: "user", content: 'Generate JSON: {"flashcards":[{"front":"What is 2+2?","back":"4","difficulty":"easy"}]}' },
    ],
    response_format: { type: "json_object" },
  });
  console.log("SUCCESS:", r.choices[0]?.message?.content?.slice(0, 200));
} catch (e) {
  console.error("ERROR:", e.message);
  console.error("status:", e.status, "code:", e.code, "type:", e.type);
}
