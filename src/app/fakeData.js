// File: src/app/fakeData.js
export const dummyResponse = {
  urgency: 85,
  sentiment: "Frustrated",
  drafts: {
    empathetic: {
      preview: "I am deeply sorry for the delay...",
      full: "Dear Customer,\n\nI am deeply sorry for the delay in addressing your concern. I completely understand how frustrating this must have been for you, and I want you to know that your experience matters greatly to us.\n\nWe have thoroughly investigated the issue and have taken the following steps to resolve it:\n\n1. Your account has been credited with a full refund for the affected order.\n2. We have escalated the matter to our quality assurance team to prevent similar issues in the future.\n3. A dedicated support agent has been assigned to your case for any follow-up needs.\n\nPlease don't hesitate to reach out if there's anything else we can do. We truly value your patience and continued trust in our services.\n\nWarm regards,\nCustomer Support Team",
    },
    professional: {
      preview: "Thank you for reaching out regarding...",
      full: "Dear Customer,\n\nThank you for reaching out regarding your recent experience. We acknowledge the issue you have reported and sincerely apologize for any inconvenience caused.\n\nAfter reviewing your case, we have identified the root cause and implemented the following corrective actions:\n\n1. A full refund has been processed to your original payment method (please allow 3-5 business days).\n2. Your case has been documented and shared with our operations team for process improvement.\n3. We have updated our systems to prevent recurrence of this issue.\n\nShould you require any further assistance, please do not hesitate to contact us. We appreciate your understanding.\n\nBest regards,\nCustomer Support Team",
    },
    concise: {
      preview: "We have fixed the issue.",
      full: "Hi,\n\nWe've resolved the issue you reported. A full refund has been processed and should appear within 3-5 business days.\n\nLet us know if you need anything else.\n\nThanks,\nSupport Team",
    },
  },
};