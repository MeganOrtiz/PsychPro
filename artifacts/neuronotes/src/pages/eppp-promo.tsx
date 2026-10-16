import { useEffect } from "react";
import bookSrc from "@/assets/psychpro-foundations-book.webp";
import "./eppp-promo.css";

export default function EpppPromoPage() {
  useEffect(() => {
    document.title = "Textbook offer | PsychPro";
  }, []);

  return (
    <div className="promo-root">
      <main className="promo-main">
        <section className="promo-offer" aria-labelledby="promo-offer-title" data-testid="promo-book-offer">
          <img className="promo-book" src={bookSrc} alt="Foundations in Clinical Psychology textbook cover" loading="lazy" />
          <div className="promo-offer-copy">
            <h1 id="promo-offer-title">For a Limited Time</h1>
            <p>Leave us an honest review and receive a FREE copy of the Foundations in Clinical Psychology textbook!</p>
          </div>
        </section>
      </main>
    </div>
  );
}
