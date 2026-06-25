import howImg from '../../assets/images/how.jpg';
import contactImg from '../../assets/images/contact.jpg';
import homecareImg from '../../assets/images/homecare.jpg';

export interface WelcomeData {
  hero: {
    image: string;
    fallbackImage: string;
    location: string;
    badge: {
      text: string;
      number: string;
    };
    heading: {
      prefix: string;
      highlight: string;
      suffix: string;
    };
    exploreBtnText: string;
    description: string;
  };
  contactCard: {
    image: string;
    fallbackImage: string;
    badgeText: string;
    description: string;
  };
  subscribeCard: {
    text: string;
    buttonText: string;
  };
  stats: {
    completedVisits: {
      count: string;
      label: string;
    };
    caregivers: {
      label: string;
    };
    medicalGrade: {
      label: string;
    };
    familiesSupported: {
      count: string;
      label: string;
    };
  };
  services: {
    title: string;
    exploreBtnText: string;
    items: Array<{
      id: number;
      type: 'card' | 'description';
      icon?: string;
      label?: string;
      text?: string;
      colSpan: number;
      animateSpin?: boolean;
    }>;
  };
  trustSection: {
    title: string;
    description: string;
    image: string;
    fallbackImage: string;
    buttonText: string;
    items: Array<{
      title: string;
      subtitle: string;
    }>;
  };
}

export const welcomeData: WelcomeData = {
  hero: {
    image: howImg,
    fallbackImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
    location: 'New York, USA 3:47 PM',
    badge: {
      text: 'Innovative health solutions',
      number: '01',
    },
    heading: {
      prefix: 'Compassionate',
      highlight: 'home care',
      suffix: 'you can trust',
    },
    exploreBtnText: 'Explore our services',
    description: 'We provide compassionate, reliable home care services to help families care for their loved ones with confidence.',
  },
  contactCard: {
    image: contactImg,
    fallbackImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    badgeText: 'Contact us',
    description: 'We are always glad to collaborate',
  },
  subscribeCard: {
    text: 'Subscribe to our news & updates',
    buttonText: 'Subscribe',
  },
  stats: {
    completedVisits: {
      count: '98+',
      label: 'Care Visits Completed',
    },
    caregivers: {
      label: 'Certified & Background-Checked Caregivers',
    },
    medicalGrade: {
      label: 'Medical-grade Home Care',
    },
    familiesSupported: {
      count: '1,500k+',
      label: 'Families Supported',
    },
  },
  services: {
    title: 'Explore our care services and expertise',
    exploreBtnText: 'Explore now',
    items: [
      {
        id: 1,
        type: 'card',
        icon: 'ecg_heart',
        label: 'Caregivers',
        colSpan: 1,
      },
      {
        id: 2,
        type: 'card',
        icon: 'pill',
        label: 'Home Medical Support',
        colSpan: 2,
      },
      {
        id: 3,
        type: 'card',
        icon: 'stethoscope',
        label: 'Medical Equipment',
        colSpan: 1,
      },
      {
        id: 4,
        type: 'card',
        icon: 'settings',
        label: 'In-Home Support',
        colSpan: 1,
        animateSpin: true,
      },
      {
        id: 5,
        type: 'description',
        text: 'HomeCare provides trusted home care services that support families in maintaining health and well-being.',
        colSpan: 1,
      },
      {
        id: 6,
        type: 'card',
        icon: 'vaccines',
        label: 'Vaccination Support at Home',
        colSpan: 2,
      },
    ],
  },
  trustSection: {
    title: 'Trusted by Families & Recognized for Care Excellence',
    description: 'We are proud to be recognized for delivering compassionate, reliable, and high-quality care directly in the comfort of patients’ homes.',
    image: homecareImg,
    fallbackImage: '/images/homecare1.jpeg',
    buttonText: 'Learn More',
    items: [
      {
        title: 'Trusted by 1,000+ Families',
        subtitle: 'Families rely on us for safe, compassionate, and professional home care.',
      },
      {
        title: 'Certified & Background-Checked Caregivers',
        subtitle: 'Our team members undergo extensive vetting and ongoing professional training.',
      },
      {
        title: 'Awarded Best Home Care Service 2025',
        subtitle: 'Recognized for our commitment to quality, reliability, and patient-centered care.',
      },
    ],
  },
};
