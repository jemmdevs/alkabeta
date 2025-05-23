import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Obtener posts de un usuario específico
export async function GET(request, { params }) {
  try {
    const { username } = params;
    
    await connectDB();
    
    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    
    // Buscar todos los posts del usuario
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'name username'
      })
      .lean();
    
    const formattedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      author: {
        ...post.author,
        _id: post.author._id.toString()
      },
      likes: post.likes.map(like => like.toString()),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
    
    return NextResponse.json(formattedPosts);
    
  } catch (error) {
    console.error("Error al obtener posts del usuario:", error);
    return NextResponse.json(
      { message: "Error al obtener posts del usuario" },
      { status: 500 }
    );
  }
} 