import './App.scss';
import Footer from '@/components/layout/Footer/Footer';
import Header from '@/components/layout/Header/Header';
import Main from '@/components/layout/Main/Main';

function App() {
  return (
    <div className="app">
      <Header title="página inicial - login" />
      <Main>
        <h1>Hello, World!</h1>
        <p>Espaço para as postagens de docentes e estudantes.</p>
      </Main>
      <Footer />
    </div>
  );
}

export default App;
