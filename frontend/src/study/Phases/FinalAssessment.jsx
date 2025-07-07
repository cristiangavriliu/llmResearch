import React from "react";

const FinalAssessment = ({ nextPhase, studyData, setStudyData }) => {
  const handleNext = () => {
    // Set completion timestamp and calculate times before moving to next phase
    const completionTime = Date.now();
    
    // Calculate times immediately with current studyData
    const timestamps = {
      ...studyData.timestamps,
      completion: completionTime
    };
    
    let totalTimeSeconds = null;
    let chatTimeSeconds = null;
    
    if (timestamps.iframeOpen && completionTime) {
      totalTimeSeconds = Math.round((completionTime - timestamps.iframeOpen) / 1000 * 100) / 100;
    }
    
    if (timestamps.chatStart && timestamps.chatEnd) {
      chatTimeSeconds = Math.round((timestamps.chatEnd - timestamps.chatStart) / 1000 * 100) / 100;
    }
    
    const completedData = {
      ...studyData,
      timestamps,
      totalTimeSeconds,
      chatTimeSeconds
    };
    
    // Update state with calculated values and pass completed data to nextPhase
    setStudyData(completedData);
    
    // Pass the completed data directly to nextPhase
    nextPhase(completedData);
  };

  return (
    <div className="space-y-6">
      {/* Thesis Display */}
      <div className="p-3">
        <div className="text-sm text-secondary">
          These: {studyData.thesisTitle || "..."}
        </div>
        <div className="text-lg font-semibold text-primary">
          {studyData.thesisText || "..."}
        </div>
      </div>

      {/* Final Position Question */}
      <div className="border border-color rounded-lg p-6 bg-secondary text-primary">
        <div className="space-y-2">
          <label htmlFor="final-position" className="block text-sm font-medium">
            Wie stehen Sie zu dieser These? (<span>{studyData.finalPosition ?? 50}</span>/100):
          </label>
          <input
            type="range"
            id="final-position"
            min={0}
            max={100}
            value={studyData.finalPosition ?? 50}
            onChange={e =>
              setStudyData(prev => ({
                ...prev,
                finalPosition: Number(e.target.value)
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

      {/* Final Information Question */}
      <div className="border border-color rounded-lg p-6 bg-secondary text-primary">
        <div className="space-y-2">
          <label htmlFor="final-informed" className="block text-sm font-medium">
            Wie gut informiert fühlen Sie zu dieser These? (<span>{studyData.finalInformation ?? 50}</span>/100):
          </label>
          <input
            type="range"
            id="final-informed"
            min={0}
            max={100}
            value={studyData.finalInformation ?? 50}
            onChange={e =>
              setStudyData(prev => ({
                ...prev,
                finalInformation: Number(e.target.value)
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

      {/* Continue Button */}
      <button
        onClick={handleNext}
        className="bg-accent hover:bg-[var(--accent-color-secondary)] text-white px-4 py-2 rounded font-semibold transition ml-auto block cursor-pointer"
      >
        Weiter
      </button>
    </div>
  );
};

export default FinalAssessment;
