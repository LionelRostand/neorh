
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { LeaveFormValues } from "./form/types";
import { EmployeeField } from "./form/EmployeeField";
import { LeaveTypeField } from "./form/LeaveTypeField";
import { DatePickerField } from "./form/DatePickerField";
import { CommentField } from "./form/CommentField";
import { LeaveFormActions } from "./form/LeaveFormActions";
import { useLeaveFormSubmit } from "./form/useLeaveFormSubmit";

interface NewLeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
}

const NewLeaveRequestForm: React.FC<NewLeaveRequestFormProps> = ({ open, onClose }) => {
  const form = useForm<LeaveFormValues>({
    defaultValues: {
      employeeId: "",
      type: "",
      startDate: undefined,
      endDate: undefined,
      comment: "",
    },
  });

  const { handleSubmit, isSubmitting } = useLeaveFormSubmit(() => {
    form.reset();
    onClose();
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <EmployeeField form={form} />
            <LeaveTypeField form={form} />
            <DatePickerField 
              form={form} 
              name="startDate" 
              label="Date de début" 
            />
            <DatePickerField 
              form={form} 
              name="endDate" 
              label="Date de fin"
              disableDates={(date) => {
                const startDate = form.getValues("startDate");
                return startDate ? date < startDate : false;
              }}
            />
            <CommentField form={form} />
            <LeaveFormActions onCancel={onClose} isSubmitting={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeaveRequestForm;
