import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectFormField({
  control,
  name,
  placeholder,
  label,
  className,
  options,
}: {
  control: any;
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  className?: string;
  options: any[];
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, ...field } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select value={value} onValueChange={field.onChange} defaultValue="">
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name} {option.lastname} {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormControl></FormControl>
        </FormItem>
      )}
    />
  );
}
