import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Lightbulb, Trash2, ChevronLeft, BookOpen } from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import {
  listAllReflections,
  deleteReflection,
  type ReflectionRecord,
} from "@/lib/reflections";

interface TopicLike {
  id: number;
  name: string;
}

export default function ReflectionsPage() {
  const [records, setRecords] = useState<ReflectionRecord[]>([]);
  // Track whether we've actually read localStorage yet — without this,
  // a returning user sees a flash of the "no reflections yet" empty state
  // before useEffect runs on first paint.
  const [hydrated, setHydrated] = useState(false);
  const { data: topics } = useGetTopics();

  useEffect(() => {
    setRecords(listAllReflections());
    setHydrated(true);
  }, []);

  const topicNameById = useMemo(() => {
    const map = new Map<number, string>();
    (topics as TopicLike[] | undefined)?.forEach((t) => map.set(t.id, t.name));
    return map;
  }, [topics]);

  // Group by topic so the page reads like a study journal organized by
  // subject rather than a flat dump of every saved note.
  const grouped = useMemo(() => {
    const byTopic = new Map<number, ReflectionRecord[]>();
    for (const r of records) {
      const arr = byTopic.get(r.topicId) ?? [];
      arr.push(r);
      byTopic.set(r.topicId, arr);
    }
    return Array.from(byTopic.entries()).map(([topicId, items]) => ({
      topicId,
      topicName: topicNameById.get(topicId) ?? `Topic #${topicId}`,
      items,
    }));
  }, [records, topicNameById]);

  const handleDelete = (topicId: number, questionId: number) => {
    deleteReflection(topicId, questionId);
    setRecords(listAllReflections());
  };

  return (
    <div
      className="min-h-screen px-4 md:px-8 py-6 md:py-10"
      style={{ background: P.bg, color: P.mist }}
      data-testid="reflections-page"
    >
      <div className="max-w-4xl mx-auto">
        <Link href="/my-decks">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-white/70 hover:text-white"
            data-testid="back-to-tools"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> My Tools
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-6 h-6" style={{ color: P.surf }} />
          <h1 className="text-2xl md:text-3xl font-bold">Reflections</h1>
        </div>
        <p className="text-sm mb-8" style={{ color: `${P.mist}99` }}>
          Every "Lock it in" note you've saved during a quiz, grouped by topic.
          These live on this device only — they're never sent to a server.
        </p>

        {!hydrated ? (
          <div
            className="rounded-xl border p-8"
            style={{
              background: `linear-gradient(135deg, ${P.surface}f0, ${P.bg}f0)`,
              borderColor: `${P.surf}22`,
            }}
            data-testid="reflections-loading"
          >
            <div
              className="h-4 w-1/3 rounded mb-3 animate-pulse"
              style={{ background: `${P.surf}22` }}
            />
            <div
              className="h-3 w-1/2 rounded animate-pulse"
              style={{ background: `${P.surf}18` }}
            />
          </div>
        ) : records.length === 0 ? (
          <StudySurface tone="dark" innerClassName="p-8 text-center">
            <Lightbulb
              className="w-10 h-10 mx-auto mb-3 opacity-60"
              style={{ color: P.surf }}
            />
            <p className="text-base font-medium mb-1">No reflections yet</p>
            <p className="text-sm" style={{ color: `${P.mist}99` }}>
              When you miss a quiz question, write a one-sentence "why" in the
              Reflect box and tap <span className="font-semibold">Lock it in</span>.
              Saved notes show up here.
            </p>
            <Link href="/topics">
              <Button className="mt-5" data-testid="go-to-topics">
                <BookOpen className="w-4 h-4 mr-1" /> Browse topics
              </Button>
            </Link>
          </StudySurface>
        ) : (
          <div className="space-y-8">
            {grouped.map((group) => (
              <section key={group.topicId} data-testid={`group-topic-${group.topicId}`}>
                <div className="flex items-baseline justify-between mb-3">
                  <Link href={`/topics/${group.topicId}`}>
                    <h2 className="text-lg font-semibold hover:underline cursor-pointer">
                      {group.topicName}
                    </h2>
                  </Link>
                  <span className="text-xs" style={{ color: `${P.mist}77` }}>
                    {group.items.length} {group.items.length === 1 ? "note" : "notes"}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.items.map((r) => (
                    <div
                      key={`${r.topicId}-${r.questionId}`}
                      className="rounded-xl border p-4"
                      style={{
                        background: `linear-gradient(135deg, ${P.surface}f0, ${P.bg}f0)`,
                        borderColor: `${P.surf}33`,
                      }}
                      data-testid={`reflection-${r.questionId}`}
                    >
                      {r.questionText ? (
                        <p
                          className="text-sm font-medium mb-2 leading-relaxed"
                          style={{ color: P.mist }}
                        >
                          {r.questionText}
                        </p>
                      ) : (
                        <p
                          className="text-xs italic mb-2"
                          style={{ color: `${P.mist}77` }}
                        >
                          Saved before question context was tracked — re-save from
                          the quiz to add it.
                        </p>
                      )}

                      {r.correctText && (
                        <p
                          className="text-xs mb-3"
                          style={{ color: `${P.mist}99` }}
                        >
                          <span className="font-semibold" style={{ color: "#7DD3A6" }}>
                            Correct ({r.correctAnswer}):
                          </span>{" "}
                          {r.correctText}
                          {r.selectedText && r.selectedAnswer !== r.correctAnswer && (
                            <>
                              {" · "}
                              <span className="font-semibold" style={{ color: "#E89A92" }}>
                                You picked ({r.selectedAnswer}):
                              </span>{" "}
                              {r.selectedText}
                            </>
                          )}
                        </p>
                      )}

                      <div
                        className="rounded-lg px-3 py-2 text-sm mb-2"
                        style={{
                          background: `${P.bg}cc`,
                          border: `1px solid ${P.surf}22`,
                          color: P.mist,
                        }}
                      >
                        {r.text}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: `${P.mist}66` }}>
                          {r.savedAt
                            ? new Date(r.savedAt).toLocaleString()
                            : "Saved earlier"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.topicId, r.questionId)}
                          className="text-[11px] inline-flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                          style={{ color: `${P.mist}99` }}
                          data-testid={`delete-${r.questionId}`}
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
