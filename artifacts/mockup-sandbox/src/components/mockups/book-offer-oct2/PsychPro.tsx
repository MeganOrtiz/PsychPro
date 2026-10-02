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
          <h2 className="october-book-preview__heading">Get a Free Digital Textbook</h2>
          <p className="october-book-preview__description">
            Share honest feedback about PsychPro and receive a free digital copy.
          </p>
          <button className="october-book-preview__button" type="button">
            <svg
              className="october-book-preview__button-mark"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 3.5h10v7H8l-3.5 2v-2H3v-7Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path d="M5.5 6h5M5.5 8h3.75" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            Share Feedback
          </button>
        </div>
      </aside>
    </main>
  );
}