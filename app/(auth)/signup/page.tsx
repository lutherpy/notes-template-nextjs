import { SignupForm } from "@/components/forms/auth/signup-form";

import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="">
            <Image src="/cmc_logo.png" alt="Logo" width={30} height={30} />
          </div>
          Sirius Modelo
          <div className="ml-5"></div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image src="/cmc-bg.webp" alt="Image" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}
