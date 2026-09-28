export interface Course {
  id: string;
  number: string;
  title: string;
  category: 'programming' | 'design' | 'digital-marketing' | 'others';
  duration?: string;
  description?: string;
  popular?: boolean;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  timeAgo: string;
  text: string;
  reviewCount?: number;
  tags?: string[];
  photos?: string[];
}

export const COURSES_DATA: Course[] = [
  // Programming
  { id: 'c-prog', number: '01', title: 'C Programming', category: 'programming', duration: '2 Months', description: 'Core procedural programming, memory management, pointers, and foundational logic.' },
  { id: 'java-dev', number: '02', title: 'Java Development', category: 'programming', duration: '3 Months', description: 'Object-oriented programming, core Java, collections, exception handling, and JDBC.' },
  { id: 'python-prog', number: '03', title: 'Python Programming', category: 'programming', duration: '2.5 Months', description: 'Python fundamentals, data structures, automation scripts, and practical problem solving.' },
  { id: 'python-course', number: '04', title: 'Python Course', category: 'programming', duration: '3 Months', description: 'Comprehensive Python training covering OOP, modules, file I/O, and real projects.' },
  { id: 'python-training', number: '05', title: 'Python Training', category: 'programming', duration: '3 Months', description: 'Hands-on practical lab training with industry assignments and coding exercises.' },
  { id: 'linux-prog', number: '06', title: 'Linux Programming', category: 'programming', duration: '2 Months', description: 'Linux terminal commands, shell scripting, file permissions, and administration.' },
  { id: 'cpp-prog', number: '07', title: 'C++ Object Oriented', category: 'programming', duration: '2 Months', description: 'Object-oriented concepts, classes, inheritance, polymorphism, and STL.' },
  { id: 'web-dev', number: '08', title: 'Web Development', category: 'programming', duration: '3.5 Months', description: 'Frontend essentials: HTML5, modern CSS3, JavaScript, and responsive layout creation.' },
  { id: 'fullstack-dev', number: '09', title: 'Full Stack Basics', category: 'programming', duration: '4 Months', description: 'Integrated frontend and backend workflows, databases, and project deployment.' },

  // Design
  { id: 'graphic-design', number: '01', title: 'Graphic Design Masterclass', category: 'design', duration: '3 Months', description: 'Visual branding, poster design, typography, color theory, and digital graphics.' },
  { id: 'photoshop-illustrator', number: '02', title: 'Adobe Photoshop & Illustrator', category: 'design', duration: '2.5 Months', description: 'Photo retouching, vector art creation, digital composition, and marketing creatives.' },
  { id: 'coreldraw', number: '03', title: 'CorelDRAW Professional', category: 'design', duration: '2 Months', description: 'Vector illustration, print media prep, flex banners, brochures, and commercial graphics.' },
  { id: 'ui-ux', number: '04', title: 'UI/UX Design Fundamentals', category: 'design', duration: '3 Months', description: 'Wireframing, user journey maps, Figma interface prototypes, and mobile design.' },
  { id: 'autocad', number: '05', title: 'AutoCAD 2D & 3D', category: 'design', duration: '2.5 Months', description: 'Architectural drafting, mechanical plans, floor layouts, and 3D modeling.' },
  { id: 'video-editing', number: '06', title: 'Video Editing Essentials', category: 'design', duration: '2 Months', description: 'Timeline trimming, transition effects, audio balancing, and reels creation.' },

  // Digital Marketing
  { id: 'complete-dm', number: '01', title: 'Complete Digital Marketing', category: 'digital-marketing', duration: '3.5 Months', description: 'End-to-end digital marketing strategies across search, social, and performance ads.' },
  { id: 'seo-course', number: '02', title: 'Search Engine Optimization (SEO)', category: 'digital-marketing', duration: '2 Months', description: 'On-page SEO, technical audits, keyword research, backlink strategies, and Google Search Console.' },
  { id: 'smm-course', number: '03', title: 'Social Media Marketing (SMM)', category: 'digital-marketing', duration: '2 Months', description: 'Instagram growth, Facebook ad manager, LinkedIn lead campaigns, and community handling.' },
  { id: 'google-ads', number: '04', title: 'Google Ads & PPC Campaigns', category: 'digital-marketing', duration: '1.5 Months', description: 'Search ads, Display network, YouTube video campaigns, conversion tracking, and ROI analysis.' },
  { id: 'content-copy', number: '05', title: 'Content Creation & Copywriting', category: 'digital-marketing', duration: '1.5 Months', description: 'Persuasive copywriting, blog structuring, social content calendar, and storytelling.' },
  { id: 'email-analytics', number: '06', title: 'Email Marketing & Web Analytics', category: 'digital-marketing', duration: '1.5 Months', description: 'Audience segmentation, email automation workflows, and Google Analytics 4 reporting.' },

  // Others
  { id: 'mscit', number: '01', title: 'MS-CIT (Govt. Certified)', category: 'others', duration: '2-3 Months', description: 'Maharashtra state certified IT course covering computer basics, internet, and office tools.' },
  { id: 'tally-prime', number: '02', title: 'Tally Prime with GST', category: 'others', duration: '2 Months', description: 'Practical accounting, voucher entry, GST invoicing, e-way bills, and financial statements.' },
  { id: 'adv-tally', number: '03', title: 'Advance Tally & Payroll', category: 'others', duration: '2 Months', description: 'Inventory management, cost centers, TDS, bank reconciliation, and payroll processing.' },
  { id: 'adv-excel', number: '04', title: 'Advance Excel & MIS Reporting', category: 'others', duration: '1.5 Months', description: 'VLOOKUP, XLOOKUP, Pivot tables, dashboards, formulas, and business data analysis.' },
  { id: 'typing', number: '05', title: 'English & Marathi Typing', category: 'others', duration: '2 Months', description: 'Touch typing accuracy, speed improvement (30/40 wpm), and GCC-TBC exam preparation.' },
  { id: 'basic-computers', number: '06', title: 'Basic Computers & Internet', category: 'others', duration: '1 Month', description: 'Keyboard skills, Windows navigation, email writing, web searching, and essential security.' },
];

export const STUDENT_STORIES: Review[] = [
  {
    id: 'rohan',
    name: 'Rohan M.',
    role: 'Student review',
    rating: 5,
    timeAgo: '1 month ago',
    text: '“The practical sessions made difficult topics easier. Teachers explain patiently and help until the concept is clear.”',
    tags: ['practical session', 'supportive teachers'],
  },
  {
    id: 'sneha',
    name: 'Sneha K.',
    role: 'Student review',
    rating: 5,
    timeAgo: '2 months ago',
    text: '“A supportive place to build confidence and improve computer knowledge through regular hands-on practice.”',
    tags: ['computer courses', 'practical session'],
  },
  {
    id: 'aditi',
    name: 'Aditi Shikhare',
    role: 'Student review',
    rating: 5,
    timeAgo: '2 months ago',
    reviewCount: 2,
    text: 'Very good institute for learning computers and practical skills. The staff is helpful, classes are well managed, and the teaching method is easy to understand. Recommended for students who want to improve their computer knowledge.',
    tags: ['computer courses', 'supportive teachers'],
  },
  {
    id: 'muskan',
    name: 'Muskan Pattedar',
    role: 'Student review',
    rating: 5,
    timeAgo: '2 months ago',
    reviewCount: 1,
    text: 'It is an good institution. I had completed my MC-CIT classes in this institution. We had a great experience. We have learnt many things with great memories. Thank You',
    tags: ['computer courses'],
  },
  {
    id: 'atif',
    name: 'Atif Shaikh',
    role: 'Student review',
    rating: 5,
    timeAgo: '2 months ago',
    reviewCount: 3,
    text: 'Aakar Computer Classes provides excellent computer training with knowledgeable and supportive teachers. The practical sessions helped me improve my skills and confidence.',
    tags: ['practical session', 'supportive teachers'],
  },
  {
    id: 'transworld',
    name: 'Trans World',
    role: 'Reviewer',
    rating: 5,
    timeAgo: '3 months ago',
    reviewCount: 6,
    text: "It's Small AC Space (around 65-70 seats) but best as Computer Lab...they are conducting National Entrance Exams also... Overall Good Institute.",
    tags: ['practical session'],
  },
  {
    id: 'gajanan',
    name: 'Gajanan Bari',
    role: 'Local Guide',
    rating: 4,
    timeAgo: '2 years ago',
    reviewCount: 25,
    text: 'Aakar Institute has a dedicated lab for students near Nehru Nagar signal with accessible entrance and hands-on computer machines.',
    tags: ['computer courses'],
  },
];

export const DIFFERENCE_ITEMS = [
  {
    number: '01',
    title: '100% practical learning',
    description: 'Practice-driven sessions designed around usable, real-world skills.',
    icon: 'Target',
  },
  {
    number: '02',
    title: 'Supportive teachers',
    description: 'Approachable guidance that helps every learner progress confidently.',
    icon: 'HeartHandshake',
  },
  {
    number: '03',
    title: 'Hands-on sessions',
    description: 'Learn by doing with exercises, projects and focused demonstrations.',
    icon: 'Tv',
  },
  {
    number: '04',
    title: 'Career direction',
    description: 'Choose a learning path aligned with your interests and next goals.',
    icon: 'Compass',
  },
  {
    number: '05',
    title: 'Personal attention',
    description: 'A welcoming environment with room to ask, practise and improve.',
    icon: 'Users',
  },
  {
    number: '06',
    title: 'Trusted locally',
    description: 'Rated 4.5 stars from 294+ learners across Kurla & Mumbai.',
    icon: 'Award',
  },
];
