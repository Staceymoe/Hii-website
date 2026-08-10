const domains = [
  {
    id: "ai-capabilities",
    name: "AI Capabilities",
    short: "What AI systems can do, how they work, and how their capabilities change.",
    tone: "amber",
    glyph: "AI"
  },
  {
    id: "human-judgment-agency",
    name: "Human Judgment & Agency",
    short: "How people decide, evaluate, act, and retain meaningful control.",
    tone: "blue",
    glyph: "HJ"
  },
  {
    id: "information-environment",
    name: "Information Environment",
    short: "The content, systems, and conditions through which people know what to trust.",
    tone: "teal",
    glyph: "IE"
  },
  {
    id: "labor-economy",
    name: "Labor & Economy",
    short: "How work, roles, opportunity, and economic security are changing.",
    tone: "amber",
    glyph: "LE"
  },
  {
    id: "education-learning",
    name: "Education & Learning",
    short: "How people learn, practice, transfer knowledge, and develop capability.",
    tone: "blue",
    glyph: "EL"
  },
  {
    id: "health-well-being",
    name: "Health & Well-Being",
    short: "How AI affects physical, mental, emotional, and cognitive health.",
    tone: "teal",
    glyph: "HW"
  },
  {
    id: "governance-policy",
    name: "Governance & Policy",
    short: "How institutions, laws, standards, and public choices shape the transition.",
    tone: "teal",
    glyph: "GP"
  },
  {
    id: "society-culture",
    name: "Society & Culture",
    short: "How norms, values, relationships, identity, and collective behavior evolve.",
    tone: "amber",
    glyph: "SC"
  }
];

const questions = [
  {
    slug: "is-ai-changing-how-i-think",
    question: "Is AI changing how I think?",
    state: "Research preview available",
    active: true,
    glyph: "01"
  },
  {
    slug: "how-do-i-know-what-is-real-online",
    question: "How do I know what is real online?",
    state: "Research in development",
    active: false,
    glyph: "02"
  },
  {
    slug: "how-is-ai-changing-work",
    question: "How is AI changing work and what should I prepare for?",
    state: "Research in development",
    active: false,
    glyph: "03"
  }
];

const relationships = [
  {
    from: "ai-capabilities",
    to: "human-judgment-agency",
    trajectory: "emerging",
    strength: "strong",
    mechanism: "Easier delegation changes where effort is applied. Confidence, skill, and verification practices shape whether critical effort is preserved or displaced."
  },
  {
    from: "information-environment",
    to: "human-judgment-agency",
    trajectory: "emerging",
    strength: "moderate",
    mechanism: "External answer access can affect memory strategy and self-assessed knowledge, while search and verification choices shape what is trusted."
  },
  {
    from: "ai-capabilities",
    to: "education-learning",
    trajectory: "emerging",
    strength: "moderate",
    mechanism: "Interfaces can supply answers or scaffold reasoning. Learning goals help determine which capabilities are appropriate to expose."
  }
];

export default {
  status: "Unreleased research preview",
  reviewed: "Candidate records reviewed August 9, 2026",
  questions,
  domains,
  relationships,
  pilot: {
    slug: "is-ai-changing-how-i-think",
    question: "Is AI changing how I think?",
    orientation: "AI can change which parts of a task you perform yourself and which you delegate. Research shows both immediate benefits and context-specific risks, while long-term cognitive effects remain unresolved.",
    whatWeKnow: [
      "Cognitive offloading is an established human behavior. External tools can reduce demand and can also free attention for higher-level work.",
      "Generative AI can improve immediate performance in selected, bounded tasks.",
      "Effects depend on the task, interface, user confidence and skill, and whether AI replaces effort or scaffolds reflection."
    ],
    whatMayBeChanging: [
      "Some knowledge workers report shifting effort from producing toward verifying, integrating, and directing.",
      "Assisted performance and independent learning can diverge in some settings.",
      "Long-term effects on memory, reasoning, and independent problem-solving remain unresolved."
    ],
    whatToNotice: [
      "When AI gives a confident answer, do I verify it more carefully or less carefully?",
      "Am I using AI to compare and explain, or to replace my own first attempt?",
      "What can I still recall, explain, or do independently after using the tool?",
      "Does the interaction broaden the alternatives I consider, or make the first plausible answer feel sufficient?"
    ],
    takeaway: "AI is not simply improving or degrading thought. Its effect depends on what a person delegates, how the system is designed, and whether the interaction preserves reflection, verification, and independent practice.",
    takeawayConfidence: "High confidence in conditionality. The exact moderators and long-term effects remain incomplete.",
    domainIds: ["human-judgment-agency", "ai-capabilities", "information-environment", "education-learning"],
    watch: [
      "Cognitive offloading and independent recall",
      "Confidence calibration and verification effort",
      "Transfer from AI-assisted practice to independent performance"
    ],
    signals: [
      {
        title: "Cognitive work may be shifting toward oversight",
        summary: "In some knowledge work, generative AI is changing where people report applying critical thought.",
        state: "Moderate significance · mixed direction"
      },
      {
        title: "Assisted performance and independent learning can diverge",
        summary: "One randomized mathematics field experiment found materially different outcomes between direct assistance and a guarded tutor.",
        state: "High significance · bounded finding"
      },
      {
        title: "Long-term cognitive effects remain an open question",
        summary: "Current evidence is stronger for short-run task behavior than for durable cognitive change.",
        state: "High significance · unresolved"
      }
    ],
    limitations: [
      "Evidence is concentrated in limited tasks, populations, and short time horizons.",
      "Search-era findings provide mechanism context but are not direct evidence about current generative AI.",
      "No reviewed evidence justifies a universal claim that AI improves or harms cognition."
    ]
  }
};
