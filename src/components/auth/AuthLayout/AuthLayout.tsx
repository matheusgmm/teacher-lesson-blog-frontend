import type { ReactNode } from 'react';
import BrandLogo from '@/components/ui/BrandLogo/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import './AuthLayout.scss';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <section className="auth-layout__brand">
        <BrandLogo size="lg" />
        <h1 className="auth-layout__headline">
          Onde aulas viram conhecimento compartilhado.
        </h1>
        <p className="auth-layout__lead">
          Um espaço acadêmico para docentes e estudantes publicarem, lerem e
          acompanharem lições com clareza.
        </p>
        <ul className="auth-layout__highlights">
          <li>Publicações pensadas para sala de aula</li>
          <li>Acesso autenticado para a comunidade</li>
          <li>Leitura confortável no claro e no escuro</li>
        </ul>
      </section>

      <section className="auth-layout__panel">
        <div className="auth-layout__toolbar">
          <div className="auth-layout__toolbar-brand">
            <BrandLogo size="sm" />
          </div>
          <ThemeToggle />
        </div>

        <div className="auth-layout__form-wrap">
          <div className="auth-layout__card">
            <header className="auth-layout__header">
              <h2 className="auth-layout__title">{title}</h2>
              <p className="auth-layout__subtitle">{subtitle}</p>
            </header>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;
