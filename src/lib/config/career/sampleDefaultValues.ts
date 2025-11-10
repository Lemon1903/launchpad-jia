import { CareerFormValues } from "@/lib/schemas/careerFormSchema";

export const sampleFSSeniorDeveloper: CareerFormValues = {
  // Career Information
  jobTitle: "Senior Full Stack Developer",
  description:
    "<p>We are seeking an experienced Senior Full Stack Developer to join our growing team. The ideal candidate will have strong expertise in React, Node.js, and TypeScript.</p><p>Responsibilities include designing and implementing scalable web applications, mentoring junior developers, and collaborating with cross-functional teams.</p>",
  employmentType: "Full-Time",
  workSetup: "Hybrid",
  country: "Philippines",
  province: "Metro Manila",
  location: "Quezon City",
  minimumSalary: 50000,
  maximumSalary: 80000,
  salaryNegotiable: false,

  // CV Screening
  cvScreeningSetting: "No Automatic Promotion",
  cvSecretPrompt: undefined,
  preScreeningQuestions: [
    {
      id: crypto.randomUUID(),
      type: "short-answer",
      isSuggested: false,
      question: "How many years of experience do you have with React?",
    },
    {
      id: crypto.randomUUID(),
      type: "long-answer",
      isSuggested: false,
      question: "Describe your most challenging project and how you overcame the obstacles.",
    },
    {
      id: crypto.randomUUID(),
      type: "dropdown",
      isSuggested: false,
      question: "What is your preferred programming language?",
      options: [{ value: "JavaScript" }, { value: "TypeScript" }, { value: "Python" }],
    },
    {
      id: crypto.randomUUID(),
      type: "checkbox",
      isSuggested: false,
      question: "Which technologies are you proficient in?",
      options: [
        { value: "React" },
        { value: "Node.js" },
        { value: "Next.js" },
        { value: "MongoDB" },
      ],
    },
    {
      id: crypto.randomUUID(),
      type: "range",
      isSuggested: false,
      question: "What is your expected salary range (in PHP)?",
      minimumSalary: 40000,
      maximumSalary: 100000,
      step: 5000,
    },
  ],

  // AI Interview
  aiScreeningSetting: "No Automatic Promotion",
  videoRequired: false,
  aiSecretPrompt: undefined,
  questions: [
    {
      id: crypto.randomUUID(),
      category: "CV Validation / Experience",
      questionCountToAsk: 2,
      questions: [
        {
          id: crypto.randomUUID(),
          question: "Can you walk me through your experience with React and Next.js?",
        },
        {
          id: crypto.randomUUID(),
          question: "Tell me about a significant project you've worked on in your recent role.",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: "Technical",
      questionCountToAsk: 2,
      questions: [
        {
          id: crypto.randomUUID(),
          question: "How would you optimize the performance of a React application?",
        },
        {
          id: crypto.randomUUID(),
          question: "Explain the difference between REST and GraphQL APIs.",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: "Behavioral",
      questionCountToAsk: 1,
      questions: [
        {
          id: crypto.randomUUID(),
          question: "How do you handle conflicts within your development team?",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: "Analytical",
      questionCountToAsk: null,
      questions: [],
    },
    {
      id: crypto.randomUUID(),
      category: "Others",
      questionCountToAsk: null,
      questions: [],
    },
  ],
};

// Alternative sample with CV screening and AI interview enabled
export const sampleFSJuniorDeveloper: CareerFormValues = {
  // Career Information
  jobTitle: "Junior Full Stack Developer",
  description:
    "<p>We're seeking a passionate <b>Junior Full Stack Developer</b> to join our dynamic team. The ideal candidate has hands-on experience building modern web applications and is eager to grow their skills in a collaborative environment.</p>" +
    "<p><b>About the Role:</b></p>" +
    "<p>You'll be working on exciting projects using cutting-edge technologies to create responsive, user-friendly web applications. This position offers excellent mentorship opportunities and the chance to work alongside experienced developers who are committed to your professional growth.</p>" +
    "<p><b>Required Technical Skills:</b></p>" +
    "<p>• <b>Frontend:</b> React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS</p>" +
    "<p>• <b>Backend:</b> Node.js, Express.js, RESTful API development</p>" +
    "<p>• <b>Database:</b> MongoDB, Firebase</p>" +
    "<p>• <b>State Management:</b> Redux, Zustand, or Context API</p>" +
    "<p>• <b>Version Control:</b> Git, GitHub</p>" +
    "<p>• <b>Tools:</b> VS Code, npm/yarn, Postman</p>" +
    "<p><b>What We're Looking For:</b></p>" +
    "<p>• Bachelor's degree in Computer Science or related field (or equivalent experience)</p>" +
    "<p>• Portfolio of personal or academic projects demonstrating full-stack development skills</p>" +
    "<p>• Strong understanding of responsive design and mobile-first development</p>" +
    "<p>• Experience with component-based architecture and modern JavaScript (ES6+)</p>" +
    "<p>• Ability to write clean, maintainable, and well-documented code</p>" +
    "<p>• Problem-solving mindset and attention to detail</p>" +
    "<p>• Excellent communication and teamwork skills</p>" +
    "<p><b>Nice to Have:</b></p>" +
    "<p>• Experience with Firebase authentication and real-time databases</p>" +
    "<p>• Knowledge of server-side rendering (SSR) and static site generation (SSG)</p>" +
    "<p>• Familiarity with Agile/Scrum methodologies</p>" +
    "<p>• Understanding of web performance optimization techniques</p>" +
    "<p><b>What We Offer:</b></p>" +
    "<p>• Competitive salary with performance-based increases</p>" +
    "<p>• Hybrid work arrangement for better work-life balance</p>" +
    "<p>• Learning and development opportunities</p>" +
    "<p>• Mentorship from senior developers</p>" +
    "<p>• Modern tech stack and tools</p>" +
    "<p>• Collaborative and supportive team culture</p>",
  employmentType: "Full-Time",
  workSetup: "Hybrid",
  country: "Philippines",
  province: "Metro Manila",
  location: "Quezon City",
  minimumSalary: 30000,
  maximumSalary: 45000,
  salaryNegotiable: true,

  // CV Screening with secret prompt
  cvScreeningSetting: "Good Fit and Above",
  cvSecretPrompt:
    "Prioritize candidates with React, Next.js, and TypeScript experience. Look for practical project experience, especially with full-stack applications using Node.js and MongoDB. Bonus points for Firebase, Tailwind CSS, and state management libraries.",
  preScreeningQuestions: [
    {
      id: crypto.randomUUID(),
      type: "short-answer",
      isSuggested: false,
      question: "How many years of experience do you have with React and Next.js?",
    },
    {
      id: crypto.randomUUID(),
      type: "checkbox",
      isSuggested: false,
      question: "Which of these technologies have you worked with?",
      options: [
        { value: "TypeScript" },
        { value: "Node.js" },
        { value: "MongoDB" },
        { value: "Firebase" },
        { value: "Tailwind CSS" },
        { value: "Redux/Zustand" },
      ],
    },
    {
      id: crypto.randomUUID(),
      type: "long-answer",
      isSuggested: false,
      question:
        "Describe a full-stack project you've built. What technologies did you use and what challenges did you face?",
    },
    {
      id: crypto.randomUUID(),
      type: "dropdown",
      isSuggested: false,
      question: "What is your preferred state management solution?",
      options: [
        { value: "Redux" },
        { value: "Zustand" },
        { value: "Context API" },
        { value: "Other" },
      ],
    },
  ],

  // AI Interview with secret prompt
  aiScreeningSetting: "Good Fit and Above",
  videoRequired: true,
  aiSecretPrompt:
    "Look for candidates with strong React/Next.js fundamentals and practical full-stack experience. Assess their ability to explain technical concepts clearly and their problem-solving approach. Value candidates with portfolio projects demonstrating real-world application development.",
  questions: [
    {
      id: crypto.randomUUID(),
      category: "CV Validation / Experience",
      questionCountToAsk: 2,
      questions: [
        {
          id: crypto.randomUUID(),
          question:
            "Tell me about your experience building applications with React and Next.js. What projects have you worked on?",
        },
        {
          id: crypto.randomUUID(),
          question:
            "Can you walk me through one of your full-stack projects? What was your role and what technologies did you use?",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: "Technical",
      questionCountToAsk: 2,
      questions: [
        {
          id: crypto.randomUUID(),
          question:
            "Explain how you would structure a Next.js application with both client and server components. What are the benefits of each?",
        },
        {
          id: crypto.randomUUID(),
          question:
            "How do you manage state in a React application? Can you explain when you would use Redux vs Zustand vs Context API?",
        },
        {
          id: crypto.randomUUID(),
          question:
            "Describe your experience with MongoDB. How would you design a database schema for a social media application?",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: "Behavioral",
      questionCountToAsk: 1,
      questions: [
        {
          id: crypto.randomUUID(),
          question:
            "Tell me about a challenging bug you encountered in one of your projects. How did you approach debugging and solving it?",
        },
        {
          id: crypto.randomUUID(),
          question:
            "Describe a situation where you had to learn a new technology or framework quickly to complete a project.",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: "Analytical",
      questionCountToAsk: 1,
      questions: [
        {
          id: crypto.randomUUID(),
          question:
            "How would you optimize the performance of a Next.js application that's loading slowly? What tools and techniques would you use?",
        },
        {
          id: crypto.randomUUID(),
          question:
            "If you were building a real-time chat application, what technologies and architecture would you choose and why?",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: "Others",
      questionCountToAsk: null,
      questions: [],
    },
  ],
};
