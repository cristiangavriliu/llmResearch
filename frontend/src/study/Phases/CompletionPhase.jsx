import React, { useEffect } from "react";

const CompletionPhase = ({ studyData, submissionState, retrySubmission }) => {
  // Send message to parent window when completion phase is reached
  useEffect(() => {
    // Send message to parent window to enable the "Weiter" button
    window.parent.postMessage('IFRAME_DONE', '*');
  }, []);

  const downloadData = () => {
    const dataStr = JSON.stringify(studyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `study-data-${studyData.prolificPid}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRetry = async () => {
    await retrySubmission();
  };

  return (
    <div className="text-center space-y-4">
      {/* Success State */}
      {submissionState.isSubmitted && (
        <div className="bg-secondary border border-color rounded-lg p-6">
          <h2 className="text-xl font-bold text-primary mb-2">Vielen Dank!</h2>
          <p className="text-secondary">
            Ihre Versuchsdaten wurden erfolgreich gespeichert.<br />
            Sie können nun auf weiter klicken.
          </p>
        </div>
      )}

      {/* Loading State */}
      {submissionState.isSubmitting && (
        <div className="bg-secondary border border-color rounded-lg p-6">
          <h2 className="text-xl font-bold text-primary mb-2">Daten werden gespeichert...</h2>
          <p className="text-secondary">Bitte warten Sie einen Moment.</p>
        </div>
      )}

      {/* Error State */}
      {submissionState.error && (
        <div className="bg-secondary border border-color rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-primary mb-2">Fehler beim Speichern</h2>
          <p className="text-secondary">
            Ihre Daten konnten nicht gespeichert werden.<br />
            Bitte versuchen Sie es erneut oder laden Sie die Daten herunter.
          </p>
          
          <div className="space-x-3">
            <button
              onClick={handleRetry}
              disabled={submissionState.isSubmitting}
              className="bg-accent hover:bg-[var(--accent-color-secondary)] text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50"
            >
              {submissionState.isSubmitting ? "Wird wiederholt..." : "Erneut versuchen"}
            </button>
            
            <button
              onClick={downloadData}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              Daten herunterladen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletionPhase;
