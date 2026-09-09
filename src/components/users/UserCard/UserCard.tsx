import { Link, useLocation } from 'react-router-dom';
import Avatar from '@/components/ui/Avatar/Avatar';
import type { User } from '@/types/auth';
import { formatDate } from '@/utils/format';
import { getRoleLabel } from '@/utils/user-display';
import './UserCard.scss';

type UserCardProps = {
  user: User;
};

function UserCard({ user }: UserCardProps) {
  const location = useLocation();
  const joinedAt = formatDate(user.created_at);

  return (
    <article className="user-card">
      <Link
        className="user-card__content"
        to={`/users/${user.id}`}
        state={{ from: `${location.pathname}${location.search}` }}
      >
        <Avatar name={user.name} role={user.role} />
        <div className="user-card__copy">
          <header className="user-card__header">
            <h2 className="user-card__title">{user.name}</h2>
            <span className={`user-card__role user-card__role--${user.role.toLowerCase()}`}>
              {getRoleLabel(user.role)}
            </span>
          </header>
          <p className="user-card__email">{user.email}</p>
          {joinedAt ? (
            <p className="user-card__meta">
              Na comunidade desde <time dateTime={user.created_at}>{joinedAt}</time>
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export default UserCard;
