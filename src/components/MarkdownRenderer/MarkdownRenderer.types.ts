import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Components } from 'react-markdown';

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  components?: Components;
  linkComponent?: (props: ComponentPropsWithoutRef<'a'> & { children: ReactNode }) => JSX.Element;
}
