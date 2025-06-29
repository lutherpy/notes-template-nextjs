"use client";

import { Loader2, Trash2 } from "lucide-react";

import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteDepartment } from "@/server/actions/department/actions"; // Adjust the import path as necessary
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteDepartmentButtonProps {
  departmentId: string;
}

export default function DeleteDepartmentButton({
  departmentId,
}: DeleteDepartmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteDepartment(departmentId);
      toast.success("Department deleted successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete department");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 className="size-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>

          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={handleDelete}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
