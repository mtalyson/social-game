import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export interface IRuleItem {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}
