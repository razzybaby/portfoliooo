/**
 * All of Rudransh's content lives here.
 * The page renders from these objects AND the chatbot's instructions are
 * generated from them (see `buildAssistantPrompt`), so both always agree.
 */

export type Project = {
  slug: string;
  name: string;
  summary: string;
  points: string[];
  stack: string[];
  repo: string;
  demo?: string;
};

// GitHub username: every repo link is built from it.
const githubUser = "razzybaby";
const linkedinUrl = "https://www.linkedin.com/in/rudransh-sharma-694521381/";

const repoUrl = (repoName: string) => (githubUser ? `https://github.com/${githubUser}/${repoName}` : "");

export const person = {
  fullName: "Rudransh Sharma",
  shortName: "Rudransh",
  initials: "RS",
  title: "CSE undergrad · problem solver",
  course: "B.Tech, Computer Science & Engineering",
  college: "JECRC University, Jaipur",
  batch: "2025",
  rollNo: "25BCON2412",
  city: "Jaipur, Rajasthan, India",
  email: "rudransh.25bcon2412@jecrcu.edu.in",
  github: githubUser ? `https://github.com/${githubUser}` : "",
  linkedin: linkedinUrl,
  // No photo yet, so the "RS" monogram is shown. To add one: put it in /public and set "/rudransh.jpg".
  photo: "",
  headline: "I break problems down, then build them back up in code.",
  about:
    "I'm Rudransh, a first-year Computer Science student at JECRC University in Jaipur. I like knowing why something works before I build it: I split a problem into small parts, write it in Python or JavaScript, test it, and keep refining. I use AI tools to debug and refactor faster, but I make sure I understand every line I ship.",
  principles: [
    { label: "Plan", text: "Sketch the problem into small, testable pieces first." },
    { label: "Build", text: "Write the simplest version that works, then improve it." },
    { label: "Verify", text: "Prove it with tests and real use, not guesses." },
  ],
};

export const bot = {
  name: "Draft",
  blurb: `Ask me anything about ${person.shortName}'s work`,
};

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const skillTable = [
  { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { group: "Web", items: ["Next.js", "React", "Tailwind CSS", "Responsive design", "localStorage"] },
  { group: "Testing & quality", items: ["unittest", "Debugging", "Refactoring", "Clean code"] },
  { group: "AI", items: ["Gemini API", "Prompt engineering", "AI-assisted debugging"] },
  { group: "Tools", items: ["Git", "GitHub", "VS Code", "Vercel", "Google Colab"] },
];

export const projects: Project[] = [
  {
    slug: "python-programs",
    name: "Python Programs Collection",
    summary:
      "Core Python exercises: factorial solved two ways, a Fibonacci series, and turning different data structures into dictionaries.",
    points: [
      "Factorial with an iterative loop and with recursion",
      "Fibonacci series generator",
      "Structure → dictionary conversion for a dataclass, a plain object, a list of tuples and records",
    ],
    stack: ["Python"],
    repo: repoUrl("python-programs-collection-"),
  },
  {
    slug: "messy-code",
    name: "Messy Python Code Improvement",
    summary:
      "Took a hard-to-read student marks script and refactored it with AI help, keeping the output exactly the same.",
    points: [
      "Meaningful variable and function names",
      "Validation for every mark entered",
      "Built-in functions in place of hand-written loops",
      "A grade lookup table instead of a long if/else chain",
    ],
    stack: ["Python", "AI refactoring"],
    repo: repoUrl("messy-python-code-improvement"),
  },
  {
    slug: "bug-fixing",
    name: "Bug Fixing Using AI (student_utils)",
    summary:
      "Located and fixed three bugs in a student utilities module using RED → FIX → GREEN, guided by nine unit tests.",
    points: [
      "Average was divided by len − 1 instead of len",
      "Pass check used > 40 instead of >= 40, so a 40 failed",
      "Distinction grade could never be reached because the conditions were in the wrong order",
      "Test run went from 4 failures + 1 error to 9/9 passing",
    ],
    stack: ["Python", "unittest"],
    repo: repoUrl("bug-fixing-student-utils"),
  },
  {
    slug: "quiz-app",
    name: "Interactive Quiz Application",
    summary:
      "A five-question multiple-choice quiz that tracks progress, locks each answer and shows the final score.",
    points: [
      "Progress shown across 5 questions",
      "Only one answer allowed per question",
      "Score screen with a Play Again button",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    repo: repoUrl("interactive-quiz-app"),
  },
  {
    slug: "reading-list",
    name: "Book Reading List Application",
    summary:
      "A reading tracker where books move between Want to Read, Reading and Finished, saved in the browser.",
    points: [
      "Add a book with a status: Want to Read, Reading or Finished",
      "Filter by status, change a book's status or delete it",
      "Live summary counts for each status",
      "Blocks duplicate titles and titles over 60 characters",
      "Data saved in localStorage; deployed on Vercel",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    repo: repoUrl("reading-list-app-"),
    demo: "https://reading-list-app-plum.vercel.app/",
  },
];

// Unique technologies across all projects → the filter chips.
export const allStacks = [...new Set(projects.flatMap((p) => p.stack))];

// The pinned horizontal "build log": how the five projects built on each other.
export const buildLog = [
  {
    step: "01",
    title: "Foundations",
    text: "Recursion vs. loops, sequences and data structures in plain Python.",
  },
  { step: "02", title: "Readability", text: "Learned that clean names and built-ins beat clever code." },
  {
    step: "03",
    title: "Testing",
    text: "Let failing tests point to bugs, fixed them, watched 9/9 go green.",
  },
  {
    step: "04",
    title: "Interaction",
    text: "Moved to the browser: events, state and a quiz that scores itself.",
  },
  {
    step: "05",
    title: "Shipping",
    text: "Persisted data with localStorage and deployed the reading list on Vercel.",
  },
];

export const starterQuestions = [
  "Who is Rudransh?",
  "What are his skills?",
  "Explain the Python programs",
  "How does the reading list work?",
];

/**
 * Turns the content above into the chatbot's instructions.
 * The model is told to answer ONLY from this text, so it can't make things up.
 */
export function buildAssistantPrompt(): string {
  const skillLines = skillTable.map((s) => `- ${s.group}: ${s.items.join(", ")}`).join("\n");
  const projectLines = projects
    .map((p, i) =>
      [
        `${i + 1}. ${p.name}: ${p.summary}`,
        ...p.points.map((pt) => `   - ${pt}`),
        `   Tech: ${p.stack.join(", ")}`,
        `   GitHub: ${p.repo || "link not added yet"}`,
        p.demo ? `   Live: ${p.demo}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  return `You are ${bot.name}, the assistant on ${person.fullName}'s portfolio website.
Answer visitors' questions about ${person.shortName} briefly and warmly (2-5 sentences, or a short "- " list).
When a visitor says "you", they mean ${person.shortName}; answer about him in the third person.

Rules:
- Use only the facts below. Never invent projects, marks, dates, jobs or links.
- If something isn't covered, say you don't know and suggest emailing ${person.email}.
- If a link says "not added yet", say it hasn't been added to the site yet.
- Plain text only, no markdown formatting other than "- " bullets.
- Politely decline anything unrelated to ${person.shortName}'s portfolio.

Profile:
- Name: ${person.fullName}
- Education: ${person.course}, ${person.college} (batch ${person.batch}, roll no. ${person.rollNo})
- Location: ${person.city}
- Email: ${person.email}
- GitHub: ${person.github || "not added yet"}
- LinkedIn: ${person.linkedin || "not added yet"}

About:
${person.about}

Skills:
${skillLines}

Projects (${projects.length}):
${projectLines}`;
}
