import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Full Image Background */}
        <Image
          src="/images/Rectangle 236 (1).png"
          alt="MUTANT Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-[var(--bg-primary)] relative">
        {/* Background Particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-400 rounded-full"></div>
          <div className="absolute top-60 left-40 w-1 h-1 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-60 right-40 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
        </div>

        <div
          className="relative z-10 flex items-center justify-center min-h-screen"
          style={{ padding: "var(--spacing-xl)" }}
        >
          <div className="w-full max-w-md">
            {/* Logo */}
            <div
              className="text-center"
              style={{ marginBottom: "var(--spacing-2xl)" }}
            >
              <h1
                className="text-4xl font-bold text-[var(--accent-purple)] font-xirod"
                style={{ marginBottom: "var(--spacing-md)" }}
              >
                MUTANT
              </h1>
              <h2
                className="text-3xl font-bold text-white font-xirod"
                style={{ marginBottom: "var(--spacing-sm)" }}
              >
                ENTER THE LAB.
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Login to continue your mutation.
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
