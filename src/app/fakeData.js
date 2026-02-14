// Fallback dummy data used when no real analysis result is available in sessionStorage
export const dummyResponse = {
  urgency: 65,
  sentiment: "Frustrated",
  summary: "Customer is frustrated with repeated billing errors and lack of follow-up from support.",
  drafts: {
    empathetic: {
      preview: "We sincerely apologize for the inconvenience you've experienced...",
      full: "We sincerely apologize for the inconvenience you've experienced. Your feedback is incredibly important to us, and we understand how frustrating this must be. Our team is looking into this matter right away, and we will do everything we can to resolve it promptly. Thank you for your patience.",
    },
    professional: {
      preview: "Thank you for bringing this to our attention. We have logged your concern...",
      full: "Thank you for bringing this to our attention. We have logged your concern and our support team is actively investigating the issue. You can expect an update within 24-48 hours. If you need immediate assistance, please don't hesitate to reach out.",
    },
    concise: {
      preview: "We've received your feedback and are working on a fix.",
      full: "We've received your feedback and are working on a fix. We'll follow up shortly.",
    },
  },
};
