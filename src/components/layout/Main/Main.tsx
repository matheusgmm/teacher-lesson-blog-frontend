import type { ReactNode } from 'react';
import './Main.scss';

type MainProps = {
  children?: ReactNode;
};

function Main({ children }: MainProps) {
  return (
    <main id="conteudo" className="main" tabIndex={-1}>
      {children}
    </main>
  );
}

export default Main;
