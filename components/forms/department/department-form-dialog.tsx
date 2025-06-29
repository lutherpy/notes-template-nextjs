import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import DepartmentForm from "./department-form";

export default async function DepartmentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild className="justify-start">
        <Button>
          Add Department <UserPlus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription>
            Add a new department to the database.
          </DialogDescription>

          <DepartmentForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
