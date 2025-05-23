import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Obtener un post específico
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID de post inválido" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const post = await Post.findById(id)
      .populate({
        path: 'author',
        select: 'name username'
      })
      .lean();
    
    if (!post) {
      return NextResponse.json(
        { message: "Post no encontrado" },
        { status: 404 }
      );
    }
    
    const formattedPost = {
      ...post,
      _id: post._id.toString(),
      author: {
        ...post.author,
        _id: post.author._id.toString()
      },
      likes: post.likes.map(like => like.toString()),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
    
    return NextResponse.json(formattedPost);
    
  } catch (error) {
    console.error("Error al obtener post:", error);
    return NextResponse.json(
      { message: "Error al obtener post" },
      { status: 500 }
    );
  }
}

// Actualizar un post
export async function PUT(request, { params }) {
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
    
    const { content } = await request.json();
    
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { message: "El contenido del post es obligatorio" },
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
    
    // Verificar que el usuario sea el autor del post
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "No tienes permiso para editar este post" },
        { status: 403 }
      );
    }
    
    post.content = content;
    post.updatedAt = new Date();
    await post.save();
    
    await post.populate({
      path: 'author',
      select: 'name username'
    });
    
    return NextResponse.json({
      message: "Post actualizado correctamente",
      post: {
        ...post.toObject(),
        _id: post._id.toString(),
        author: {
          ...post.author.toObject(),
          _id: post.author._id.toString()
        },
        likes: post.likes.map(like => like.toString()),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }
    });
    
  } catch (error) {
    console.error("Error al actualizar post:", error);
    return NextResponse.json(
      { message: "Error al actualizar post" },
      { status: 500 }
    );
  }
}

// Eliminar un post
export async function DELETE(request, { params }) {
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
    
    // Verificar que el usuario sea el autor del post
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "No tienes permiso para eliminar este post" },
        { status: 403 }
      );
    }
    
    await Post.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: "Post eliminado correctamente"
    });
    
  } catch (error) {
    console.error("Error al eliminar post:", error);
    return NextResponse.json(
      { message: "Error al eliminar post" },
      { status: 500 }
    );
  }
} 