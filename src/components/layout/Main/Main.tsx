import type { ReactNode } from 'react';
import './Main.scss';

type MainProps = {
  children?: ReactNode;
};

const Main: React.FC<MainProps> = ({ children }: MainProps) => {
  return <main className="main">{children}</main>;
};

export default Main;
