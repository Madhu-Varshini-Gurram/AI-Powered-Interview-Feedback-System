import { SignUp } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function Register() {
  // Preload OAuth providers on component mount
  useEffect(() => {
    // Preload Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Force early fetch so the browser caches GIS before SignUp renders
  useEffect(() => {
    fetch("https://accounts.google.com/gsi/client", { mode: "no-cors" }).catch(()=>{});
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-24"> 
      <div className="w-full max-w-md px-4">
      <SignUp
          path="/register"
          routing="path"
          signInUrl="/login"
          forceRedirectUrl="/career-options"
          // Optimize OAuth loading
          appearance={{
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
              logoPlacement: "none",
            },
            elements: {
              rootBox: "w-full flex justify-center items-center",
              card: "bg-transparent shadow-none w-full space-y-6",

              headerTitle: "text-3xl font-bold text-center mb-2",
              headerSubtitle: "text-gray-500 text-center",

              socialButtonsBlockButton:
                "w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105",
              socialButtonsBlockButton__google:
                "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
              socialButtonsBlockButton__linkedin:
                "bg-[#0A66C2] text-white hover:bg-[#004182]",

              divider: "relative flex items-center justify-center my-4",
              dividerLine: "hidden",
              dividerText: "text-gray-400 text-sm",

              formField: "space-y-2",
              formFieldLabel: "text-sm font-medium text-gray-700",
              formFieldInput:
                "w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none",

              formButtonPrimary:
                "w-full bg-black text-white rounded-lg py-3 mt-4 text-sm font-medium transition hover:bg-gray-800",

              footerActionText: "text-gray-600 text-sm text-center",
              footerActionLink: "text-blue-600 hover:underline text-sm",

              footer: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
