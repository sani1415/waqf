'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { login } from '@/lib/data';

export function Auth() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const user = login(userId.trim(), password);
    if (user) {
      router.replace('/dashboard');
    } else {
      setError(t('login_error'));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="login-form-group">
        <label htmlFor="loginUserId">
          <span>{t('user_id')}</span>
        </label>
        <input
          id="loginUserId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. admin"
          required
          autoComplete="username"
        />
      </div>
      <div className="login-form-group">
        <label htmlFor="loginPin">
          <span>{t('password')}</span>
        </label>
        <input
          id="loginPin"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="PIN"
          required
          autoComplete="current-password"
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn-primary btn-block login-submit-btn">
        <i className="fas fa-sign-in-alt" aria-hidden />
        {t('login')}
      </button>
      <p className="hint">Demo: admin/1234 or user1/1111</p>
    </form>
  );
}
