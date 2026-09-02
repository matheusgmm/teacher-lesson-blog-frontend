import { Link } from 'react-router-dom';
import logo from '@/assets/logo-codice.png';
import './BrandLogo.scss';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  to?: string;
};

function BrandLogo({ size = 'md', showTagline = true, to }: BrandLogoProps) {
  const className = `brand-logo brand-logo--${size}`;
  const content = (
    <>
      <img
        src={logo}
        alt=""
        className="brand-logo__mark"
        width={size === 'lg' ? 88 : size === 'sm' ? 36 : 44}
        height={size === 'lg' ? 88 : size === 'sm' ? 36 : 44}
      />
      <div className="brand-logo__identity">
        <p className="brand-logo__name">Portal Acadêmico</p>
        {showTagline ? (
          <p className="brand-logo__tagline">Full Stack Development</p>
        ) : null}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default BrandLogo;
