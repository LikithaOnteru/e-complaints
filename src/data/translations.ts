export type Language = 'en' | 'te' | 'hi';

export interface TranslationStrings {
  portalTitle: string;
  portalSubtitle: string;
  tagline: string;
  
  citizen: string;
  volunteer: string;
  admin: string;
  citizenDesc: string;
  volunteerDesc: string;
  adminDesc: string;
  
  loginHeading: string;
  loginSubheading: string;
  selectRole: string;
  emailLabel: string;
  passwordLabel: string;
  signInBtn: string;
  quickDemoLogin: string;
  forgotPassword: string;
  demoNotice: string;
  oneClickLogin: string;
  
  home: string;
  dashboard: string;
  registerComplaint: string;
  myComplaints: string;
  trackComplaint: string;
  villageMap: string;
  emergency: string;
  analytics: string;
  reports: string;
  logout: string;
  language: string;
  
  stateName: string;
  defaultUserName: string;
  defaultLocation: string;
  villagePenumaka: string;
  districtGuntur: string;
  
  totalGrievances: string;
  resolvedCount: string;
  pendingCount: string;
  inProgressCount: string;
  highPriority: string;
  recentActivity: string;
  
  submit: string;
  cancel: string;
  viewDetails: string;
  updateStatus: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    portalTitle: 'E-Rural Complaints AP',
    portalSubtitle: 'Andhra Pradesh Grama Sachivalayam Portal',
    tagline: 'Digital Rural Grievance Redressal System',
    
    citizen: 'Citizen (Krishna Rao)',
    volunteer: 'Gram Volunteer (AP)',
    admin: 'District Officer (Admin)',
    citizenDesc: 'Public citizen grievance filing & tracking',
    volunteerDesc: 'Gram Sachivalayam doorstep assistance',
    adminDesc: 'District Panchayati Raj authority portal',
    
    loginHeading: 'Grama Sachivalayam Login',
    loginSubheading: 'Select your role to access Andhra Pradesh Rural Grievance Portal',
    selectRole: 'Select Access Role',
    emailLabel: 'Email or Mobile Number',
    passwordLabel: 'Password / OTP',
    signInBtn: 'Sign In to Portal',
    quickDemoLogin: 'Quick Demo Pre-filled Credentials',
    forgotPassword: 'Forgot Password?',
    demoNotice: 'Demo AP Credentials Pre-filled',
    oneClickLogin: 'One-Click Login →',
    
    home: 'Home / Login',
    dashboard: 'Dashboard',
    registerComplaint: 'Register Grievance',
    myComplaints: 'My Complaints',
    trackComplaint: 'Track Grievance',
    villageMap: 'AP Village Map',
    emergency: 'AP Helplines',
    analytics: 'Analytics',
    reports: 'Reports',
    logout: 'Logout',
    language: 'Language',
    
    stateName: 'Andhra Pradesh',
    defaultUserName: 'Krishna Rao',
    defaultLocation: 'Penumaka Village, Tadepalle Mandal, Guntur Dist, AP',
    villagePenumaka: 'Penumaka',
    districtGuntur: 'Guntur District',
    
    totalGrievances: 'Total Grievances',
    resolvedCount: 'Resolved',
    pendingCount: 'Pending',
    inProgressCount: 'In Progress',
    highPriority: 'High Priority',
    recentActivity: 'Recent AP Grievance Updates',
    
    submit: 'Submit',
    cancel: 'Cancel',
    viewDetails: 'View Details',
    updateStatus: 'Update Status',
  },
  
  te: {
    portalTitle: 'ఈ-గ్రామీణ ఫిర్యాదులు (ఆంధ్ర ప్రదేశ్)',
    portalSubtitle: 'ఆంధ్ర ప్రదేశ్ గ్రామ సచివాలయం పోర్టల్',
    tagline: 'డిజిటల్ గ్రామీణ సమస్యల పరిష్కార వ్యవస్థ',
    
    citizen: 'పౌరుడు (కృష్ణారావు)',
    volunteer: 'గ్రామ వాలంటీర్ (AP)',
    admin: 'జిల్లా అధికారి (అడ్మిన్)',
    citizenDesc: 'ప్రజా ఫిర్యాదుల నమోదు మరియు ట్రాకింగ్',
    volunteerDesc: 'గ్రామ సచివాలయ ఇంటింటి సేవలు',
    adminDesc: 'జిల్లా పంచాయతీ రాజ్ అధికారుల పోర్టల్',
    
    loginHeading: 'గ్రామ సచివాలయం లాగిన్',
    loginSubheading: 'ఆంధ్ర ప్రదేశ్ ఈ-గ్రామీణ ఫిర్యాదుల పోర్టల్ కొరకు మీ రోల్ ఎంచుకోండి',
    selectRole: 'లాగిన్ రోల్ ఎంచుకోండి',
    emailLabel: 'ఈమెయిల్ లేదా మొబైల్ నంబర్',
    passwordLabel: 'పాస్‌వర్డ్ / ఒటిపి',
    signInBtn: 'పోర్టల్ లోనికి ప్రవేశించండి',
    quickDemoLogin: 'డెమో ఖాతా వివరాలు సిద్ధంగా ఉన్నాయి',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    demoNotice: 'AP డెమో వివరాలు పూరించబడ్డాయి',
    oneClickLogin: 'ఒకే క్లిక్‌తో లాగిన్ →',
    
    home: 'హోమ్ / లాగిన్',
    dashboard: 'డాష్‌బోర్డ్',
    registerComplaint: 'ఫిర్యాదు నమోదు',
    myComplaints: 'నా ఫిర్యాదులు',
    trackComplaint: 'ఫిర్యాదు ట్రాకింగ్',
    villageMap: 'AP గ్రామాల మ్యాప్',
    emergency: 'AP హెల్ప్‌లైన్లు',
    analytics: 'విశ్లేషణలు',
    reports: 'నివేదికలు',
    logout: 'లాగౌట్',
    language: 'భాష',
    
    stateName: 'ఆంధ్ర ప్రదేశ్',
    defaultUserName: 'డి. కృష్ణారావు',
    defaultLocation: 'పెనుమాక గ్రామం, తాడేపల్లి మండలం, గుంటూరు జిల్లా, AP',
    villagePenumaka: 'పెనుమాక',
    districtGuntur: 'గుంటూరు జిల్లా',
    
    totalGrievances: 'మొత్తం ఫిర్యాదులు',
    resolvedCount: 'పరిష్కరించబడినవి',
    pendingCount: 'పెండింగ్‌లో ఉన్నవి',
    inProgressCount: 'పురోగతిలో ఉన్నవి',
    highPriority: 'అత్యవసర సమస్యలు',
    recentActivity: 'ఇటీవలి ఆంధ్రప్రదేశ్ ఫిర్యాదుల తాజా సమాచారం',
    
    submit: 'సమర్పించండి',
    cancel: 'రద్దు చేయి',
    viewDetails: 'వివరాలు చూడండి',
    updateStatus: 'స్థితిని నవీకరించు',
  },
  
  hi: {
    portalTitle: 'ई-ग्रामीण शिकायतें (आंध्र प्रदेश)',
    portalSubtitle: 'आंध्र प्रदेश ग्राम सचिवालय पोर्टल',
    tagline: 'डिजिटल ग्रामीण शिकायत निवारण प्रणाली',
    
    citizen: 'नागरिक (कृष्णा राव)',
    volunteer: 'ग्राम वॉलंटियर (AP)',
    admin: 'जिला अधिकारी (एडमिन)',
    citizenDesc: 'नागरिक शिकायत पंजीकरण और ट्रैकिंग',
    volunteerDesc: 'ग्राम सचिवालय द्वार-सेवा सहायता',
    adminDesc: 'जिला पंचायती राज अधिकारी पोर्टल',
    
    loginHeading: 'ग्राम सचिवालय लॉगिन',
    loginSubheading: 'आंध्र प्रदेश ग्रामीण शिकायत पोर्टल के लिए अपनी भूमिका चुनें',
    selectRole: 'लॉगिन भूमिका चुनें',
    emailLabel: 'ईमेल या मोबाइल नंबर',
    passwordLabel: 'पासवर्ड / ओटीपी',
    signInBtn: 'पोर्टल में प्रवेश करें',
    quickDemoLogin: 'डेमो क्रेडेंशियल प्री-फिल्ड हैं',
    forgotPassword: 'पासवर्ड भूल गए?',
    demoNotice: 'AP डेमो विवरण पहले से भरा है',
    oneClickLogin: 'एक क्लिक में लॉगिन →',
    
    home: 'होम / लॉगिन',
    dashboard: 'डैशबोर्ड',
    registerComplaint: 'शिकायत दर्ज करें',
    myComplaints: 'मेरी शिकायतें',
    trackComplaint: 'शिकायत ट्रैक करें',
    villageMap: 'AP गांव मानचित्र',
    emergency: 'AP हेल्पलाइन',
    analytics: 'विश्लेषण',
    reports: 'रिपोर्ट',
    logout: 'लॉगआउट',
    language: 'भाषा',
    
    stateName: 'आंध्र प्रदेश',
    defaultUserName: 'कृष्णा राव',
    defaultLocation: 'पेनुमाका गांव, ताड़ेपल्ली मंडल, गुंटूर जिला, AP',
    villagePenumaka: 'पेनुमाका',
    districtGuntur: 'गुंटूर जिला',
    
    totalGrievances: 'कुल शिकायतें',
    resolvedCount: 'समाधान किया गया',
    pendingCount: 'लंबित',
    inProgressCount: 'प्रगति पर',
    highPriority: 'उच्च प्राथमिकता',
    recentActivity: 'आंध्र प्रदेश शिकायत अपडेट',
    
    submit: 'सबमिट करें',
    cancel: 'रद्द करें',
    viewDetails: 'विवरण देखें',
    updateStatus: 'स्थिति अपडेट करें',
  },
};
