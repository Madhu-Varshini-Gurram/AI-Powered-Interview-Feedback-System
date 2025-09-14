import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-24"> 
      <div className="w-full max-w-md px-4">
      <SignUp
          path="/register"
          routing="path"
          signInUrl="/login"
          // Remove the fallbackRedirectUrl prop
          forceRedirectUrl="/login"
          // 👈 if you want to *always* override Clerk’s redirect
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
                "w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition hover:shadow-md",
              socialButtonsBlockButton__google:
                "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
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
