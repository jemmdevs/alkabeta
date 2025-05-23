import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Endpoint para obtener todos los posts
export async function GET() {
  try {
    await connectDB();
    
    const posts = await Post.find({})
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
    console.error("Error al obtener posts:", error);
    return NextResponse.json(
      { message: "Error al obtener posts" },
      { status: 500 }
    );
  }
}

// Endpoint para crear un nuevo post
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
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
    
    const newPost = await Post.create({
      content,
      author: session.user.id,
    });
    
    await newPost.populate({
      path: 'author',
      select: 'name username'
    });
    
    return NextResponse.json(
      {
        message: "Post creado correctamente",
        post: {
          ...newPost.toObject(),
          _id: newPost._id.toString(),
          author: {
            ...newPost.author.toObject(),
            _id: newPost.author._id.toString()
          },
          likes: newPost.likes.map(like => like.toString()),
          createdAt: newPost.createdAt.toISOString(),
          updatedAt: newPost.updatedAt.toISOString()
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error al crear post:", error);
    return NextResponse.json(
      { message: "Error al crear post" },
      { status: 500 }
    );
  }
} 