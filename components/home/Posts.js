'use client'

import { useState, useEffect } from 'react';
import PostCard from '@/components/post/PostCard';
import { useSession } from 'next-auth/react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' o 'popular'
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error('Error al cargar los posts');
        }
        
        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('No se pudieron cargar los posts. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };
  
  const getSortedPosts = () => {
    if (sortBy === 'newest') {
      return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      return [...posts].sort((a, b) => b.likes.length - a.likes.length);
    }
    return posts;
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (loading) {
    return (
      <div className="flex justify-center my-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 text-red-500 p-4 rounded-md text-center my-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center my-10">
        <p className="text-lg text-secondary mb-4">No hay publicaciones disponibles.</p>
        {session && (
          <p>
            ¡Sé el primero en publicar algo!
          </p>
        )}
      </div>
    );
  }

  const sortedPosts = getSortedPosts();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`py-2 px-4 text-sm font-medium rounded-l-lg border border-r-0 border-color ${sortBy === 'newest' ? 'bg-primary text-white' : 'hover:bg-secondary/80'}`}
            onClick={() => handleSortChange('newest')}
            aria-current={sortBy === 'newest' ? 'page' : undefined}
          >
            Recientes
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-sm font-medium rounded-r-lg border border-color ${sortBy === 'popular' ? 'bg-primary text-white' : 'hover:bg-secondary/80'}`}
            onClick={() => handleSortChange('popular')}
            aria-current={sortBy === 'popular' ? 'page' : undefined}
          >
            Populares
          </button>
        </div>
      </div>
      
      <div>
        {sortedPosts.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            onDelete={handleDeletePost}
            onUpdate={handleUpdatePost}
          />
        ))}
      </div>
    </div>
  );
} 