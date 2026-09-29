// ─── TapServe Capstone Demo Data & Persistence Store ──────────────────────────
// Household services platform in San Pablo City, Laguna

const A = `${import.meta.env.BASE_URL}assets/`;

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
  { id: "plumbing", name: "Plumbing", emoji: "🔧", enabled: true, count: 4 },
  { id: "electrical", name: "Electrical", emoji: "⚡", enabled: true, count: 4 },
  { id: "gardening", name: "Gardening", emoji: "🌿", enabled: true, count: 4 },
  { id: "appliance-repair", name: "Appliance Repair", emoji: "🔌", enabled: true, count: 4 },
  { id: "carpentry", name: "Carpentry", emoji: "🪚", enabled: true, count: 4 },
  { id: "home-maintenance", name: "Home Maintenance", emoji: "🏠", enabled: true, count: 4 },
  { id: "aircon", name: "Aircon Cleaning", emoji: "❄️", enabled: true, count: 4 },
  { id: "painting", name: "Painting", emoji: "🖌️", enabled: true, count: 4 },
  { id: "pest-control", name: "Pest Control", emoji: "🐛", enabled: true, count: 4 },
  { id: "moving", name: "Moving Assistance", emoji: "📦", enabled: true, count: 3 },
  { id: "other", name: "Other Services", emoji: "✨", enabled: true, count: 3 },
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
    id: "p-roger",
    name: "Kuya Roger",
    photo: `${A}b0037.png`,
    category: "Cleaning",
    categoryId: "cleaning",
    specialization: "Express Sanitation & Trash Clearing",
    rating: 4.4,
    reviewCount: 45,
    completedJobs: 52,
    yearsExperience: 4,
    hourlyRate: 350,
    area: "Brgy. San Nicolas, San Pablo City",
    distance: "0.8 km away",
    isVerified: true,
    description: "Fast-response home sanitation and clutter clearing specialist. Quick dispatch within 30 minutes in Poblacion and San Nicolas.",
    services: [
      "Express Room Sanitization",
      "Trash & Clutter Hauling",
      "Floor Sweeping & Mopping",
      "Yard Debris Disposal",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "1:00 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "11:00 AM", "2:00 PM"],
      "Wed, Oct 14": ["9:00 AM", "1:30 PM"],
    },
    reviews: [
      {
        id: "rev-r1",
        userName: "Dennis K.",
        rating: 4,
        date: "4 days ago",
        comment: "Mabilis dumating, maayos naman ang paglinis.",
      },
    ],
  },
  {
    id: "p-teresa",
    name: "Ate Teresa",
    photo: `${A}9dc21.png`,
    category: "Cleaning",
    categoryId: "cleaning",
    specialization: "Eco-Friendly Deep Housekeeper",
    rating: 5.0,
    reviewCount: 168,
    completedJobs: 180,
    yearsExperience: 10,
    hourlyRate: 240,
    area: "Brgy. San Lucas, San Pablo City",
    distance: "3.2 km away",
    isVerified: true,
    description: "Premier 5-star housekeeper specializing in plant-based, allergy-safe deep cleaning. Outstanding attention to detail on fine tiles and glass.",
    services: [
      "Eco-Friendly Home Scrubbing",
      "Allergy-Safe Dusting & Vacuuming",
      "Tile Grout Whitening",
      "Appliance Exterior Buffing",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "11:00 AM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:00 PM", "3:30 PM"],
      "Wed, Oct 14": ["8:30 AM", "10:30 AM"],
    },
    reviews: [
      {
        id: "rev-t1",
        userName: "Maria Clara",
        rating: 5,
        date: "Yesterday",
        comment: "Super bait at napakagaling maglinis. Lahat ng sulok makintab. 5 stars!",
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

  // ─── PLUMBING (Additional Specialists) ───
  {
    id: "p-danilo",
    name: "Kuya Danilo",
    photo: `${A}0aac5.png`,
    category: "Plumbing",
    categoryId: "plumbing",
    specialization: "Express Pipe Unclogging & Faucets",
    rating: 4.3,
    reviewCount: 38,
    completedJobs: 42,
    yearsExperience: 5,
    hourlyRate: 340,
    area: "Brgy. Poblacion, San Pablo City",
    distance: "0.6 km away",
    isVerified: true,
    description: "Rapid-response plumber stationed right in Poblacion. Immediate arrival for kitchen drain clogs and leaking angle valves.",
    services: [
      "Emergency Drain Clearing",
      "Faucet & Valve Replacement",
      "P-trap Re-piping",
      "Water Tank Flushing",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "1:00 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["8:30 AM", "11:00 AM"],
    },
    reviews: [
      { id: "rev-dn1", userName: "Rico M.", rating: 4, date: "3 days ago", comment: "Mabilis dumating at naayos ang lababo." },
    ],
  },
  {
    id: "p-arnel",
    name: "Kuya Arnel",
    photo: `${A}1f784.png`,
    category: "Plumbing",
    categoryId: "plumbing",
    specialization: "Budget Waterline & Booster Pump Tech",
    rating: 5.0,
    reviewCount: 124,
    completedJobs: 135,
    yearsExperience: 11,
    hourlyRate: 260,
    area: "Brgy. San Jose, San Pablo City",
    distance: "3.4 km away",
    isVerified: true,
    description: "Top-rated 5-star plumber offering the most affordable residential plumbing rates in San Pablo City. Booster pump and PPR pipe installation expert.",
    services: [
      "Water Pressure Booster Pump Installation",
      "PPR Hot & Cold Pipe Welding",
      "Bathroom Toilet Overhaul",
      "Float Valve Calibration",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:30 PM"],
    },
    reviews: [
      { id: "rev-ar1", userName: "Luzviminda V.", rating: 5, date: "Yesterday", comment: "Napakabait at napakagaling. Pinakamura pa ang singil!" },
    ],
  },

  // ─── ELECTRICAL (Additional Specialists) ───
  {
    id: "p-bert",
    name: "Kuya Bert",
    photo: `${A}2df02.png`,
    category: "Electrical",
    categoryId: "electrical",
    specialization: "Express Breaker & Short Circuit Tech",
    rating: 4.3,
    reviewCount: 32,
    completedJobs: 36,
    yearsExperience: 4,
    hourlyRate: 360,
    area: "Brgy. Poblacion, San Pablo City",
    distance: "0.7 km away",
    isVerified: true,
    description: "Centrally located electrician for emergency circuit trips, blown fuses, and switch replacements in San Pablo downtown.",
    services: [
      "Emergency Short Circuit Fix",
      "Fuse & Miniature Circuit Breaker",
      "Outlet Grounding Test",
      "Ceiling Fan Wiring",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 7:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["11:00 AM", "3:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-bt1", userName: "Dante P.", rating: 4, date: "5 days ago", comment: "Naayos ang trip na breaker mabilis." },
    ],
  },
  {
    id: "p-ramil",
    name: "Kuya Ramil",
    photo: `${A}384f1.png`,
    category: "Electrical",
    categoryId: "electrical",
    specialization: "Smart Home Lighting & Solar Inverters",
    rating: 5.0,
    reviewCount: 145,
    completedJobs: 160,
    yearsExperience: 12,
    hourlyRate: 250,
    area: "Brgy. San Lucas, San Pablo City",
    distance: "2.9 km away",
    isVerified: true,
    description: "5-star rated licensed Master Electrician offering honest, pocket-friendly electrical rewiring and solar off-grid solutions.",
    services: [
      "Affordable Home Rewiring",
      "Solar Panel & Inverter Maintenance",
      "LED Track Lighting Installation",
      "Submeter Setup for Rental Units",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:30 AM", "1:30 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "3:00 PM"],
    },
    reviews: [
      { id: "rev-rm1", userName: "Gina Santos", rating: 5, date: "2 days ago", comment: "Sobrang pulido ng pagkakagawa sa aming submeter at ilaw. 5 stars!" },
    ],
  },
  {
    id: "p-noel",
    name: "Kuya Noel",
    photo: `${A}44484.png`,
    category: "Electrical",
    categoryId: "electrical",
    specialization: "Heavy Appliance Circuit Wiring",
    rating: 4.8,
    reviewCount: 89,
    completedJobs: 98,
    yearsExperience: 9,
    hourlyRate: 300,
    area: "Brgy. San Diego, San Pablo City",
    distance: "3.5 km away",
    isVerified: true,
    description: "Specialist in dedicated lines for aircons, induction cookers, and water heaters with proper safety conduits.",
    services: [
      "Dedicated Aircon Circuit Line",
      "Panel Load Balancing",
      "GFCI Wet Outlet Installation",
      "Power Surge Protection",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-nl1", userName: "Ernesto B.", rating: 5, date: "1 week ago", comment: "Maingat mag-wiring at malinis magtrabaho." },
    ],
  },

  // ─── GARDENING (Additional Specialists) ───
  {
    id: "p-nestor",
    name: "Kuya Nestor",
    photo: `${A}672a1.png`,
    category: "Gardening",
    categoryId: "gardening",
    specialization: "Express Yard Clearance & Mowing",
    rating: 4.4,
    reviewCount: 40,
    completedJobs: 45,
    yearsExperience: 4,
    hourlyRate: 280,
    area: "Brgy. San Roque, San Pablo City",
    distance: "0.9 km away",
    isVerified: true,
    description: "Equipped with power grass cutters for rapid backyard clearing, weed removal, and brush disposal.",
    services: [
      "Power Grass Mowing",
      "Dry Leaf Bagging & Disposal",
      "Overgrown Weed Clearing",
      "Hedge Trimming",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "11:00 AM", "3:00 PM"],
      "Tomorrow, Oct 13": ["7:30 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-ns1", userName: "Benny L.", rating: 4, date: "4 days ago", comment: "Mabilis natabas ang malaking damuhan." },
    ],
  },
  {
    id: "p-romy",
    name: "Kuya Romy",
    photo: `${A}8a7df.png`,
    category: "Gardening",
    categoryId: "gardening",
    specialization: "Bonsai, Palm & Ornamental Landscaping",
    rating: 5.0,
    reviewCount: 110,
    completedJobs: 122,
    yearsExperience: 14,
    hourlyRate: 320,
    area: "Brgy. Concepcion, San Pablo City",
    distance: "2.2 km away",
    isVerified: true,
    description: "Award-winning landscape designer in Laguna. Crafts custom rock gardens, ornamental trimming, and plant nutrition.",
    services: [
      "Japanese Garden & Rockscapes",
      "Fruit Tree Canopy Pruning",
      "Soil Conditioning & Organic Compost",
      "Flowerbed Floral Arrangement",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 4:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "1:30 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "11:00 AM"],
    },
    reviews: [
      { id: "rev-rmy1", userName: "Clara Ocampo", rating: 5, date: "Yesterday", comment: "Naging parang resort ang hardin namin!" },
    ],
  },
  {
    id: "p-joel",
    name: "Kuya Joel",
    photo: `${A}bcede.png`,
    category: "Gardening",
    categoryId: "gardening",
    specialization: "Budget Lawn Weeding & Soil Mulching",
    rating: 4.6,
    reviewCount: 68,
    completedJobs: 75,
    yearsExperience: 6,
    hourlyRate: 200,
    area: "Brgy. San Vicente, San Pablo City",
    distance: "4.0 km away",
    isVerified: true,
    description: "Most budget-friendly gardener in San Pablo. Great for regular weekly yard cleanup, watering, and soil tilling.",
    services: [
      "Hand Weeding & Bed Raking",
      "Soil Aeration & Mulch Spreading",
      "Garden Potted Plant Re-potting",
      "Vegetable Patch Preparation",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"],
    workingHours: "7:00 AM – 4:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["7:00 AM", "10:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-jl1", userName: "Pedro H.", rating: 5, date: "3 days ago", comment: "Sobrang mura at masipag maglinis ng bakuran." },
    ],
  },

  // ─── APPLIANCE REPAIR (Additional Specialists) ───
  {
    id: "p-marlon",
    name: "Kuya Marlon",
    photo: `${A}d6b13.png`,
    category: "Appliance Repair",
    categoryId: "appliance-repair",
    specialization: "Express Washing Machine & Dryer Fix",
    rating: 4.3,
    reviewCount: 39,
    completedJobs: 44,
    yearsExperience: 5,
    hourlyRate: 380,
    area: "Brgy. San Rafael, San Pablo City",
    distance: "0.8 km away",
    isVerified: true,
    description: "Rapid troubleshooting for front-load and top-load automatic washing machines. Replaces spin belts, solenoids, and clutches on the spot.",
    services: [
      "Spin Dry Belt Replacement",
      "Water Inlet Solenoid Fix",
      "Drain Motor Replacement",
      "Drum Suspension Rod Alignment",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:30 AM", "2:30 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-mr1", userName: "Joy G.", rating: 4, date: "5 days ago", comment: "Umiikot na ulit ang washing machine namin." },
    ],
  },
  {
    id: "p-jun",
    name: "Kuya Jun",
    photo: `${A}ef9a9.png`,
    category: "Appliance Repair",
    categoryId: "appliance-repair",
    specialization: "Inverter Refrigerator & Freezer Master",
    rating: 5.0,
    reviewCount: 156,
    completedJobs: 170,
    yearsExperience: 15,
    hourlyRate: 280,
    area: "Brgy. Santa Catalina, San Pablo City",
    distance: "2.8 km away",
    isVerified: true,
    description: "Top-rated 5-star refrigeration mechanic. Diagnostic expert on Panasonic, Samsung, LG, and Whirlpool inverter compressors and PCB boards.",
    services: [
      "Inverter Ref PCB Board Diagnostics",
      "Compressor Relay & Overload Sensor",
      "Door Gasket Seal Replacement",
      "Defrost Heater & Sensor Repair",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "1:00 PM", "3:30 PM"],
      "Tomorrow, Oct 13": ["8:30 AM", "11:30 AM"],
    },
    reviews: [
      { id: "rev-jn1", userName: "Arlene Cruz", rating: 5, date: "Yesterday", comment: "Lumamig agad ang ref namin na 2 weeks nang sira. Salamat Kuya Jun!" },
    ],
  },
  {
    id: "p-edwin",
    name: "Kuya Edwin",
    photo: `${A}f043e.png`,
    category: "Appliance Repair",
    categoryId: "appliance-repair",
    specialization: "Microwaves, Stoves & Small Kitchen Tech",
    rating: 4.8,
    reviewCount: 84,
    completedJobs: 92,
    yearsExperience: 8,
    hourlyRate: 320,
    area: "Brgy. San Gabriel, San Pablo City",
    distance: "3.3 km away",
    isVerified: true,
    description: "Comprehensive home kitchen repair: gas range igniters, microwave magnetrons, electric kettles, and air fryers.",
    services: [
      "Microwave Magnetron & Capacitor Fix",
      "Gas Range Burner & Thermal Couple",
      "Electric Oven Heating Element",
      "Rice Cooker & Air Fryer Maintenance",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:30 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["11:00 AM", "3:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-ew1", userName: "Ramon T.", rating: 5, date: "4 days ago", comment: "Gumana ulit microwave oven namin, pinalitan lang yung piyesa." },
    ],
  },

  // ─── AIRCON CLEANING (Additional Specialists) ───
  {
    id: "p-paolo",
    name: "Kuya Paolo",
    photo: `${A}fe801.png`,
    category: "Aircon Cleaning",
    categoryId: "aircon",
    specialization: "Express Window Aircon Jet Wash",
    rating: 4.4,
    reviewCount: 48,
    completedJobs: 55,
    yearsExperience: 4,
    hourlyRate: 370,
    area: "Brgy. San Francisco, San Pablo City",
    distance: "0.7 km away",
    isVerified: true,
    description: "Fast pull-out and pressurized wash for window type air conditioners. Same-day reinstallation guaranteed.",
    services: [
      "Window Type Pressure Wash",
      "Air Filter & Blower Degreasing",
      "Drain Pan Bleaching",
      "Thermostat Check",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "2:00 PM", "4:30 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-pl1", userName: "Cynthia S.", rating: 4, date: "3 days ago", comment: "Mabilis natapos ang paglinis ng window type." },
    ],
  },
  {
    id: "p-christian",
    name: "Kuya Christian",
    photo: `${A}0aac5.png`,
    category: "Aircon Cleaning",
    categoryId: "aircon",
    specialization: "Split Inverter Deep Chemical Wash & Freon",
    rating: 5.0,
    reviewCount: 182,
    completedJobs: 195,
    yearsExperience: 11,
    hourlyRate: 280,
    area: "Brgy. San Nicolas, San Pablo City",
    distance: "2.6 km away",
    isVerified: true,
    description: "5-star rated inverter specialist. Uses coil-safe chemical detergents, high-pressure foam guns, and precision digital freon gauges.",
    services: [
      "Inverter Evaporator Coil Chemical Flush",
      "Digital Freon Refill (R32 / R410A)",
      "Outdoor Condenser Fan Overhaul",
      "Anti-Bacterial Coil Mist Treatment",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:30 AM", "11:30 AM", "2:30 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:00 PM", "3:30 PM"],
    },
    reviews: [
      { id: "rev-ch1", userName: "Dr. Mendoza", rating: 5, date: "Yesterday", comment: "Walang kasing lamig ang buga ng aircon ngayon! Very clean job." },
    ],
  },
  {
    id: "p-sonny",
    name: "Kuya Sonny",
    photo: `${A}1f784.png`,
    category: "Aircon Cleaning",
    categoryId: "aircon",
    specialization: "Multi-Split & Commercial Maintenance",
    rating: 4.7,
    reviewCount: 96,
    completedJobs: 104,
    yearsExperience: 9,
    hourlyRate: 310,
    area: "Brgy. San Jose, San Pablo City",
    distance: "3.2 km away",
    isVerified: true,
    description: "Handles home multi-splits and light commercial package aircon systems with preventative maintenance contracts.",
    services: [
      "Multi-Split System Servicing",
      "Condensate Water Drain Unclog",
      "Fan Motor Bearing Lubrication",
      "Temperature Differential Test",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "1:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-sn1", userName: "Gary Santos", rating: 5, date: "1 week ago", comment: "Maingat at pulido mag-linis sa wall." },
    ],
  },

  // ─── CARPENTRY (Additional Specialists) ───
  {
    id: "p-berto",
    name: "Kuya Berto",
    photo: `${A}2df02.png`,
    category: "Carpentry",
    categoryId: "carpentry",
    specialization: "Express Door Hinges & Lock Installation",
    rating: 4.4,
    reviewCount: 44,
    completedJobs: 50,
    yearsExperience: 6,
    hourlyRate: 350,
    area: "Brgy. Poblacion, San Pablo City",
    distance: "0.9 km away",
    isVerified: true,
    description: "Fast fix for sticking doors, broken hinges, deadbolts, sliding door tracks, and window latches.",
    services: [
      "Door Planing & Hinge Alignment",
      "Heavy Duty Deadbolt Installation",
      "Sliding Screen Door Roller Fix",
      "Cabinet Magnetic Catch Replace",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:30 PM"],
    },
    reviews: [
      { id: "rev-br1", userName: "Nancy T.", rating: 4, date: "4 days ago", comment: "Sumasara na nang maayos ang pinto namin." },
    ],
  },
  {
    id: "p-lando",
    name: "Kuya Lando",
    photo: `${A}384f1.png`,
    category: "Carpentry",
    categoryId: "carpentry",
    specialization: "Budget Custom Cabinets & Table Resto",
    rating: 5.0,
    reviewCount: 138,
    completedJobs: 150,
    yearsExperience: 16,
    hourlyRate: 260,
    area: "Brgy. San Roque, San Pablo City",
    distance: "3.1 km away",
    isVerified: true,
    description: "5-star master furniture craftsman. Builds durable marine plywood kitchen cabinets and restores heirloom wooden furniture at budget-friendly rates.",
    services: [
      "Custom Modular Kitchen Cabinets",
      "Antique Wood Stripping & Polish",
      "Plywood Partition Wall Setup",
      "Wooden Bed Frame Reinforcement",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:30 AM – 4:30 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:30 AM", "1:00 PM", "3:30 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-ld1", userName: "Corazon Reyes", rating: 5, date: "Yesterday", comment: "Napakaganda ng ginawang kabinet sa kusina. Sulit na sulit!" },
    ],
  },
  {
    id: "p-rico",
    name: "Kuya Rico",
    photo: `${A}44484.png`,
    category: "Carpentry",
    categoryId: "carpentry",
    specialization: "Ceiling Joists & Hardiflex Wall Pro",
    rating: 4.7,
    reviewCount: 82,
    completedJobs: 90,
    yearsExperience: 8,
    hourlyRate: 290,
    area: "Brgy. San Lucas, San Pablo City",
    distance: "2.0 km away",
    isVerified: true,
    description: "Drywall, fiber cement board ceiling installation, and structural wooden repair for residential homes.",
    services: [
      "Hardiflex Ceiling Board Replacement",
      "Light Steel & Wood Stud Framing",
      "Attic Crawlspace Door Framing",
      "Baseboard & Molding Trimming",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:30 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["8:30 AM", "11:30 AM"],
    },
    reviews: [
      { id: "rev-rc1", userName: "Lando Garcia", rating: 5, date: "5 days ago", comment: "Maayos ang pagkakakabit ng kisame." },
    ],
  },

  // ─── HOME MAINTENANCE (Additional Specialists) ───
  {
    id: "p-gary",
    name: "Kuya Gary",
    photo: `${A}672a1.png`,
    category: "Home Maintenance",
    categoryId: "home-maintenance",
    specialization: "Emergency Roof & Gutter Patching",
    rating: 4.4,
    reviewCount: 46,
    completedJobs: 52,
    yearsExperience: 6,
    hourlyRate: 340,
    area: "Brgy. Poblacion, San Pablo City",
    distance: "0.8 km away",
    isVerified: true,
    description: "Rapid dispatch for storm leaks, clogged roof valleys, and dislodged downspouts throughout Poblacion.",
    services: [
      "Emergency Vulcaseal Roof Patch",
      "Downspout Strainer Installation",
      "Loose Gutter Bracket Screwing",
      "Roof Nail Hole Waterstop",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "1:00 PM", "3:30 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-gr1", userName: "Nestor F.", rating: 4, date: "3 days ago", comment: "Naagapan agad ang tulo bago lumakas ang ulan." },
    ],
  },
  {
    id: "p-victor",
    name: "Kuya Victor",
    photo: `${A}8a7df.png`,
    category: "Home Maintenance",
    categoryId: "home-maintenance",
    specialization: "Masonry Waterproofing & Concrete Patch",
    rating: 5.0,
    reviewCount: 142,
    completedJobs: 155,
    yearsExperience: 14,
    hourlyRate: 250,
    area: "Brgy. San Diego, San Pablo City",
    distance: "2.4 km away",
    isVerified: true,
    description: "5-star handyman and mason. Experts in sealing exterior wall seepage, re-tiling loose bathroom tiles, and mortar touchups at unbeatable rates.",
    services: [
      "Exterior Firewall Elastomeric Sealing",
      "Loose Bathroom Tile Re-grouting",
      "Concrete Crack Epoxy Injection",
      "Window Frame Silicone Weatherproofing",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:30 AM – 4:30 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "11:30 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-vc1", userName: "Milagros C.", rating: 5, date: "Yesterday", comment: "Wala nang seepage sa firewall namin! Napakabait at mura maningil." },
    ],
  },
  {
    id: "p-mel",
    name: "Kuya Mel",
    photo: `${A}bcede.png`,
    category: "Home Maintenance",
    categoryId: "home-maintenance",
    specialization: "General Fixtures & Hardware Mounting",
    rating: 4.8,
    reviewCount: 90,
    completedJobs: 100,
    yearsExperience: 9,
    hourlyRate: 280,
    area: "Brgy. San Nicolas, San Pablo City",
    distance: "1.9 km away",
    isVerified: true,
    description: "Drilling, anchoring, curtain rod installation, TV wall mounting, and bathroom accessory setup.",
    services: [
      "Heavy TV Bracket Wall Mounting",
      "Bathroom Towel Bar & Mirror Anchor",
      "Curtain Rod & Blind Installation",
      "Doorknob & Deadbolt Replacement",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "2:00 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["9:30 AM", "1:30 PM"],
    },
    reviews: [
      { id: "rev-ml1", userName: "Diane Santos", rating: 5, date: "4 days ago", comment: "Pulido ang pagkabit ng TV sa pader." },
    ],
  },

  // ─── PAINTING (Additional Specialists) ───
  {
    id: "p-dante",
    name: "Kuya Dante",
    photo: `${A}d6b13.png`,
    category: "Painting",
    categoryId: "painting",
    specialization: "Express Touch-ups & Gate Anti-Rust",
    rating: 4.3,
    reviewCount: 35,
    completedJobs: 40,
    yearsExperience: 5,
    hourlyRate: 310,
    area: "Brgy. San Rafael, San Pablo City",
    distance: "0.8 km away",
    isVerified: true,
    description: "Quick paint turnaround for metal grilles, perimeter iron gates, baseboards, and small room accent repaint.",
    services: [
      "Metal Gate Rust Scraping & Primer",
      "Single Room Quick Color Repaint",
      "Door & Window Frame Enamel Paint",
      "Baseboard Staining & Varnish",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "1:30 PM"],
      "Tomorrow, Oct 13": ["8:30 AM", "11:00 AM"],
    },
    reviews: [
      { id: "rev-dt1", userName: "Alvin R.", rating: 4, date: "6 days ago", comment: "Makintab ang kinalabasan ng gate." },
    ],
  },
  {
    id: "p-arthur",
    name: "Kuya Arthur",
    photo: `${A}ef9a9.png`,
    category: "Painting",
    categoryId: "painting",
    specialization: "Premium Interior Textures & Faux Finish",
    rating: 5.0,
    reviewCount: 160,
    completedJobs: 175,
    yearsExperience: 17,
    hourlyRate: 230,
    area: "Brgy. San Cristobal, San Pablo City",
    distance: "3.0 km away",
    isVerified: true,
    description: "Laguna's top-rated master painter. Flawless drywall joint taping, plaster skim coating, and budget residential interior painting.",
    services: [
      "Full House Skim Coat & Sanding",
      "Odorless Interior Satin Acrylic Paint",
      "Waterproof Elastomeric Exterior Wall",
      "Textured Venetian & Sponge Plaster",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 4:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "11:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-at1", userName: "Rosanna M.", rating: 5, date: "Yesterday", comment: "Walang kasing kinis ang aming sala. Pinakamura pa ang quote!" },
    ],
  },
  {
    id: "p-elmer",
    name: "Kuya Elmer",
    photo: `${A}f043e.png`,
    category: "Painting",
    categoryId: "painting",
    specialization: "Roof Coating & Exterior Waterproofing",
    rating: 4.7,
    reviewCount: 78,
    completedJobs: 85,
    yearsExperience: 8,
    hourlyRate: 260,
    area: "Brgy. Del Remedio, San Pablo City",
    distance: "1.6 km away",
    isVerified: true,
    description: "Heat-reflective roof painting, corrugated galvanized iron treatment, and perimeter wall painting.",
    services: [
      "Heat Reflective Roof Coating",
      "Anti-Fungus Wall Primer Application",
      "Garage Floor Epoxy Painting",
      "High-Pressure Surface Washing",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "7:30 AM – 4:30 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "1:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-em1", userName: "Oscar V.", rating: 5, date: "4 days ago", comment: "Bumaba ang init sa loob ng bahay dahil sa roof paint." },
    ],
  },

  // ─── PEST CONTROL (Additional Specialists) ───
  {
    id: "p-jerry",
    name: "Kuya Jerry",
    photo: `${A}fe801.png`,
    category: "Pest Control",
    categoryId: "pest-control",
    specialization: "Express Fogging & Cockroach Gel",
    rating: 4.4,
    reviewCount: 36,
    completedJobs: 41,
    yearsExperience: 5,
    hourlyRate: 420,
    area: "Brgy. Poblacion, San Pablo City",
    distance: "0.9 km away",
    isVerified: true,
    description: "Immediate response for cockroach infestations, drain flies, and mosquito thermal fogging.",
    services: [
      "Cockroach Gel Bait Application",
      "Thermal Mosquito Fogging",
      "Kitchen Drain Fly Eradication",
      "Ant Colony Granular Baiting",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["10:00 AM", "2:30 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-jr1", userName: "Evelyn T.", rating: 4, date: "5 days ago", comment: "Nawala ang ipis sa kusina." },
    ],
  },
  {
    id: "p-ronald",
    name: "Kuya Ronald",
    photo: `${A}0aac5.png`,
    category: "Pest Control",
    categoryId: "pest-control",
    specialization: "Eco-Safe Termite Barrier & Wood Treatment",
    rating: 5.0,
    reviewCount: 148,
    completedJobs: 160,
    yearsExperience: 13,
    hourlyRate: 320,
    area: "Brgy. San Roque, San Pablo City",
    distance: "2.5 km away",
    isVerified: true,
    description: "5-star certified pest controller with odorless, pet-safe termite piping barriers, bait monitoring stations, and 1-year warranty.",
    services: [
      "Subterranean Termite Baiting Stations",
      "Odorless Wood Infiltration Spray",
      "Ceiling Truss Anti-Termite Paint",
      "Foundation Soil Injection Barrier",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:30 AM", "1:30 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-rn1", userName: "Judge Bautista", rating: 5, date: "Yesterday", comment: "Safe sa aso namin at nawala ang mga anay. Highly recommended!" },
    ],
  },
  {
    id: "p-allan",
    name: "Kuya Allan",
    photo: `${A}1f784.png`,
    category: "Pest Control",
    categoryId: "pest-control",
    specialization: "Rodent Exclusion & Attic Sealing",
    rating: 4.7,
    reviewCount: 74,
    completedJobs: 82,
    yearsExperience: 8,
    hourlyRate: 360,
    area: "Brgy. San Jose, San Pablo City",
    distance: "1.8 km away",
    isVerified: true,
    description: "Attic rat trapping, mesh wire entry point sealing, and sanitary droppings cleanup.",
    services: [
      "Ceiling Rodent Trapping & Removal",
      "Galvanized Wire Entry Point Mesh",
      "Attic Disinfection & Deodorizing",
      "Garden Burrow Rodent Baiting",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-al1", userName: "Teresita D.", rating: 5, date: "3 days ago", comment: "Wala nang ingay ng daga sa kisame namin." },
    ],
  },

  // ─── MOVING ASSISTANCE (3 Specialists) ───
  {
    id: "p-dindo",
    name: "Kuya Dindo",
    photo: `${A}384f1.png`,
    category: "Moving Assistance",
    categoryId: "moving",
    specialization: "Express Lipat-Bahay Helper",
    rating: 4.3,
    reviewCount: 30,
    completedJobs: 35,
    yearsExperience: 4,
    hourlyRate: 350,
    area: "Brgy. Poblacion, San Pablo City",
    distance: "0.6 km away",
    isVerified: true,
    description: "Fast loading and unloading help for condo moves, furniture transfers, and small boxes in San Pablo City.",
    services: [
      "Heavy Appliance Lifting & Loading",
      "Van & Pickup Truck Loading Helper",
      "Furniture Disassembly Assist",
      "Stairway Mattress Carry",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "1:00 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-dd1", userName: "Kiko M.", rating: 4, date: "4 days ago", comment: "Mabilis magbuhat ng mabibigat." },
    ],
  },
  {
    id: "p-obet",
    name: "Kuya Obet",
    photo: `${A}44484.png`,
    category: "Moving Assistance",
    categoryId: "moving",
    specialization: "Careful Packing & Fragile Moving Team",
    rating: 5.0,
    reviewCount: 115,
    completedJobs: 125,
    yearsExperience: 10,
    hourlyRate: 250,
    area: "Brgy. San Cristobal, San Pablo City",
    distance: "3.2 km away",
    isVerified: true,
    description: "5-star moving service. Brings bubble wrap, cardboard corner guards, and moving blankets for zero scratches on your valuables.",
    services: [
      "Bubble Wrap & Shrink Wrapping",
      "Fragile Glassware & TV Packaging",
      "Careful Room-to-Room Re-assembly",
      "Budget Half-Day Moving Assistance",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:30 AM", "12:30 PM", "3:30 PM"],
      "Tomorrow, Oct 13": ["8:00 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-ob1", userName: "Sheila B.", rating: 5, date: "Yesterday", comment: "Walang nabasag kahit isang baso! Napaka-ingat at mura." },
    ],
  },
  {
    id: "p-tony",
    name: "Kuya Tony",
    photo: `${A}2df02.png`,
    category: "Moving Assistance",
    categoryId: "moving",
    specialization: "Office & Heavy Furniture Relocation",
    rating: 4.8,
    reviewCount: 78,
    completedJobs: 86,
    yearsExperience: 8,
    hourlyRate: 320,
    area: "Brgy. San Roque, San Pablo City",
    distance: "1.5 km away",
    isVerified: true,
    description: "Equipped with hydraulic dollies and straps for piano, safe, ref, and modular desk relocation.",
    services: [
      "Commercial & Office Moving",
      "Hydraulic Dolly Transport",
      "Upright Piano & Safe Moving",
      "Storage Room Organization",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "3:00 PM"],
    },
    reviews: [
      { id: "rev-tn1", userName: "Atty. Delgado", rating: 5, date: "3 days ago", comment: "Maingat at mabilis ang paglipat ng mga gamit sa opisina." },
    ],
  },

  // ─── OTHER SERVICES (3 Specialists) ───
  {
    id: "p-andy",
    name: "Kuya Andy",
    photo: `${A}8a7df.png`,
    category: "Other Services",
    categoryId: "other",
    specialization: "Express Handyman & Curtain Hanging",
    rating: 4.4,
    reviewCount: 38,
    completedJobs: 42,
    yearsExperience: 4,
    hourlyRate: 300,
    area: "Brgy. Poblacion, San Pablo City",
    distance: "0.7 km away",
    isVerified: true,
    description: "Quick home odd jobs: changing locks, hanging mirrors, assembling flat-pack shelves, and fixing cabinet handles.",
    services: [
      "Flat-pack Furniture Assembly",
      "Mirror & Photo Frame Hanging",
      "Cabinet Handle Replacement",
      "Door Stopper Installation",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 6:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:30 AM", "1:30 PM", "4:00 PM"],
      "Tomorrow, Oct 13": ["9:00 AM", "2:00 PM"],
    },
    reviews: [
      { id: "rev-ad1", userName: "Paolo R.", rating: 4, date: "5 days ago", comment: "Mabilis nabuo yung cabinet." },
    ],
  },
  {
    id: "p-leo",
    name: "Kuya Leo",
    photo: `${A}bcede.png`,
    category: "Other Services",
    categoryId: "other",
    specialization: "Pressure Washing & Paver Cleaning",
    rating: 5.0,
    reviewCount: 110,
    completedJobs: 120,
    yearsExperience: 10,
    hourlyRate: 220,
    area: "Brgy. San Lucas, San Pablo City",
    distance: "2.8 km away",
    isVerified: true,
    description: "Top-rated 5-star outdoor cleaning. Heavy-duty gasoline pressure washer removes black algae, moss, and oil stains from driveways and gates.",
    services: [
      "Driveway High-Pressure Wash",
      "Perimeter Wall Moss Removal",
      "Patio & Paver Deep Scrub",
      "Carport Oil Stain Degreasing",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "7:30 AM – 4:30 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["8:00 AM", "11:00 AM", "2:00 PM"],
      "Tomorrow, Oct 13": ["8:30 AM", "1:00 PM"],
    },
    reviews: [
      { id: "rev-lo1", userName: "Tito S.", rating: 5, date: "Yesterday", comment: "Pumuti ulit ang driveway namin! Parang bago. 5 stars!" },
    ],
  },
  {
    id: "p-boyet",
    name: "Kuya Boyet",
    photo: `${A}672a1.png`,
    category: "Other Services",
    categoryId: "other",
    specialization: "General Fix-it & Home Maintenance",
    rating: 4.8,
    reviewCount: 88,
    completedJobs: 95,
    yearsExperience: 9,
    hourlyRate: 280,
    area: "Brgy. San Roque, San Pablo City",
    distance: "1.4 km away",
    isVerified: true,
    description: "Trusted San Pablo neighborhood handyman for odd jobs, screen door patching, gate wheels, and plumbing/electrical quick fixes.",
    services: [
      "Sliding Gate Wheel Lubrication",
      "Window Screen Mesh Replacement",
      "Silicone Caulking Touch-ups",
      "General Odd Job Repairs",
    ],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {
      "Today, Oct 12": ["9:00 AM", "1:00 PM"],
      "Tomorrow, Oct 13": ["10:00 AM", "2:30 PM"],
    },
    reviews: [
      { id: "rev-by1", userName: "Carmen D.", rating: 5, date: "3 days ago", comment: "Lahat ng maliliit na sira sa bahay naayos niya agad." },
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
    const CAT_VERSION = "v6_all_services_rich";
    try {
      const storedVersion = localStorage.getItem("tapserve_categories_version");
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data && storedVersion === CAT_VERSION) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem("tapserve_categories_version", CAT_VERSION);
      return INITIAL_CATEGORIES;
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
    const DATA_VERSION = "v6_all_services_rich";
    try {
      const storedVersion = localStorage.getItem("tapserve_providers_version");
      const data = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
      if (data && storedVersion === DATA_VERSION) {
        const stored: Provider[] = JSON.parse(data);
        const missing = INITIAL_PROVIDERS.filter((p) => !stored.some((s) => s.id === p.id));
        if (missing.length > 0) {
          const merged = [...stored, ...missing];
          localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(merged));
          return merged;
        }
        return stored;
      }
      // Upgrade or first load: store fresh rich multi-provider inventory
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
      localStorage.setItem("tapserve_providers_version", DATA_VERSION);
      return INITIAL_PROVIDERS;
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
