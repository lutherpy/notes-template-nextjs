"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .email("E-mail inválido")
    .refine((email) => !email.endsWith("@cmc.ao"), {
      message:
        "Este e-mail pertence à CMC. Faça login clicando em 'Login with Microsoft' acima.",
    }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSocial, setIsLoadingSocial] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Desativa o spinner social só quando já está na dashboard
  useEffect(() => {
    if (isLoadingSocial && pathname === "/dashboard") {
      setIsLoadingSocial(false);
    }
  }, [pathname, isLoadingSocial]);

  async function handleSignInWithMicrosoft() {
    try {
      setIsLoadingSocial(true);
      await authClient.signIn.social({
        provider: "microsoft",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer login com Microsoft");
      setIsLoadingSocial(false); // Desativa apenas se erro
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe: true,
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          toast.success("Login realizado com sucesso!");
          router.push("/dashboard");
          return; // ✅ Sai após sucesso
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Erro ao fazer login.");
        },
      }
    );

    // Caso ainda haja erro após os callbacks
    if (error) {
      toast.error(error.message || "Erro ao fazer login.");
    }

    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Microsoft account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={handleSignInWithMicrosoft}
                    disabled={isLoadingSocial}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="mr-2 h-4 w-4"
                    >
                      <path fill="#F25022" d="M0 0h242.667v242.667H0z" />
                      <path
                        fill="#7FBA00"
                        d="M269.333 0H512v242.667H269.333z"
                      />
                      <path fill="#00A4EF" d="M0 269.333h242.667V512H0z" />
                      <path
                        fill="#FFB900"
                        d="M269.333 269.333H512V512H269.333z"
                      />
                    </svg>{" "}
                    {isLoadingSocial ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Login with Microsoft"
                    )}
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
