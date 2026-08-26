export interface ArtProgram {
  id: string;
  num: string;
  name: string;
  category: string;
  tagline: string;
  tamilTitle?: string;
  description: string;
  pillars: {
    title: string;
    description: string;
  }[];
  outcomes: string[];
  progression: {
    stage: string;
    focus: string;
    duration: string;
  }[];
  metrics: {
    intensity: string;
    recoveryDemand: string;
    focusArea: string;
  };
  schedulePreview: string;
  whoIsThisFor: string;
}

export const ARTS_DATA: ArtProgram[] = [
  {
    id: "fitness",
    num: "01",
    name: "FITNESS",
    category: "Athletic Conditioning & Hypertrophy",
    tagline: "Science-driven resistance training, functional strength, and metabolic acceleration.",
    description: "Our athletic performance program bridges biomechanical precision and functional conditioning. Built for individuals seeking substantial strength gains, metabolic endurance, body recomposition, and structural longevity without burnout.",
    pillars: [
      {
        title: "Functional Strength & Hypertrophy",
        description: "Compound barbell, dumbbell, and kettlebell movements targeting full-body neuromuscular development."
      },
      {
        title: "High-Threshold Energy Systems",
        description: "Interval conditioning engineered to raise VO2 max, accelerate lipid oxidation, and sustain output under fatigue."
      },
      {
        title: "Structural Joint Longevity",
        description: "Postural correction protocols, hip/shoulder mobility work, and posterior chain stabilization."
      }
    ],
    outcomes: [
      "Substantial increase in power output and core stability",
      "Noticeable reduction in body fat with lean muscle retention",
      "Enhanced cardiovascular endurance and resting recovery",
      "Correction of desk-bound postural imbalances"
    ],
    progression: [
      { stage: "Phase 1: Movement Screening", focus: "Biomechanical baseline, core bracing, foundational movement patterns", duration: "Weeks 1–4" },
      { stage: "Phase 2: Progressive Overload", focus: "Hypertrophy protocols, strength development, metabolic threshold work", duration: "Weeks 5–12" },
      { stage: "Phase 3: High Performance", focus: "Complex athletic circuits, power conditioning, peak endurance benchmarks", duration: "Ongoing" }
    ],
    metrics: {
      intensity: "High (Variable)",
      recoveryDemand: "24–48 Hours",
      focusArea: "Strength, Body Composition, Stamina"
    },
    schedulePreview: "Mon, Wed, Fri — 05:30 AM | 07:30 AM | 06:30 PM | 07:30 PM",
    whoIsThisFor: "Working professionals, aspiring athletes, and fitness enthusiasts aiming for lean muscle and elite stamina."
  },
  {
    id: "yoga",
    num: "02",
    name: "YOGA",
    category: "Restorative Alignment & Prana Regulation",
    tagline: "Classical Hatha & Vinyasa integrated with therapeutic breathwork and mental stillness.",
    description: "A coursed practice rooted in classical traditions, focused on structural alignment, fascia decompression, respiratory control (Pranayama), and nervous system regulation to cultivate sustained mental clarity and physical resilience.",
    pillars: [
      {
        title: "Classical Asana & Flow",
        description: "Systematic posture sequences enhancing spine mobility, hip opening, and isometric core endurance."
      },
      {
        title: "Pranayama & Autonomic Balance",
        description: "Evidence-backed breathing protocols reducing cortisol and optimizing oxygen utilization."
      },
      {
        title: "Mindfulness & Mental Recovery",
        description: "Guided conscious stillness and somatic relaxation restoring cognitive clarity and sleep quality."
      }
    ],
    outcomes: [
      "Total body flexibility and chronic joint pain alleviation",
      "Balanced autonomic nervous system and lower resting stress levels",
      "Decompressed spine and corrected pelvic/shoulder alignment",
      "Sharpened daily cognitive focus and emotional composure"
    ],
    progression: [
      { stage: "Phase 1: Foundation & Breath", focus: "Surya Namaskar mastery, foundational alignment, diaphragm breathing", duration: "Weeks 1–4" },
      { stage: "Phase 2: Dynamic Vinyasa", focus: "Flow transitions, sustained balances, deep fascia release", duration: "Weeks 5–12" },
      { stage: "Phase 3: Deep Mastery", focus: "Advanced inversions, extended Pranayama, deep meditative absorption", duration: "Ongoing" }
    ],
    metrics: {
      intensity: "Moderate / Restorative",
      recoveryDemand: "Immediate Restoration",
      focusArea: "Flexibility, Spine Health, Stress Reduction"
    },
    schedulePreview: "Tue, Thu, Sat — 06:00 AM | 07:00 AM | 06:00 PM",
    whoIsThisFor: "Those seeking relief from stress, stiffness, back/neck pain, and individuals desiring serene mental focus."
  },
  {
    id: "martial-arts",
    num: "03",
    name: "MARTIAL ARTS",
    category: "Combat Dynamics & Practical Self-Defense",
    tagline: "Striking fundamentals, spatial awareness, defensive reflexes, and warrior course.",
    description: "A comprehensive martial course fusing Karate striking precision, Kickboxing footwork, and pragmatic self-defense mechanics. Built to develop unshakeable situational awareness, lightning reflexes, and fearless composure under pressure.",
    pillars: [
      {
        title: "Technical Striking Mechanics",
        description: "Fluid combinations of punches, kicks, knees, and elbow strikes with maximum kinetic efficiency."
      },
      {
        title: "Situational Defense & Countering",
        description: "Real-world release techniques, threat assessment, distance management, and evasive head movement."
      },
      {
        title: "Sparring & Reflex Calibration",
        description: "Controlled, padded drills designed to develop instantaneous reaction without injury."
      }
    ],
    outcomes: [
      "Practical, instinctual self-defense capability in real-world scenarios",
      "Superior hand-eye coordination and spatial peripheral awareness",
      "Exceptional cardiovascular endurance and explosive muscular power",
      "Iron course, situational calm, and unwavering self-confidence"
    ],
    progression: [
      { stage: "Novice (White/Yellow)", focus: "Stances, guards, straight punches, basic front/round kicks, breakfalls", duration: "3–6 Months" },
      { stage: "Intermediate (Green/Blue)", focus: "Pad combinations, slipping, counters, controlled sparring introduction", duration: "6–12 Months" },
      { stage: "Advanced (Brown/Black)", focus: "Multi-range combat, advanced Katas, technical sparring, instructor track", duration: "12+ Months" }
    ],
    metrics: {
      intensity: "High (Cardio-Combat)",
      recoveryDemand: "24 Hours",
      focusArea: "Self-Defense, Reflexes, Functional Power"
    },
    schedulePreview: "Mon, Wed, Fri — 06:00 AM | 05:00 PM (Kids) | 07:00 PM (Adults)",
    whoIsThisFor: "Kids (age 5+), teens, women seeking robust self-protection, and adults desiring high-energy combat conditioning."
  },
  {
    id: "silambam",
    num: "04",
    name: "SILAMBAM",
    category: "Ancient Tamil Martial Art & Weapon Mastery",
    tamilTitle: "பாரம்பரிய சிலம்பக் கலை",
    tagline: "Centuries of Tamil warrior heritage preserved through lightning staff twirling and dynamic footwork.",
    description: "Recognized as one of the world's most ancient weapons systems, Silambam is the quintessential martial art of Tamil Nadu. The course emphasizes intricate footwork (Kaaladi), high-velocity bamboo staff manipulation (Kambu Veechu), and acute peripheral acuity.",
    pillars: [
      {
        title: "18 Kaaladi Patterns",
        description: "Systematic geometric footwork sequences dictating angles of evasion, advancement, and balance."
      },
      {
        title: "Kambu Veechu & Spin Dynamics",
        description: "Single (Nedunkambu) and double stick velocity rotations creating continuous defensive perimeters."
      },
      {
        title: "Por Silambam & Tournament Katas",
        description: "Traditional sparring patterns and standardized forms for state and national tournament circuits."
      }
    ],
    outcomes: [
      "Ambidextrous coordination and razor-sharp reaction speed",
      "Significant wrist, forearm, shoulder girdle, and core strengthening",
      "Deep pride and connection to authentic Tamil cultural martial heritage",
      "Eligibility for recognized state/national championship certifications"
    ],
    progression: [
      { stage: "Kaaladi & Basic Veechu", focus: "Asan Vanakkam, Otta & Irattai Kaaladi, foundational figure-8 spins", duration: "3–6 Months" },
      { stage: "Por Silambam", focus: "Defensive perimeter rotations, two-person paired combat drills, speed twirling", duration: "6–12 Months" },
      { stage: "Mastery & Weaponry", focus: "Traditional weapons intro (Maan Kombu, Surul Vaal), tournament forms", duration: "12+ Months" }
    ],
    metrics: {
      intensity: "High (Agility & Speed)",
      recoveryDemand: "24 Hours",
      focusArea: "Weapon Coordination, Reflexes, Heritage"
    },
    schedulePreview: "Tue, Thu, Sat — 06:00 AM | 05:00 PM (Junior) | 06:30 PM (Senior)",
    whoIsThisFor: "Children, youth, culture enthusiasts, and martial artists seeking world-class staff coordination and agility."
  }
];

export const MEMBERSHIP_TIERS = [
  {
    id: "single",
    name: "Single Course",
    tagline: "Dedicated mastery in 1 chosen art.",
    price: "1,499",
    period: "month",
    description: "Ideal for individuals focused specifically on one goal — whether it is Functional Fitness, Classical Yoga, Combat Martial Arts, or Traditional Silambam.",
    features: [
      "Access to 1 dedicated course of your choice",
      "3 structured training sessions per week (12/mo)",
      "Standard instructor guidance and form checks",
      "Quarterly performance & milestone review",
      "Locker room & shower access"
    ],
    recommended: false,
    cta: "Select Single Art"
  },
  {
    id: "warrior",
    name: "Dual Course (Warrior)",
    tagline: "The most popular balanced training combination.",
    price: "2,499",
    period: "month",
    description: "Combine two complementary arts (e.g. Fitness + Martial Arts or Silambam + Yoga) for accelerated physical conditioning and mental balance.",
    features: [
      "Access to any 2 courses of your choice",
      "5 training sessions per week (20/mo)",
      "Dedicated biomechanical & form assessments",
      "Official Team Vajra training apparel included",
      "Eligibility for belt grading & tournament coaching",
      "Priority booking for weekend masterclasses"
    ],
    recommended: true,
    cta: "Join Warrior Track"
  },
  {
    id: "elite",
    name: "All-Access Elite",
    tagline: "Unrestricted access across all 4 courses.",
    price: "3,499",
    period: "month",
    description: "Complete immersion for dedicated practitioners. Train without limitations across Fitness, Yoga, Martial Arts, and Silambam with chief master mentorship.",
    features: [
      "Unlimited access to all 4 courses (Mon–Sat)",
      "Customized nutritional & recovery architecture",
      "Monthly 1-on-1 performance review with Chief Master",
      "Full Team Vajra Gear Pack (Uniform, Staff, Bag)",
      "State & National tournament registration pathways",
      "Complimentary guest access passes (2/month)"
    ],
    recommended: false,
    cta: "Get All-Access Elite"
  }
];

export const SCHEDULE_DAYS = [
  {
    day: "Monday",
    slots: [
      { time: "05:30 AM – 06:30 AM", art: "FITNESS", title: "Functional Strength & Conditioning", level: "All Levels" },
      { time: "06:30 AM – 07:30 AM", art: "YOGA", title: "Classical Hatha & Surya Flow", level: "All Levels" },
      { time: "05:00 PM – 06:00 PM", art: "MARTIAL ARTS", title: "Junior Combat & Self-Defense", level: "Ages 5–14" },
      { time: "06:00 PM – 07:00 PM", art: "FITNESS", title: "Metabolic HIIT & Core Burn", level: "All Levels" },
      { time: "07:00 PM – 08:30 PM", art: "MARTIAL ARTS", title: "Adult Combat & Sparring Drills", level: "Intermediate / Advanced" }
    ]
  },
  {
    day: "Tuesday",
    slots: [
      { time: "05:30 AM – 06:30 AM", art: "SILAMBAM", title: "Kaaladi Footwork & Kambu Drills", level: "All Levels" },
      { time: "06:30 AM – 07:30 AM", art: "YOGA", title: "Spine Alignment & Pranayama", level: "All Levels" },
      { time: "05:00 PM – 06:00 PM", art: "SILAMBAM", title: "Junior Silambam & Staff Basics", level: "Ages 5–14" },
      { time: "06:00 PM – 07:00 PM", art: "YOGA", title: "Restorative Vinyasa & Mobility", level: "All Levels" },
      { time: "07:00 PM – 08:30 PM", art: "SILAMBAM", title: "Por Silambam & Advanced Katas", level: "Intermediate / Advanced" }
    ]
  }
];

export const TESTIMONIALS = [
  {
    name: "Dr. Arvind Swaminathan",
    role: "Senior Consultant Orthopedic Surgeon",
    course: "Yoga & Functional Fitness",
    quote: "As a surgeon, I spend hours standing in the OR. The deliberate posture correction and breath control taught at Team Vajra eliminated my chronic lower back fatigue within two months.",
    metric: "Pain-Free Mobility"
  }
];

export const ACADEMY_FAQS = [
  {
    q: "I am a complete beginner with no athletic background. Can I join?",
    a: "Absolutely. Over 60% of our incoming students start with zero prior martial arts or fitness experience. Every course begins with foundational movement screenings and controlled pacing."
  },
  {
    q: "How does the Free Trial session work?",
    a: "Your trial class is a comprehensive 60-minute session where you train alongside our instructors in the course of your choice with zero financial commitment."
  }
];

export const FAQS_DATA = ACADEMY_FAQS;
