
import React from "react";
import { Form } from "@/components/ui/form";
import { usePayslipForm } from "./form/usePayslipForm";
import EmployeeCompanyFields from "./form/EmployeeCompanyFields";
import PeriodSalaryFields from "./form/PeriodSalaryFields";
import OvertimeFields from "./form/OvertimeFields";
import SubmitButton from "./form/SubmitButton";

const PayslipForm: React.FC = () => {
  const {
    form,
    onSubmit,
    employees,
    companies,
    periods,
    salaryValue,
    employeesLoading,
    companiesLoading,
    contractsLoading
  } = usePayslipForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee and Company Selection */}
        <EmployeeCompanyFields
          form={form}
          employees={employees}
          companies={companies}
          employeesLoading={employeesLoading}
          companiesLoading={companiesLoading}
        />

        {/* Period and Salary */}
        <PeriodSalaryFields
          form={form}
          periods={periods}
          salaryValue={salaryValue}
          contractsLoading={contractsLoading}
        />

        {/* Overtime Fields */}
        <OvertimeFields form={form} />

        {/* Submit Button */}
        <SubmitButton />
      </form>
    </Form>
  );
};

export default PayslipForm;
