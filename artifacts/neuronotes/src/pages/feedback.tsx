import { MessageSquare } from "lucide-react";
import { PageTitle } from "@/components/brand/page-title";
import { FeedbackForm } from "@/components/feedback/feedback-form";

export default function FeedbackPage() {
  return (
    <div className="min-h-full study-page-bg" data-testid="feedback-page">
      <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8">
        <PageTitle
          title="Feedback"
          icon={MessageSquare}
          subtitle="Found a bug? Have a suggestion? We want to hear it."
          className="mb-6"
        />
        <FeedbackForm />
      </div>
    </div>
  );
}