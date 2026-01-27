import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Components } from 'react-markdown';

export type MarkdownLinkComponent = (
  props: ComponentPropsWithoutRef<'a'> & { children?: ReactNode }
) => JSX.Element;

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  components?: Components;
  linkComponent?: MarkdownLinkComponent;
}
