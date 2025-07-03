"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserDetails } from "@/services/user-details";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments } from "@/hooks/useDepartments"; // ✅ Hook customizado

// Schema de validação
const formSchema = z.object({
  address: z.string().min(5, "Informe a morada completa"),
  identificationNumber: z.string().min(5, "Número inválido"),
  country: z.string().min(2, "Informe o país"),
  province: z.string().min(2, "Informe a província"),
  departmentId: z.string().uuid("Selecione um departamento válido"),
});

type FormData = z.infer<typeof formSchema>;

export function UserDetailsForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      identificationNumber: "",
      country: "",
      province: "",
      departmentId: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // ✅ Usa o hook customizado
  const { departments, isLoading } = useDepartments();

  const onSubmit = async (values: FormData) => {
    try {
      await createUserDetails(values);
      toast.success("Detalhes salvos com sucesso!");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao salvar detalhes.");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        {/* Morada */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Morada</FormLabel>
              <FormControl>
                <Input placeholder="Rua, bairro, nº..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Identificação */}
        <FormField
          control={form.control}
          name="identificationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº de Identificação</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123456789LA034" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* País */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Angola" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Província */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Província</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Luanda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Departamento */}
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                {isLoading ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: { id: string; name: string }) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? "Salvando..." : "Salvar Detalhes"}
        </Button>
      </form>
    </Form>
  );
}
