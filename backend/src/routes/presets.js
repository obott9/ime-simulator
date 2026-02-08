import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/presets/default — デフォルトプリセット一覧（認証不要）
router.get('/default', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('presets')
    .select('*')
    .eq('is_default', true)
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/presets/popular — 人気プリセットランキング（認証不要）
router.get('/popular', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('presets')
    .select('*')
    .not('share_code', 'is', null)
    .eq('is_default', false)
    .order('likes_count', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/presets/mine — 自分のプリセット一覧（認証必要）
router.get('/mine', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('presets')
    .select('*')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/presets/likes — 自分のいいね一覧（認証必要）
router.get('/likes', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('likes')
    .select('preset_id')
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map((l) => l.preset_id));
});

// GET /api/presets/share/:code — 共有コードでプリセット取得（認証不要）
router.get('/share/:code', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('presets')
    .select('*')
    .eq('share_code', req.params.code)
    .single();

  if (error) return res.status(404).json({ error: 'Preset not found' });
  res.json(data);
});

// GET /api/presets/:id — プリセット取得（認証不要）
router.get('/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('presets')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Preset not found' });
  res.json(data);
});

// POST /api/presets — プリセット保存（認証必要）
router.post('/', requireAuth, async (req, res) => {
  const { name, settings } = req.body;
  if (!name || typeof name !== 'string' || name.length > 255) {
    return res.status(400).json({ error: 'name must be a string (1-255 chars)' });
  }
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return res.status(400).json({ error: 'settings must be a JSON object' });
  }

  const { data, error } = await supabaseAdmin
    .from('presets')
    .insert({ user_id: req.user.id, name, settings })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/presets/:id — プリセット更新（認証必要、自分のもののみ）
router.put('/:id', requireAuth, async (req, res) => {
  const { name, settings } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.length === 0 || name.length > 255)) {
    return res.status(400).json({ error: 'name must be a string (1-255 chars)' });
  }
  if (settings !== undefined && (typeof settings !== 'object' || Array.isArray(settings) || settings === null)) {
    return res.status(400).json({ error: 'settings must be a JSON object' });
  }

  // 所有者チェック
  const { data: existing } = await supabaseAdmin
    .from('presets')
    .select('user_id')
    .eq('id', req.params.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Preset not found' });
  if (existing.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { data, error } = await supabaseAdmin
    .from('presets')
    .update({ name, settings })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/presets/:id — プリセット削除（認証必要、自分のもののみ）
router.delete('/:id', requireAuth, async (req, res) => {
  const { data: existing } = await supabaseAdmin
    .from('presets')
    .select('user_id, is_default')
    .eq('id', req.params.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Preset not found' });
  if (existing.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  if (existing.is_default) {
    return res.status(403).json({ error: 'Cannot delete default preset' });
  }

  const { error } = await supabaseAdmin
    .from('presets')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

// POST /api/presets/:id/share — 共有コード生成（認証必要）
router.post('/:id/share', requireAuth, async (req, res) => {
  // 所有者チェック
  const { data: existing } = await supabaseAdmin
    .from('presets')
    .select('user_id, share_code')
    .eq('id', req.params.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Preset not found' });
  if (existing.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // 既に共有コードがあればそのまま返す
  if (existing.share_code) {
    return res.json({ share_code: existing.share_code });
  }

  // 8文字の暗号学的に安全なランダムコード生成
  const code = randomBytes(4).toString('hex');
  const { error } = await supabaseAdmin
    .from('presets')
    .update({ share_code: code })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ share_code: code });
});

// POST /api/presets/:id/like — いいね切替（認証必要）
router.post('/:id/like', requireAuth, async (req, res) => {
  const presetId = req.params.id;
  const userId = req.user.id;

  // 既存いいねチェック
  const { data: existing } = await supabaseAdmin
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('preset_id', presetId)
    .single();

  let liked;
  if (existing) {
    await supabaseAdmin.from('likes').delete().eq('id', existing.id);
    liked = false;
  } else {
    const { error } = await supabaseAdmin
      .from('likes')
      .insert({ user_id: userId, preset_id: presetId });
    if (error) return res.status(500).json({ error: error.message });
    liked = true;
  }

  // likes_countを実カウントで同期
  const { count } = await supabaseAdmin
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('preset_id', presetId);
  await supabaseAdmin
    .from('presets')
    .update({ likes_count: count })
    .eq('id', presetId);

  res.json({ liked });
});

export default router;
