import React from "react";

function generateRandomPID() {
  const random = Math.random().toString(36).substring(2, 10);
  return `Heroku_${random}`;
}

const StudyOverview = () => {
  const randomPID = generateRandomPID();
  const surveyUrl = `https://survey.ifkw.lmu.de/AI-Survey/?PROLIFIC_PID=${randomPID}`;

  return (
    <div className="py-12 px-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Studienübersicht</h1>
      <p className="text-base mb-4 max-w-md text-justify">
        Die Studie befindet sich in der Pilot Phase, momentan sammeln wir erste freiwillige Tester für die Studie. Falls du teilnehmen willst, bitte klicke auf den folgenden Link:
      </p>
      <a
        href={surveyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-block text-blue-600 group"
      >
        Zur Studie
        <span className="block absolute left-0 bottom-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300"></span>
      </a>
    </div>
  );
};

export default StudyOverview;
