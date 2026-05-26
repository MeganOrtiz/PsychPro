// Test extractTextFromBuffer functions in isolation, without going through the route/auth
import fs from "node:fs";

console.log("Test 1: pdf-parse plain text buffer (should fall through to utf8)");
try {
  const buf = Buffer.from("hello world from txt", "utf-8");
  console.log("buf:", buf.toString("utf-8").slice(0, 40));
} catch (e) { console.error("FAIL:", e.message); }

console.log("\nTest 2: import('pdf-parse') and parse a PDF");
try {
  const pdfParse = (await import("pdf-parse")).default;
  console.log("pdf-parse loaded:", typeof pdfParse);
  // Try parsing a minimal PDF
  const minPdf = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\nxref\n0 1\n0000000000 65535 f \ntrailer<</Size 1>>\nstartxref\n9\n%%EOF\n");
  const r = await pdfParse(minPdf);
  console.log("parsed:", JSON.stringify({ numpages: r.numpages, textLen: r.text.length }));
} catch (e) { console.error("FAIL:", e.message.slice(0, 200)); }

console.log("\nTest 3: import('mammoth') and parse empty docx");
try {
  const mammoth = await import("mammoth");
  console.log("mammoth loaded:", typeof mammoth.extractRawText);
} catch (e) { console.error("FAIL:", e.message.slice(0, 200)); }
