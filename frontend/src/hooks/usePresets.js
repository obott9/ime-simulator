import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export default function usePresets(user) {
  const [defaultPresets, setDefaultPresets] = useState([]);
  const [popularPresets, setPopularPresets] = useState([]);
  const [myPresets, setMyPresets] = useState([]);
  const [myLikes, setMyLikes] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchDefaultPresets = useCallback(async () => {
    try {
      const data = await api.getDefaultPresets();
      if (data) setDefaultPresets(data);
    } catch {
      // API未接続時は空のまま
    }
  }, []);

  const fetchPopularPresets = useCallback(async () => {
    try {
      const data = await api.getPopularPresets();
      if (data) setPopularPresets(data);
    } catch {
      // API未接続時は空のまま
    }
  }, []);

  const fetchMyPresets = useCallback(async () => {
    if (!user) {
      setMyPresets([]);
      return;
    }
    try {
      const data = await api.getMyPresets();
      if (data) setMyPresets(data);
    } catch {
      setMyPresets([]);
    }
  }, [user]);

  const fetchMyLikes = useCallback(async () => {
    if (!user) {
      setMyLikes(new Set());
      return;
    }
    try {
      const data = await api.getMyLikes();
      if (data) setMyLikes(new Set(data));
    } catch {
      setMyLikes(new Set());
    }
  }, [user]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchDefaultPresets(),
      fetchPopularPresets(),
      fetchMyPresets(),
      fetchMyLikes(),
    ]);
    setLoading(false);
  }, [fetchDefaultPresets, fetchPopularPresets, fetchMyPresets, fetchMyLikes]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchDefaultPresets(),
        fetchPopularPresets(),
        fetchMyPresets(),
        fetchMyLikes(),
      ]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [fetchDefaultPresets, fetchPopularPresets, fetchMyPresets, fetchMyLikes]);

  const savePreset = useCallback(async (name, settings) => {
    const data = await api.createPreset(name, settings);
    await fetchMyPresets();
    return data;
  }, [fetchMyPresets]);

  const updatePreset = useCallback(async (id, name, settings) => {
    const data = await api.updatePreset(id, name, settings);
    await fetchMyPresets();
    return data;
  }, [fetchMyPresets]);

  const deletePreset = useCallback(async (id) => {
    await api.deletePreset(id);
    await fetchMyPresets();
  }, [fetchMyPresets]);

  const sharePreset = useCallback(async (id) => {
    const data = await api.sharePreset(id);
    await fetchMyPresets();
    return data.share_code;
  }, [fetchMyPresets]);

  const toggleLike = useCallback(async (presetId) => {
    const data = await api.toggleLike(presetId);
    setMyLikes((prev) => {
      const next = new Set(prev);
      if (data.liked) {
        next.add(presetId);
      } else {
        next.delete(presetId);
      }
      return next;
    });
    await Promise.all([fetchPopularPresets(), fetchDefaultPresets()]);
    return data.liked;
  }, [fetchPopularPresets, fetchDefaultPresets]);

  const fetchByShareCode = useCallback(async (shareCode) => {
    try {
      return await api.getPresetByShareCode(shareCode);
    } catch {
      return null;
    }
  }, []);

  return {
    defaultPresets,
    popularPresets,
    myPresets,
    myLikes,
    loading,
    savePreset,
    updatePreset,
    deletePreset,
    sharePreset,
    toggleLike,
    fetchByShareCode,
    refreshAll,
  };
}
