import type { SVGProps } from 'react';
import './Icon.scss';

export type IconName =
  | 'home'
  | 'posts'
  | 'write'
  | 'users'
  | 'logout'
  | 'menu'
  | 'close'
  | 'panel'
  | 'search'
  | 'calendar'
  | 'chevronLeft'
  | 'chevronRight';

type IconProps = {
  name: IconName;
} & SVGProps<SVGSVGElement>;

const PATHS: Record<IconName, string> = {
  home: 'M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1z',
  posts: 'M6 5h12v14H6zM9 9h6M9 13h6M9 17h4',
  write: 'M5 19h4l10-10-4-4L5 15v4zM13 7l4 4',
  users: 'M16 19v-1.2A3.8 3.8 0 0012.2 14H7.8A3.8 3.8 0 004 17.8V19M15 14h2.4A3.6 3.6 0 0121 17.6V19M9.5 11a3 3 0 100-6 3 3 0 000 6zM16.5 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  logout: 'M10 19H6a1 1 0 01-1-1V6a1 1 0 011-1h4M14 15l5-3-5-3M19 12H10',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  panel: 'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2zm7-2v16',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  calendar: 'M7 4v3M17 4v3M5 9h14M6 6h12a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1z',
  chevronLeft: 'M14 6l-6 6 6 6',
  chevronRight: 'M10 6l6 6-6 6',
};

function Icon({ name, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={['icon', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export default Icon;
