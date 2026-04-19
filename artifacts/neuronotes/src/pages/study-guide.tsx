import { type ReactElement } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, BookOpen, Lock } from "lucide-react";
import { useGetStudyGuideByTopic, useGetUserProfile } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Props {
  params: { id: string };
}

export default function StudyGuidePage({ params }: Props) {
  const [, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const { data: profile } = useGetUserProfile();
  const isSubscribed = profile?.subscriptionStatus === "active" || profile?.subscriptionStatus === "pro" || profile?.subscriptionStatus === "trialing" || profile?.subscriptionStatus === "scholar";

  const { data: guide, isLoading, error } = useGetStudyGuideByTopic(topicId);

  const is402 = (error as any)?.status === 402 || (error as any)?.response?.status === 402 || (!isSubscribed && profile !== undefined);

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto" data-testid="study-guide-page">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/topics/${topicId}`)}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Study Guide</h1>
      </div>

      {isLoading && profile === undefined ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-4 rounded" />)}
        </div>
      ) : is402 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl px-6" data-testid="study-guide-paywall">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Study Guides are a Premium Feature</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Unlock comprehensive, in-depth study guides for all 15 topics — written from real course notes with clinical depth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/subscription")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="btn-upgrade"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Upgrade to Unlock
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/topics/${topicId}`)}
            >
              Back to Topic
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Starting at $9.99/month · Cancel anytime</p>
        </div>
      ) : error || !guide ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl" data-testid="no-study-guide">
          <p className="text-muted-foreground font-medium">Study guide coming soon</p>
          <p className="text-sm text-muted-foreground mt-1">Check back later for detailed notes on this topic.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <div className="text-center mb-8 pb-6 border-b border-border">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/80 mb-2">Study Guide</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
              {guide.title.replace(/\s*[—–-]\s*Study Guide\s*$/i, "")}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
              <span className="h-px w-8 bg-border" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span className="h-px w-8 bg-border" />
            </div>
          </div>
          <div
            className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-table:text-sm"
            data-testid="study-guide-content"
          >
            <MarkdownRenderer content={guide.content.replace(/^\s*#\s+.*\n+/, "")} />
          </div>
        </div>
      )}
    </div>
  );
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
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

    if (line.startsWith("# ") && !line.startsWith("## ") && !line.startsWith("### ")) {
      blocks.push({ type: "h1", text: line.slice(2) });
    } else if (line.startsWith("## ") && !line.startsWith("### ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
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
      elements.push(
        <div key={key++} className="overflow-x-auto my-4 rounded-lg border border-border">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                {headers.map((h, ci) => (
                  <th key={ci} className="px-4 py-2.5 text-left font-semibold text-foreground border-b border-border">
                    <InlineMarkdown text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-foreground border-b border-border/50 align-top">
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
