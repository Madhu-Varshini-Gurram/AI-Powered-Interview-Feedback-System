import { useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCareer = location.state?.selectedCareer || "general";

  // Role-specific interviews for each career
  const careerSpecificInterviews = {
    "web-dev": [
      {
        id: "web-frontend",
        title: "Frontend Development",
        description: "React, Vue, Angular, HTML/CSS/JS fundamentals",
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "web-backend",
        title: "Backend Development", 
        description: "Node.js, Python, APIs, databases, server architecture",
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
        buttonColor: "bg-green-600 hover:bg-green-700"
      },
      {
        id: "web-fullstack",
        title: "Full Stack Development",
        description: "End-to-end development, system design, deployment",
        color: "purple",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        buttonColor: "bg-purple-600 hover:bg-purple-700"
      }
    ],
    "data-science": [
      {
        id: "ds-analytics",
        title: "Data Analytics",
        description: "SQL, Python, statistical analysis, visualization",
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "ds-ml",
        title: "Machine Learning",
        description: "Algorithms, model training, feature engineering",
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
        buttonColor: "bg-green-600 hover:bg-green-700"
      },
      {
        id: "ds-engineering",
        title: "Data Engineering",
        description: "ETL pipelines, data warehousing, big data tools",
        color: "purple",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        buttonColor: "bg-purple-600 hover:bg-purple-700"
      }
    ],
    "frontend": [
      {
        id: "fe-react",
        title: "React Development",
        description: "React hooks, state management, component design",
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "fe-vue",
        title: "Vue.js Development",
        description: "Vue components, Vuex, routing, composition API",
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
        buttonColor: "bg-green-600 hover:bg-green-700"
      },
      {
        id: "fe-angular",
        title: "Angular Development",
        description: "TypeScript, services, directives, RxJS",
        color: "purple",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        buttonColor: "bg-purple-600 hover:bg-purple-700"
      }
    ],
    "cyber-security": [
      {
        id: "cyber-pentest",
        title: "Penetration Testing",
        description: "Vulnerability assessment, ethical hacking, tools",
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "cyber-incident",
        title: "Incident Response",
        description: "Security monitoring, threat analysis, forensics",
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
        buttonColor: "bg-green-600 hover:bg-green-700"
      },
      {
        id: "cyber-compliance",
        title: "Security Compliance",
        description: "Risk assessment, policy development, audits",
        color: "purple",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        buttonColor: "bg-purple-600 hover:bg-purple-700"
      }
    ],
    "ai-ml": [
      {
        id: "ai-nlp",
        title: "Natural Language Processing",
        description: "Text processing, transformers, language models",
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "ai-cv",
        title: "Computer Vision",
        description: "Image processing, CNN, object detection",
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
        buttonColor: "bg-green-600 hover:bg-green-700"
      },
      {
        id: "ai-mlops",
        title: "MLOps & Deployment",
        description: "Model deployment, monitoring, CI/CD for ML",
        color: "purple",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        buttonColor: "bg-purple-600 hover:bg-purple-700"
      }
    ],
    "genai": [
      {
        id: "genai-chatbots",
        title: "Chatbot Development",
        description: "Conversational AI, prompt engineering, RAG",
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      {
        id: "genai-content",
        title: "Content Generation",
        description: "Text generation, image synthesis, creative AI",
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
        buttonColor: "bg-green-600 hover:bg-green-700"
      },
      {
        id: "genai-automation",
        title: "AI Automation",
        description: "Workflow automation, intelligent agents, APIs",
        color: "purple",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        buttonColor: "bg-purple-600 hover:bg-purple-700"
      }
    ]
  };

  // General interviews (same for all careers)
  const generalInterviews = [
    {
      id: "hr-interview",
      title: "HR Interview",
      description: "Practice HR-style questions focusing on personality, teamwork, and behavior.",
      color: "orange",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    },
    {
      id: "mock-interview",
      title: "Mock Practice",
      description: "Run a full mock interview session to test your skills and get instant feedback.",
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      id: "technical-interview",
      title: "Technical Interview",
      description: "Prepare for technical questions with AI-driven coding and theory evaluations.",
      color: "violet",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      textColor: "text-violet-600",
      buttonColor: "bg-violet-600 hover:bg-violet-700"
    }
  ];

  const currentCareerInterviews = careerSpecificInterviews[selectedCareer] || [];

  const handleInterviewClick = (interviewId) => {
    navigate(`/${interviewId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
        {selectedCareer !== "general" ? `${selectedCareer.charAt(0).toUpperCase() + selectedCareer.slice(1).replace('-', ' ')} Dashboard` : "General Dashboard"}
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Select one of the options below to begin your interview preparation.
      </p>

      {/* Role-Specific Interviews */}
      {currentCareerInterviews.length > 0 && (
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Role-Specific Interviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentCareerInterviews.map((interview) => (
              <div
                key={interview.id}
                className={`${interview.bgColor} ${interview.borderColor} border-2 rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                <h3 className={`text-xl font-bold ${interview.textColor} mb-3`}>
                  {interview.title}
                </h3>
                <p className="text-gray-600 mb-4">{interview.description}</p>
                <button
                  onClick={() => handleInterviewClick(interview.id)}
                  className={`${interview.buttonColor} text-white px-4 py-2 rounded transition`}
                >
                  Start {interview.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Interviews */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          General Interviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {generalInterviews.map((interview) => (
            <div
              key={interview.id}
              className={`${interview.bgColor} ${interview.borderColor} border-2 rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <h3 className={`text-xl font-bold ${interview.textColor} mb-3`}>
                {interview.title}
              </h3>
              <p className="text-gray-600 mb-4">{interview.description}</p>
              <button
                onClick={() => handleInterviewClick(interview.id)}
                className={`${interview.buttonColor} text-white px-4 py-2 rounded transition`}
              >
                Start {interview.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}