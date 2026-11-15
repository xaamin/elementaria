import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';

import { AlertDialog } from '../alert-dialog';

export interface ConfirmProps {
  isOpen?: boolean;
  title: ReactNode;
  description?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirm = ({
  isOpen,
  title,
  description,
  children,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  onConfirm,
  onCancel,
}: ConfirmProps) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onCancel}
      size="md"
    >
      <AlertDialog.Header>
        <Heading
          className="text-typography-950 font-semibold"
          size="md"
        >
          {title}
        </Heading>
      </AlertDialog.Header>
      <AlertDialog.Body className="mt-3 mb-4">
        <ScrollView className="space-y-2 flex-1">
          {description && <Text size="sm">{description}</Text>}

          {children}
        </ScrollView>
      </AlertDialog.Body>
      <AlertDialog.Footer className="">
        <Button
          variant="outline"
          size="md"
          onPress={onCancel}
        >
          {cancelText}
        </Button>
        <Button
          size="md"
          onPress={onConfirm}
        >
          {confirmText}
        </Button>
      </AlertDialog.Footer>
    </AlertDialog>
  );
};

export { Confirm };
