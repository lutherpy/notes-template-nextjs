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
import UserForm from "./user-form";

export default async function UserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild className="justify-start">
        <Button>
          Add User <UserPlus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Add a new user to the database.</DialogDescription>

          <UserForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
