import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import logo from '@/assets/logo-codice.png';
import './Header.scss';

type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title }: HeaderProps) => {
  const pageTitle = title?.trim();

  return (
    <header className="header">
      <div className="header__brand">
        <img
          src={logo}
          alt=""
          className="header__logo"
          width={44}
          height={44}
        />
        <div className="header__identity">
          <p className="header__name">Portal Acadêmico</p>
          <p className="header__tagline">Full Stack Development</p>
        </div>
      </div>

      { pageTitle ? <p className="header__page">{ pageTitle }</p> : null }

      <ThemeToggle />
    </header>
  );
};

export default Header;
