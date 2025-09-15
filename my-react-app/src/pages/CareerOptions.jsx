import { useNavigate } from "react-router-dom";
import { Code, Database, Monitor, Shield, Brain, Bot } from "lucide-react";

export default function CareerOptions() {
  const navigate = useNavigate();

  const careerOptions = [
    {
      id: "web-dev",
      title: "Web Development",
      description: "Build modern websites and web applications",
      icon: <Code className="w-12 h-12" />,
      color: "indigo",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-600",
      hoverColor: "hover:bg-indigo-100"
    },
    {
      id: "data-science",
      title: "Data Science",
      description: "Analyze data and extract meaningful insights",
      icon: <Database className="w-12 h-12" />,
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      hoverColor: "hover:bg-emerald-100"
    },
    {
      id: "frontend",
      title: "Frontend",
      description: "Create beautiful and interactive user interfaces",
      icon: <Monitor className="w-12 h-12" />,
      color: "violet",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      textColor: "text-violet-600",
      hoverColor: "hover:bg-violet-100"
    },
    {
      id: "cyber-security",
      title: "Cyber Security",
      description: "Protect systems and data from cyber threats",
      icon: <Shield className="w-12 h-12" />,
      color: "rose",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      textColor: "text-rose-600",
      hoverColor: "hover:bg-rose-100"
    },
    {
      id: "ai-ml",
      title: "AI/ML",
      description: "Develop intelligent systems and machine learning models",
      icon: <Brain className="w-12 h-12" />,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-600",
      hoverColor: "hover:bg-amber-100"
    },
    {
      id: "genai",
      title: "GenAI",
      description: "Build and deploy generative AI applications",
      icon: <Bot className="w-12 h-12" />,
      color: "teal",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      textColor: "text-teal-600",
      hoverColor: "hover:bg-teal-100"
    }
  ];

  const handleCareerSelect = (careerId) => {
    // Navigate to dashboard with selected career
    navigate("/dashboard", { state: { selectedCareer: careerId } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Career Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a career field to access specialized interview questions and practice sessions
          </p>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {careerOptions.map((career) => (
            <div
              key={career.id}
              onClick={() => handleCareerSelect(career.id)}
              className={`
                ${career.bgColor} ${career.borderColor} ${career.hoverColor}
                border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300
                transform hover:scale-105 hover:shadow-lg
                flex flex-col items-center text-center
              `}
            >
              <div className={`${career.textColor} mb-4`}>
                {career.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {career.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {career.description}
              </p>
            </div>
          ))}
        </div>

      
      </div>
    </div>
  );
}