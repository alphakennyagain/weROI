export interface Achievement {
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    title: "Dean's List",
    description:
      "Recognized for strong academic performance in the BSc Computer Science programme at the University of Technology, Jamaica. Maintains a 3.7 GPA while balancing contract development and personal projects.",
  },
  {
    title: "Contract and freelance delivery",
    description:
      "Delivered production web applications for ministry and agency clients using React, FastAPI, MongoDB, and modern deployment workflows on Vercel and Railway.",
  },
  {
    title: "Senior church volunteer",
    description:
      "Serves in leadership and technical support roles at church, coordinating events and helping maintain digital tools for the community.",
  },
  {
    title: "Jamaica Red Cross volunteer",
    description:
      "Contributes time to community service through the Red Cross, building teamwork, communication, and reliability outside of coursework.",
  },
  {
    title: "Security-aware engineering",
    description:
      "Applies OWASP-aligned practices, secure authentication patterns, and networking fundamentals learned through coursework and self-directed lab work.",
  },
];
