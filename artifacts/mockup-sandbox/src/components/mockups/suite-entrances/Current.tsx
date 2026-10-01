import { GraduationCap } from "lucide-react";
import "./_current.css";

export function Current() {
  return (
    <div className="suite-current">
      <section
        id="eppp"
        className="landing-section landing-mastery"
        data-reveal
      >
        <div className="landing-mastery-card">
          <div className="landing-mastery-icon">
            <GraduationCap aria-hidden />
          </div>
          <p className="landing-eyebrow">EPPP PREP</p>
          <h2 className="landing-section-title">
            The PsychPro EPPP Mastery System&trade;
          </h2>
          <p className="landing-mastery-text">
            The PsychPro EPPP Mastery System&trade; is a system of learning
            resources designed to promote mastery of EPPP content through
            conceptual understanding, critical thinking, and active application.
            Featuring structured lessons in each domain, clinical integration
            case examples, and full-length practice exams, the system equips
            learners with the knowledge and confidence needed for both EPPP
            success and real-world clinical practice.
          </p>
        </div>
      </section>
    </div>
  );
}