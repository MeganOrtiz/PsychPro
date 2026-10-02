import { LibraryView } from "@/components/library/book-library";
import type { BookLibraryResponse } from "@workspace/api-client-react";
import { DashboardFeedbackOffer } from "@/components/feedback/dashboard-feedback-offer";

// DEV-only. Static isolated data rendered through the real LibraryView; nothing is persisted.
const DATA: BookLibraryResponse = {
  books: [{
    id: "psychpro-foundations-v1",
    title: "PsychPro: Foundations in Clinical Psychology, Volume 1",
    description: "Preview data only. Not a real ownership record.",
    coverUrl: null, pageCount: null, grantedAt: new Date().toISOString(), source: "feedback",
  }],
  reward: { bookId: "psychpro-foundations-v1", title: "Foundations", owned: true, eligible: false, available: true },
} as BookLibraryResponse;

export default function DevLibraryPreview() {
  return (
    <div className="study-page-bg min-h-screen">
      <p className="p-4 text-xs text-muted-foreground">DEV preview: mocked data, no persistence.</p>
      <LibraryView suite="psychpro" data={DATA} />
      <LibraryView suite="eppp" data={{ ...DATA, books: [] , reward: { ...DATA.reward, owned: false, eligible: true } }} />
      <LibraryView suite="eppp" data={{ ...DATA, books: [], reward: { ...DATA.reward, owned: false, eligible: false } }} />
      <DashboardFeedbackOffer suite="eppp" />
    </div>
  );
}
