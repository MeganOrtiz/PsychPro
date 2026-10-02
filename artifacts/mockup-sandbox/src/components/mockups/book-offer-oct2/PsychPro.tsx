import "./_group.css";

export function PsychPro() {
  return (
    <main
      className="october-book-preview october-book-preview--psychpro"
      aria-label="PsychPro dashboard screenshot with redesigned digital textbook offer"
    >
      <img
        className="october-book-preview__dashboard"
        src="/__mockup/images/book-offer-oct2/psychpro-dashboard.webp"
        alt="PsychPro study dashboard"
        width="1668"
        height="874"
        loading="eager"
      />
      <aside className="october-book-preview__offer" aria-label="Free digital textbook offer">
        <img
          className="october-book-preview__book"
          src="/__mockup/images/book-offer-oct2/book.webp"
          alt="Foundations in Clinical Psychology, volume one"
          loading="eager"
        />
        <div className="october-book-preview__copy">
          <h2 className="october-book-preview__heading">How’s PsychPro working for you?</h2>
          <p className="october-book-preview__description">
            Share honest feedback and we’ll send you a free digital textbook as a thank-you.
          </p>
          <button className="october-book-preview__button" type="button">
            Share a thought <span aria-hidden="true">→</span>
          </button>
        </div>
      </aside>
    </main>
  );
}