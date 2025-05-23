import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, username, email, password } = await request.json();
    
    // Validar campos
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Verificar si el email ya existe
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json(
        { message: "Este correo ya está registrado" },
        { status: 400 }
      );
    }
    
    // Verificar si el username ya existe
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return NextResponse.json(
        { message: "Este nombre de usuario ya está en uso" },
        { status: 400 }
      );
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
    
    const newUser = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
    };
    
    return NextResponse.json(
      { message: "Usuario registrado correctamente", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json(
      { message: "Error al registrar usuario" },
      { status: 500 }
    );
  }
} 