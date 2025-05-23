import MainLayout from '@/components/layout/MainLayout';
import Posts from '@/components/home/Posts';

export const metadata = {
  title: 'AlkaBeta - Inicio',
  description: 'Página principal de AlkaBeta, red social',
};

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Publicaciones recientes</h1>
        <Posts />
      </div>
    </MainLayout>
  );
}
