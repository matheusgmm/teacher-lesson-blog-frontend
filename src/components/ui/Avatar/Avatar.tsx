import type { UserRole } from '@/types/auth';
import { getInitials } from '@/utils/user-display';
import './Avatar.scss';

type AvatarProps = {
  name: string;
  role?: UserRole;
  size?: 'sm' | 'md';
};

function Avatar({ name, role = 'USER', size = 'md' }: AvatarProps) {
  return (
    <span
      className={`avatar avatar--${size} avatar--${role.toLowerCase()}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
