'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

export default function NewPost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirigir si el usuario no está autenticado
  if (status === 'unauthenticated') {
    router.replace('/auth/signin');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('El contenido del post no puede estar vacío');
      return;
    }
    
    if (content.length > 500) {
      setError('El contenido del post no puede exceder los 500 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el post');
      }
      
      // Redireccionar a la página principal en caso de éxito
      router.push('/');
      router.refresh();
      
    } catch (error) {
      setError(error.message || 'Error al crear el post');
      console.error('Error al crear post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Botón de volver al inicio - Solo visible en desktop */}
        <div className="hidden md:block mb-4">
          <Link 
            href="/"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Volver al inicio
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Crear publicación</h1>
        
        <form onSubmit={handleSubmit} className="bg-secondary rounded-lg p-4 border border-color">
          <div className="mb-4">
            <textarea
              placeholder="¿Qué está pasando?"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-background text-foreground border border-color rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={500}
            />
            <div className="flex justify-between mt-2">
              <span className={`text-sm ${content.length > 500 ? 'text-red-500' : 'text-secondary'}`}>
                {content.length}/500 caracteres
              </span>
            </div>
          </div>
          
          {error && (
            <div className="p-3 mb-4 bg-red-900/20 border border-red-700 rounded-md text-red-500">
              {error}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim() || content.length > 500}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-full disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}