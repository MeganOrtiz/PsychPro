import { useEffect, type ReactElement } from "react";
import { useLocation } from "wouter";
import { BookOpen, Lock, FileText, Stethoscope } from "lucide-react";
import { useGetStudyGuideByTopic, useGetTopic } from "@workspace/api-client-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { useEntitlements } from "@/lib/use-entitlements";
import { PageTitle } from "@/components/brand/page-title";
import { epppTopicPath, isEpppRoute } from "@/lib/eppp-routes";
import { isEpppTopic, isEpppQuickReference, isEpppClinicalCase } from "@/lib/eppp-content";

// Clinical Integration Cases are authored with a metadata preamble at the top of
// the guide body (an "EPPP Part N — Clinical Integration Case" heading plus
// examPart / contentType / domain / difficulty / competencyTags / reviewTags
// lines). That frontmatter is for content management, not the reader, so we strip
// the leading contiguous block of it and show only the actual case content.
function stripClinicalCaseMeta(md: string): string {
  const lines = md.split("\n");
  const isMeta = (raw: string) => {
    const t = raw.trim().replace(/^#+\s*/, "").replace(/\*\*/g, "");
    if (t === "") return true;
    if (/clinical integration case/i.test(t) && /eppp\s*part/i.test(t)) return true;
    if (/^(examPart|contentType|domain|difficulty|competencyTags|reviewTags)\s*:/i.test(t)) return true;
    return false;
  };
  let i = 0;
  while (i < lines.length && isMeta(lines[i])) i++;
  return lines.slice(i).join("\n").replace(/^\s+/, "");
}

interface Props {
  params: { id: string };
}

export default function StudyGuidePage({ params }: Props) {
  const [location, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const inEppp = isEpppRoute(location);
  const backToTopic = inEppp ? epppTopicPath(topicId) : `/topics/${topicId}`;
  // Single source of truth for "is this user allowed to see the guide".
  // Includes admin bypass + tier check. Previously this used
  // `subscriptionStatus` directly, which paywalled admins. (Bug fix.)
  const { data: ent } = useEntitlements();

  const { data: guide, isLoading, error } = useGetStudyGuideByTopic(topicId);
  const { data: topic } = useGetTopic(topicId);

  useEffect(() => {
    if (!inEppp && topic && isEpppTopic(topic)) {
      navigate(`${epppTopicPath(topicId)}/study-guide`);
    }
  }, [inEppp, navigate, topic, topicId]);

  const is402 =
    (error as any)?.status === 402 ||
    (error as any)?.response?.status === 402 ||
    (ent !== undefined && ent.studyGuideLocked);

  const isQRG = !!(topic && isEpppQuickReference(topic));
  const isClinicalCase = !!(topic && isEpppClinicalCase(topic));

  return (
    <div className="min-h-full study-page-bg" data-testid="study-guide-page">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <Breadcrumbs items={[
        { label: inEppp ? "EPPP Domains" : "Topics", href: inEppp ? "/eppp/suite/domains" : "/topics" },
        { label: topic?.name ?? "Topic", href: backToTopic },
        { label: isClinicalCase ? "Clinical Integration Case" : "Study Guide" },
      ]} />
      {!isQRG && (
        <PageTitle
          title={isClinicalCase ? "Clinical Integration Case" : "Study Guide"}
          icon={isClinicalCase ? Stethoscope : FileText}
        />
      )}

      {isLoading && ent === undefined ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-4 rounded" />)}
        </div>
      ) : is402 ? (
        <StudySurface tone="light" glow innerClassName="text-center py-16 px-6" testId="study-guide-paywall">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border"
            style={{ background: "rgba(189,229,255,0.55)", borderColor: `${P.surf}66` }}
          >
            <Lock className="w-8 h-8" style={{ color: P.tealDeep }} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Study Guides are a Premium Feature</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Unlock comprehensive, in-depth study guides for every topic — written from real course notes with clinical depth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/subscription")}
              data-testid="btn-upgrade"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Upgrade to Unlock
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(backToTopic)}
            >
              Back to Topic
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Starting at $9.99/month · Cancel anytime</p>
        </StudySurface>
      ) : error || !guide ? (
        <StudySurface tone="light" innerClassName="text-center py-16" testId="no-study-guide">
          <p className="text-muted-foreground font-medium">Study guide coming soon</p>
          <p className="text-sm text-muted-foreground mt-1">Check back later for detailed notes on this topic.</p>
        </StudySurface>
      ) : (
        <StudySurface tone="light" glow innerClassName="p-6 md:p-10">
          <div className="text-center mb-8 pb-6" style={{ borderBottom: `1px solid ${P.surf}44` }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
              {isQRG
                ? guide.title.replace(/\s*[—–-]\s*Quick Reference Guide\s*$/i, "")
                : guide.title.replace(/\s*[—–-]\s*(?:EPPP\s+)?Study Guide\s*$/i, "")}
            </h2>
            {isQRG && (
              <p className="mt-2 text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: P.tealDeep }}>
                Quick Reference Guide
              </p>
            )}
            <div className="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
              <span className="h-px w-8" style={{ background: `${P.surf}66` }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: P.teal }} />
              <span className="h-px w-8" style={{ background: `${P.surf}66` }} />
            </div>
          </div>
          <div
            className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-table:text-sm"
            data-testid="study-guide-content"
          >
            <MarkdownRenderer
              content={
                isClinicalCase
                  ? stripClinicalCaseMeta(guide.content.replace(/^\s*#\s+.*\n+/, ""))
                  : guide.content.replace(/^\s*#\s+.*\n+/, "")
              }
            />
          </div>
        </StudySurface>
      )}
      </div>
    </div>
  );
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "hr" }
  | { type: "blank" }
  | { type: "bullet"; text: string }
  | { type: "numbered"; text: string }
  | { type: "table"; rows: string[][] }
  | { type: "paragraph"; text: string };

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableRows.push(
          lines[i].split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim())
        );
        i++;
      }
      blocks.push({ type: "table", rows: tableRows });
      continue;
    }

    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", text: line.slice(5) });
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) });
    } else if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      blocks.push({ type: "hr" });
    } else if (line.startsWith("- ")) {
      blocks.push({ type: "bullet", text: line.slice(2) });
    } else if (/^\d+\. /.test(line)) {
      blocks.push({ type: "numbered", text: line.replace(/^\d+\. /, "") });
    } else if (line.trim() === "") {
      blocks.push({ type: "blank" });
    } else {
      blocks.push({ type: "paragraph", text: line });
    }

    i++;
  }

  return blocks;
}

function MarkdownRenderer({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  const elements: ReactElement[] = [];
  let key = 0;
  let bi = 0;

  while (bi < blocks.length) {
    const block = blocks[bi];

    if (block.type === "h1") {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-foreground mt-2 mb-5 pb-2 border-b border-border">
          <InlineMarkdown text={block.text} />
        </h1>
      );
    } else if (block.type === "h2") {
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-foreground mt-8 mb-3 pb-1 border-b border-border/50">
          <InlineMarkdown text={block.text} />
        </h2>
      );
    } else if (block.type === "h3") {
      elements.push(
        <h3 key={key++} className="text-base font-semibold text-foreground mt-5 mb-2">
          <InlineMarkdown text={block.text} />
        </h3>
      );
    } else if (block.type === "h4") {
      elements.push(
        <h4 key={key++} className="text-sm font-semibold text-foreground mt-4 mb-1.5 uppercase tracking-wide text-muted-foreground">
          <InlineMarkdown text={block.text} />
        </h4>
      );
    } else if (block.type === "hr") {
      // Suppress — headings already provide visual separation
    } else if (block.type === "blank") {
      // Accumulate consecutive blanks into a single small gap
      let count = 0;
      while (bi < blocks.length && blocks[bi].type === "blank") { count++; bi++; }
      elements.push(<div key={key++} className={count > 1 ? "h-4" : "h-1"} />);
      continue;
    } else if (block.type === "bullet") {
      const items: string[] = [];
      while (bi < blocks.length && blocks[bi].type === "bullet") {
        items.push((blocks[bi] as { type: "bullet"; text: string }).text);
        bi++;
      }
      elements.push(
        <ul key={key++} className="list-disc pl-5 mb-3 space-y-1">
          {items.map((item, j) => (
            <li key={j} className="text-foreground text-sm leading-relaxed">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (block.type === "numbered") {
      const items: string[] = [];
      while (bi < blocks.length && blocks[bi].type === "numbered") {
        items.push((blocks[bi] as { type: "numbered"; text: string }).text);
        bi++;
      }
      elements.push(
        <ol key={key++} className="list-decimal pl-5 mb-3 space-y-1">
          {items.map((item, j) => (
            <li key={j} className="text-foreground text-sm leading-relaxed">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (block.type === "table") {
      const { rows } = block;
      const headers = rows[0] ?? [];
      const bodyRows = rows.length > 2 ? rows.slice(2) : [];
      const nowrapCols = new Set<number>();
      headers.forEach((h, ci) => {
        const label = h.trim().toLowerCase();
        if (
          label === "test" ||
          label === "age" ||
          label === "age range" ||
          label === "ages" ||
          label === "group"
        ) {
          nowrapCols.add(ci);
        }
      });
      elements.push(
        <div key={key++} className="overflow-x-auto my-4 rounded-lg border border-border">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                {headers.map((h, ci) => (
                  <th
                    key={ci}
                    className={`px-4 py-2.5 text-left font-semibold text-foreground border-b border-border ${
                      nowrapCols.has(ci) ? "whitespace-nowrap w-px" : ""
                    }`}
                  >
                    <InlineMarkdown text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-2.5 text-foreground border-b border-border/50 align-top ${
                        nowrapCols.has(ci) ? "whitespace-nowrap w-px" : ""
                      }`}
                    >
                      <InlineMarkdown text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (block.type === "paragraph") {
      elements.push(
        <p key={key++} className="text-foreground text-sm leading-relaxed mb-3">
          <InlineMarkdown text={block.text} />
        </p>
      );
    }

    bi++;
  }

  return <div>{elements}</div>;
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
