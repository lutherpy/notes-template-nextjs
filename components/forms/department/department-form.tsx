"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(100),
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createDepartment, updateDepartment } from "@/services/department";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Department } from "@/db/schema";

interface DepartmentFormProps {
  department?: Department;
}

export default function DepartmentForm({ department }: DepartmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const departmentData = {
        ...values,
      };

      if (department) {
        await updateDepartment({
          ...departmentData,
          id: department.id,
        });
      } else {
        await createDepartment(departmentData);
        console.log(departmentData);
      }

      form.reset();

      toast.success(
        `Department ${department ? "updated" : "added"} successfully`
      );
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${department ? "update" : "add"} department`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Install NextJS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="Department Content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            `${department ? "Update" : "Add"} Department`
          )}
        </Button>
      </form>
    </Form>
  );
}
