import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '../lib/hooks';

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  style?: CSSProperties;
  id?: string;
}

/** Scroll-triggered fade + rise. Content is always in the DOM and readable by assistive tech. */
export default function Reveal({ as: Tag = 'div', children, className = '', delay = 0, style, id }: Props) {
  const [ref, visible] = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
