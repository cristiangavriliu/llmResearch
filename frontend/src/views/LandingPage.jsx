import React from "react";

const LandingPage = () => (
  <div className="py-14 px-4">
    <h1 className="text-2xl font-bold max-w-md text-primary mb-6">
      LLMs und politische Meinungsbildung
    </h1>
    <section className="mb-6">
      <p className="text-base max-w-md text-justify">
        Politische Meinungsbildung ist essenziell für informierte Wahlentscheidungen. Zugleich steigt der Bedarf nach digitalen Tools, die Wählerinnen und Wählern helfen, komplexe Thesen zu verstehen. Künstliche Intelligenz eröffnet hier neue Möglichkeiten, indem sie interaktive Diskussionen anbietet.
      </p>
    </section>
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Forschungsfrage</h2>
      <p className="text-base max-w-md text-justify">
        Untersucht wird, ob strukturierte Dialoge mit Large Language Models (LLMs) die politische Meinungsbildung unterstützen. Konkret geht es darum, wie sich Einstellungen und Vertrauen verändern, wenn Teilnehmende KI-regulierte Diskussionen zu Bundestagswahl-Thesen führen.
      </p>
    </section>
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Methodik</h2>
      <p className="text-base max-w-md text-justify">
        Ein AI-gestütztes Diskussions-Tool wurde entwickelt, das auf den Wahl-O-Mat-Thesen zur Bundestagswahl 2025 basiert. Nutzerinnen und Nutzer können Thesen bewerten, Argumente austauschen und Gegenpositionen erkunden – alles gesteuert durch ein LLM.
      </p>
    </section>
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Studienaufbau</h2>
      <p className="text-base max-w-md text-justify">
        In einer randomisierten Studie bewerten Teilnehmende Thesen vor und nach der Interaktion. Die Einstellungen werden auf einer Skala von 1–100 erhoben, ergänzt durch qualitative Rückmeldungen zum Diskussionsprozess und zur Glaubwürdigkeit der KI-Antworten.
      </p>
    </section>
    <section>
      <h2 className="text-lg font-semibold mb-2">Erwartete Ergebnisse & Beitrag</h2>
      <p className="text-base max-w-md text-justify">
        Erwartet werden Einblicke, wie KI-Dialoge politische Präferenzen verschieben und das Vertrauen in KI-generierte Inhalte beeinflussen. Die Ergebnisse liefern Empfehlungen für die Integration von LLMs in Wahlbildungsplattformen.
      </p>
    </section>
  </div>
);

export default LandingPage;
