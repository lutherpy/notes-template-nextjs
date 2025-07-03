import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import DepartmentForm from "./department-form";

export default function DepartmentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild className="justify-start">
        <Button>
          Add Department <PlusCircle className="size-4" />
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
