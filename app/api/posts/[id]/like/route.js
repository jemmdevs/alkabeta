import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Dar/quitar like a un post
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID de post inválido" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const post = await Post.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { message: "Post no encontrado" },
        { status: 404 }
      );
    }
    
    const userId = session.user.id;
    const likeIndex = post.likes.findIndex(
      like => like.toString() === userId
    );
    
    // Si ya dio like, quitarlo
    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
      await post.save();
      
      return NextResponse.json({
        message: "Like removido",
        liked: false,
        likesCount: post.likes.length
      });
    }
    
    // Si no ha dado like, agregarlo
    post.likes.push(userId);
    await post.save();
    
    return NextResponse.json({
      message: "Like agregado",
      liked: true,
      likesCount: post.likes.length
    });
    
  } catch (error) {
    console.error("Error al procesar like:", error);
    return NextResponse.json(
      { message: "Error al procesar like" },
      { status: 500 }
    );
  }
} 