import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
  useAuth,
} from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Summary from "./pages/Summary";
import Interview from "./Interview";
import CareerOptions from "./pages/CareerOptions";

// Clerk publishable key (from your .env file)
const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_d2hvbGUtbW90aC03MC5jbGVyay5hY2NvdW50cy5kZXYk";

function AppContent() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // HR Interview
  const hrQuestions = [
    "Tell me about yourself.",
    "Why do you want to join our company?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging situation and how you handled it.",
  ];
  const hrExpectedAnswers = [
    "Introduce yourself briefly and professionally",
    "Explain your motivation to join the company",
    "List your strengths and weaknesses honestly",
    "Talk about your 5-year plan",
    "Describe a challenging situation and your solution",
  ];

  // Mock Interview
  const mockQuestions = [
    "What motivates you to work hard?",
    "How do you handle stress and pressure?",
    "Explain a time you worked in a team.",
    "What's your biggest professional achievement?",
    "Why should we hire you?",
  ];
  const mockExpectedAnswers = [
    "Discuss what motivates you",
    "Explain how you manage stress",
    "Give an example of teamwork",
    "Highlight your professional achievement",
    "Explain why you are the best fit",
  ];

  // Technical Interview
  const technicalQuestions = [
    "Explain OOP principles with examples.",
    "What is the difference between HTTP and HTTPS?",
    "How do you optimize a slow SQL query?",
    "What is the time complexity of binary search?",
    "Explain how React's useState works internally.",
  ];
  const technicalExpectedAnswers = [
    "Explain OOP concepts like inheritance, polymorphism, encapsulation, abstraction",
    "Describe HTTP vs HTTPS",
    "Explain SQL query optimization techniques",
    "State binary search time complexity",
    "Explain React's useState internal working",
  ];

  return (
    <Router>
      <Navbar
        isLoggedIn={isSignedIn}
        setIsLoggedIn={() => {}} // Not needed with Clerk
        currentUser={
          isSignedIn && user
            ? {
                name:
                  user.fullName ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.emailAddresses[0]?.emailAddress ||
                  "User",
                email: user.emailAddresses[0]?.emailAddress || "",
                avatar: user.imageUrl,
                id: user.id,
              }
            : null
        }
        setCurrentUser={() => {}} // Not needed with Clerk
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Project />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />

        {/* ✅ Fix Clerk callback route */}
        <Route
          path="/register/sso-callback"
          element={<Navigate to="/login" replace />}
        />

        {/* Protected Career Options - First page after login */}
        <Route
          path="/career-options"
          element={
            <>
              <SignedIn>
                <CareerOptions />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* HR Interview */}
        <Route
          path="/hr-interview"
          element={
            <Interview
              title="HR Interview"
              color="blue"
              questions={hrQuestions}
              expectedAnswers={hrExpectedAnswers}
            />
          }
        />

        {/* Mock Interview */}
        <Route
          path="/mock-interview"
          element={
            <Interview
              title="Mock Interview"
              color="green"
              questions={mockQuestions}
              expectedAnswers={mockExpectedAnswers}
            />
          }
        />

        {/* Technical Interview */}
        <Route
          path="/technical-interview"
          element={
            <Interview
              title="Technical Interview"
              color="purple"
              questions={technicalQuestions}
              expectedAnswers={technicalExpectedAnswers}
            />
          }
        />

        {/* Career-Specific Interview Routes */}
        {/* Web Development Interviews */}
        <Route
          path="/web-frontend"
          element={
            <Interview
              title="Frontend Development Interview"
              color="blue"
              questions={[
                "Explain the difference between React functional and class components.",
                "How do you handle state management in a large React application?",
                "What are the key differences between CSS Grid and Flexbox?",
                "How do you optimize the performance of a React application?",
                "Explain the concept of virtual DOM and its benefits."
              ]}
              expectedAnswers={[
                "Functional components use hooks, class components use lifecycle methods",
                "Use Redux, Context API, or state management libraries",
                "Grid is 2D layout system, Flexbox is 1D layout system",
                "Code splitting, lazy loading, memoization, bundle optimization",
                "Virtual DOM is a JavaScript representation of the real DOM for efficient updates"
              ]}
            />
          }
        />

        <Route
          path="/web-backend"
          element={
            <Interview
              title="Backend Development Interview"
              color="green"
              questions={[
                "Explain RESTful API design principles.",
                "How do you handle database migrations in a production environment?",
                "What is the difference between SQL and NoSQL databases?",
                "How do you implement authentication and authorization?",
                "Explain microservices architecture and its benefits."
              ]}
              expectedAnswers={[
                "Use HTTP methods, stateless, resource-based URLs",
                "Version control, rollback strategies, testing in staging",
                "SQL is relational, NoSQL is non-relational and flexible",
                "JWT tokens, OAuth, role-based access control",
                "Independent services, scalability, technology diversity"
              ]}
            />
          }
        />

        <Route
          path="/web-fullstack"
          element={
            <Interview
              title="Full Stack Development Interview"
              color="purple"
              questions={[
                "How do you ensure data consistency between frontend and backend?",
                "Explain the complete flow of a web application request.",
                "How do you handle errors and exceptions across the stack?",
                "What strategies do you use for API versioning?",
                "How do you implement real-time features in a web application?"
              ]}
              expectedAnswers={[
                "API contracts, validation, error handling, data synchronization",
                "Client → Server → Database → Response → Client rendering",
                "Try-catch blocks, error boundaries, logging, user feedback",
                "URL versioning, header versioning, backward compatibility",
                "WebSockets, Server-Sent Events, polling, real-time databases"
              ]}
            />
          }
        />

        {/* Data Science Interviews */}
        <Route
          path="/ds-analytics"
          element={
            <Interview
              title="Data Analytics Interview"
              color="blue"
              questions={[
                "How do you approach a new dataset for analysis?",
                "Explain the difference between correlation and causation.",
                "What are the key metrics you use to measure data quality?",
                "How do you handle missing data in your analysis?",
                "Describe your experience with data visualization tools."
              ]}
              expectedAnswers={[
                "Data exploration, cleaning, understanding business context",
                "Correlation shows relationship, causation shows cause-effect",
                "Completeness, accuracy, consistency, timeliness, validity",
                "Imputation, deletion, modeling, domain knowledge",
                "Tableau, Power BI, Python libraries, interactive dashboards"
              ]}
            />
          }
        />

        <Route
          path="/ds-ml"
          element={
            <Interview
              title="Machine Learning Interview"
              color="green"
              questions={[
                "Explain the bias-variance tradeoff in machine learning.",
                "How do you prevent overfitting in your models?",
                "What's the difference between supervised and unsupervised learning?",
                "How do you evaluate the performance of a classification model?",
                "Explain cross-validation and why it's important."
              ]}
              expectedAnswers={[
                "Balance between model complexity and generalization",
                "Regularization, cross-validation, early stopping, more data",
                "Supervised uses labeled data, unsupervised finds patterns",
                "Accuracy, precision, recall, F1-score, ROC-AUC",
                "Splits data into folds to test model performance robustly"
              ]}
            />
          }
        />

        <Route
          path="/ds-engineering"
          element={
            <Interview
              title="Data Engineering Interview"
              color="purple"
              questions={[
                "Explain the ETL process and its importance.",
                "How do you handle large-scale data processing?",
                "What's the difference between batch and stream processing?",
                "How do you ensure data pipeline reliability?",
                "Describe your experience with cloud data platforms."
              ]}
              expectedAnswers={[
                "Extract, Transform, Load - data integration process",
                "Distributed computing, parallel processing, cloud platforms",
                "Batch processes data in chunks, stream processes in real-time",
                "Monitoring, error handling, data validation, alerting",
                "AWS, GCP, Azure data services, scalability, cost optimization"
              ]}
            />
          }
        />

        {/* Frontend Interviews */}
        <Route
          path="/fe-react"
          element={
            <Interview
              title="React Development Interview"
              color="blue"
              questions={[
                "Explain React hooks and their benefits over class components.",
                "How do you manage component state and props effectively?",
                "What is the purpose of useEffect and how do you use it?",
                "How do you handle performance optimization in React?",
                "Explain the concept of React context and when to use it."
              ]}
              expectedAnswers={[
                "Hooks allow functional components to use state and lifecycle",
                "State for internal data, props for parent-child communication",
                "Side effects, data fetching, cleanup, dependency arrays",
                "Memo, useMemo, useCallback, code splitting, lazy loading",
                "Global state management, avoiding prop drilling, provider pattern"
              ]}
            />
          }
        />

        <Route
          path="/fe-vue"
          element={
            <Interview
              title="Vue.js Development Interview"
              color="green"
              questions={[
                "Explain Vue's reactivity system and how it works.",
                "What are Vue components and how do you create reusable ones?",
                "How do you handle state management in Vue applications?",
                "Explain Vue's template syntax and directives.",
                "What are Vue lifecycle hooks and when do you use them?"
              ]}
              expectedAnswers={[
                "Proxy-based reactivity, automatic dependency tracking",
                "Single file components, props, events, slots for reusability",
                "Vuex, Pinia, provide/inject, component state",
                "Template expressions, v-if, v-for, v-model, event handling",
                "Created, mounted, updated, destroyed - component lifecycle"
              ]}
            />
          }
        />

        <Route
          path="/fe-angular"
          element={
            <Interview
              title="Angular Development Interview"
              color="purple"
              questions={[
                "Explain Angular's dependency injection system.",
                "What are Angular services and how do you use them?",
                "How do you handle routing and navigation in Angular?",
                "Explain Angular's change detection mechanism.",
                "What are Angular pipes and how do you create custom ones?"
              ]}
              expectedAnswers={[
                "Hierarchical DI, providers, injectable decorators",
                "Singleton services, data sharing, business logic",
                "Router module, route configuration, navigation guards",
                "Zone.js, change detection strategies, OnPush",
                "Data transformation, pure/impure pipes, custom pipe creation"
              ]}
            />
          }
        />

        {/* Cyber Security Interviews */}
        <Route
          path="/cyber-pentest"
          element={
            <Interview
              title="Penetration Testing Interview"
              color="blue"
              questions={[
                "Explain the penetration testing methodology you follow.",
                "How do you identify and exploit common web vulnerabilities?",
                "What tools do you use for network penetration testing?",
                "How do you write effective penetration testing reports?",
                "Explain the difference between black box and white box testing."
              ]}
              expectedAnswers={[
                "Reconnaissance, scanning, enumeration, exploitation, reporting",
                "OWASP Top 10, SQL injection, XSS, CSRF, authentication bypass",
                "Nmap, Metasploit, Burp Suite, Wireshark, custom scripts",
                "Executive summary, technical details, risk assessment, remediation",
                "Black box: no prior knowledge, White box: full system knowledge"
              ]}
            />
          }
        />

        <Route
          path="/cyber-incident"
          element={
            <Interview
              title="Incident Response Interview"
              color="green"
              questions={[
                "Describe your incident response process and procedures.",
                "How do you identify and contain security incidents?",
                "What tools do you use for security monitoring and analysis?",
                "How do you handle evidence collection and preservation?",
                "Explain the importance of incident documentation and lessons learned."
              ]}
              expectedAnswers={[
                "Preparation, identification, containment, eradication, recovery",
                "SIEM alerts, log analysis, network monitoring, threat hunting",
                "Splunk, ELK stack, Wireshark, forensic tools, threat intel",
                "Chain of custody, legal requirements, forensic imaging",
                "Process improvement, knowledge sharing, prevention strategies"
              ]}
            />
          }
        />

        <Route
          path="/cyber-compliance"
          element={
            <Interview
              title="Security Compliance Interview"
              color="purple"
              questions={[
                "Explain the key requirements of GDPR and how to ensure compliance.",
                "How do you conduct security risk assessments?",
                "What is the difference between SOC 2 and ISO 27001?",
                "How do you implement and maintain security policies?",
                "Describe your experience with security audits and remediation."
              ]}
              expectedAnswers={[
                "Data protection, consent, breach notification, privacy by design",
                "Asset identification, threat analysis, vulnerability assessment",
                "SOC 2: service organizations, ISO 27001: information security",
                "Policy development, training, monitoring, regular updates",
                "Audit planning, evidence collection, gap analysis, remediation"
              ]}
            />
          }
        />

        {/* AI/ML Interviews */}
        <Route
          path="/ai-nlp"
          element={
            <Interview
              title="Natural Language Processing Interview"
              color="blue"
              questions={[
                "Explain the transformer architecture and its impact on NLP.",
                "How do you handle text preprocessing for NLP tasks?",
                "What are the differences between BERT, GPT, and T5 models?",
                "How do you evaluate the performance of NLP models?",
                "Explain the concept of attention mechanisms in neural networks."
              ]}
              expectedAnswers={[
                "Self-attention, encoder-decoder, parallel processing, scalability",
                "Tokenization, normalization, stemming, lemmatization, encoding",
                "BERT: bidirectional, GPT: autoregressive, T5: text-to-text",
                "BLEU, ROUGE, perplexity, human evaluation, task-specific metrics",
                "Weighted connections, focus mechanism, long-range dependencies"
              ]}
            />
          }
        />

        <Route
          path="/ai-cv"
          element={
            <Interview
              title="Computer Vision Interview"
              color="green"
              questions={[
                "Explain the architecture of Convolutional Neural Networks (CNNs).",
                "How do you handle data augmentation for computer vision tasks?",
                "What are the differences between object detection and image classification?",
                "How do you optimize computer vision models for deployment?",
                "Explain transfer learning and its benefits in computer vision."
              ]}
              expectedAnswers={[
                "Convolutional layers, pooling, fully connected, feature extraction",
                "Rotation, scaling, flipping, color jittering, mixup, cutmix",
                "Classification: single label, Detection: multiple objects with location",
                "Model compression, quantization, pruning, edge deployment",
                "Pre-trained models, fine-tuning, reduced training time, better performance"
              ]}
            />
          }
        />

        <Route
          path="/ai-mlops"
          element={
            <Interview
              title="MLOps & Deployment Interview"
              color="purple"
              questions={[
                "Explain the MLOps lifecycle and its key components.",
                "How do you version control machine learning models?",
                "What strategies do you use for model monitoring in production?",
                "How do you handle model retraining and deployment pipelines?",
                "Explain the concept of A/B testing for machine learning models."
              ]}
              expectedAnswers={[
                "Data management, model training, deployment, monitoring, retraining",
                "Model registries, metadata tracking, experiment management",
                "Performance metrics, data drift detection, model degradation",
                "CI/CD pipelines, automated testing, gradual rollout, rollback",
                "Statistical testing, control groups, gradual rollout, metrics comparison"
              ]}
            />
          }
        />

        {/* GenAI Interviews */}
        <Route
          path="/genai-chatbots"
          element={
            <Interview
              title="Chatbot Development Interview"
              color="blue"
              questions={[
                "How do you design conversational flows for chatbots?",
                "Explain the difference between rule-based and AI-powered chatbots.",
                "How do you handle context and memory in chatbot conversations?",
                "What techniques do you use for chatbot evaluation and testing?",
                "How do you integrate chatbots with existing business systems?"
              ]}
              expectedAnswers={[
                "User journey mapping, decision trees, natural language understanding",
                "Rule-based: predefined responses, AI: machine learning, NLP",
                "Session management, conversation state, memory storage, context",
                "User satisfaction, task completion, conversation quality metrics",
                "APIs, webhooks, database integration, authentication, scalability"
              ]}
            />
          }
        />

        <Route
          path="/genai-content"
          element={
            <Interview
              title="Content Generation Interview"
              color="green"
              questions={[
                "How do you ensure quality and accuracy in AI-generated content?",
                "Explain the concept of prompt engineering and its importance.",
                "How do you handle bias and ethical considerations in content generation?",
                "What techniques do you use for content personalization?",
                "How do you measure the effectiveness of AI-generated content?"
              ]}
              expectedAnswers={[
                "Human review, fact-checking, quality metrics, iterative improvement",
                "Crafting effective prompts, few-shot learning, prompt optimization",
                "Bias detection, diverse training data, ethical guidelines, monitoring",
                "User profiling, behavioral analysis, A/B testing, feedback loops",
                "Engagement metrics, conversion rates, user feedback, content quality"
              ]}
            />
          }
        />

        <Route
          path="/genai-automation"
          element={
            <Interview
              title="AI Automation Interview"
              color="purple"
              questions={[
                "How do you identify processes suitable for AI automation?",
                "Explain the role of APIs in AI automation workflows.",
                "How do you ensure reliability and error handling in automated systems?",
                "What considerations are important for scaling AI automation?",
                "How do you measure the ROI of AI automation initiatives?"
              ]}
              expectedAnswers={[
                "Repetitive tasks, clear rules, high volume, measurable outcomes",
                "Data exchange, service integration, real-time communication",
                "Error handling, fallback mechanisms, monitoring, alerting",
                "Infrastructure, data management, performance optimization, security",
                "Time savings, cost reduction, accuracy improvement, productivity"
              ]}
            />
          }
        />

        {/* Summary Page */}
        <Route path="/summary" element={<Summary />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppContent />
    </ClerkProvider>
  );
}