'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/post/PostCard';

export default function UserProfile() {
  const { username } = useParams();
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Verificar si el perfil es del usuario autenticado
  const isCurrentUser = session?.user?.username === username;
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Obtener los posts del usuario
        const response = await fetch(`/api/users/${username}/posts`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Usuario no encontrado');
          }
          throw new Error('Error al obtener datos del usuario');
        }
        
        const postsData = await response.json();
        
        // Si hay posts, extraer datos del usuario del primer post
        if (postsData.length > 0) {
          setUserData({
            name: postsData[0].author.name,
            username: postsData[0].author.username,
            image: postsData[0].author.image || ''
          });
        } else {
          // Si no hay posts, intentar obtener datos del usuario por otra vía
          // Aquí se podría implementar un endpoint específico para datos de usuario
          setUserData({
            name: username,
            username: username,
            image: ''
          });
        }
        
        setPosts(postsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-900/20 text-red-500 p-4 rounded-md text-center my-4">
            {error}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
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

        {userData && (
          <div className="bg-secondary rounded-lg p-6 mb-6 border border-color">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <span className="text-background text-2xl font-bold">
                    {userData.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-secondary">@{userData.username}</p>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-semibold mb-4">Publicaciones</h2>
        
        {posts.length === 0 ? (
          <div className="text-center my-10 bg-secondary p-6 rounded-lg border border-color">
            <p className="text-lg text-secondary">No hay publicaciones disponibles.</p>
            {isCurrentUser && (
              <p className="mt-2">
                ¡Comparte tu primer post!
              </p>
            )}
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 