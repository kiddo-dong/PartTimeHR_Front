// app/(main)/layout.tsx
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AuthProvider from '../providers/AuthProvider';
import { StoreProvider } from '../providers/StoreProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
        </div>
      </StoreProvider>
    </AuthProvider>
  );
}
