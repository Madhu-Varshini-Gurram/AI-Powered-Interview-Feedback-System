import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-24">
      <div className="w-full max-w-md px-4">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/register"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
          appearance={{
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
              logoPlacement: "none",
            },
            elements: {
              // Root container
              rootBox: "w-full flex justify-center items-center",
              card: "bg-transparent shadow-none w-full space-y-6",

              // Header
              headerTitle: "text-3xl font-bold text-center mb-2",
              headerSubtitle: "text-gray-500 text-center",

              // Social buttons
              socialButtonsBlockButton:
                "w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition hover:shadow-md",
              socialButtonsBlockButton__google:
                "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
              socialButtonsBlockButton__linkedin:
                "bg-[#0A66C2] text-white hover:bg-[#004182]",

              // Divider
              divider: "relative flex items-center justify-center my-4",
              dividerLine: "hidden",
              dividerText: "text-gray-400 text-sm",

              // Inputs
              formField: "space-y-2",
              formFieldLabel: "text-sm font-medium text-gray-700",
              formFieldInput:
                "w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none",

              // Primary button
              formButtonPrimary:
                "w-full bg-black text-white rounded-lg py-3 mt-4 text-sm font-medium transition hover:bg-gray-800",

              // Footer (Don’t have an account?)
              footerActionText: "text-gray-600 text-sm text-center",
              footerActionLink: "text-blue-600 hover:underline text-sm",

              // Hide Clerk footer
              footer: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
