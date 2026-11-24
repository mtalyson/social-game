import type { ViewStyle } from 'react-native';
import { EButtonVariant } from '@/types/ui/enums/ui';

export type TButtonVariant =
  (typeof EButtonVariant)[keyof typeof EButtonVariant];

export interface IPrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: TButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}
