<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class AuthController extends Controller
{
    private const MESSAGES = [
        'required'  => 'Kolom :attribute wajib diisi.',
        'email'     => 'Format email tidak valid.',
        'unique'    => 'Email ini sudah terdaftar.',
        'confirmed' => 'Konfirmasi password tidak cocok.',
        'max'       => ['string' => 'Kolom :attribute maksimal :max karakter.'],
        'min'       => ['string' => 'Kolom :attribute minimal :min karakter.'],
    ];

    private const ATTRIBUTES = [
        'name'     => 'nama',
        'email'    => 'email',
        'password' => 'password',
    ];

    public function showLogin(): View|RedirectResponse
    {
        return Auth::check() ? redirect()->route('dashboard') : view('auth.login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ], self::MESSAGES, self::ATTRIBUTES);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()
                ->withErrors(['email' => 'Email atau password salah.'])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function showRegister(): View|RedirectResponse
    {
        return Auth::check() ? redirect()->route('dashboard') : view('auth.register');
    }

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:100'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], self::MESSAGES, self::ATTRIBUTES);

        $user = User::forceCreate([
            'name'     => trim($data['name']),
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
