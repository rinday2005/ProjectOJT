import {
  LayoutGrid,
  Bell,
  Shield,
  Users,
  Check,
  Lock,
  Eye,
  FileText
} from "lucide-react";

import hero1Img from '../assets/images/hero1.webp';
import hero2Img from '../assets/images/hero2.jpeg';
import hero3Img from '../assets/images/hero3.webp';
import banner2Img from '../assets/images/banner2.png';

//HomePulic------------------------------------------------------------------------------
export const features = [
  {
    icon: "schedule", // using string for Material Symbols or mapping to Lucide later
    title: "Busy work schedules",
    description: "Balancing professional responsibilities with the needs of your family can be overwhelming and exhausting.",
    color: "bg-[#e6f3f6] dark:bg-primary/20",
    iconColor: "text-primary",
    highlight: false,
    colSpan: "md:col-span-1",
  },
  {
    icon: "gpp_maybe",
    title: "Worrying about safety",
    description: "The constant concern for a loved one's well-being while you're away can cause significant mental and emotional stress.",
    color: "bg-[#eef8f7] dark:bg-soft-teal/20",
    iconColor: "text-soft-teal",
    highlight: false,
    colSpan: "md:col-span-1",
  },
  {
    icon: "medical_services",
    title: "Lack of expertise",
    description: "Managing complex health needs requires professional knowledge that most families simply don't have.",
    color: "bg-[#fdeeee] dark:bg-[#e74c3c]/20",
    iconColor: "text-[#e74c3c]",
    highlight: false,
    colSpan: "md:col-span-1",
  },
];

export const heroSlides = [
  {
    image: hero1Img,
    title: "Compassionate Care in the Comfort of Home",
    description: "We provide professional, personalized home care services tailored to meet the unique needs of your loved ones.",
    cta: "Start Your Journey"
  },
  {
    image: hero2Img,
    title: "Expert Medical Support at Your Doorstep",
    description: "From post-surgery recovery to chronic disease management, our certified nurses deliver hospital-quality care at home.",
    cta: "View Services"
  },
  {
    image: hero3Img,
    title: "Empowering Independence for Seniors",
    description: "Our caregivers assist with daily activities, ensuring safety and dignity while promoting an active and independent lifestyle.",
    cta: "Find a Caregiver"
  }
];


export const pricing = [
  {
    icon: LayoutGrid,
    title: "Real-time Health Dashboard",
    description: "Get instant access to vitals, mood tracking, and care reports right from your smartphone.",
    highlight: true,
    colSpan: "md:col-span-2",
  },
  {
    icon: Bell,
    title: "Smart Emergency Alerts",
    description: "Our proprietary AI detects deviations in normal routines and alerts emergency services instantly.",
    highlight: false,
    colSpan: "md:col-span-1",
  },
  {
    icon: Shield,
    title: "Verified Professionalism",
    description: "Every caregiver undergoes a rigorous 5-step background check and professional certification.",
    highlight: false,
    colSpan: "md:col-span-1",
  },
  {
    icon: Users,
    title: "Multi-Family Access",
    description: "Multiple family members can stay connected through the dashboard, ensuring everyone is on the same page.",
    highlight: false,
    colSpan: "md:col-span-2",
  },
];


export const steps = [
  {
    number: "1",
    title: "Tell us your needs",
    description: "Share your specific requirements and health goals through our intake process.",
  },
  {
    number: "2",
    title: "Meet your verified caregiver",
    description: "We match you with a certified professional who fits your family's personality and needs.",
  },
  {
    number: "3",
    title: "Track health 24/7",
    description: "Access our app to see real-time updates, medication logs, and daily wellness reports.",
  },
];


export const careCircle = [
  {
    icon: "groups",
    title: "Family",
    description: "Stay connected and informed with daily updates and direct communication channels.",
    bg: "bg-[#e6f3f6]",
    color: "text-primary"
  },
  {
    icon: "favorite",
    title: "Caregivers",
    description: "Verified professionals providing compassionate, specialized hands-on care at home.",
    bg: "bg-[#eef8f7]",
    color: "text-soft-teal"
  },
  {
    icon: "monitor_heart",
    title: "Admin Monitoring",
    description: "24/7 centralized oversight ensuring safety protocols and clinical quality are met.",
    bg: "bg-gray-100 dark:bg-white/10",
    color: "text-[#2c3e50] dark:text-white"
  },
];

export const certifications = [
  { icon: "verified_user", label: "Background Checked" },
  { icon: "workspace_premium", label: "ISO Certified" },
  { icon: "clinical_notes", label: "Nurse Supervised" },
  { icon: "diversity_1", label: "20k+ Families Served" },
];


//Pricing Page ------------------------------------------------------------------------------------------
export const plans = {
  "on-demand": [
    {
      name: "Basic Support",
      price: "$499",
      period: "/ month",
      note: "Cancel any time",
      buttonText: "Select Plan",
      buttonVariant: "outline",
      features: [
        "Daily check-ins (15 min)",
        "Medication reminders",
        "Basic light housekeeping",
        "Admin app oversight",
      ],
      popular: false,
      highlight: false,
    },
    {
      name: "Premium Care",
      price: "$1,299",
      period: "/ month",
      note: "3 or 6-month options",
      buttonText: "Get Started",
      buttonVariant: "default",
      features: [
        "Dedicated fixed caregiver",
        "24/7 active monitoring",
        "Specialized medical support",
        "Priority response team",
        "Bi-weekly wellness report",
      ],
      popular: true,
      highlight: true,
    },
    {
      name: "Post-Hospital Recovery",
      price: "$2,499",
      period: "/ month",
      note: "Intensive short-term",
      buttonText: "Consult Specialist",
      buttonVariant: "outline",
      features: [
        "Intensive clinical care",
        "Physical rehab support",
        "Post-op vitals monitoring",
        "Equipment coordination",
        "Direct MD communication",
      ],
      popular: false,
      highlight: false,
      premium: true,
    },
  ],
  "long-term": [
    {
      name: "Basic Annual",
      price: "$449",
      period: "/ month",
      note: "Billed annually - Save 10%",
      buttonText: "Select Plan",
      buttonVariant: "outline",
      features: [
        "Daily check-ins (15 min)",
        "Medication reminders",
        "Basic light housekeeping",
        "Admin app oversight",
      ],
      popular: false,
      highlight: false,
    },
    {
      name: "Premium Annual",
      price: "$1,099",
      period: "/ month",
      note: "Billed annually - Save 15%",
      buttonText: "Get Started",
      buttonVariant: "default",
      features: [
        "Dedicated fixed caregiver",
        "24/7 active monitoring",
        "Specialized medical support",
        "Priority response team",
        "Bi-weekly wellness report",
      ],
      popular: true,
      highlight: true,
    },
    {
      name: "Enterprise Care",
      price: "Custom",
      period: "",
      note: "For facilities & agencies",
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      features: [
        "Multi-patient management",
        "Custom reporting",
        "API integrations",
        "Dedicated account manager",
        "Custom SLAs",
      ],
      popular: false,
      highlight: false,
      premium: true,
    },
  ],
};

export const trustFeatures = [
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "Fully encrypted end-to-end payment processing for peace of mind.",
  },
  {
    icon: FileText,
    title: "No Hidden Fees",
    description:
      "Transparent pricing with detailed invoices. No surprise charges ever.",
  },
  {
    icon: Eye,
    title: "Admin Oversight",
    description:
      "Centralized portal for families to track care logs and medication.",
  },
];

export const faqs = [
  {
    question: "Can I change my caregiver?",
    answer:
      "Yes, you can request a caregiver change anytime. Premium members receive priority rematching.",
  },
  {
    question: "Is insurance accepted for these plans?",
    answer:
      "Many long-term care insurance policies cover our services. We provide full documentation for claims.",
  },
  {
    question: "How does the 24/7 monitoring work?",
    answer:
      "We combine wearable monitoring with real nurses on standby for immediate response.",
  },
  {
    question: "Are there long-term commitment discounts?",
    answer:
      "Yes. Annual plans offer up to 15% savings compared to monthly billing.",
  },
];

//Caregivers Page------------------------------------------------------------------------------------------
export const caregivers = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Registered Nurse (RN)",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVXGLD6dnBIXXwpWyZGxsMfK0xe84MQAvtfRHiEnmDMzgCMPGfUWpoHgQshhxLz9HpAKZPxX2nNcI9sLp_W6MIaJ14YZUDdF5I2z96r9OxAwpzySBKuJ8Foo-uohvsjPUw2eBuhQwvU1oOrRmhrOZ-pdDI7oWuGWzGNbR-4Sp3abYJ8_TsHpSKe4UmXmFSPuyLyWngiyrIdxvh9NR8u6wIOt-RKcXX26HvTngsNBAGProKN0RPr2eYMNjBoP91-96MmSTnAaKAxDOb",
    experience: "12+ Years Exp",
    rating: "4.9",
    reviews: 124,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["Dementia Care", "Wound Care", "IV Therapy"],
    bio: "Sarah is a compassionate Registered Nurse with over 12 years of experience. She specializes in dementia care and complex medical treatments, providing peace of mind to families."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Physical Therapist (DPT)",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBALJensGVYcUq2SJvz5LzELF3MEfD8pIhN_8aSmOepHqCAId3kUR6OfznQ3G3nLf60AcWcnYFfvVxiCEQ2H4DFbDiI12QIWZ__EFxAVHhyZmaQoQ1SJgfgxkO5G8r1ZsI_rtaIO1LxY-tCWFEJd5VIj6uS0AAuZfemKw8a6_-jl5d5fxyRlYyh1RjHQnW1NFNwxmefufu_UNSmtXqeruRdGmZ84Y25iqzVnZT_rq2wY0ROnYKryZawr2Pfgx2aJ0rMkhleU2uVRxR2",
    experience: "15+ Years Exp",
    rating: "5.0",
    reviews: 89,
    verified: true,
    licensed: true,
    screened: false,
    skills: ["Post-Op Recovery", "Mobility Training"],
    bio: "Michael is dedicated to helping patients regain their strength and mobility. With his doctoral level training, he designs personalized recovery plans for optimal results."
  },
  {
    id: 3,
    name: "Maria Garcia",
    role: "Elder Care Specialist",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjP9fKZDoscau9JWXILHatIV06uA6WjOblCzVDwezIlitQxQpIOjl625gbEs1hSq0rcQZfbKklrwiy8APfiMilf68lPpsm8xMg2h0S5YlqCKy19VVCFQaPUJdFtFeRHRQQeNImh_wESPpVYpdp1EgXXx8iGqROE-WUm-ypnQQ1OG5zHyEuhDjzk-B8N35TIzjTwyaORGnA8CJQrvRaNpZcpSkW23hBucpS6Irrshq96MbMiGx8T8HGt_ETEDZEDTWL1kn2vK_CCsKN",
    experience: "8+ Years Exp",
    rating: "4.8",
    reviews: 215,
    verified: true,
    licensed: false,
    screened: true,
    skills: ["Companionship", "ADL Support", "Meal Prep"],
    bio: "Maria creates a supportive home environment, assisting with daily activities and meal preparation while offering meaningful companionship."
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Registered Nurse (RN)",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    experience: "10+ Years Exp",
    rating: "4.9",
    reviews: 156,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["Critical Care", "Cardiac Rehab"],
    bio: "James specializes in cardiac rehabilitation and critical care. With over a decade of ICU experience, he brings hospital-level expertise to home care settings."
  },
  {
    id: 5,
    name: "Emily Zhang",
    role: "Physical Therapist (DPT)",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    experience: "5+ Years Exp",
    rating: "4.7",
    reviews: 42,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["Mobility Training", "Stroke Recovery"],
    bio: "Emily is passionate about helping patients regain their independence through targeted physical therapy. she specializes in stroke recovery and balance training."
  },
  {
    id: 6,
    name: "David Brown",
    role: "Elder Care Specialist",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    experience: "15+ Years Exp",
    rating: "5.0",
    reviews: 203,
    verified: true,
    licensed: false,
    screened: true,
    skills: ["Dementia Care", "Palliative Support"],
    bio: "David has a gentle approach and extensive experience with dementia patients. He creates a calm, supportive environment focusing on dignity and comfort."
  },
  {
    id: 7,
    name: "Lisa Anderson",
    role: "Certified Nursing Assistant (CNA)",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400",
    experience: "7+ Years Exp",
    rating: "4.8",
    reviews: 98,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["ADL Support", "Medication Reminders"],
    bio: "Lisa is known for her reliability and cheerful demeanor. She assists with daily living activities, ensuring patients feel comfortable and well-cared for."
  },
  {
    id: 8,
    name: "Robert Martinez",
    role: "Occupational Therapist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    experience: "9+ Years Exp",
    rating: "4.9",
    reviews: 112,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["Home Safety", "Adaptive Equipment"],
    bio: "Robert experts in modifying home environments for safety and teaching patients how to use adaptive equipment to maintain independence."
  },
  {
    id: 9,
    name: "Jennifer Lee",
    role: "Registered Nurse (RN)",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
    experience: "11+ Years Exp",
    rating: "4.8",
    reviews: 134,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["Wound Care", "Diabetes Management"],
    bio: "Jennifer is a diabetes educator and wound care specialist. She empowers patients with the knowledge to manage their conditions effectively at home."
  },
  {
    id: 10,
    name: "Thomas Wilson",
    role: "Care Companion",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    experience: "4+ Years Exp",
    rating: "4.6",
    reviews: 56,
    verified: true,
    licensed: false,
    screened: true,
    skills: ["Companionship", "Transportation"],
    bio: "Thomas provides friendly companionship and reliable transportation for medical appointments and social outings, helping seniors stay connected."
  },
  {
    id: 11,
    name: "Patricia Taylor",
    role: "Hospice Nurse",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
    experience: "20+ Years Exp",
    rating: "5.0",
    reviews: 189,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["End of Life Care", "Pain Management"],
    bio: "Patricia brings deep compassion and expertise to end-of-life care, supporting both patients and their families through difficult times with grace."
  },
  {
    id: 12,
    name: "Kevin White",
    role: "Physical Therapist Assistant",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    experience: "6+ Years Exp",
    rating: "4.7",
    reviews: 78,
    verified: true,
    licensed: true,
    screened: true,
    skills: ["Exercise Therapy", "Stretching"],
    bio: "Kevin works closely with physical therapists to implement exercise plans that help patients recover strength and flexibility."
  },
];

//Service Page------------------------------------------------------------------------------------------------------
export const servicesPageData = {
  hero: {
    badge: "Trusted by 10,000+ Families",
    title: "Comprehensive Care",
    titleHighlight: "Tailored",
    titleSuffix: "to Your Family",
    description: "Empathetic professional caregiving designed to provide absolute peace of mind for you and your aging loved ones.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8gmmtmQi5pspgp4FLLZDC2U_SC6a-lATj5BnnaLwtGUElFfBERkVePxRb_X7Y6QSKcIIiEzNUKxVBq-2MVfYzw5R3vqbDmMXJJ-iojkqhecleDK0VyOKVznlNr9yY8ddYPRjgPJCxPMaum0cCE8NLWYrhXCZLeg_HeXqD9EWBXcEcto0cC6k8pWQDlxLy2e-yhlZuuhAW0ywRTxDAO4Y-_lFXVMijImBhX0APfLJfNS5hNuV2V2qSTMfpRgcFVmiZ-5Z-dSz8IJZA",
    successBadge: {
      number: "100%",
      label: "Background checked",
      subLabel: "Certified Experts"
    }
  },
  categories: [
    {
      title: "Daily Home Care",
      icon: "Home",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1hM3SJyXLq3LRt4znbhD-MC26OM_Mz48x9WUrisjgr5Aw2pkGXisPGpiVNQ0NdruDJLKv8Oq5_ey2ENm1ax3rWfqxMpQfQBZ0AzTNyGpQmxg4OdfkUNTTu-pNEXtpjsiAQf0_5QTow9nV3rwHCQgJh68qUHHzUW8q8BOQ0rwEuGjpZQeSu7mkXr1S6VT8mKeAtEPDj3nte_VhjFlMsGTCU4aOzJU9i0hbGAxHncOqWA_XfBwFrykBKR1-c57sSthC3C5b9-6gx05Z",
      features: ["Companion care & errands", "Routine daily assistance", "24/7 Monitoring included"],
      color: "bg-[#0d8ca5]/10",
      textColor: "text-[#0d8ca5]"
    },
    {
      title: "Professional Nursing",
      icon: "Stethoscope",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzp1VVzhiL26dV0PttUK3lVLRQa7Pd1NEM7mUFeHNarUe2fCtpbxM_yRL45xKqhyJeNRy_E7A-rUJ5ypHRRRLiTCEd-DCRfHiGdX2az4zSwArlyhL7kts8vpRUEW3Fy1JhgIa2RAAeQj9O_37yBkhoXzaB3xajGbxWqWKAaaZmXImv8JD2GZ9mVXULUssPDPBRwFo7DNvhMSkafQa-UGmOJcagtntgjVCgRh9M7SSNY-VNPAbinrTmbmwjT1fmva6UaUuK7KDjaru8",
      features: ["Clinical wound management", "Medication administration", "Expert health assessment"],
      color: "bg-[#4ea6a5]/10",
      textColor: "text-[#4ea6a5]"
    },
    {
      title: "Specialized Therapy",
      icon: "Activity",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkRyYPC3huzcCBGmt7lwHyeHBGpkJzvuxbX7NovGfy71prHl79R_V_Qz6uA_6e5M98CLS8d_r7VijaRMrWnsM-oKyS_vnR1DgCn3vp81hHSoDZNZvaIP_48eDaC10Rd3vDotU_f0gGOwlanlYt9IrQyShmqnsEz_woIFvum1t29ivu331UERvDgaCaL3vBo9KQnJ9kQQJPeKLFu8uB0PXvFolICWRn-sDb_-Lij_RPSX4zX0jDC7R17iN2wKCHY6LQ4TTwlsbn4UET",
      features: ["Physical rehabilitation", "Personalized recovery plans", "Post-surgery support"],
      color: "bg-[#0d8ca5]/10",
      textColor: "text-[#0d8ca5]"
    }
  ],
  dashboardFeature: {
    title: "Real-time Peace of Mind with our Health Dashboard",
    description: "Never worry about missed doses or clinical updates. Our platform gives you instant access to vitals, logs, and activity reports from anywhere in the world.",
    stats: [
      { label: "Heart Rate", value: "72 BPM", icon: "Heart", color: "text-[#0d8ca5]" },
      { label: "Blood Pressure", value: "120/80", icon: "Activity", color: "text-[#4ea6a5]" }
    ],
    medication: { name: "Vitamin D3", time: "10:00 AM" },
    careTeam: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWOKa3ooEbJMV4ZeGt6uNmmWbd4Be0OFlo1qrKfm1sLFHoSI5aQ7B4PpVhqLm-6sYdF70wgXRHSFWiLbEAQjJNpnSHSkbKn9SQekpxDtLnqHO4lqrpDguTUfwz_iM0rMGukaTR9hupZe5ko3kYZZHdOnE9-yFtVa6cuI1pd18uV0_XWAwQYxU2dgXF7BiaKqXkcV8psDZwRGfwuUSzkgdh8fGTQgiw0UhTDmLrM3HwB2qM_u0siBwSF-RKVNVmQGlDJiNRlda7_HWB",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB01pRB05D5AzldS9eLKiRrJqzoezJN6gbPe2Z-VepcD2IILjei0geu29VOkv5Vdb88MNdLsbzS0LiG28Ygitw5fB_lJ-oFFPlzvhKdssFIgiGzeYFH19Z_twgb_UL-Rn_xwJ-ijhH9jsMLU6nj7EEFdyWM3XRKKkmyWVDRKkNNPwBG9gmwwfa4r0eCCjEqR0wEMID5vDetBOuBAbmYb14aZqe9_KGQiAv7CshUKjoVXnuZrcHDTa4K1TENa6qFbPF7ewxzXDxLT0i4"
    ]
  },
  comparisonPlans: {
    features: [
      { name: "Dedicated Caregiver", onDemand: false, longTerm: true },
      { name: "Priority Booking", onDemand: false, longTerm: true },
      { name: "Family App Access", onDemand: true, longTerm: true },
      { name: "Price Stability", onDemand: "Market Rate", longTerm: "Fixed Monthly" }
    ]
  },
  trustFeatures: [
    { icon: "ShieldCheck", label: "Certified Staff" },
    { icon: "Lock", label: "Secure Payments" },
    { icon: "UserCog", label: "Admin Supervision" },
    { icon: "Phone", label: "24/7 Support" }
  ]
};

export const howItWorksPageData = {
  hero: {
    badge: "How it works",
    title: "Simple Care for Your Loved Ones",
    description: "A professional healthcare platform designed to bring peace of mind to families through transparent, real-time care management and expert matching.",
    image: banner2Img
  },
  tabs: [
    { id: "families", label: "For Families" },
    { id: "caregivers", label: "For Caregivers" },
    { id: "admins", label: "For Admins" }
  ],
  steps: {
    families: [
      {
        icon: "UserPlus",
        title: "Create Profile & Request Care",
        description: "Onboard your loved one by detailing their medical history, preferences, and specific care requirements. Our intuitive setup takes less than 10 minutes."
      },
      {
        icon: "ShieldCheck",
        title: "Admin Verification & Matching",
        description: "Our clinical team reviews the request, verifies safety protocols, and uses our smart-matching algorithm to find the perfect caregiver for your specific needs."
      },
      {
        icon: "Activity",
        title: "Real-Time Care & Logs",
        description: "Monitor daily activities, vital signs, and medication intake through your transparent dashboard. Stay connected with your caregiver through instant messaging."
      }
    ],
    caregivers: [
      {
        icon: "Briefcase",
        title: "Create Profile & Request",
        description: "Create your caregiver profile with your certifications, experience, specializations, and availability. Upload necessary documents for verification."
      },
      {
        icon: "ShieldCheck",
        title: "Get Verified & Matched",
        description: "Our admin team reviews your credentials and verifies your background. Once approved, you'll start receiving care assignments that match your skills."
      },
      {
        icon: "Activity",
        title: "Provide Care & Log Activities",
        description: "Deliver compassionate care to your assigned patients. Use our mobile app to log vitals, medications, activities, and any observations in real-time."
      }
    ],
    admins: [
      {
        icon: "Users",
        title: "Manage & Verify",
        description: "Review caregiver credentials, run background checks, and maintain a database of verified professionals ready to serve families in need."
      },
      {
        icon: "Briefcase",
        title: "Match & Assign",
        description: "Use our intelligent matching system to pair families with the most suitable caregivers based on needs, skills, location, and availability."
      },
      {
        icon: "Activity",
        title: "Monitor & Report",
        description: "Track all care logs, monitor patient health metrics, generate reports, and ensure quality standards are maintained across all services."
      }
    ]
  },
  dashboardWidget: {
    title: "Live Care Dashboard",
    status: "Active (Last updated 2m ago)",
    pulse: { value: "82", unit: "BPM", label: "Pulse Rate" },
    meds: { name: "Morning Meds", time: "08:00 AM", status: "TAKEN" },
    activity: { name: "Lunch Activity", time: "12:30 PM", status: "SCHEDULED" }
  },
  cta: {
    title: "Ready to get started?",
    description: "Join thousands of families who trust HomeCare Connect for safe, professional, and transparent healthcare at home.",
    footerText: "No commitment required. Initial consultation is free."
  }
};
