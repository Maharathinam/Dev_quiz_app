const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const questions = [
  {
    id: 1,
    category: "DevOps",
    difficulty: "easy",
    question: "What does CI/CD stand for?",
    options: [
      "Continuous Integration / Continuous Delivery",
      "Code Integration / Code Deployment",
      "Continuous Iteration / Continuous Development",
      "Code Inspection / Code Delivery",
    ],
    answer: 0,
    explanation:
      "CI/CD stands for Continuous Integration and Continuous Delivery (or Deployment). It automates the process of building, testing, and deploying applications.",
  },
  {
    id: 2,
    category: "Docker",
    difficulty: "easy",
    question: "Which command builds a Docker image from a Dockerfile?",
    options: [
      "docker run",
      "docker build",
      "docker create",
      "docker compose",
    ],
    answer: 1,
    explanation:
      "'docker build' reads the Dockerfile in the current directory and builds an image from it. You can tag it with -t myapp:latest.",
  },
  {
    id: 3,
    category: "Kubernetes",
    difficulty: "medium",
    question: "What is a Kubernetes Pod?",
    options: [
      "A physical server in a cluster",
      "A Docker image stored in a registry",
      "The smallest deployable unit containing one or more containers",
      "A load balancer for services",
    ],
    answer: 2,
    explanation:
      "A Pod is the smallest and simplest Kubernetes object. It represents a single instance of a running process and can contain one or more containers that share network and storage.",
  },
  {
    id: 4,
    category: "DevOps",
    difficulty: "medium",
    question: "What is Infrastructure as Code (IaC)?",
    options: [
      "Writing code that runs on physical servers",
      "Managing infrastructure through machine-readable config files instead of manual processes",
      "A programming language used for networking",
      "Code that monitors server health",
    ],
    answer: 1,
    explanation:
      "IaC means managing and provisioning infrastructure through code (like Terraform or Ansible) rather than manual configuration. It enables version control, repeatability, and automation of infrastructure.",
  },
  {
    id: 5,
    category: "AWS",
    difficulty: "easy",
    question: "What does EKS stand for in AWS?",
    options: [
      "Elastic Kernel Service",
      "Elastic Kubernetes Service",
      "Extended Kubernetes System",
      "Elastic Key Storage",
    ],
    answer: 1,
    explanation:
      "EKS (Elastic Kubernetes Service) is AWS's managed Kubernetes service. It handles the control plane so you only manage worker nodes and your applications.",
  },
  {
    id: 6,
    category: "Docker",
    difficulty: "medium",
    question: "What is the purpose of a .dockerignore file?",
    options: [
      "To stop Docker from running on certain files",
      "To list files that should not be copied into the Docker image",
      "To ignore Docker errors during build",
      "To exclude containers from docker-compose",
    ],
    answer: 1,
    explanation:
      ".dockerignore works like .gitignore — it tells Docker which files to exclude when building an image. This keeps images smaller and build context faster (e.g., exclude node_modules, .git).",
  },
  {
    id: 7,
    category: "Kubernetes",
    difficulty: "hard",
    question: "What does a Kubernetes Service of type LoadBalancer do?",
    options: [
      "Balances CPU load across nodes",
      "Exposes your app to the internet via a cloud provider load balancer",
      "Distributes pods evenly across namespaces",
      "Automatically scales pods based on traffic",
    ],
    answer: 1,
    explanation:
      "A LoadBalancer Service provisions an external load balancer from your cloud provider (AWS ELB, GCP LB) and exposes your service to the public internet with a stable external IP.",
  },
  {
    id: 8,
    category: "GitHub Actions",
    difficulty: "easy",
    question: "In GitHub Actions, what is a 'workflow'?",
    options: [
      "A branch protection rule",
      "An automated process defined in a YAML file that runs on GitHub events",
      "A GitHub project board column",
      "A pull request review process",
    ],
    answer: 1,
    explanation:
      "A workflow is a configurable automated process defined in .github/workflows/*.yml. It triggers on events like push or pull_request and contains one or more jobs.",
  },
  {
    id: 9,
    category: "DevOps",
    difficulty: "hard",
    question: "What is the difference between horizontal and vertical scaling?",
    options: [
      "Horizontal = adding more RAM, Vertical = adding more servers",
      "Horizontal = adding more servers, Vertical = adding more RAM/CPU to existing server",
      "They are the same thing",
      "Horizontal scaling only applies to databases",
    ],
    answer: 1,
    explanation:
      "Horizontal scaling (scale out) adds more machines/instances. Vertical scaling (scale up) adds more resources to existing machines. Kubernetes makes horizontal scaling easy with HorizontalPodAutoscaler.",
  },
  {
    id: 10,
    category: "AWS",
    difficulty: "medium",
    question: "What is Amazon ECR used for?",
    options: [
      "Running serverless functions",
      "A managed Docker container image registry",
      "Monitoring application logs",
      "Creating virtual networks",
    ],
    answer: 1,
    explanation:
      "ECR (Elastic Container Registry) is AWS's managed Docker image registry. You push your built Docker images to ECR, then EKS pulls them from there during deployment.",
  },
];

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Dev Quiz API is running!" });
});

app.get("/api/questions", (req, res) => {
  const { category, difficulty } = req.query;
  let filtered = questions;

  if (category && category !== "all") {
    filtered = filtered.filter(
      (q) => q.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (difficulty && difficulty !== "all") {
    filtered = filtered.filter(
      (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  const safeQuestions = filtered.map(({ answer, explanation, ...q }) => q);
  res.json({ total: safeQuestions.length, questions: safeQuestions });
});

app.get("/api/questions/:id", (req, res) => {
  const question = questions.find((q) => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).json({ error: "Question not found" });
  const { answer, explanation, ...safeQuestion } = question;
  res.json(safeQuestion);
});

app.post("/api/submit", (req, res) => {
  const { questionId, selectedOption } = req.body;
  const question = questions.find((q) => q.id === parseInt(questionId));

  if (!question) return res.status(404).json({ error: "Question not found" });

  const isCorrect = selectedOption === question.answer;
  res.json({
    correct: isCorrect,
    correctAnswer: question.answer,
    explanation: question.explanation,
  });
});

app.get("/api/categories", (req, res) => {
  const categories = [...new Set(questions.map((q) => q.category))];
  res.json({ categories });
});

app.get("/api/leaderboard", (req, res) => {
  res.json({
    leaderboard: [
      { rank: 1, name: "Alice", score: 950, streak: 7 },
      { rank: 2, name: "Bob", score: 880, streak: 5 },
      { rank: 3, name: "Charlie", score: 820, streak: 3 },
      { rank: 4, name: "You", score: 0, streak: 0 },
    ],
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Dev Quiz API running on port ${PORT}`);
  });
}

module.exports = app;