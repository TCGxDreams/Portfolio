// F1 Telemetry Portfolio Configuration Data - Custom for Nguyen Vu Trong Nhan

export const portfolioConfig = {
  profile: {
    name: "Trong Nhan",
    surname: "Nguyen Vu",
    role: "Bioinformatics & AI Researcher",
    status: "ACTIVE_IN_RESEARCH",
    sector: "PTNK_BIOLOGY",
    gridRef: "VN-2026-AI",
    location: "Ho Chi Minh City, VN",
    bio: "Applying Deep Learning (GNNs) to computational drug discovery and structural biology. Co-founder of The Noders AI Club and Silver Medalist at the Vietnam National AI Championship."
  },
  
  contacts: {
    email: "nhan100434@gmail.com",
    phone: "(+84) 906-891-004",
    github: "https://github.com/TCGxBill",
    githubDreams: "https://github.com/TCGxDreams",
    linkedin: "https://linkedin.com"
  },
  
  sprintCountdown: {
    targetDate: "2026-10-15T09:00:00Z", // Youth Science Conference 2026 Target
    eventName: "YOUTH SCIENCE CONFERENCE // VNU-HCM",
    sprintSpeed: "9.3 GPA",
    lapCount: "1 PREPRINT",
    engineTemp: "37°C (BIOLOGY)",
    tyreCompound: "PYTORCH (GNN)"
  },
  
  navigation: [
    { 
      label: "HOME", 
      id: "home", 
      previewImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      label: "PROJECTS", 
      id: "projects", 
      previewImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      label: "STINTS", 
      id: "experience", 
      previewImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      label: "TELEMETRY", 
      id: "telemetry", 
      previewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      label: "ACADEMY", 
      id: "academy", 
      previewImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      label: "OFF-TRACK", 
      id: "offtrack", 
      previewImage: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      label: "ROADMAP", 
      id: "roadmap", 
      previewImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" 
    }
  ],

  projects: [
    {
      id: "gnn-binding-site",
      title: "Lightweight GNNs for Binding Site Prediction",
      description: "Research design applying deep Graph Neural Networks to computational drug discovery. Developed a lightweight GNN architecture achieving competitive accuracy in protein-ligand binding site prediction with low computational cost.",
      tags: ["PyTorch Geometric", "RDKit", "BioPython", "Zenodo"],
      image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=800",
      stats: {
        latency: "4.2 ms",
        throughput: "PyTorch",
        efficiency: 95
      },
      link: "https://github.com/TCGxBill"
    },
    {
      id: "text-to-video-edu",
      title: "AI-Powered Text-to-Video Platform",
      description: "Developed an AI system that translates speech and text into educational video content, designed for creating highly accessible, interactive learning materials for students.",
      tags: ["Generative AI", "NLP", "Text-to-Speech", "Python"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      stats: {
        latency: "1.2s",
        throughput: "GenAI",
        efficiency: 90
      },
      link: "https://github.com/TCGxBill"
    },
    {
      id: "viet-history-learning",
      title: "AI Vietnamese History Learning",
      description: "Built an interactive web platform utilizing AI-driven content recommendation algorithms to make Vietnamese national history engaging and interactive for high school students.",
      tags: ["Web Dev", "AI/ML Integration", "NLP", "Python"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      stats: {
        latency: "80ms",
        throughput: "Full-Stack",
        efficiency: 88
      },
      link: "https://github.com/TCGxBill"
    }
  ],

  experience: [
    {
      company: "MINDX TECHNOLOGY",
      period: "Aug 2024 – Dec 2024",
      role: "Data Analyst & Data Engineering Intern and Junior",
      location: "Ho Chi Minh City, Vietnam",
      highlights: [
        "Conducted Exploratory Data Analysis (EDA) on large-scale educational datasets using Python and statistical methods to identify student performance trends.",
        "Built ETL pipelines for data processing and analytics infrastructure to streamline data flow.",
        "Applied predictive analytics for student performance forecasting to proactively support learners."
      ],
      stintSpecs: {
        compLoad: "94% CPU",
        temp: "38°C TEMP",
        lapTime: "5 MONTHS"
      }
    },
    {
      company: "MINDX TECHNOLOGY",
      period: "Aug 2019 – Jun 2024",
      role: "Programming Team Member",
      location: "Ho Chi Minh City, Vietnam",
      highlights: [
        "Primary coder for UNISWAP project (2022) – built and optimized a full-stack web application with React and Node.js.",
        "Core team member for the D4E83 competition (2024) resolving complex data pipelines."
      ],
      stintSpecs: {
        compLoad: "88% CPU",
        temp: "36°C TEMP",
        lapTime: "58 MONTHS"
      }
    }
  ],

  leadership: [
    {
      role: "Co-Founder",
      organization: "The Noders",
      period: "2024 – Present",
      description: "First AI Club at PTNK (VNUHCM High School for the Gifted)",
      points: [
        "AI Education Initiative: Established the first student-led AI club at one of Vietnam's top high schools.",
        "AI Competition Organizer: Designed and hosted AI competitions modeled after national/international AI championships.",
        "Built an inclusive community bridging theoretical AI concepts with practical implementation."
      ]
    },
    {
      role: "Co-Founder",
      organization: "Kinh Thuong Huan Nghiep Hoi",
      period: "2024 – 2025",
      description: "Student Organization, PTNK",
      points: [
        "Founded and operated a student organization promoting entrepreneurship and business literacy."
      ]
    },
    {
      role: "Robotics Programming Instructor",
      organization: "THPT Chuyen Le Hong Phong",
      period: "May 2022 – May 2024",
      description: "Ho Chi Minh City, Vietnam",
      points: [
        "Teaching: Designed robotics and AI programming curriculum for high school students who want to join WRO or FLL."
      ]
    },
    {
      role: "Science Communication",
      organization: "PiiSE",
      period: "2024",
      description: "PTNK Scientific Publication Initiative",
      points: [
        "Technical Review: Provided detailed technical reviews on student research publications."
      ]
    }
  ],

  offTrackLogs: [
    {
      date: "2025",
      title: "Vietnam National AI Championship",
      category: "Silver Medal",
      value: "Demonstrated excellence in Computer Vision (CV) and Natural Language Processing (NLP) problem-solving on a national level."
    },
    {
      date: "2024",
      title: "D4E83 Data Analysis Competition",
      category: "Bronze Medal",
      value: "City-level data analysis competition held in Ho Chi Minh City."
    },
    {
      date: "2022",
      title: "World Robot Olympiad (WRO) Vietnam",
      category: "1st Place",
      value: "Designed autonomous robot systems using computer vision and algorithmic control, leading the team to national championship."
    },
    {
      date: "2020",
      title: "FIRST LEGO League International",
      category: "Core Values",
      value: "Recognized for exceptional teamwork, design innovation, and robotics core values."
    }
  ],

  education: [
    {
      institution: "High School for the Gifted, VNU-HCM (PTNK)",
      period: "Aug 2023 – Present",
      track: "Biology Specialized Track (Lớp Chuyên Sinh)",
      location: "Ho Chi Minh City, Vietnam",
      gpa: "GPA: 9.3+/10.0 (Highest Honors)",
      highlights: [
        "Biology Focus: Molecular Genetics, Classical Genetics, Population Genetics, Ecology.",
        "Self-directed AI Studies: Mathematics (Calculus, Linear Algebra) and Computer Science."
      ]
    },
    {
      institution: "Colette Secondary School",
      period: "Aug 2019 – May 2023",
      track: "Secondary Education",
      location: "Ho Chi Minh City, Vietnam",
      gpa: "GPA: 9.0+/10.0 (Highest Honors)",
      highlights: [
        "District-level Outstanding Student Awards in Informatics and Biology."
      ]
    }
  ],

  certifications: [
    { title: "Generative AI Course", issuer: "Luong Minh Thang (Google DeepMind)" },
    { title: "CSE Summer School", issuer: "Ho Chi Minh City University of Technology (HCMUT)" },
    { title: "AI Summer Bootcamp: CV & NLP", issuer: "Pima & VIASM" },
    { title: "AI & Emerging Technologies Research Foundations", issuer: "University of Science, VNU-HCM" },
    { title: "Interdisciplinary Science: Sustainable Development", issuer: "VNU-HCM Innovation Center" },
    { title: "Full-Stack Development & Data Analyst", issuer: "MindX Technology" }
  ],

  languages: [
    { name: "Vietnamese", level: "Native", value: 100 },
    { name: "English", level: "Proficient", value: 85 },
    { name: "German", level: "Elementary", value: 30 },
    { name: "French", level: "Elementary", value: 30 }
  ],

  telemetry: {
    gauges: [
      { id: "core-ai-ml", label: "Deep Learning (PyTorch)", value: 95 },
      { id: "bioinformatics", label: "Bioinformatics (RDKit)", value: 90 },
      { id: "software-dev", label: "Software Eng (Python/C++)", value: 85 }
    ],
    counters: [
      { id: "ligands-processed", label: "Processed Molecular Ligands", targetValue: 12450, format: "number" },
      { id: "gpa-biology", label: "Biology Specialized GPA", targetValue: 9.3, format: "decimal" },
      { id: "awards-national", label: "National & Global Awards", targetValue: 4, format: "number" },
      { id: "certifications-count", label: "Technical Certifications", targetValue: 6, format: "number" }
    ],
    historicalData: [
      35, 42, 50, 48, 55, 62, 70, 68, 75, 80, 84, 89, 93, 95, 92, 98, 96, 92, 88, 90, 93, 95
    ]
  },

  roadmap: [
    {
      quarter: "2026 Q2",
      title: "Youth Science Conference presentation",
      description: "Presenting Lightweight Graph Neural Networks for Protein-Ligand Binding Site Prediction at University of Science, VNU-HCM.",
      status: "COMPLETED"
    },
    {
      quarter: "2026 Q3",
      title: "Asia-Pacific Student Research Conference",
      description: "Bioinformatics research preprint paper review and upcoming conference presentation session.",
      status: "IN PROGRESS"
    },
    {
      quarter: "2026 Q4",
      title: "WASM GNN Client Inference",
      description: "Compiling Graph Neural Network architectures to run inference locally in browser clients using WebAssembly.",
      status: "SCHEDULED"
    }
  ]
};
