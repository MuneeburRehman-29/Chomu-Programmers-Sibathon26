"use client";

import { createContext, useContext, useState, useCallback } from "react";

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [feedbacks, setFeedbacks] = useState([]);

  const addFeedback = useCallback((email, text) => {
    const newFeedback = {
      id: crypto.randomUUID(),
      email,
      text,
      timestamp: new Date().toISOString(),
      urgency: null,
      analysis: null,
    };
    setFeedbacks((prev) => [newFeedback, ...prev]);
    return newFeedback.id;
  }, []);

  const updateFeedbackAnalysis = useCallback((id, analysis) => {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id
          ? { ...fb, analysis, urgency: analysis?.urgency ?? fb.urgency }
          : fb
      )
    );
  }, []);

  const getFeedbackById = useCallback(
    (id) => feedbacks.find((fb) => fb.id === id) || null,
    [feedbacks]
  );

  return (
    <FeedbackContext.Provider
      value={{ feedbacks, addFeedback, updateFeedbackAnalysis, getFeedbackById }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
}
