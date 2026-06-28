import type { Profile } from "./types";

export const profile: Profile = {
  name: "Zachary Hutton",
  headline: "CS student · full-stack builder · security-minded engineer",
  tags: ["Computer Science", "Full-Stack Development", "Cybersecurity", "UTech"],
  oneLiner:
    "CS student building across the stack — from coursework and security labs to production web apps. Based in Jamaica, open to internships and co-ops.",
  about: [
    "BSc Computer Science student at the University of Technology, Jamaica, with a strong CSEC foundation in IT, Mathematics, and Physics (Grade I). Dean's List honouree who learns fast and ships consistently.",
    "Interests span application development, systems thinking, and security — not locked to one lane. I enjoy connecting theory from the classroom to tools I can actually run and debug.",
    "Professional experience includes founding weROI and freelance delivery for Jamaican businesses. Personal time goes to GitHub projects, security labs, and deepening CS fundamentals.",
  ],
  stats: [
    { value: "Dean's List", label: "Academic honour" },
    { value: "Principal's Honour Roll", label: "Secondary school" },
    { value: "2029", label: "UTech BSc CS (expected)" },
    { value: "20+", label: "Projects shipped" },
    { value: "Jamaica", label: "Kingston · open to remote" },
  ],
  contact: {
    email: "zachary.hutton.dev@gmail.com",
    github: "https://github.com/alphakennyagain",
    linkedin: "https://linkedin.com/in/zachary-hutton",
    location: "Kingston, Jamaica",
  },
};
