import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import clsx from 'clsx';
import { MarkdownRendererProps } from './MarkdownRenderer.types';
import './MarkdownRenderer.css';

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  components,
  linkComponent,
}) => {
  const resolvedComponents = useMemo(() => {
    if (!linkComponent) return components;
    return {
      ...components,
      a: linkComponent,
    };
  }, [components, linkComponent]);

  return (
    <div className={clsx('itdo-markdown', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={resolvedComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
