
import React from 'react';
import { Control } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DEPARTMENT_COLORS } from '../../schema/departmentSchema';
import { DepartmentFormValues } from '../../schema/departmentSchema';

interface ColorSelectorProps {
  control: Control<DepartmentFormValues>;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Couleur</FormLabel>
          <FormControl>
            <RadioGroup 
              className="flex space-x-2" 
              value={field.value || DEPARTMENT_COLORS[0]} 
              onValueChange={field.onChange}
            >
              {DEPARTMENT_COLORS.map((color) => (
                <FormItem key={color} className="space-y-0">
                  <FormControl>
                    <RadioGroupItem 
                      value={color} 
                      id={color}
                      className="sr-only"
                    />
                  </FormControl>
                  <label
                    htmlFor={color}
                    className={`block h-8 w-8 rounded-full cursor-pointer border-2 ${
                      field.value === color ? 'border-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
