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
                className="text-[15px]  sm:text-[26px] font-[400] text-[#391579] leading-[41pxpx] font-xirod"
                style={{ marginBottom: "var(--spacing-md)" }}
              >
                MUTANT
              </h1>
              <h2
                className="text-[15px]   sm:text-[31px] font-[400] text-white font-xirod"
                style={{ marginBottom: "var(--spacing-sm)" }}
              >
                ENTER THE LAB.
              </h2>
              <p className="text-[10px]  sm:text-[13px] font-[400] leading-[27px] text-[#CDE98D]">
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
