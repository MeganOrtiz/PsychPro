import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Search,
} from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTitle } from "@/components/brand/page-title";
import { groupEpppTopicsByCategory } from "@/lib/eppp-content";

type Topic = {
  id: number;
  name: string;
  description: string;
  category: string;
  flashcardCount?: number;
  quizCount?: number;
};

const C = {
  cyan: "#76E4F7",
  mist: "#A7F3FF",
  cloud: "#F4FBFF",
  body: "rgba(225,244,250,0.84)",
  muted: "rgba(186,214,224,0.66)",
  hairline: "rgba(118,228,247,0.18)",
  hairlineStrong: "rgba(118,228,247,0.34)",
};

export default function EpppDomainsPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const { data: topics, isLoading } = useGetTopics();

  const groups = useMemo(
    () => groupEpppTopicsByCategory((topics ?? []) as Topic[]),
    [topics],
  );

  const activeGroup = groups[0] ?? null;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = useMemo(() => {
    if (!normalizedQuery) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (topic) =>
            topic.name.toLowerCase().includes(normalizedQuery) ||
            topic.description.toLowerCase().includes(normalizedQuery) ||
            group.name.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, normalizedQuery]);

  return (
    <div className="study-page-bg eppd-page" data-testid="eppp-domains-page">
      <style>{styles}</style>
      <div className="eppd-shell">
        <div className="eppd-topbar">
          <Link href="/eppp/dashboard" className="eppd-back">
            <ArrowLeft aria-hidden /> Dashboard
          </Link>
          <Link href="/eppp" className="eppd-system-link">
            System overview <ArrowRight aria-hidden />
          </Link>
        </div>

        <PageTitle
          title="EPPP Domains"
          icon={GraduationCap}
          subtitle="Focused licensing-exam content only"
        />

        <div className="eppd-search">
          <Search aria-hidden />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search EPPP domains and lessons..."
            className="eppd-search-input"
            data-testid="eppp-domains-search"
          />
        </div>

        {isLoading ? (
          <div className="eppd-grid">
            <Skeleton className="h-80 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          </div>
        ) : groups.length === 0 ? (
          <section className="eppd-empty">
            <Layers aria-hidden />
            <h2>No EPPP content is loaded here yet.</h2>
            <p>
              EPPP uploads are paused until the dedicated dashboard and domain
              structure are ready.
            </p>
          </section>
        ) : (
          <div className="eppd-grid">
            <aside className="eppd-rail" aria-label="EPPP domains">
              {groups.map((group) => (
                <a
                  key={group.name}
                  href={`#${slug(group.name)}`}
                  className={`eppd-rail-item${
                    activeGroup?.name === group.name ? " is-active" : ""
                  }`}
                >
                  <span>{group.name}</span>
                  <strong>{group.items.length}</strong>
                </a>
              ))}
            </aside>

            <main className="eppd-content">
              {filteredGroups.length === 0 ? (
                <section className="eppd-empty eppd-empty--small">
                  <Search aria-hidden />
                  <h2>No matching EPPP lessons</h2>
                  <p>Try another domain, concept, or lesson name.</p>
                </section>
              ) : (
                filteredGroups.map((group) => (
                  <section
                    key={group.name}
                    id={slug(group.name)}
                    className="eppd-domain"
                    data-testid={`eppp-domain-section-${slug(group.name)}`}
                  >
                    <div className="eppd-domain-head">
                      <div>
                        <p className="eppd-eyebrow">CONTENT AREA</p>
                        <h2>{group.name}</h2>
                      </div>
                      <span>{group.items.length} lessons</span>
                    </div>

                    <div className="eppd-lessons">
                      {group.items.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          className="eppd-lesson"
                          onClick={() => navigate(`/topics/${topic.id}`)}
                          data-testid={`eppp-lesson-${topic.id}`}
                        >
                          <span className="eppd-lesson-icon">
                            <BookOpen aria-hidden />
                          </span>
                          <span className="eppd-lesson-body">
                            <span className="eppd-lesson-title">
                              {topic.name}
                            </span>
                            <span className="eppd-lesson-desc">
                              {topic.description}
                            </span>
                            <span className="eppd-lesson-meta">
                              {topic.flashcardCount ?? 0} cards ·{" "}
                              {topic.quizCount ?? 0} questions
                            </span>
                          </span>
                          <ArrowRight aria-hidden className="eppd-lesson-arrow" />
                        </button>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const styles = `
.eppd-page {
  min-height: 100%;
  padding: clamp(20px, 3vw, 36px) clamp(16px, 4vw, 42px) clamp(48px, 6vw, 88px);
}
.eppd-shell {
  max-width: 1180px;
  margin: 0 auto;
}
.eppd-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}
.eppd-back,
.eppd-system-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${C.body};
  font-size: 13px;
  text-decoration: none;
}
.eppd-back:hover,
.eppd-system-link:hover {
  color: ${C.cloud};
}
.eppd-back svg,
.eppd-system-link svg {
  width: 15px;
  height: 15px;
  color: ${C.cyan};
}
.eppd-search {
  position: relative;
  margin: 18px 0 20px;
}
.eppd-search > svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${C.mist};
  z-index: 1;
}
.eppd-search-input {
  padding-left: 38px;
  background: rgba(5,23,32,0.84);
  border-color: ${C.hairline};
  color: ${C.cloud};
}
.eppd-grid {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}
.eppd-rail {
  position: sticky;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid ${C.hairline};
  border-radius: 12px;
  background: linear-gradient(155deg, rgba(7,36,50,0.78), rgba(3,21,29,0.88));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
}
.eppd-rail-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 10px 11px;
  border: 1px solid rgba(118,228,247,0.10);
  border-radius: 8px;
  color: ${C.body};
  text-decoration: none;
  background: rgba(255,255,255,0.025);
}
.eppd-rail-item:hover,
.eppd-rail-item.is-active {
  color: ${C.cloud};
  border-color: ${C.hairlineStrong};
  background: rgba(118,228,247,0.08);
}
.eppd-rail-item span {
  font-size: 13px;
  line-height: 1.25;
}
.eppd-rail-item strong {
  color: ${C.mist};
  font-size: 12px;
}
.eppd-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.eppd-domain {
  scroll-margin-top: 18px;
  border: 1px solid ${C.hairline};
  border-radius: 12px;
  background: linear-gradient(155deg, rgba(8,37,51,0.66), rgba(3,21,29,0.84));
  overflow: hidden;
}
.eppd-domain-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(118,228,247,0.14);
}
.eppd-eyebrow {
  margin: 0 0 5px;
  color: ${C.mist};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
}
.eppd-domain-head h2 {
  margin: 0;
  color: ${C.cloud};
  font-size: 20px;
  line-height: 1.15;
}
.eppd-domain-head span {
  color: ${C.muted};
  font-size: 12px;
  white-space: nowrap;
}
.eppd-lessons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: rgba(118,228,247,0.12);
}
.eppd-lesson {
  appearance: none;
  border: 0;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 18px;
  gap: 12px;
  padding: 15px;
  text-align: left;
  background: rgba(3,21,29,0.92);
  color: ${C.body};
  cursor: pointer;
}
.eppd-lesson:hover {
  background: rgba(8,48,66,0.94);
}
.eppd-lesson-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${C.hairlineStrong};
  background: rgba(118,228,247,0.08);
  color: ${C.cyan};
}
.eppd-lesson-icon svg,
.eppd-lesson-arrow {
  width: 17px;
  height: 17px;
}
.eppd-lesson-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.eppd-lesson-title {
  color: ${C.cloud};
  font-size: 14px;
  font-weight: 650;
  line-height: 1.25;
}
.eppd-lesson-desc {
  color: ${C.body};
  font-size: 12px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.eppd-lesson-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${C.muted};
  font-size: 11px;
}
.eppd-lesson-arrow {
  align-self: center;
  color: ${C.cyan};
  opacity: 0.72;
}
.eppd-empty {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid ${C.hairline};
  border-radius: 12px;
  background: rgba(3,21,29,0.78);
  color: ${C.body};
  text-align: center;
  padding: 24px;
}
.eppd-empty--small {
  min-height: 180px;
}
.eppd-empty svg {
  width: 28px;
  height: 28px;
  color: ${C.cyan};
}
.eppd-empty h2 {
  margin: 0;
  color: ${C.cloud};
  font-size: 18px;
}
.eppd-empty p {
  margin: 0;
  max-width: 420px;
  color: ${C.muted};
  font-size: 13px;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .eppd-grid {
    grid-template-columns: 1fr;
  }
  .eppd-rail {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 680px) {
  .eppd-topbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .eppd-rail,
  .eppd-lessons {
    grid-template-columns: 1fr;
  }
  .eppd-domain-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;
