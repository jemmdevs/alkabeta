import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { message: "Se requiere un término de búsqueda" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Buscar usuarios cuyo nombre o username coincida parcialmente con la búsqueda
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    })
      .select('name username image')
      .limit(10)
      .lean();
    
    const formattedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString()
    }));
    
    return NextResponse.json(formattedUsers);
    
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return NextResponse.json(
      { message: "Error al buscar usuarios" },
      { status: 500 }
    );
  }
} 