'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { assets } from '@/data/assets';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const { locale } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/search');
    return null;
  }

  const marqueeAssets = [...assets, ...assets, ...assets];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      router.push('/search');
    } else {
      setError(locale === 'ja' ? 'メールアドレスまたはパスワードが正しくありません' : 'Invalid email or password');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    const success = await loginWithGoogle();

    if (success) {
      router.push('/search');
    } else {
      setError(locale === 'ja' ? 'ログインに失敗しました' : 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Background Marquee - Subtle */}
      <div className="fixed inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="flex gap-4 mb-4 animate-marquee-slow">
          {marqueeAssets.map((asset, index) => (
            <div key={`row1-${index}`} className="flex-shrink-0">
              <div className="relative w-40 h-28 rounded-xl overflow-hidden">
                <Image
                  src={asset.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 animate-marquee-slow-reverse">
          {[...marqueeAssets].reverse().map((asset, index) => (
            <div key={`row2-${index}`} className="flex-shrink-0">
              <div className="relative w-48 h-32 rounded-xl overflow-hidden">
                <Image
                  src={asset.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">
            {locale === 'ja' ? '戻る' : 'Back'}
          </span>
        </Link>
      </header>

      {/* Login Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)]">
              {locale === 'ja' ? 'ログイン' : 'Sign In'}
            </h1>
            <p className="text-sm text-[var(--color-ink-muted)] mt-2">
              {locale === 'ja'
                ? 'アカウントにログインしてアセットを探索'
                : 'Log in to explore assets'}
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg)] hover:border-[var(--color-ink-muted)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {locale === 'ja' ? 'Googleでログイン' : 'Continue with Google'}
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--color-bg)] px-3 text-[var(--color-ink-muted)]">
                {locale === 'ja' ? 'または' : 'or'}
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-ink-secondary)] mb-1.5">
                {locale === 'ja' ? 'メールアドレス' : 'Email'}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale === 'ja' ? 'example@email.com' : 'example@email.com'}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-ink-secondary)] mb-1.5">
                {locale === 'ja' ? 'パスワード' : 'Password'}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={locale === 'ja' ? '6文字以上' : '6+ characters'}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                locale === 'ja' ? 'ログイン' : 'Sign In'
              )}
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-xs text-center text-[var(--color-ink-muted)] mt-6">
            {locale === 'ja'
              ? 'デモ: 任意のメールアドレスと6文字以上のパスワードでログインできます'
              : 'Demo: Use any email and 6+ character password'}
          </p>
        </div>
      </div>
    </div>
  );
}
