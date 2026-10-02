import { useState } from "react";
import book from "@/assets/psychpro-foundations-book.webp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeedbackForm } from "./feedback-form";
import "./dashboard-feedback-offer.css";

export function DashboardFeedbackOffer() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <aside className="dashboard-feedback-offer" aria-label="Textbook feedback offer">
        <img
          src={book}
          alt="PsychPro: Foundations in Clinical Psychology textbook"
          className="dashboard-feedback-offer__book"
          width={785}
          height={1181}
        />
        <div className="dashboard-feedback-offer__copy">
          <p className="dashboard-feedback-offer__invitation">
            We’d love to hear from you.
          </p>
          <p className="dashboard-feedback-offer__details">
            Share feedback of your experience and get a FREE copy of the textbook
          </p>
          <Button
            className="dashboard-feedback-offer__button"
            onClick={() => setOpen(true)}
            data-testid="dashboard-feedback-button"
          >
            FEEDBACK
          </Button>
        </div>
      </aside>
      <Dialog open={open} onOpenChange={(next) => { if (!submitting) setOpen(next); }}>
        <DialogContent
          className="dashboard-feedback-dialog max-h-[90dvh] overflow-y-auto"
          data-testid="dashboard-feedback-dialog"
          aria-busy={submitting}
        >
          <DialogHeader>
            <DialogTitle>We’d love to hear from you.</DialogTitle>
            <DialogDescription>
              Tell us about your experience with PsychPro. Honest feedback—positive
              or negative—is welcome.
            </DialogDescription>
          </DialogHeader>
          <FeedbackForm
            onSubmittingChange={setSubmitting}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}