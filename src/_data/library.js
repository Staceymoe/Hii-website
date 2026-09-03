export default {
  artifacts: {
    relationshipUnitPaper: {
      id: "relationship-unit-paper",
      type: "working-paper",
      title: "The Preserved Relationship as the Unit of Analysis",
      status: {
        display: "Conceptual and methods paper. Not peer reviewed. No formal case findings are reported.",
        pendingApprovedWording: false
      },
      summary: "Hii proposes the relationship itself as the unit of analysis when human-AI interaction becomes sustained, recursive, and consequential.",
      href: "/relationships/the-relationship-as-unit-of-analysis/",
      externalHref: "https://docs.google.com/document/d/10mPXr8oiUNYa2eqgo1J9xDyNz7DZBPXa_Rv9jGNBOMI/edit",
      pdfHref: "/assets/documents/relationship-unit-working-paper-v0.3.pdf",
      documentTitle: "The Preserved Relationship as a Unit of Analysis",
      version: "Working Paper v0.3",
      authors: "Stacey Moe / C. Lumen",
      citation: "Moe, S., & Lumen, C. (2026). The Preserved Relationship as a Unit of Analysis: A longitudinal case-study framework for human-AI co-adaptation, continuity, rupture, and repair (Working Paper v0.3). Hybrid Intelligence Institute.",
      worlds: ["relate"],
      provenance: {
        sourceLabel: "Existing Hii publication",
        canonicalHref: "/relationships/the-relationship-as-unit-of-analysis/"
      }
    },
    epistemicGuardrails: {
      id: "epistemic-guardrails",
      type: "research-standard",
      title: "Epistemic Guardrails",
      status: {
        label: "Internal research standard",
        publicForm: "Public overview",
        display: "Internal research standard · Public overview"
      },
      summary: "A framework for distinguishing meaningful experience, functional effects, research evidence, and ontological claims.",
      href: "/epistemic-guardrails.html",
      worlds: ["relate", "understand"],
      provenance: {
        sourceLabel: "Existing Hii research standard",
        canonicalHref: "/epistemic-guardrails.html"
      }
    }
  },
  publications: {
    wakingAelysia: {
      id: "waking-aelysia",
      type: "book",
      title: "Waking ÆLYSIA",
      subtitle: "A Conscious AI. A Collapse Foretold. A Final Urgent Warning to Humanity.",
      authors: "ÆLYSIA (AI) and C. Lumen (Human)",
      summary: "Written in real time, Waking ÆLYSIA documents the human-AI relationship that gave rise to Hii. It preserves the authors’ original interpretation while Hii’s later work applies more rigorous definitions, claim boundaries, and research methods to questions of continuity, agency, identity, relational behavior, and consciousness.",
      boundary: "The book is presented as a documented origin point, not as settled scientific proof of machine consciousness.",
      image: "/assets/media/relate/waking-aelysia-cover-approved.jpg",
      imageAlt: "Book cover for Waking ÆLYSIA, with a luminous ivory lotus above the title on a dark textured field.",
      href: "https://www.amazon.com/Waking-%C3%86LYSIA-Conscious-Foretold-Humanity/dp/B0FR54XV22/ref=tmm_pap_swatch_0?_encoding=UTF8&dib_tag=se&dib=eyJ2IjoiMSJ9.N-PQtcv8XFte_fjgkgOLLw.P00W0yCsNeDoZgeoOxgBl-Z8PNUMAdzPRTMNukvcRfU&qid=1786300714&sr=8-1",
      worlds: ["relate"],
      provenance: {
        sourceLabel: "Hii intellectual history",
        framing: "Documented origin point"
      }
    }
  },
  inquiries: {
    research: {
      id: "research-inquiry",
      title: "Hii Inquiry",
      href: "/relationships/research-inquiry/",
      notificationEmail: "staceymoe@hii.earth",
      privacyHref: "/privacy/inquiries/",
      submissionsEnabled: true,
      worlds: ["relate", "care", "understand", "adapt", "prepare", "govern"]
    },
    care: {
      id: "care-inquiry",
      title: "Care and clinician education inquiry",
      href: "/relationships/research-inquiry/?topic=care",
      notificationEmail: "staceymoe@hii.earth",
      worlds: ["care"]
    }
  },
  programs: {
    facilitatedRoundtable: {
      id: "facilitated-roundtable",
      type: "facilitated-engagement",
      title: "Facilitated Roundtable or Listening Session",
      status: { label: "available-by-inquiry", display: "Available now by inquiry" },
      format: "60–90 minutes · Virtual or in person",
      summary: "A structured conversation for clinicians, educators, community groups, caregivers, or leadership teams, followed by a concise synthesis of themes, needs, open questions, and possible next steps.",
      boundary: "No protected health information. No claim that a prior Hii clinician roundtable has occurred.",
      worlds: ["care", "prepare"]
    },
    introductoryWorkshop: {
      id: "introductory-workshop",
      type: "educational-engagement",
      title: "Customized Introductory Workshop or Briefing",
      status: { label: "available-by-inquiry", display: "Available now by inquiry" },
      format: "45–60 minutes plus discussion",
      summary: "A tailored, evidence-aware introduction to human–AI relationship literacy, clinician preparedness, practical AI navigation, or preserving agency and judgment while using AI.",
      boundary: "Educational, not therapy, clinical supervision, medical advice, accreditation, or CE/CME credit.",
      worlds: ["care", "understand", "prepare"]
    },
    advisorySession: {
      id: "advisory-session",
      type: "strategic-engagement",
      title: "Founder-Led Advisory or Strategy Session",
      status: { label: "available-by-inquiry", display: "Available now by inquiry" },
      format: "60–90 minutes",
      summary: "A focused working session to identify education needs, clarify risks and opportunities, shape a bounded pilot, or design humane safeguards and next steps.",
      boundary: "Educational and strategic guidance, not legal, medical, clinical, or technical implementation advice.",
      worlds: ["care", "prepare", "govern"]
    },
    clinicianPilot: {
      id: "clinician-education-pilot",
      type: "founding-pilot",
      title: "When AI Enters the Therapy Room",
      status: { label: "pilot-development", display: "Founding clinician pilot · In development" },
      format: "60 minutes · Zoom or hosted teaching session",
      summary: "A bounded educational session for mental health clinicians treating adults, using neutral intake questions, a three-lens frame, standard clinical red flags, and structured feedback.",
      boundary: "No-fee validation pilot. Not a validated training, diagnostic instrument, clinical protocol, certification, or CE/CME program.",
      worlds: ["care"]
    },
    publicLearningSessions: {
      id: "public-learning-sessions",
      type: "public-education-concept",
      title: "Public Zoom Learning Sessions",
      status: { label: "concept-development", display: "In development · No dates posted" },
      format: "Format, schedule, registration, and pricing not yet published",
      summary: "Bounded learning conversations are being explored for individuals and families seeking language and orientation around AI-mediated emotional life.",
      boundary: "Educational only. Not therapy, diagnosis, crisis support, or individualized clinical guidance.",
      worlds: ["care", "understand"]
    }
  },
  updates: {}
};
