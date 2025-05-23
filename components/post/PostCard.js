'use client'

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function PostCard({ post, onDelete, onUpdate }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLiking, setIsLiking] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = session?.user?.id === post.author._id;
  const hasLiked = session?.user && likes.includes(session.user.id);
  
  // Formatear fecha relativa
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true,
    locale: es
  });

  const handleLike = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    
    try {
      setIsLiking(true);
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.liked) {
          setLikes([...likes, session.user.id]);
        } else {
          setLikes(likes.filter(id => id !== session.user.id));
        }
      }
    } catch (error) {
      console.error("Error al dar/quitar like:", error);
    } finally {
      setIsLiking(false);
    }
  };
  
  const handleUpdate = async () => {
    if (content === post.content || content.trim() === "") {
      setIsEditing(false);
      setContent(post.content);
      return;
    }
    
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      const data = await response.json();
      
      if (response.ok && data.post) {
        setIsEditing(false);
        if (onUpdate) {
          onUpdate(data.post);
        }
      }
    } catch (error) {
      console.error("Error al actualizar post:", error);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este post?")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        if (onDelete) {
          onDelete(post._id);
        }
      }
    } catch (error) {
      console.error("Error al eliminar post:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-secondary rounded-lg p-4 mb-4 border border-color">
      <div className="flex justify-between items-start">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center mr-3">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <span className="text-background text-sm font-bold">
                {post.author.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <Link 
              href={`/profile/${post.author.username}`}
              className="font-bold hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-secondary text-sm">
              @{post.author.username} · {formattedDate}
            </p>
          </div>
        </div>
        
        {isAuthor && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="text-primary hover:text-primary-dark"
                  disabled={content === post.content}
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setContent(post.content);
                  }}
                  className="text-secondary hover:text-foreground"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary hover:text-primary-dark"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-background text-foreground border border-color rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
          maxLength={500}
        />
      ) : (
        <p className="my-3 whitespace-pre-wrap">{post.content}</p>
      )}
      
      <div className="mt-4 flex items-center">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1 ${hasLiked ? 'text-red-500' : 'text-secondary hover:text-red-500'}`}
          disabled={isLiking}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill={hasLiked ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likes.length}</span>
        </button>
      </div>
    </div>
  );
} 