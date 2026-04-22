<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        return Inertia::render('Admin/Usuarios', [
            'usuarios' => User::orderBy('name')->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $request->validate([
            'name'     => 'required|string|max:150',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:admin,user',
        ]);

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
            'role'     => $request->role,
        ]);

        return redirect()->back()->with('success', 'Usuario creado correctamente.');
    }

    public function update(Request $request, User $usuario)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $request->validate([
            'name'  => 'required|string|max:150',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($usuario->id)],
            'role'  => 'required|in:admin,user',
        ]);

        // No permitir que el admin se quite su propio rol
        if ($usuario->id === auth()->id() && $request->role !== 'admin') {
            return redirect()->back()->with('error', 'No puedes cambiar tu propio rol.');
        }

        $usuario->update([
            'name'  => $request->name,
            'email' => $request->email,
            'role'  => $request->role,
        ]);

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function updatePassword(Request $request, User $usuario)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $usuario->update(['password' => Hash::make($request->password)]);

        return redirect()->back()->with('success', 'Contraseña actualizada correctamente.');
    }

    public function destroy(User $usuario)
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        if ($usuario->id === auth()->id()) {
            return redirect()->back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $usuario->delete();

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }
}
