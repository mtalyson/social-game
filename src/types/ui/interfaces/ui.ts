import type { ComponentProps } from 'react';
import type { ViewStyle } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';
import { EButtonVariant } from '@/types/ui/enums/ui';

export type TButtonVariant =
  (typeof EButtonVariant)[keyof typeof EButtonVariant];

export interface IPrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: TButtonVariant;
  iconName?: ComponentProps<typeof Ionicons>['name'];
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}
