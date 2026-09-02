import type { ReactNode } from 'react';
import './EmptyState.scss';

type EmptyStateProps = {
  kicker: string;
  title: string;
  description: string;
  action?: ReactNode;
};

function EmptyState({ kicker, title, description, action }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <p className="empty-state__kicker">{kicker}</p>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__description">{description}</p>
      {action}
    </section>
  );
}

export default EmptyState;
