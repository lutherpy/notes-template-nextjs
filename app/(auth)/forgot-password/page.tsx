import Link from "next/link";

import Image from "next/image";
import { ForgotPasswordForm } from "@/components/forms/auth/forgot-password-form";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="">
            <Image
              width={50}
              height={50}
              src={"/cmc_logo.png"}
              alt="CMC Logo"
              priority
            />
          </div>
          Sirius V3
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
