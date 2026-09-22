// ─── TapServe Capstone Demo Data & Persistence Store ──────────────────────────
// Household services platform in San Pablo City, Laguna

const A = "/assets/";

export interface ServiceCategory {
  id: string;
  name: string;
  emoji: string;
  enabled: boolean;
  count: number;
}

export interface ReviewItem {
  id: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  date: string;
  comment: string;
  isAnonymous?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Provider {
  id: string;
  name: string;
  photo: string;
  bannerPhoto?: string;
  category: string; // e.g. "Plumbing"
  categoryId: string; // e.g. "plumbing"
  specialization: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  yearsExperience: number;
  hourlyRate: number;
  area: string;
  distance: string;
  isVerified: boolean;
  description: string;
  services: string[];
  workingDays: string[];
  workingHours: string;
  isAcceptingBookings: boolean;
  availableSlots: Record<string, string[]>; // dateKey -> array of available time strings
  reviews: ReviewItem[];
}

export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "On the Way"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export interface Booking {
  id: string; // e.g. "TS-2026-00125"
  providerId: string;
  providerName: string;
  providerPhoto: string;
  serviceCategory: string;
  serviceDetail: string;
  date: string; // e.g. "Today, Oct 12"
  time: string; // e.g. "2:00 PM"
  address: string;
  clientName: string;
  clientPhone: string;
  problemDescription: string;
  urgencyLevel: "Low" | "Medium" | "High";
  photoUrl?: string;
  estimatedCost: number;
  paymentMethod: "Cash Payment";
  status: BookingStatus;
  cancellationReason?: string;
  createdAt: string;
  reviewed?: boolean;
  userRating?: number;
  userReviewText?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  houseUnit: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  postalCode?: string;
  landmark?: string;
  isDefault: boolean;
}

export interface NotificationSettings {
  bookingConfirm: boolean;
  providerAccepted: boolean;
  providerOtw: boolean;
  serviceStarted: boolean;
  serviceCompleted: boolean;
  bookingCancel: boolean;
  newMessages: boolean;
  aiResponses: boolean;
  providerAvail: boolean;
  appStatus: boolean;
  loginAlerts: boolean;
  promotions: boolean;
}

export interface UserAccount {
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  memberSince: string;
  isProvider: boolean;
  providerApplicationStatus?:
    | "None"
    | "Submitted"
    | "Under Review"
    | "Additional Documents Required"
    | "Approved"
    | "Rejected";
}

export interface ProviderApplicationData {
  fullName: string;
  dob: string;
  age: string;
  address: string;
  contactNumber: string;
  email: string;
  profilePhotoName?: string;
  category: string;
  specialization: string;
  yearsExperience: string;
  description: string;
  serviceArea: string;
  workingDays: string[];
  workingHours: string;
  documents: {
    govId?: string;
    proofAddress?: string;
    certifications?: string;
    trainingCerts?: string;
    nbiClearance?: string;
    barangayClearance?: string;
    otherDocs?: string;
  };
  termsAgreed: boolean;
  status: "Submitted" | "Under Review" | "Additional Documents Required" | "Approved" | "Rejected";
  submittedAt: string;
}

// ─── Default Seed Categories ──────────────────────────────────────────────────

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  { id: "cleaning", name: "Cleaning", emoji: "🧹", enabled: true, count: 4 },
  { id: "plumbing", name: "Plumbing", emoji: "🔧", enabled: true, count: 3 },
  { id: "electrical", name: "Electrical", emoji: "⚡", enabled: true, count: 2 },
  { id: "gardening", name: "Gardening", emoji: "🌿", enabled: true, count: 2 },
  { id: "appliance-repair", name: "Appliance Repair", emoji: "🔌", enabled: true, count: 2 },
  { id: "carpentry", name: "Carpentry", emoji: "🪚", enabled: true, count: 1 },
  { id: "home-maintenance", name: "Home Maintenance", emoji: "🏠", enabled: true, count: 2 },
  { id: "aircon", name: "Aircon Cleaning", emoji: "❄️", enabled: true, count: 2 },
  { id: "painting", name: "Painting", emoji: "🖌️", enabled: true, count: 1 },
  { id: "pest-control", name: "Pest Control", emoji: "🐛", enabled: true, count: 1 },
  { id: "moving", name: "Moving Assistance", emoji: "📦", enabled: true, count: 1 },
  { id: "other", name: "Other Services", emoji: "✨", enabled: true, count: 1 },
];

// ─── 12 Comprehensive Philippine Service Providers ───────────────────────────

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: "p-reynaldo",
    name: "Kuya Reynaldo",
    photo: `${A}81684.png`,
    category: "Plumbing",
    categoryId: "plumbing",
    specialization: "Master Plumber & Pipe Specialist",
    rating: 4.9,
    reviewCount: 142,
    completedJobs: 142,
    yearsExperience: 12,
    hourlyRate: 350,
    area: "Brgy. San Roque, San Pablo City",
    distance: "1.2 km away",
    isVerified: true,
    description: "TESDA-certified Master Plumber with over 12 years of hands-on experience in residential and commercial plumbing across San Pablo City. Specializes in hidden leak detection, water pressure systems, and bathroom remodeling.",
    services: [
      "Leak Detection & Pipe Repair",
      "Drain Unclogging & Descaling",
      "Faucet & Toilet Installation",
      "Water Heater Setup & Checkup",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "10:30 AM", "3:30 PM", "5:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"],
      "Wed, Oct 14": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    },
    reviews: [
      {
        id: "rev-1",
        userName: "Juan Dela Cruz",
        rating: 5,
        date: "2 days ago",
        comment: "Salamat Kuya! Napaka-ayos ng gawa sa aming lumaking toilet leak. Walang kalat pagkatapos.",
      },
      {
        id: "rev-2",
        userName: "Sonia Mercado",
        rating: 5,
        date: "1 week ago",
        comment: "Punctual, friendly and diagnosed the broken PVC elbow immediately. Very reasonable rate!",
      },
      {
        id: "rev-3",
        userName: "Anonymous Client",
        rating: 5,
        date: "2 weeks ago",
        comment: "Mabilis dumating nung nag-emergency call kami sa baradong lababo. Highly recommended.",
        isAnonymous: true,
      },
    ],
  },
  {
    id: "p-maria",
    name: "Ate Maria",
    photo: `${A}9dc21.png`,
    category: "Cleaning",
    categoryId: "cleaning",
    specialization: "Deep Cleaning & Disinfection Expert",
    rating: 4.8,
    reviewCount: 98,
    completedJobs: 115,
    yearsExperience: 7,
    hourlyRate: 280,
    area: "Brgy. Concepcion, San Pablo City",
    distance: "2.4 km away",
    isVerified: true,
    description: "Thorough, meticulous, and trustworthy home cleaner. Provides own eco-friendly and pet-safe cleaning supplies. Specializes in move-in/move-out deep cleaning, kitchen degreasing, and post-construction cleanup.",
    services: [
      "Standard House Cleaning",
      "Deep Kitchen Degreasing",
      "Bathroom Sanitation & Descaling",
      "Post-Renovation Cleaning",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 4:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["1:00 PM", "3:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "11:00 AM", "2:00 PM"],
      "Wed, Oct 14": ["8:30 AM", "1:30 PM", "3:30 PM"],
    },
    reviews: [
      {
        id: "rev-m1",
        userName: "Carla P.",
        rating: 5,
        date: "3 days ago",
        comment: "Kinang ang kusina at banyo namin pagkatapos linisin ni Ate Maria. Sulit na sulit!",
      },
      {
        id: "rev-m2",
        userName: "Mark Anthony",
        rating: 4,
        date: "2 weeks ago",
        comment: "Very detailed cleaning and she arrived right on time with all her supplies.",
      },
    ],
  },
  {
    id: "p-jose",
    name: "Kuya Jose",
    photo: `${A}b0037.png`,
    category: "Electrical",
    categoryId: "electrical",
    specialization: "Master Electrician & Wiring Specialist",
    rating: 4.7,
    reviewCount: 85,
    completedJobs: 92,
    yearsExperience: 10,
    hourlyRate: 320,
    area: "Brgy. Sampaloc Lake, San Pablo City",
    distance: "1.8 km away",
    isVerified: true,
    description: "Registered Master Electrician handling residential circuit troubleshooting, breaker installation, short-circuit diagnostics, and smart lighting installations.",
    services: [
      "Breaker & Panel Box Upgrades",
      "Short Circuit Diagnosis",
      "Lighting & Ceiling Fan Installation",
      "Home Rewiring & Safety Check",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"],
    workingHours: "8:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["11:00 AM", "2:00 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "10:30 AM", "1:30 PM"],
      "Wed, Oct 14": ["9:00 AM", "1:00 PM", "3:00 PM"],
    },
    reviews: [
      {
        id: "rev-j1",
        userName: "Rene Garcia",
        rating: 5,
        date: "5 days ago",
        comment: "Nahanap agad yung grounded na saksakan sa kusina. Ligtas na ulit bahay namin.",
      },
    ],
  },
  {
    id: "p-cardo",
    name: "Kuya Cardo",
    photo: `${A}6f77b.png`,
    category: "Plumbing",
    categoryId: "plumbing",
    specialization: "Emergency Pipe & Sewer Line Repair",
    rating: 4.9,
    reviewCount: 210,
    completedJobs: 210,
    yearsExperience: 15,
    hourlyRate: 380,
    area: "Brgy. Del Remedio, San Pablo City",
    distance: "2.5 km away",
    isVerified: true,
    description: "Veteran emergency plumber equipped with motorized drain augers and pressure leak detectors. Ready for urgent clogged sewer lines and burst pipes.",
    services: [
      "Emergency Sewer Clearing",
      "Burst Water Pipe Replacement",
      "Water Tank & Pump Installation",
      "Underground Drainage Repair",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    workingHours: "7:00 AM – 8:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "1:00 PM", "4:30 PM"],
      "Tomorrow, Oct 13": ["9:30 AM", "11:30 AM", "3:00 PM"],
      "Wed, Oct 14": ["8:00 AM", "10:00 AM", "2:00 PM"],
    },
    reviews: [
      {
        id: "rev-c1",
        userName: "Edgar Ramos",
        rating: 5,
        date: "Yesterday",
        comment: "Kahit gabi na pumunta pa rin para ayusin ang pumutok na tubo sa garahe. Saludo!",
      },
    ],
  },
  {
    id: "p-benjie",
    name: "Kuya Benjie",
    photo: `${A}e06f4.png`,
    category: "Gardening",
    categoryId: "gardening",
    specialization: "Lawn Care & Landscaping Specialist",
    rating: 4.8,
    reviewCount: 76,
    completedJobs: 80,
    yearsExperience: 8,
    hourlyRate: 250,
    area: "Brgy. San Jose, San Pablo City",
    distance: "3.1 km away",
    isVerified: true,
    description: "Passionate landscape gardener specializing in grass trimming, ornamental tree pruning, soil revitalization, and garden pest mitigation.",
    services: [
      "Grass Cutting & Weed Trimming",
      "Tree & Shrub Pruning",
      "Garden Re-planting & Landscaping",
      "Organic Plant Fertilizer Application",
    ],
    workingDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    workingHours: "7:00 AM – 4:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "10:00 AM"],
      "Tomorrow, Oct 13": ["7:30 AM", "9:30 AM", "1:00 PM"],
      "Wed, Oct 14": ["8:00 AM", "11:00 AM"],
    },
    reviews: [
      {
        id: "rev-b1",
        userName: "Lorna Santos",
        rating: 5,
        date: "4 days ago",
        comment: "Napakalinis ng tabas sa damuhan namin at tinapon pa lahat ng tuyong dahon.",
      },
    ],
  },
  {
    id: "p-elena",
    name: "Ate Elena",
    photo: `${A}9dc21.png`,
    category: "Cleaning",
    categoryId: "cleaning",
    specialization: "Home & Office Sanitization",
    rating: 4.9,
    reviewCount: 114,
    completedJobs: 130,
    yearsExperience: 6,
    hourlyRate: 270,
    area: "Brgy. San Francisco, San Pablo City",
    distance: "1.5 km away",
    isVerified: true,
    description: "Certified hygienic housekeeping specialist. Uses hospital-grade sanitizers and steam cleaners for mattresses, sofas, and carpets.",
    services: [
      "Steam Cleaning & Upholstery",
      "Mattress Dust Mite Treatment",
      "Window & Glass Washing",
      "Condo / Apartment Move-in Clean",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:30 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "11:30 AM", "2:30 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "1:00 PM", "3:30 PM"],
      "Wed, Oct 14": ["9:00 AM", "2:00 PM"],
    },
    reviews: [
      {
        id: "rev-e1",
        userName: "Grace Lim",
        rating: 5,
        date: "1 week ago",
        comment: "Nawala ang mantsa sa sofa namin! Parang bago ulit.",
      },
    ],
  },
  {
    id: "p-dennis",
    name: "Kuya Dennis",
    photo: `${A}b0037.png`,
    category: "Appliance Repair",
    categoryId: "appliance-repair",
    specialization: "Refrigerator & Washing Machine Technician",
    rating: 4.6,
    reviewCount: 62,
    completedJobs: 70,
    yearsExperience: 9,
    hourlyRate: 350,
    area: "Brgy. Sta. Veronica, San Pablo City",
    distance: "2.0 km away",
    isVerified: true,
    description: "Expert diagnostics on inverter refrigerators, automatic washing machines, and microwave ovens. Carries genuine replacement parts.",
    services: [
      "Refrigerator Gas Refill & Leak Fix",
      "Washing Machine Motor & Drain Pump",
      "Microwave Oven Circuit Fix",
      "Induction Cooker Repair",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "1:00 PM", "3:00 PM"],
      "Tomorrow, Oct 13": ["8:30 AM", "11:00 AM", "2:00 PM"],
      "Wed, Oct 14": ["10:00 AM", "1:30 PM"],
    },
    reviews: [
      {
        id: "rev-d1",
        userName: "Vicente Flores",
        rating: 5,
        date: "6 days ago",
        comment: "Mabilis nahanap kung bakit di lumalamig yung freezer. Magaling at magalang.",
      },
    ],
  },
  {
    id: "p-grace",
    name: "Ate Grace",
    photo: `${A}9dc21.png`,
    category: "Aircon Cleaning",
    categoryId: "aircon",
    specialization: "Split & Window Inverter Aircon Servicing",
    rating: 4.9,
    reviewCount: 150,
    completedJobs: 175,
    yearsExperience: 8,
    hourlyRate: 350,
    area: "Brgy. Bagong Bayan, San Pablo City",
    distance: "1.7 km away",
    isVerified: true,
    description: "High-pressure coil wash, freon replenishment, and blower maintenance for all major brands (Daikin, Panasonic, Carrier, Condura).",
    services: [
      "Inverter Aircon Chemical Cleaning",
      "Freon R32 / R410A Re-charging",
      "Water Drip & Drainage Unclogging",
      "Thermostat & PCB Board Check",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "10:00 AM", "1:00 PM"],
      "Wed, Oct 14": ["9:30 AM", "11:30 AM", "3:00 PM"],
    },
    reviews: [
      {
        id: "rev-g1",
        userName: "Dra. Ramos",
        rating: 5,
        date: "3 days ago",
        comment: "Lumamig agad ang clinic pagkatapos ng chemical wash. Walang tumulo sa sahig.",
      },
    ],
  },
  {
    id: "p-noli",
    name: "Kuya Noli",
    photo: `${A}81684.png`,
    category: "Carpentry",
    categoryId: "carpentry",
    specialization: "Custom Furniture & Cabinet Repair",
    rating: 4.9,
    reviewCount: 130,
    completedJobs: 140,
    yearsExperience: 14,
    hourlyRate: 320,
    area: "Brgy. San Crispin, San Pablo City",
    distance: "2.7 km away",
    isVerified: true,
    description: "Skilled woodwork artisan. Handles door re-hanging, wooden sliding window fixes, custom kitchen pantry cabinets, and roof truss repairs.",
    services: [
      "Kitchen Cabinet Alignment & Hardware",
      "Wooden Door Framing & Lock Installation",
      "Custom Shelving & Bookcases",
      "Floorboard & Wood Deck Repair",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:30 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:00 PM", "3:30 PM"],
      "Wed, Oct 14": ["8:00 AM", "11:00 AM"],
    },
    reviews: [
      {
        id: "rev-n1",
        userName: "Antonio Cruz",
        rating: 5,
        date: "1 week ago",
        comment: "Pino ang pagkakagawa sa aming dining table at kabinet. Maasahan.",
      },
    ],
  },
  {
    id: "p-bong",
    name: "Kuya Bong",
    photo: `${A}6f77b.png`,
    category: "Home Maintenance",
    categoryId: "home-maintenance",
    specialization: "Roof Leak Sealing & Gutter Maintenance",
    rating: 4.7,
    reviewCount: 95,
    completedJobs: 105,
    yearsExperience: 11,
    hourlyRate: 300,
    area: "Brgy. Soledad, San Pablo City",
    distance: "3.5 km away",
    isVerified: true,
    description: "Rainy season waterproofing expert. Fixes roof flashing, gutters, ceiling watermarks, and cement crack vulcanizing.",
    services: [
      "Corrugated Sheet Vulca-Seal Coating",
      "Rain Gutter Declogging & Re-alignment",
      "Ceiling Water Damage Replacement",
      "Exterior Wall Crack Waterproofing",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:30 AM – 4:30 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:30 AM", "1:30 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "10:30 AM", "2:30 PM"],
      "Wed, Oct 14": ["9:00 AM", "1:00 PM"],
    },
    reviews: [
      {
        id: "rev-bo1",
        userName: "Fely Diaz",
        rating: 5,
        date: "5 days ago",
        comment: "Wala nang tulo sa kwarto namin nung umulan kahapon. Maraming salamat Kuya Bong!",
      },
    ],
  },
  {
    id: "p-manny",
    name: "Kuya Manny",
    photo: `${A}e06f4.png`,
    category: "Pest Control",
    categoryId: "pest-control",
    specialization: "Termite & General Pest Extermination",
    rating: 4.8,
    reviewCount: 88,
    completedJobs: 94,
    yearsExperience: 9,
    hourlyRate: 400,
    area: "Brgy. San Mateo, San Pablo City",
    distance: "2.9 km away",
    isVerified: true,
    description: "Licensed pest controller utilizing safe, FDA-approved misting and baiting systems for termites, cockroaches, rodents, and ants.",
    services: [
      "Subterranean Termite Soil Barrier",
      "Gel Baiting & Residual Spraying",
      "Rodent Control & Exclusion",
      "Full House Disinfection & Misting",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "1:30 PM", "4:00 PM"],
      "Wed, Oct 14": ["8:30 AM", "11:00 AM"],
    },
    reviews: [
      {
        id: "rev-mn1",
        userName: "Ricardo T.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Nawala ang mga anay sa kisame namin. May warranty pa na binigay.",
      },
    ],
  },
  {
    id: "p-lito",
    name: "Kuya Lito",
    photo: `${A}81684.png`,
    category: "Painting",
    categoryId: "painting",
    specialization: "Interior & Exterior House Painter",
    rating: 4.8,
    reviewCount: 102,
    completedJobs: 110,
    yearsExperience: 13,
    hourlyRate: 280,
    area: "Brgy. Sta. Maria, San Pablo City",
    distance: "2.2 km away",
    isVerified: true,
    description: "Expert surface preparation, primer application, waterproofing paint, and decorative interior accent walls.",
    services: [
      "Interior Wall & Ceiling Repainting",
      "Exterior Elastomeric Paint Application",
      "Wood Stain & Varnish Refinishing",
      "Metal Gate & Grille Anti-Rust Painting",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:30 AM – 4:30 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "11:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "1:00 PM"],
      "Wed, Oct 14": ["9:00 AM", "1:30 PM"],
    },
    reviews: [
      {
        id: "rev-lt1",
        userName: "Bea Alonzo",
        rating: 5,
        date: "3 days ago",
        comment: "Pantay na pantay ang pintura sa sala namin. Walang tapon sa sahig.",
      },
    ],
  },
];

// ─── Default Demo Bookings ────────────────────────────────────────────────────

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "TS-2026-00125",
    providerId: "p-reynaldo",
    providerName: "Kuya Reynaldo",
    providerPhoto: `${A}81684.png`,
    serviceCategory: "Plumbing",
    serviceDetail: "Leak Detection & Pipe Repair",
    date: "Today, Oct 12",
    time: "2:00 PM",
    address: "123 Sample Street, Brgy. San Roque, San Pablo City",
    clientName: "Carlo Santos",
    clientPhone: "+63 917 555 1234",
    problemDescription: "May leak sa ilalim ng aming kitchen sink basin. Lumalaki na ang basa sa sahig.",
    urgencyLevel: "High",
    photoUrl: `${A}c2bb0.png`,
    estimatedCost: 350,
    paymentMethod: "Cash Payment",
    status: "In Progress",
    createdAt: "2026-10-12T06:30:00.000Z",
  },
  {
    id: "TS-2026-00098",
    providerId: "p-maria",
    providerName: "Ate Maria",
    providerPhoto: `${A}9dc21.png`,
    serviceCategory: "Cleaning",
    serviceDetail: "Deep Kitchen Degreasing & Bathroom Sanitation",
    date: "Tomorrow, Oct 13",
    time: "9:00 AM",
    address: "123 Sample Street, Brgy. San Roque, San Pablo City",
    clientName: "Carlo Santos",
    clientPhone: "+63 917 555 1234",
    problemDescription: "General deep cleaning for weekend family gathering.",
    urgencyLevel: "Medium",
    estimatedCost: 560,
    paymentMethod: "Cash Payment",
    status: "Accepted",
    createdAt: "2026-10-11T14:15:00.000Z",
  },
  {
    id: "TS-2026-00074",
    providerId: "p-jose",
    providerName: "Kuya Jose",
    providerPhoto: `${A}b0037.png`,
    serviceCategory: "Electrical",
    serviceDetail: "Breaker & Panel Box Upgrades",
    date: "Oct 10, 2026",
    time: "4:30 PM",
    address: "123 Sample Street, Brgy. San Roque, San Pablo City",
    clientName: "Carlo Santos",
    clientPhone: "+63 917 555 1234",
    problemDescription: "Frequent breaker tripping when air conditioner runs.",
    urgencyLevel: "High",
    estimatedCost: 320,
    paymentMethod: "Cash Payment",
    status: "Completed",
    createdAt: "2026-10-09T08:00:00.000Z",
    reviewed: true,
    userRating: 5,
    userReviewText: "Very professional electrician. Fixed the overloaded breaker safely.",
  },
];

// ─── Default Saved Addresses ──────────────────────────────────────────────────

export const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    houseUnit: "123",
    street: "Sample Street",
    barangay: "Brgy. San Roque",
    city: "San Pablo City",
    province: "Laguna",
    postalCode: "4000",
    landmark: "Near Sampaloc Lake Circle",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Work",
    houseUnit: "Suite 402",
    street: "ABC Commercial Bldg., Rizal Ave.",
    barangay: "Brgy. Poblacion",
    city: "San Pablo City",
    province: "Laguna",
    postalCode: "4000",
    landmark: "Across City Hall Plaza",
    isDefault: false,
  },
];

// ─── Default Notification Settings ────────────────────────────────────────────

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSettings = {
  bookingConfirm: true,
  providerAccepted: true,
  providerOtw: true,
  serviceStarted: true,
  serviceCompleted: true,
  bookingCancel: true,
  newMessages: true,
  aiResponses: true,
  providerAvail: false,
  appStatus: true,
  loginAlerts: true,
  promotions: false,
};

// ─── Demo User Profile ────────────────────────────────────────────────────────

export const INITIAL_USER: UserAccount = {
  name: "Carlo Santos",
  email: "user@tapserve.demo",
  phone: "+63 917 555 1234",
  address: "123 Sample Street, Brgy. San Roque, San Pablo City",
  rating: 4.9,
  memberSince: "2024",
  isProvider: false,
  providerApplicationStatus: "None",
};

// ─── LocalStorage Persistence Keys & Handlers ────────────────────────────────

const STORAGE_KEYS = {
  USER: "tapserve_current_user",
  ACCOUNTS: "tapserve_accounts",
  CATEGORIES: "tapserve_categories",
  PROVIDERS: "tapserve_providers",
  BOOKINGS: "tapserve_bookings",
  FAVORITES: "tapserve_favorites",
  ADDRESSES: "tapserve_addresses",
  NOTIFICATIONS: "tapserve_notifications",
  PROVIDER_APPLICATION: "tapserve_provider_app",
  ACTIVE_ROLE: "tapserve_active_role", // "user" | "provider"
};

export class AppStorage {
  static getUser(): UserAccount {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_USER;
  }

  static saveUser(user: UserAccount) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }

  static getRegisteredAccounts(): { name: string; email: string; pass: string }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [
      { name: "Carlo Santos", email: "user@tapserve.demo", pass: "12345678" },
      { name: "Carlo Santos", email: "carlo.santos@gmail.com", pass: "password123" },
    ];
  }

  static saveRegisteredAccount(account: { name: string; email: string; pass: string }) {
    try {
      const current = this.getRegisteredAccounts();
      const filtered = current.filter(a => a.email.toLowerCase() !== account.email.toLowerCase());
      filtered.push(account);
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }

  static getCategories(): ServiceCategory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_CATEGORIES;
  }

  static saveCategories(categories: ServiceCategory[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }

  static getProviders(): Provider[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_PROVIDERS;
  }

  static saveProviders(providers: Provider[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
    } catch {
      // ignore
    }
  }

  static getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_BOOKINGS;
  }

  static saveBookings(bookings: Booking[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }

  static getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return ["p-reynaldo", "p-maria"];
  }

  static saveFavorites(favs: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    } catch {
      // ignore
    }
  }

  static getAddresses(): SavedAddress[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_ADDRESSES;
  }

  static saveAddresses(addrs: SavedAddress[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addrs));
    } catch {
      // ignore
    }
  }

  static getNotificationSettings(): NotificationSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATION_SETTINGS;
  }

  static saveNotificationSettings(settings: NotificationSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  static getProviderApplication(): ProviderApplicationData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROVIDER_APPLICATION);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  }

  static saveProviderApplication(app: ProviderApplicationData | null) {
    try {
      if (!app) {
        localStorage.removeItem(STORAGE_KEYS.PROVIDER_APPLICATION);
      } else {
        localStorage.setItem(STORAGE_KEYS.PROVIDER_APPLICATION, JSON.stringify(app));
      }
    } catch {
      // ignore
    }
  }

  static getActiveRole(): "user" | "provider" {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      if (data === "provider" || data === "user") return data;
    } catch {
      // ignore
    }
    return "user";
  }

  static saveActiveRole(role: "user" | "provider") {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    } catch {
      // ignore
    }
  }

  static resetToDefaults() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.PROVIDERS);
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      localStorage.removeItem(STORAGE_KEYS.ADDRESSES);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.PROVIDER_APPLICATION);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
    } catch {
      // ignore
    }
  }
}
