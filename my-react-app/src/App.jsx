import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import Profile from "./pages/Profile";
import Interview from "./Interview";
import { generateInterviewQA } from "./gemini";
import CareerOptions from "./pages/CareerOptions";
import { selectQuestionsForUser } from "./utils/questionSelector";

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
    "How do you handle conflict in a team?",
    "Tell me about a time you showed leadership.",
    "Describe a failure and what you learned.",
    "How do you prioritize tasks when everything is urgent?",
    "What motivates you at work?",
  ];
  const hrExpectedAnswers = [
    "Introduce yourself briefly and professionally",
    "Explain your motivation to join the company",
    "List your strengths and weaknesses honestly",
    "Talk about your 5-year plan",
    "Describe a challenging situation and your solution",
    "Describe constructive communication and resolution steps",
    "Provide a concrete leadership example and impact",
    "Explain failure, take ownership, and describe learnings",
    "Discuss frameworks and examples of prioritization",
    "Share intrinsic and extrinsic motivators with examples",
  ];

  // Mock Interview
  const mockQuestions = [
    "What motivates you to work hard?",
    "How do you handle stress and pressure?",
    "Explain a time you worked in a team.",
    "What's your biggest professional achievement?",
    "Why should we hire you?",
    "Tell me about a time you disagreed with a decision.",
    "Describe a situation where you went above and beyond.",
    "How do you stay current in your field?",
    "Describe your ideal work environment.",
    "What do you expect from your manager?",
  ];
  const mockExpectedAnswers = [
    "Discuss what motivates you",
    "Explain how you manage stress",
    "Give an example of teamwork",
    "Highlight your professional achievement",
    "Explain why you are the best fit",
    "Show constructive dissent and alignment after decision",
    "Quantify impact and initiative",
    "Mention courses, reading, projects, communities",
    "Explain collaboration, focus, autonomy, psychological safety",
    "Clarity, feedback, support, growth, autonomy",
  ];

  // Technical Interview
  const technicalQuestions = [
    "Explain OOP principles with examples.",
    "What is the difference between HTTP and HTTPS?",
    "How do you optimize a slow SQL query?",
    "What is the time complexity of binary search?",
    "Explain how React's useState works internally.",
    "What is a race condition and how do you prevent it?",
    "Explain indexing and its trade-offs in databases.",
    "What is the CAP theorem?",
    "Explain caching strategies for web apps.",
    "Describe common OWASP Top 10 vulnerabilities.",
  ];
  const technicalExpectedAnswers = [
    "Explain OOP concepts like inheritance, polymorphism, encapsulation, abstraction",
    "Describe HTTP vs HTTPS",
    "Explain SQL query optimization techniques",
    "State binary search time complexity",
    "Explain React's useState internal working",
    "Define race conditions and use locks/transactions/atomics",
    "Cover B-tree indexes, selective columns, write overhead",
    "Consistency, Availability, Partition tolerance trade-offs",
    "Client/server caching, TTL, validation, CDN, cache-busting",
    "List examples like SQLi, XSS, CSRF, auth issues",
  ];

  // Helper to select 5 randomized, non-repeating questions per user per interview
  const getSelected = (interviewId, qPool, aPool) => {
    const userId = isSignedIn && user ? user.id : "anon";
    return selectQuestionsForUser(interviewId, qPool, aPool, userId, 5);
  };

  // Loader component to fetch AI-generated questions for a category
  const AIInterviewRoute = ({ interviewId, category, fallbackQuestions, fallbackAnswers, title, color }) => {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
      let mounted = true;
      const userId = isSignedIn && user ? user.id : "anon";
      const fallback = (fallbackQuestions || []).map((q, i) => ({ question: q, expected_answer: (fallbackAnswers || [])[i] || "" }));
      (async () => {
        const items = await generateInterviewQA({ interviewId, userId, category, count: 5, fallback });
        if (!mounted) return;
        setQuestions(items.map((it) => it.question));
        setAnswers(items.map((it) => it.expected_answer));
        setLoading(false);
      })();
      return () => { mounted = false; };
    }, [interviewId, category, isSignedIn, user]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 pt-24 px-6 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="animate-pulse text-gray-600">Generating questions with AI…</div>
          </div>
        </div>
      );
    }

    return (
      <Interview title={title} color={color} questions={questions} expectedAnswers={answers} />
    );
  };

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

        {/* Protected Profile */}
        <Route
          path="/profile"
          element={
            <>
              <SignedIn>
                <Profile />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* HR Interview (AI-generated) */}
        <Route
          path="/hr-interview"
          element={
            <AIInterviewRoute
              interviewId="hr-interview"
              category="HR behavioral"
              title="HR Interview"
              color="blue"
              fallbackQuestions={hrQuestions}
              fallbackAnswers={hrExpectedAnswers}
            />
          }
        />

        {/* Mock Interview (AI-generated) */}
        <Route
          path="/mock-interview"
          element={
            <AIInterviewRoute
              interviewId="mock-interview"
              category="Mock interview general"
              title="Mock Interview"
              color="green"
              fallbackQuestions={mockQuestions}
              fallbackAnswers={mockExpectedAnswers}
            />
          }
        />

        {/* Technical Interview (AI-generated) */}
        <Route
          path="/technical-interview"
          element={
            <AIInterviewRoute
              interviewId="technical-interview"
              category="Technical general"
              title="Technical Interview"
              color="purple"
              fallbackQuestions={technicalQuestions}
              fallbackAnswers={technicalExpectedAnswers}
            />
          }
        />

        {/* Career-Specific Interview Routes */}
        {/* Web Development Interviews */}
        <Route
          path="/web-frontend"
          element={
            <AIInterviewRoute
              interviewId="web-frontend"
              category="Frontend (React/CSS/Performance)"
              title="Frontend Development Interview"
              color="blue"
              fallbackQuestions={[
                "Explain the difference between React functional and class components.",
                "How do you handle state management in a large React application?",
                "What are the key differences between CSS Grid and Flexbox?",
                "How do you optimize the performance of a React application?",
                "Explain the concept of virtual DOM and its benefits.",
                "What is reconciliation in React?",
                "Explain code splitting and route-based chunking.",
                "How does React's concurrent rendering help performance?",
                "What are controlled vs uncontrolled components?",
                "How do you prevent layout thrashing in the browser?",
              ]}
              fallbackAnswers={[
                "Functional components use hooks, class components use lifecycle methods",
                "Use Redux, Context API, or state management libraries",
                "Grid is 2D layout system, Flexbox is 1D layout system",
                "Code splitting, lazy loading, memoization, bundle optimization",
                "Virtual DOM is a JavaScript representation of the real DOM for efficient updates",
                "Diffing algorithm to update DOM efficiently",
                "Dynamic import(), split bundles by route/components",
                "Interruptible rendering, prioritization, improved responsiveness",
                "Controlled via state/props vs DOM-managed inputs",
                "Batch DOM reads/writes, use requestAnimationFrame, CSS transforms",
              ]}
            />
          }
        />

        <Route
          path="/web-backend"
          element={
            <AIInterviewRoute
              interviewId="web-backend"
              category="Backend (APIs/DB/Architecture)"
              title="Backend Development Interview"
              color="green"
              fallbackQuestions={[
                "Explain RESTful API design principles.",
                "How do you handle database migrations in a production environment?",
                "What is the difference between SQL and NoSQL databases?",
                "How do you implement authentication and authorization?",
                "Explain microservices architecture and its benefits.",
                "Explain idempotency and why it matters in APIs.",
                "How do you design pagination and filtering for APIs?",
                "What is eventual consistency?",
                "Explain message queues and when to use them.",
                "How do you secure APIs against common attacks?",
              ]}
              fallbackAnswers={[
                "Use HTTP methods, stateless, resource-based URLs",
                "Version control, rollback strategies, testing in staging",
                "SQL is relational, NoSQL is non-relational and flexible",
                "JWT tokens, OAuth, role-based access control",
                "Independent services, scalability, technology diversity",
                "Same result on retries; use PUT, keys, deduplication",
                "Query params, cursors/offsets, consistent sorting",
                "Consistency delay across replicas; trade-offs",
                "Decouple services, reliability, buffering, async processing",
                "AuthN/Z, rate limiting, input validation, headers, TLS",
              ]}
            />
          }
        />

        <Route
          path="/web-fullstack"
          element={
            <AIInterviewRoute
              interviewId="web-fullstack"
              category="Full Stack (Frontend/Backend/DevOps)"
              title="Full Stack Development Interview"
              color="purple"
              fallbackQuestions={[
                "How do you ensure data consistency between frontend and backend?",
                "Explain the complete flow of a web application request.",
                "How do you handle errors and exceptions across the stack?",
                "What strategies do you use for API versioning?",
                "How do you implement real-time features in a web application?",
                "How do you structure a monorepo for a full-stack app?",
                "Explain SSR vs CSR vs ISR and trade-offs.",
                "How do you handle secrets across environments?",
                "What observability tools would you add end-to-end?",
                "How do you design for offline-first?",
              ]}
              fallbackAnswers={[
                "API contracts, validation, error handling, data synchronization",
                "Client → Server → Database → Response → Client rendering",
                "Try-catch blocks, error boundaries, logging, user feedback",
                "URL versioning, header versioning, backward compatibility",
                "WebSockets, Server-Sent Events, polling, real-time databases",
                "Workspaces, shared packages, tooling, CI",
                "Server-side rendering, client-side, incremental static regeneration",
                "Vaults, env management, rotation, least privilege",
                "Tracing, metrics, logs, RUM, dashboards",
                "Service workers, caching strategies, sync queues",
              ]}
            />
          }
        />

        {/* Data Science Interviews */}
        <Route
          path="/ds-analytics"
          element={
            <AIInterviewRoute
              interviewId="ds-analytics"
              category="Data Analytics"
              title="Data Analytics Interview"
              color="blue"
              fallbackQuestions={[
                "How do you approach a new dataset for analysis?",
                "Explain the difference between correlation and causation.",
                "What are the key metrics you use to measure data quality?",
                "How do you handle missing data in your analysis?",
                "Describe your experience with data visualization tools.",
                "How do you define and track KPIs?",
                "Explain cohort analysis and when to use it.",
                "How do you design A/B tests and avoid pitfalls?",
                "What is data normalization and why is it useful?",
                "How do you handle outliers and anomalies?",
              ]}
              fallbackAnswers={[
                "Data exploration, cleaning, understanding business context",
                "Correlation shows relationship, causation shows cause-effect",
                "Completeness, accuracy, consistency, timeliness, validity",
                "Imputation, deletion, modeling, domain knowledge",
                "Tableau, Power BI, Python libraries, interactive dashboards",
                "SMART metrics aligned to business outcomes",
                "Group users by time/attributes to isolate effects",
                "Sample sizing, randomization, stopping rules, guardrails",
                "Scaling to comparable ranges/features",
                "Statistical methods, domain checks, robust metrics",
              ]}
            />
          }
        />

        <Route
          path="/ds-ml"
          element={
            <AIInterviewRoute
              interviewId="ds-ml"
              category="Machine Learning"
              title="Machine Learning Interview"
              color="green"
              fallbackQuestions={[
                "Explain the bias-variance tradeoff in machine learning.",
                "How do you prevent overfitting in your models?",
                "What's the difference between supervised and unsupervised learning?",
                "How do you evaluate the performance of a classification model?",
                "Explain cross-validation and why it's important.",
                "What is regularization (L1/L2) and how does it help?",
                "Explain gradient descent and learning rate schedules.",
                "What is feature scaling and when is it necessary?",
                "How do you handle class imbalance?",
                "Explain bias in datasets and ways to mitigate it.",
              ]}
              fallbackAnswers={[
                "Balance between model complexity and generalization",
                "Regularization, cross-validation, early stopping, more data",
                "Supervised uses labeled data, unsupervised finds patterns",
                "Accuracy, precision, recall, F1-score, ROC-AUC",
                "Splits data into folds to test model performance robustly",
                "Penalize weights, sparsity vs smoothness trade-offs",
                "Optimize loss stepwise; cosine/step/exp decay",
                "Normalize/standardize features for convergence",
                "Resampling, class weights, thresholds, metrics",
                "Identify sources, reweigh, rebalance, audit",
              ]}
            />
          }
        />

        <Route
          path="/ds-engineering"
          element={
            <AIInterviewRoute
              interviewId="ds-engineering"
              category="Data Engineering"
              title="Data Engineering Interview"
              color="purple"
              fallbackQuestions={[
                "Explain the ETL process and its importance.",
                "How do you handle large-scale data processing?",
                "What's the difference between batch and stream processing?",
                "How do you ensure data pipeline reliability?",
                "Describe your experience with cloud data platforms.",
                "Explain data lake vs data warehouse.",
                "How do you partition big tables effectively?",
                "What is schema evolution and how to manage it?",
                "Explain CDC (change data capture).",
                "How do you design for data governance and lineage?",
              ]}
              fallbackAnswers={[
                "Extract, Transform, Load - data integration process",
                "Distributed computing, parallel processing, cloud platforms",
                "Batch processes data in chunks, stream processes in real-time",
                "Monitoring, error handling, data validation, alerting",
                "AWS, GCP, Azure data services, scalability, cost optimization",
                "Raw storage vs curated, structured serving",
                "Partition on time/high-cardinality keys, pruning",
                "Handle backward/forward compatibility, tooling",
                "Log-based replication, low-latency sync",
                "Catalogs, metadata, lineage tools, policies",
              ]}
            />
          }
        />

        {/* Frontend Interviews */}
        <Route
          path="/fe-react"
          element={
            <AIInterviewRoute
              interviewId="fe-react"
              category="React Frontend"
              title="React Development Interview"
              color="blue"
              fallbackQuestions={[
                "Explain React hooks and their benefits over class components.",
                "How do you manage component state and props effectively?",
                "What is the purpose of useEffect and how do you use it?",
                "How do you handle performance optimization in React?",
                "Explain the concept of React context and when to use it."
              ]}
              fallbackAnswers={[
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
            <AIInterviewRoute
              interviewId="fe-vue"
              category="Vue Frontend"
              title="Vue.js Development Interview"
              color="green"
              fallbackQuestions={[
                "Explain Vue's reactivity system and how it works.",
                "What are Vue components and how do you create reusable ones?",
                "How do you handle state management in Vue applications?",
                "Explain Vue's template syntax and directives.",
                "What are Vue lifecycle hooks and when do you use them?",
                "Explain the Composition API vs Options API.",
                "How do you optimize a large Vue app?",
                "What is a render function and when to use it?",
                "Explain dynamic component loading.",
                "How do you handle routing guards in Vue Router?",
              ]}
              fallbackAnswers={[
                "Proxy-based reactivity, automatic dependency tracking",
                "Single file components, props, events, slots for reusability",
                "Vuex, Pinia, provide/inject, component state",
                "Template expressions, v-if, v-for, v-model, event handling",
                "Created, mounted, updated, destroyed - component lifecycle",
                "Composable functions, better reuse, type inference",
                "Code splitting, caching, memoization, devtools",
                "JSX/hyperscript alternative for dynamic UIs",
                "Async import() with suspense/defineAsyncComponent",
                "beforeEach/afterEach, auth checks, per-route guards",
              ]}
            />
          }
        />

        <Route
          path="/fe-angular"
          element={
            <AIInterviewRoute
              interviewId="fe-angular"
              category="Angular Frontend"
              title="Angular Development Interview"
              color="purple"
              fallbackQuestions={[
                "Explain Angular's dependency injection system.",
                "What are Angular services and how do you use them?",
                "How do you handle routing and navigation in Angular?",
                "Explain Angular's change detection mechanism.",
                "What are Angular pipes and how do you create custom ones?",
                "Explain RxJS observables and common operators.",
                "What is Ahead-of-Time compilation?",
                "How do you optimize large Angular apps?",
                "Explain Angular modules vs standalone components.",
                "What is the purpose of guards and resolvers?",
              ]}
              fallbackAnswers={[
                "Hierarchical DI, providers, injectable decorators",
                "Singleton services, data sharing, business logic",
                "Router module, route configuration, navigation guards",
                "Zone.js, change detection strategies, OnPush",
                "Data transformation, pure/impure pipes, custom pipe creation",
                "Streams with map/mergeMap/switchMap, subscriptions",
                "Compile templates at build time for faster startup",
                "Lazy loading, change detection strategy, trackBy",
                "NgModules vs newer standalone components",
                "Protect routes, prefetch data, improve UX",
              ]}
            />
          }
        />

        {/* Cyber Security Interviews */}
        <Route
          path="/cyber-pentest"
          element={
            <AIInterviewRoute
              interviewId="cyber-pentest"
              category="Cyber Security - Penetration Testing"
              title="Penetration Testing Interview"
              color="blue"
              fallbackQuestions={[
                "Explain the penetration testing methodology you follow.",
                "How do you identify and exploit common web vulnerabilities?",
                "What tools do you use for network penetration testing?",
                "How do you write effective penetration testing reports?",
                "Explain the difference between black box and white box testing.",
                "How do you perform privilege escalation?",
                "Explain SSRF and how to detect it.",
                "How do you test for insecure deserialization?",
                "What is subdomain takeover and prevention?",
                "Explain common misconfigurations in cloud pentests.",
              ]}
              fallbackAnswers={[
                "Reconnaissance, scanning, enumeration, exploitation, reporting",
                "OWASP Top 10, SQL injection, XSS, CSRF, authentication bypass",
                "Nmap, Metasploit, Burp Suite, Wireshark, custom scripts",
                "Executive summary, technical details, risk assessment, remediation",
                "Black box: no prior knowledge, White box: full system knowledge",
                "Abuse weak perms/services; kernel/app vectors",
                "Server-side request forgery; SSRF patterns and mitigations",
                "Craft payloads; detect object manipulation risks",
                "Dangling DNS/hosted services; tighten ownership",
                "IAM, storage buckets, security groups, secrets",
              ]}
            />
          }
        />

        <Route
          path="/cyber-incident"
          element={
            <AIInterviewRoute
              interviewId="cyber-incident"
              category="Cyber Security - Incident Response"
              title="Incident Response Interview"
              color="green"
              fallbackQuestions={[
                "Describe your incident response process and procedures.",
                "How do you identify and contain security incidents?",
                "What tools do you use for security monitoring and analysis?",
                "How do you handle evidence collection and preservation?",
                "Explain the importance of incident documentation and lessons learned.",
                "How do you coordinate with stakeholders during incidents?",
                "Explain playbooks and runbooks in IR.",
                "What is the role of threat intel in response?",
                "How do you conduct post-incident reviews?",
                "Explain tabletop exercises and benefits.",
              ]}
              fallbackAnswers={[
                "Preparation, identification, containment, eradication, recovery",
                "SIEM alerts, log analysis, network monitoring, threat hunting",
                "Splunk, ELK stack, Wireshark, forensic tools, threat intel",
                "Chain of custody, legal requirements, forensic imaging",
                "Process improvement, knowledge sharing, prevention strategies",
                "Comms plans, roles, escalation paths",
                "Standardized response procedures and automation",
                "Feeds, context, attribution, TTPs",
                "Blameless reviews, actions, tracking",
                "Simulations to test readiness and gaps",
              ]}
            />
          }
        />

        <Route
          path="/cyber-compliance"
          element={
            <AIInterviewRoute
              interviewId="cyber-compliance"
              category="Cyber Security - Compliance"
              title="Security Compliance Interview"
              color="purple"
              fallbackQuestions={[
                "Explain the key requirements of GDPR and how to ensure compliance.",
                "How do you conduct security risk assessments?",
                "What is the difference between SOC 2 and ISO 27001?",
                "How do you implement and maintain security policies?",
                "Describe your experience with security audits and remediation.",
                "What is a DPIA and when is it required?",
                "Explain least privilege and access reviews.",
                "How do you handle vendor risk management?",
                "What is data retention and destruction policy?",
                "Explain incident reporting timelines and content.",
              ]}
              fallbackAnswers={[
                "Data protection, consent, breach notification, privacy by design",
                "Asset identification, threat analysis, vulnerability assessment",
                "SOC 2: service organizations, ISO 27001: information security",
                "Policy development, training, monitoring, regular updates",
                "Audit planning, evidence collection, gap analysis, remediation",
                "Data Protection Impact Assessment for high-risk processing",
                "Minimize access; periodic attestation and cleanup",
                "Assess third parties, contracts, controls, SLAs",
                "Define retention schedules and secure deletion",
                "Regulatory windows, authorities, stakeholder comms",
              ]}
            />
          }
        />

        {/* AI/ML Interviews */}
        <Route
          path="/ai-nlp"
          element={
            <AIInterviewRoute
              interviewId="ai-nlp"
              category="AI/ML - NLP"
              title="Natural Language Processing Interview"
              color="blue"
              fallbackQuestions={[
                "Explain the transformer architecture and its impact on NLP.",
                "How do you handle text preprocessing for NLP tasks?",
                "What are the differences between BERT, GPT, and T5 models?",
                "How do you evaluate the performance of NLP models?",
                "Explain the concept of attention mechanisms in neural networks.",
                "What is tokenization and subword methods (BPE/WordPiece)?",
                "Explain fine-tuning vs prompt-tuning/LoRA.",
                "How do you handle hallucinations in LLMs?",
                "What is RAG and when to use it?",
                "Explain alignment techniques (RLHF/DPO).",
              ]}
              fallbackAnswers={[
                "Self-attention, encoder-decoder, parallel processing, scalability",
                "Tokenization, normalization, stemming, lemmatization, encoding",
                "BERT: bidirectional, GPT: autoregressive, T5: text-to-text",
                "BLEU, ROUGE, perplexity, human evaluation, task-specific metrics",
                "Weighted connections, focus mechanism, long-range dependencies",
                "Break text to tokens; subword trade-offs",
                "Parameter-efficient methods vs full fine-tuning",
                "Guardrails, retrieval, constraints, evaluation",
                "Retrieve external knowledge to ground answers",
                "Preference optimization and safety/alignment",
              ]}
            />
          }
        />

        <Route
          path="/ai-cv"
          element={
            <AIInterviewRoute
              interviewId="ai-cv"
              category="AI/ML - Computer Vision"
              title="Computer Vision Interview"
              color="green"
              fallbackQuestions={[
                "Explain the architecture of Convolutional Neural Networks (CNNs).",
                "How do you handle data augmentation for computer vision tasks?",
                "What are the differences between object detection and image classification?",
                "How do you optimize computer vision models for deployment?",
                "Explain transfer learning and its benefits in computer vision.",
                "Explain semantic vs instance segmentation.",
                "What metrics evaluate detection models?",
                "How do you handle class imbalance in CV?",
                "Explain ONNX/TensorRT deployment steps.",
                "What is vision transformer (ViT)?",
              ]}
              fallbackAnswers={[
                "Convolutional layers, pooling, fully connected, feature extraction",
                "Rotation, scaling, flipping, color jittering, mixup, cutmix",
                "Classification: single label, Detection: multiple objects with location",
                "Model compression, quantization, pruning, edge deployment",
                "Pre-trained models, fine-tuning, reduced training time, better performance",
                "Pixel-wise vs object-wise segmentation tasks",
                "mAP, IoU, precision/recall curves",
                "Resampling, focal loss, augmentation",
                "Convert, optimize, calibrate, run-time engines",
                "Transformer-based architectures for images",
              ]}
            />
          }
        />

        <Route
          path="/ai-mlops"
          element={
            <AIInterviewRoute
              interviewId="ai-mlops"
              category="AI/ML - MLOps"
              title="MLOps & Deployment Interview"
              color="purple"
              fallbackQuestions={[
                "Explain the MLOps lifecycle and its key components.",
                "How do you version control machine learning models?",
                "What strategies do you use for model monitoring in production?",
                "How do you handle model retraining and deployment pipelines?",
                "Explain the concept of A/B testing for machine learning models.",
                "How do you detect and handle data drift?",
                "Explain feature stores and their benefits.",
                "What is canary vs blue/green deployment?",
                "How do you ensure reproducibility end-to-end?",
                "What SLAs/SLOs matter for ML services?",
              ]}
              fallbackAnswers={[
                "Data management, model training, deployment, monitoring, retraining",
                "Model registries, metadata tracking, experiment management",
                "Performance metrics, data drift detection, model degradation",
                "CI/CD pipelines, automated testing, gradual rollout, rollback",
                "Statistical testing, control groups, gradual rollout, metrics comparison",
                "Detect input/label drift, alarms, retraining triggers",
                "Centralize and reuse features consistently",
                "Gradual rollout strategies and rollback safety",
                "Pin datasets, seeds, envs, containers",
                "Latency, accuracy, freshness, availability",
              ]}
            />
          }
        />

        {/* GenAI Interviews */}
        <Route
          path="/genai-chatbots"
          element={
            <AIInterviewRoute
              interviewId="genai-chatbots"
              category="GenAI - Chatbots"
              title="Chatbot Development Interview"
              color="blue"
              fallbackQuestions={[
                "How do you design conversational flows for chatbots?",
                "Explain the difference between rule-based and AI-powered chatbots.",
                "How do you handle context and memory in chatbot conversations?",
                "What techniques do you use for chatbot evaluation and testing?",
                "How do you integrate chatbots with existing business systems?",
                "Explain slot filling and entity extraction.",
                "How do you reduce hallucinations in chatbots?",
                "What is a fallback strategy and escalation?",
                "Explain multi-turn context tracking.",
                "How do you log and audit conversations?",
              ]}
              fallbackAnswers={[
                "User journey mapping, decision trees, natural language understanding",
                "Rule-based: predefined responses, AI: machine learning, NLP",
                "Session management, conversation state, memory storage, context",
                "User satisfaction, task completion, conversation quality metrics",
                "APIs, webhooks, database integration, authentication, scalability",
                "Extract entities/slots to drive actions",
                "RAG, constraints, validation, safety policies",
                "Graceful handoff to human/alt channels",
                "Remember prior turns and references",
                "Structured logs, PII handling, compliance",
              ]}
            />
          }
        />

        <Route
          path="/genai-content"
          element={
            <AIInterviewRoute
              interviewId="genai-content"
              category="GenAI - Content"
              title="Content Generation Interview"
              color="green"
              fallbackQuestions={[
                "How do you ensure quality and accuracy in AI-generated content?",
                "Explain the concept of prompt engineering and its importance.",
                "How do you handle bias and ethical considerations in content generation?",
                "What techniques do you use for content personalization?",
                "How do you measure the effectiveness of AI-generated content?",
                "Explain content style transfer and risks.",
                "How do you do brand voice alignment?",
                "What are guardrails and how to implement them?",
                "Explain content deduplication and plagiarism checks.",
                "How do you enforce safety and compliance in outputs?",
              ]}
              fallbackAnswers={[
                "Human review, fact-checking, quality metrics, iterative improvement",
                "Crafting effective prompts, few-shot learning, prompt optimization",
                "Bias detection, diverse training data, ethical guidelines, monitoring",
                "User profiling, behavioral analysis, A/B testing, feedback loops",
                "Engagement metrics, conversion rates, user feedback, content quality",
                "Transform style; risks of misattribution and bias",
                "Constraints, examples, review workflows",
                "Policies, filters, validators, constraints",
                "N-gram/semantic similarity, citations",
                "Policy checks, red-teaming, audit logs",
              ]}
            />
          }
        />

        <Route
          path="/genai-automation"
          element={
            <AIInterviewRoute
              interviewId="genai-automation"
              category="GenAI - Automation"
              title="AI Automation Interview"
              color="purple"
              fallbackQuestions={[
                "How do you identify processes suitable for AI automation?",
                "Explain the role of APIs in AI automation workflows.",
                "How do you ensure reliability and error handling in automated systems?",
                "What considerations are important for scaling AI automation?",
                "How do you measure the ROI of AI automation initiatives?",
                "How do you orchestrate multi-step AI workflows?",
                "Explain human-in-the-loop patterns.",
                "What logging and observability do you add?",
                "How do you manage secrets and credentials?",
                "Explain cost controls for AI usage.",
              ]}
              fallbackAnswers={[
                "Repetitive tasks, clear rules, high volume, measurable outcomes",
                "Data exchange, service integration, real-time communication",
                "Error handling, fallback mechanisms, monitoring, alerting",
                "Infrastructure, data management, performance optimization, security",
                "Time savings, cost reduction, accuracy improvement, productivity",
                "State machines, retries, branches, compensations",
                "Review/approval checkpoints and overrides",
                "Trace IDs, metrics, dashboards, alerts",
                "Vaulting, rotation, least privilege",
                "Budgets, rate limits, caching, batching",
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