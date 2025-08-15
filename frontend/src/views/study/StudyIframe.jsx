import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorCard from "../../components/ErrorCard";
import InitialPhase from "./Phases/InitialPhase";
import { theses } from "../../data/theses";
import ChatPhase from "./Phases/ChatPhase";
import FinalAssessment from "./Phases/FinalAssessment";
import CompletionPhase from "./Phases/CompletionPhase";

const phases = ["initial", "chat", "final", "completion"];

const StudyIframe = () => {
  const [searchParams] = useSearchParams();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [validationError, setValidationError] = useState(null);
  const [studyParams, setStudyParams] = useState(null);

  // Central study data object
  const [studyData, setStudyData] = useState({
    prolificPid: "",
    group: "",
    thesisId: null,
    thesisText: "",
    run: null,
    initialPosition: null,
    initialInformation: null,
    initialStatement: "",
    chatHistory: [],
    finalPosition: null,
    finalInformation: null,
    timestamps: {
      iframeOpen: Date.now(),
      chatStart: null,
      chatEnd: null,
      completion: null,
    }
  });

  // Submission state
  const [submissionState, setSubmissionState] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  useEffect(() => {
    try {
      const prolificPid = searchParams.get("PROLIFIC_PID");
      const group = searchParams.get("group");
      const thesisId = searchParams.get("thesis_id");
      const run = searchParams.get("run");

      const errors = [];

      // Check for missing parameters
      if (!prolificPid || prolificPid.trim() === "") {
        errors.push("Missing PROLIFIC_PID parameter");
      }
      if (!group || group.trim() === "") {
        errors.push("Missing group parameter");
      }
      if (!thesisId || thesisId.trim() === "") {
        errors.push("Missing thesis_id parameter");
      }
      if (!run || run.trim() === "") {
        errors.push("Missing run parameter");
      }

      // Convert and validate thesis_id
      let thesisIdInt = null;
      if (thesisId && thesisId.trim()) {
        thesisIdInt = parseInt(thesisId.trim(), 10);
        if (isNaN(thesisIdInt)) {
          errors.push("thesis_id must be a valid integer");
        } else if (![1, 4, 5].includes(thesisIdInt)) {
          errors.push("thesis_id must be 1, 4, or 5");
        }
      }

      // Convert and validate run
      let runInt = null;
      if (run && run.trim()) {
        runInt = parseInt(run.trim(), 10);
        if (isNaN(runInt)) {
          errors.push("run must be a valid integer");
        }
      }

      // Validate group
      if (group && group.trim() && !['A', 'B', 'C'].includes(group)) {
        errors.push("group must be 'A', 'B', or 'C'");
      }

      if (errors.length > 0) {
        setValidationError(errors.join(" | "));
        setStudyParams(null);
      } else {
        setValidationError(null);
        setStudyParams({
          prolificPid: prolificPid.trim(),
          group: group.trim(),
          thesisId: thesisIdInt,
          run: runInt
        });
        setStudyData(prev => {
          const thesisObj = theses.find(t => t.id === thesisIdInt) || {};
          return {
            ...prev,
            prolificPid: prolificPid.trim(),
            group: group.trim(),
            thesisId: thesisIdInt,
            thesisTitle: thesisObj.title || "",
            thesisText: thesisObj.text || "",
            run: runInt,
            initialPosition: 50,
            initialInformation: 50,
            finalPosition: 50,
            finalInformation: 50
          };
        });
      }
    } catch {
      setValidationError("Validation failed (caught in catch)");
      setStudyParams(null);
    }
  }, []); // Only run once on mount

  const submitStudyData = async (dataToSubmit) => {
    setSubmissionState({
      isSubmitting: true,
      isSubmitted: false,
      error: null
    });

    try {
      const response = await fetch('/study/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setSubmissionState({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });

      return true; // Success
    } catch (err) {
      setSubmissionState({
        isSubmitting: false,
        isSubmitted: false,
        error: `Fehler beim Speichern der Daten: ${err.message}`
      });
      return false; // Failure
    }
  };

  const nextPhase = async (completedData = null) => {
    const currentPhase = phases[phaseIndex];
    
    // If moving from final to completion phase, submit data first
    if (currentPhase === "final") {
      // Use the provided completed data or fall back to current studyData
      const dataToSubmit = completedData || studyData;
      const success = await submitStudyData(dataToSubmit);
      // Always proceed to completion phase regardless of submission success
      // CompletionPhase will show the appropriate message
    }
    
    setPhaseIndex((idx) => Math.min(idx + 1, phases.length - 1));
  };

  if (validationError) {
    return (
      <ErrorCard
        title="Fehler beim erstellen des iFrames"
        message={validationError}
      />
    );
  }


  const phase = phases[phaseIndex];

  // Use if/else for phase rendering
  if (phase === "chat") {
    return (
      <ChatPhase
        nextPhase={nextPhase}
        studyParams={studyParams}
        studyData={studyData}
        setStudyData={setStudyData}
      />
    );
  } else {
    return (
      <div className="bg-primary text-text-primary min-h-screen max-w-2xl py-10 px-5 mx-auto">
        {phase === "initial" && (
          <InitialPhase
            nextPhase={nextPhase}
            studyParams={studyParams}
            studyData={studyData}
            setStudyData={setStudyData}
          />
        )}
        {phase === "final" && (
          <FinalAssessment
            nextPhase={nextPhase}
            studyParams={studyParams}
            studyData={studyData}
            setStudyData={setStudyData}
          />
        )}
        {phase === "completion" && (
          <CompletionPhase
            studyParams={studyParams}
            studyData={studyData}
            setStudyData={setStudyData}
            submissionState={submissionState}
            retrySubmission={() => submitStudyData(studyData)}
          />
        )}
      </div>
    );
  }
};

export default StudyIframe;
