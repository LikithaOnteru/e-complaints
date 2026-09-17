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
  registerTab: string;
  signInTab: string;
  fullName: string;
  phoneNumber: string;
  selectVillage: string;
  selectWard: string;
  registerBtn: string;
  alreadyHaveAccount: string;
  needAccount: string;
  
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
  profile: string;
  notifications: string;
  
  stateName: string;
  defaultUserName: string;
  defaultLocation: string;
  villagePenumaka: string;
  districtGuntur: string;
  
  totalGrievances: string;
  resolvedCount: string;
  pendingCount: string;
  inProgressCount: string;
  rejectedCount: string;
  highPriority: string;
  mediumPriority: string;
  lowPriority: string;
  recentActivity: string;
  
  statusPending: string;
  statusInProgress: string;
  statusResolved: string;
  statusRejected: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  
  submit: string;
  cancel: string;
  save: string;
  search: string;
  filter: string;
  all: string;
  viewDetails: string;
  updateStatus: string;
  back: string;
  delete: string;
  confirm: string;
  export: string;
  download: string;
  loading: string;
  noData: string;
  actions: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  village: string;
  ward: string;
  date: string;
  assignedTo: string;

  citizenDashboardTitle: string;
  registerNewGrievance: string;
  trackExisting: string;
  mySubmittedGrievances: string;
  emergencyHelplines: string;

  adminDashboardTitle: string;
  totalComplaints: string;
  resolutionRate: string;
  avgResolutionTime: string;
  recentComplaints: string;

  registerGrievanceTitle: string;
  grievanceTitleLabel: string;
  grievanceCategoryLabel: string;
  grievancePriorityLabel: string;
  grievanceDescriptionLabel: string;
  photoAttachment: string;
  submitSuccessMsg: string;

  trackGrievanceTitle: string;
  enterComplaintId: string;
  searchBtn: string;
  timelineTitle: string;

  profileTitle: string;
  notificationsTitle: string;
  emergencyTitle: string;
  analyticsTitle: string;
  reportsTitle: string;

  ratingTitle: string;
  ratingSubmit: string;
  progressUpdateTitle: string;
  markAllRead: string;
  noNotifications: string;
  ratingPrompt: string;
  ratingThanks: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    portalTitle: 'E-Rural Complaints AP',
    portalSubtitle: 'Andhra Pradesh Grama Sachivalayam Portal',
    tagline: 'Digital Rural Grievance Redressal System',
    
    citizen: 'Citizen',
    volunteer: 'Gram Volunteer',
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
    registerTab: 'Register New Account',
    signInTab: 'Portal Sign In',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    selectVillage: 'Select Village',
    selectWard: 'Select Ward / Secretariate',
    registerBtn: 'Register Account',
    alreadyHaveAccount: 'Already have an account?',
    needAccount: 'Need an account? Register here',
    
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
    profile: 'Profile',
    notifications: 'Notifications',
    
    stateName: 'Andhra Pradesh',
    defaultUserName: 'Krishna Rao',
    defaultLocation: 'Penumaka Village, Tadepalle Mandal, Guntur Dist, AP',
    villagePenumaka: 'Penumaka',
    districtGuntur: 'Guntur District',
    
    totalGrievances: 'Total Grievances',
    resolvedCount: 'Resolved',
    pendingCount: 'Pending',
    inProgressCount: 'In Progress',
    rejectedCount: 'Rejected',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    recentActivity: 'Recent AP Grievance Updates',

    statusPending: 'Pending',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusRejected: 'Rejected',
    priorityHigh: 'High Priority',
    priorityMedium: 'Medium Priority',
    priorityLow: 'Low Priority',
    
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    viewDetails: 'View Details',
    updateStatus: 'Update Status',
    back: 'Back',
    delete: 'Delete',
    confirm: 'Confirm',
    export: 'Export',
    download: 'Download',
    loading: 'Loading...',
    noData: 'No complaints found',
    actions: 'Actions',
    description: 'Description',
    category: 'Category',
    priority: 'Priority',
    status: 'Status',
    location: 'Location',
    village: 'Village',
    ward: 'Ward',
    date: 'Date',
    assignedTo: 'Assigned Officer',

    citizenDashboardTitle: 'Citizen Grievance Dashboard',
    registerNewGrievance: 'Register New Grievance',
    trackExisting: 'Track Existing Grievance',
    mySubmittedGrievances: 'My Submitted Grievances',
    emergencyHelplines: 'Emergency Helplines',

    adminDashboardTitle: 'District Admin Grievance Portal',
    totalComplaints: 'Total Complaints',
    resolutionRate: 'Resolution Rate',
    avgResolutionTime: 'Avg Resolution Time',
    recentComplaints: 'Recent Complaints',

    registerGrievanceTitle: 'Submit Rural Grievance',
    grievanceTitleLabel: 'Grievance Title',
    grievanceCategoryLabel: 'Select Category',
    grievancePriorityLabel: 'Select Priority',
    grievanceDescriptionLabel: 'Grievance Description',
    photoAttachment: 'Attach Photo Evidence',
    submitSuccessMsg: 'Grievance registered successfully!',

    trackGrievanceTitle: 'Track Grievance Status',
    enterComplaintId: 'Enter Complaint ID (e.g. EC1001)',
    searchBtn: 'Search Grievance',
    timelineTitle: 'Resolution Progress Timeline',

    profileTitle: 'User Profile Settings',
    notificationsTitle: 'Grievance Notifications',
    emergencyTitle: 'Andhra Pradesh Emergency Contacts',
    analyticsTitle: 'Grievance Analytics & Insights',
    reportsTitle: 'Export & Print Reports',

    ratingTitle: 'Rate Complaint Resolution',
    ratingSubmit: 'Submit Feedback & Rating',
    progressUpdateTitle: 'Update Grievance Progress',
    markAllRead: 'Mark All as Read',
    noNotifications: 'No notifications at this time.',
    ratingPrompt: 'How satisfied are you with the resolution of your grievance?',
    ratingThanks: 'Thank you for rating our resolution service!'
  },
  
  te: {
    portalTitle: 'ఈ-గ్రామీణ ఫిర్యాదులు (ఆంధ్ర ప్రదేశ్)',
    portalSubtitle: 'ఆంధ్ర ప్రదేశ్ గ్రామ సచివాలయం పోర్టల్',
    tagline: 'డిజిటల్ గ్రామీణ సమస్యల పరిష్కార వ్యవస్థ',
    
    citizen: 'పౌరుడు',
    volunteer: 'గ్రామ వాలంటీర్',
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
    registerTab: 'నూతన ఖాతా నమోదు',
    signInTab: 'పోర్టల్ ప్రవేశం',
    fullName: 'పూర్తి పేరు',
    phoneNumber: 'ఫోన్ నంబర్',
    selectVillage: 'గ్రామాన్ని ఎంచుకోండి',
    selectWard: 'వార్డు / సచివాలయం ఎంచుకోండి',
    registerBtn: 'ఖాతా సృష్టించండి',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    needAccount: 'కొత్త ఖాతా కావాలా? ఇక్కడ నమోదు చేయండి',
    
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
    profile: 'ప్రొఫైల్',
    notifications: 'నోటిఫికేషన్లు',
    
    stateName: 'ఆంధ్ర ప్రదేశ్',
    defaultUserName: 'డి. కృష్ణారావు',
    defaultLocation: 'పెనుమాక గ్రామం, తాడేపల్లి మండలం, గుంటూరు జిల్లా, AP',
    villagePenumaka: 'పెనుమాక',
    districtGuntur: 'గుంటూరు జిల్లా',
    
    totalGrievances: 'మొత్తం ఫిర్యాదులు',
    resolvedCount: 'పరిష్కరించబడినవి',
    pendingCount: 'పెండింగ్‌లో ఉన్నవి',
    inProgressCount: 'పురోగతిలో ఉన్నవి',
    rejectedCount: 'తిరస్కరించబడినవి',
    highPriority: 'అత్యవసర సమస్యలు',
    mediumPriority: 'సాధారణ ప్రాధాన్యత',
    lowPriority: 'తక్కువ ప్రాధాన్యత',
    recentActivity: 'ఇటీవలి ఆంధ్రప్రదేశ్ ఫిర్యాదుల తాజా సమాచారం',

    statusPending: 'పెండింగ్‌లో ఉంది',
    statusInProgress: 'పురోగతిలో ఉంది',
    statusResolved: 'పరిష్కరించబడింది',
    statusRejected: 'తిరస్కరించబడింది',
    priorityHigh: 'అత్యవసర ప్రాధాన్యత',
    priorityMedium: 'సాధారణ ప్రాధాన్యత',
    priorityLow: 'తక్కువ ప్రాధాన్యత',
    
    submit: 'సమర్పించండి',
    cancel: 'రద్దు చేయి',
    save: 'సేవ్ చేయి',
    search: 'శోధించండి',
    filter: 'ఫిల్టర్',
    all: 'అన్నీ',
    viewDetails: 'వివరాలు చూడండి',
    updateStatus: 'స్థితిని మార్చు',
    back: 'వెనుకకు',
    delete: 'తొలగించు',
    confirm: 'ధృవీకరించు',
    export: 'ఎగుమతి',
    download: 'డౌన్‌లోడ్',
    loading: 'లోడ్ అవుతోంది...',
    noData: 'ఫిర్యాదులు ఏవీ కనుగొనబడలేదు',
    actions: 'చర్యలు',
    description: 'సమస్య వివరణ',
    category: 'వర్గం',
    priority: 'ప్రాధాన్యత',
    status: 'స్థితి',
    location: 'ప్రదేశం',
    village: 'గ్రామం',
    ward: 'వార్డు',
    date: 'తేదీ',
    assignedTo: 'కేటాయించిన అధికారి',

    citizenDashboardTitle: 'పౌరుల ఫిర్యాదుల డాష్‌బోర్డ్',
    registerNewGrievance: 'నూతన ఫిర్యాదును నమోదు చేయండి',
    trackExisting: 'ఫిర్యాదు ప్రగతి ట్రాకింగ్',
    mySubmittedGrievances: 'నా ఫిర్యాదుల జాబితా',
    emergencyHelplines: 'అత్యవసర హెల్ప్‌లైన్లు',

    adminDashboardTitle: 'జిల్లా అడ్మిన్ ఫిర్యాదుల పోర్టల్',
    totalComplaints: 'మొత్తం ఫిర్యాదులు',
    resolutionRate: 'పరిష్కార శాతం',
    avgResolutionTime: 'సగటు పరిష్కార సమయం',
    recentComplaints: 'ఇటీవలి ఫిర్యాదులు',

    registerGrievanceTitle: 'గ్రామీణ సమస్యను నమోదు చేయండి',
    grievanceTitleLabel: 'ఫిర్యాదు శీర్షిక',
    grievanceCategoryLabel: 'వర్గాన్ని ఎంచుకోండి',
    grievancePriorityLabel: 'ప్రాధాన్యతను ఎంచుకోండి',
    grievanceDescriptionLabel: 'సమస్య పూర్తి వివరణ',
    photoAttachment: 'ఫోటో రుజువు జతచేయండి',
    submitSuccessMsg: 'ఫిర్యాదు విజయవంతంగా నమోదైంది!',

    trackGrievanceTitle: 'ఫిర్యాదు ప్రగతి ట్రాకింగ్',
    enterComplaintId: 'ఫిర్యాదు సంఖ్య నమోదు చేయండి (ఉదా: EC1001)',
    searchBtn: 'శోధించండి',
    timelineTitle: 'పరిష్కార కాలక్రమ పురోగతి',

    profileTitle: 'వినియోగదారు ప్రొఫైల్ సవరణ',
    notificationsTitle: 'ఫిర్యాదుల నోటిఫికేషన్లు',
    emergencyTitle: 'ఆంధ్రప్రదేశ్ అత్యవసర సంప్రదింపు సంఖ్యలు',
    analyticsTitle: 'ఫిర్యాదుల విశ్లేషణ నివేదికలు',
    reportsTitle: 'నివేదికల ఎగుమతి',

    ratingTitle: 'పరిష్కార రేటింగ్ ఇవ్వండి',
    ratingSubmit: 'అభిప్రాయం సమర్పించండి',
    progressUpdateTitle: 'పురోగతి సమాచారం నవీకరించు',
    markAllRead: 'అన్నీ చూసినట్లు గుర్తించు',
    noNotifications: 'నోటిఫికేషన్లు ఏవీ లేవు.',
    ratingPrompt: 'మా పరిష్కార సేవపట్ల ఎంతవరకు సంతృప్తి చెందారు?',
    ratingThanks: 'మీ అభిప్రాయానికి ధన్యవాదాలు!'
  },
  
  hi: {
    portalTitle: 'ई-ग्रामीण शिकायतें (आंध्र प्रदेश)',
    portalSubtitle: 'आंध्र प्रदेश ग्राम सचिवालय पोर्टल',
    tagline: 'डिजिटल ग्रामीण शिकायत निवारण प्रणाली',
    
    citizen: 'नागरिक',
    volunteer: 'ग्राम वॉलंटियर',
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
    registerTab: 'नया खाता पंजीकृत करें',
    signInTab: 'पोर्टल साइन इन',
    fullName: 'पूरा नाम',
    phoneNumber: 'फोन नंबर',
    selectVillage: 'गांव चुनें',
    selectWard: 'वार्ड / सचिवालय चुनें',
    registerBtn: 'खाता पंजीकृत करें',
    alreadyHaveAccount: 'क्या आपके पास पहले से एक खाता है?',
    needAccount: 'नया खाता चाहिए? यहां पंजीकरण करें',
    
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
    profile: 'प्रोफ़ाइल',
    notifications: 'सूचनाएं',
    
    stateName: 'आंध्र प्रदेश',
    defaultUserName: 'कृष्णा राव',
    defaultLocation: 'पेनुमाका गांव, ताड़ेपल्ली मंडल, गुंटूर जिला, AP',
    villagePenumaka: 'पेनुमाका',
    districtGuntur: 'गुंटूर जिला',
    
    totalGrievances: 'कुल शिकायतें',
    resolvedCount: 'समाधान किया गया',
    pendingCount: 'लंबित',
    inProgressCount: 'प्रगति पर',
    rejectedCount: 'अस्वीकृत',
    highPriority: 'उच्च प्राथमिकता',
    mediumPriority: 'मध्यम प्राथमिकता',
    lowPriority: 'कम प्राथमिकता',
    recentActivity: 'आंध्र प्रदेश शिकायत अपडेट',

    statusPending: 'लंबित',
    statusInProgress: 'प्रगति पर',
    statusResolved: 'हल हुआ',
    statusRejected: 'अस्वीकृत',
    priorityHigh: 'उच्च प्राथमिकता',
    priorityMedium: 'मध्यम प्राथमिकता',
    priorityLow: 'कम प्राथमिकता',
    
    submit: 'सबमिट करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    all: 'सभी',
    viewDetails: 'विवरण देखें',
    updateStatus: 'स्थिति अपडेट करें',
    back: 'वापस',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    export: 'निर्यात',
    download: 'डाउनलोड',
    loading: 'लोड हो रहा है...',
    noData: 'कोई शिकायत नहीं मिली',
    actions: 'कार्रवाई',
    description: 'विवरण',
    category: 'श्रेणी',
    priority: 'प्राथमिकता',
    status: 'स्थिति',
    location: 'स्थान',
    village: 'गांव',
    ward: 'वार्ड',
    date: 'तारीख',
    assignedTo: 'सौंपा गया अधिकारी',

    citizenDashboardTitle: 'नागरिक शिकायत डैशबोर्ड',
    registerNewGrievance: 'नई शिकायत दर्ज करें',
    trackExisting: 'शिकायत स्थिति ट्रैक करें',
    mySubmittedGrievances: 'मेरी दर्ज की गई शिकायतें',
    emergencyHelplines: 'आपातकालीन हेल्पलाइन',

    adminDashboardTitle: 'जिला व्यवस्थापक शिकायत पोर्टल',
    totalComplaints: 'कुल शिकायतें',
    resolutionRate: 'समाधान दर',
    avgResolutionTime: 'औसत समाधान समय',
    recentComplaints: 'हाल की शिकायतें',

    registerGrievanceTitle: 'ग्रामीण शिकायत दर्ज करें',
    grievanceTitleLabel: 'शिकायत का शीर्षक',
    grievanceCategoryLabel: 'श्रेणी चुनें',
    grievancePriorityLabel: 'प्राथमिकता चुनें',
    grievanceDescriptionLabel: 'शिकायत का विस्तृत विवरण',
    photoAttachment: 'फोटो साक्ष्य संलग्न करें',
    submitSuccessMsg: 'शिकायत सफलतापूर्वक दर्ज की गई!',

    trackGrievanceTitle: 'शिकायत की स्थिति ट्रैक करें',
    enterComplaintId: 'शिकायत आईडी दर्ज करें (जैसे EC1001)',
    searchBtn: 'खोजें',
    timelineTitle: 'समाधान प्रगति समयरेखा',

    profileTitle: 'उपयोगकर्ता प्रोफ़ाइल',
    notificationsTitle: 'शिकायत सूचनाएं',
    emergencyTitle: 'आंध्र प्रदेश आपातकालीन संपर्क',
    analyticsTitle: 'शिकायत विश्लेषण',
    reportsTitle: 'रिपोर्ट निर्यात करें',

    ratingTitle: 'शिकायत समाधान को रेट करें',
    ratingSubmit: 'फीडबैक सबमिट करें',
    progressUpdateTitle: 'प्रगति अपडेट करें',
    markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    noNotifications: 'कोई सूचना नहीं है।',
    ratingPrompt: 'आप समाधान सेवा से कितने संतुष्ट हैं?',
    ratingThanks: 'आपकी रेटिंग के लिए धन्यवाद!'
  },
};

