'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Error al buscar usuarios');
        }
        
        const data = await response.json();
        setUsers(data);
        
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Error al buscar usuarios. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto">
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

      <h1 className="text-2xl font-bold mb-6">
        Resultados para "{query}"
      </h1>
      
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 text-red-500 p-4 rounded-md text-center my-4">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center my-10 bg-secondary p-6 rounded-lg border border-color">
          <p className="text-lg">No se encontraron usuarios para "{query}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <Link 
              key={user._id} 
              href={`/profile/${user.username}`}
              className="flex items-center p-4 bg-secondary rounded-lg border border-color hover:bg-secondary/80 transition-colors"
            >
              <div className="mr-4 w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <span className="text-background text-xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-secondary text-sm">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Search() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </MainLayout>
  );
} 