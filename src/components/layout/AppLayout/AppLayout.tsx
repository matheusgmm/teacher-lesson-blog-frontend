import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer/Footer';
import Header from '@/components/layout/Header/Header';
import Main from '@/components/layout/Main/Main';

function AppLayout() {
  return (
    <div className="app">
      <Header title="Início" />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
}

export default AppLayout;
