import { Menubar } from './components/Menubar';
import { Navbar } from './components/Navbar';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='font-sans'>
      <header>
        <Navbar />
        <Menubar />
      </header>
      <main className='min-h-screen overflow-y-auto pb-8'>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
