import { supabaseAdmin } from '../lib/supabase.js';

// JWT検証ミドルウェア（必須）
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  try {
    const token = header.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = data.user;
    next();
  } catch {
    res.status(500).json({ error: 'Auth service error' });
  }
}

// JWT検証ミドルウェア（任意 — ユーザー情報があればセット）
export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const token = header.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    req.user = error ? null : data.user;
    next();
  } catch {
    req.user = null;
    next();
  }
}
