import { MinusIcon, PlusIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import { cn } from '@/components/cn';

import { Button } from '../button';
import { Input } from '../form';
import { HStack } from '../hstack';
import { VStack } from '../vstack';

export interface QuantityStepperProps {
  value: number;
  rounded?: boolean;
  size?: 'xs' | 'sm';
  buttonClassName?: string;
  onChange: (value: number) => void;
}

const QuantityStepper = ({
  value: originalValue,
  size,
  rounded = true,
  buttonClassName,
  onChange,
}: QuantityStepperProps) => {
  // Text typed by the user; `null` shows the consumer `value`, so the field
  // resyncs after every change even when the consumer keeps (or clamps) it.
  const [draft, setDraft] = useState<string | null>(null);

  const value = draft ?? `${originalValue ?? 0}`;

  useEffect(() => {
    setDraft(null);
  }, [originalValue]);

  const handleChange = (quantity: string | number) => {
    const newQuantity = parseFloat(`${quantity ?? ''}`);

    setDraft(null);

    if (!isNaN(newQuantity)) {
      onChange(newQuantity);
    }
  };

  const handleDecreaseQuantity = () => {
    handleChange(originalValue - 1);
  };

  const handleIncreaseQuantity = () => {
    handleChange(originalValue + 1);
  };

  const handleBlur = () => {
    handleChange(value);
  };

  return (
    <HStack className="items-center gap-2">
      <Button
        variant="light"
        size={size}
        rounded={rounded}
        className={cn(buttonClassName)}
        accessibilityLabel="Disminuir cantidad"
        onPress={handleDecreaseQuantity}
      >
        <Button.Text>
          <Button.Icon as={MinusIcon} />
        </Button.Text>
      </Button>
      <VStack>
        <Input
          className={cn(
            'rounded-none w-24 text-center',
            size === 'sm' ? 'w-16' : 'w-24',
          )}
          accessibilityLabel="Cantidad"
          isFieldDirty
          error={value === ''}
          value={value}
          onBlur={handleBlur}
          onChangeText={setDraft}
          onEndEditing={(event) => handleChange(event.nativeEvent.text)}
        />
      </VStack>
      <Button
        variant="light"
        size={size}
        rounded={rounded}
        className={cn(buttonClassName)}
        accessibilityLabel="Aumentar cantidad"
        onPress={handleIncreaseQuantity}
      >
        <Button.Text>
          <Button.Icon as={PlusIcon} />
        </Button.Text>
      </Button>
    </HStack>
  );
};

export { QuantityStepper };
