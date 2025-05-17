
import React from 'react';
import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { TimesheetDetailFormProps } from './form/types';
import { useTimesheetForm } from './form/useTimesheetForm';
import DayEntryForm from './form/DayEntryForm';
import GeneralNotesField from './form/GeneralNotesField';
import FormActions from './form/FormActions';

const TimesheetDetailForm: React.FC<TimesheetDetailFormProps> = ({ timesheet, onClose }) => {
  // Use the custom hook to manage form state and logic
  const { form, workDays, isSubmitting, canEdit, onSubmit } = useTimesheetForm(timesheet, onClose);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {workDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            return (
              <DayEntryForm
                key={dateKey}
                day={day}
                dateKey={dateKey}
                form={form}
                canEdit={canEdit}
              />
            );
          })}
        </div>

        <GeneralNotesField form={form} canEdit={canEdit} />

        <FormActions onClose={onClose} canEdit={canEdit} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default TimesheetDetailForm;
