import React from "react";

const InitialPhase = ({ nextPhase, studyData, setStudyData }) => {

  
  const isNextEnabled = (studyData.initialStatement || "").trim().length >= 50;

  return (
    <div className="space-y-6">
      {/* These-Anzeige */}
      <div className="p-3">
        <div className="text-sm text-secondary">
          These: {studyData.thesisTitle || "..."}
        </div>
        <div className="text-lg font-semibold text-primary">
          {studyData.thesisText || "..."}
        </div>
      </div>

      {/* Positionsfrage */}
      <div className="border border-color rounded-lg p-6 bg-secondary text-primary">
        <div className="space-y-2">
          <label htmlFor="initial-position" className="block text-sm font-medium">
            Wie stehen Sie zu dieser These? (<span>{studyData.initialPosition ?? 50}</span>/100):
          </label>
          <input
            type="range"
            id="initial-position"
            min={0}
            max={100}
          value={studyData.initialPosition ?? 50}
          onChange={e =>
            setStudyData(prev => ({
              ...prev,
              initialPosition: Number(e.target.value)
            }))
          }
            className="w-full appearance-none bg-[var(--text-secondary)] h-2 rounded"
          />
          <div className="flex justify-between text-sm text-secondary">
            <span>stimme überhaupt nicht zu</span>
            <span>stimme voll und ganz zu</span>
          </div>
        </div>
      </div>

      {/* Informiertheitsfrage */}
      <div className="border border-color rounded-lg p-6 bg-secondary text-primary">
        <div className="space-y-2">
          <label htmlFor="initial-informed" className="block text-sm font-medium">
            Wie gut informiert fühlen Sie zu dieser These? (<span>{studyData.initialInformation ?? 50}</span>/100):
          </label>
          <input
            type="range"
            id="initial-informed"
            min={0}
            max={100}
          value={studyData.initialInformation ?? 50}
          onChange={e =>
            setStudyData(prev => ({
              ...prev,
              initialInformation: Number(e.target.value)
            }))
          }
            className="w-full appearance-none bg-[var(--text-secondary)] h-2 rounded"
          />
          <div className="flex justify-between text-sm text-secondary">
            <span>überhaupt nicht informiert</span>
            <span>sehr gut informiert</span>
          </div>
        </div>
      </div>

      {/* Meinungsbegründung */}
      <div>
        <label htmlFor="initial-statement" className="block font-semibold mb-1 px-3">
          Ihre Meinung zur These:
        </label>
        <textarea
          id="initial-statement"
          rows={5}
          className="w-full bg-secondary border border-color p-3 rounded text-primary focus:outline-none resize-none placeholder-[var(--text-secondary)]"
          placeholder="Begründen Sie Ihre Position zu dieser These ausführlich ... (min. 50 Zeichen)"
          value={studyData.initialStatement || ""}
          onChange={e =>
            setStudyData(prev => ({
              ...prev,
              initialStatement: e.target.value
            }))
          }
        />
      </div>

      {/* Weiter-Button */}
      <button
        onClick={nextPhase}
        disabled={!isNextEnabled}
        className={`bg-accent hover:bg-[var(--accent-color-secondary)] text-white px-4 py-2 rounded font-semibold transition ml-auto block ${
          isNextEnabled ? "cursor-pointer" : "opacity-40 cursor-default"
        }`}
      >
        Diskussion starten
      </button>
    </div>
  );
};

export default InitialPhase;
