-- ============================================
-- IME Indicator Clock - Supabase Setup SQL
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create presets table
CREATE TABLE presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  settings JSONB NOT NULL,
  share_code TEXT UNIQUE,
  likes_count INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create likes table
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preset_id UUID REFERENCES presets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, preset_id)
);

-- 3. Create indexes
CREATE INDEX idx_presets_user_id ON presets(user_id);
CREATE INDEX idx_presets_share_code ON presets(share_code);
CREATE INDEX idx_presets_is_default ON presets(is_default);
CREATE INDEX idx_presets_likes_count ON presets(likes_count DESC);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_preset_id ON likes(preset_id);

-- 4. Enable RLS
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for presets

-- Anyone can read default presets
CREATE POLICY "Default presets are readable by everyone"
  ON presets FOR SELECT
  USING (is_default = TRUE);

-- Anyone can read shared presets (has share_code)
CREATE POLICY "Shared presets are readable by everyone"
  ON presets FOR SELECT
  USING (share_code IS NOT NULL);

-- Users can read their own presets
CREATE POLICY "Users can read own presets"
  ON presets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own presets
CREATE POLICY "Users can create own presets"
  ON presets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own presets (not defaults)
CREATE POLICY "Users can update own presets"
  ON presets FOR UPDATE
  USING (auth.uid() = user_id AND is_default = FALSE)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own presets (not defaults)
CREATE POLICY "Users can delete own presets"
  ON presets FOR DELETE
  USING (auth.uid() = user_id AND is_default = FALSE);

-- 6. RLS Policies for likes

-- Users can read their own likes
CREATE POLICY "Users can read own likes"
  ON likes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own likes
CREATE POLICY "Users can create own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Function: generate_share_code
CREATE OR REPLACE FUNCTION generate_share_code(preset_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  preset_owner UUID;
BEGIN
  -- Verify ownership
  SELECT user_id INTO preset_owner FROM presets WHERE id = preset_id;
  IF preset_owner IS NULL OR preset_owner != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Generate 8-char alphanumeric code
  new_code := substr(md5(random()::text || clock_timestamp()::text), 1, 8);

  UPDATE presets SET share_code = new_code, updated_at = now()
  WHERE id = preset_id;

  RETURN new_code;
END;
$$;

-- 8. Function: toggle_like
CREATE OR REPLACE FUNCTION toggle_like(target_preset_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_like UUID;
  is_liked BOOLEAN;
BEGIN
  -- Check if already liked
  SELECT id INTO existing_like FROM likes
  WHERE user_id = auth.uid() AND preset_id = target_preset_id;

  IF existing_like IS NOT NULL THEN
    -- Unlike
    DELETE FROM likes WHERE id = existing_like;
    UPDATE presets SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = target_preset_id;
    is_liked := FALSE;
  ELSE
    -- Like
    INSERT INTO likes (user_id, preset_id) VALUES (auth.uid(), target_preset_id);
    UPDATE presets SET likes_count = likes_count + 1
    WHERE id = target_preset_id;
    is_liked := TRUE;
  END IF;

  RETURN is_liked;
END;
$$;

-- 9. Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER presets_updated_at
  BEFORE UPDATE ON presets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 10. Seed default presets
INSERT INTO presets (name, settings, is_default, share_code) VALUES
(
  'Dark',
  '{
    "clock": {
      "mode": "analog",
      "dateTimePosition": "dateTimeVertical",
      "showSeconds": true,
      "dateFormatStyle": "complete",
      "timeFormatStyle": "standard",
      "customDateFormat1": "yyyy/MM/dd E",
      "customDateFormat2": "M/d (EEE)",
      "customTimeFormat1": "HH:mm:ss",
      "customTimeFormat2": "H:mm",
      "useIndicatorColors": true,
      "bgColorOff": "#0096ff",
      "bgColorOn": "#ff2600",
      "bgOpacity": 60,
      "textColor": "#ffffff",
      "analogColor": "#fffc00",
      "font": "system-ui",
      "fontSize": 24,
      "windowWidth": 320,
      "windowHeight": 220,
      "analogClockSize": 200
    },
    "indicator": {
      "colors": {"ja": "#e74c3c", "en": "#3498db", "ko": "#9b59b6", "zh-Hant": "#a8e063", "zh-Hans": "#2ecc71"},
      "texts": {"ja": "あ", "en": "A", "ko": "한", "zh-Hant": "繁", "zh-Hans": "简"},
      "size": 40,
      "fontSizeRatio": 0.5,
      "opacity": 100,
      "position": {"x": 90, "y": 10}
    }
  }'::jsonb,
  TRUE,
  'default1'
),
(
  'Light',
  '{
    "clock": {
      "mode": "digital",
      "dateTimePosition": "dateTimeVertical",
      "showSeconds": true,
      "dateFormatStyle": "abbreviated",
      "timeFormatStyle": "standard",
      "customDateFormat1": "yyyy/MM/dd E",
      "customDateFormat2": "M/d (EEE)",
      "customTimeFormat1": "HH:mm:ss",
      "customTimeFormat2": "H:mm",
      "useIndicatorColors": false,
      "bgColorOff": "#5ac8fa",
      "bgColorOn": "#ff9500",
      "bgOpacity": 80,
      "textColor": "#1c1c1e",
      "analogColor": "#fffc00",
      "font": "system-ui",
      "fontSize": 28,
      "windowWidth": 320,
      "windowHeight": 220,
      "analogClockSize": 200
    },
    "indicator": {
      "colors": {"ja": "#ff3b30", "en": "#007aff", "ko": "#af52de", "zh-Hant": "#34c759", "zh-Hans": "#30d158"},
      "texts": {"ja": "あ", "en": "A", "ko": "한", "zh-Hant": "繁", "zh-Hans": "简"},
      "size": 36,
      "fontSizeRatio": 0.5,
      "opacity": 100,
      "position": {"x": 90, "y": 10}
    }
  }'::jsonb,
  TRUE,
  'default2'
),
(
  'Classic',
  '{
    "clock": {
      "mode": "analog",
      "dateTimePosition": "timeOnly",
      "showSeconds": true,
      "dateFormatStyle": "complete",
      "timeFormatStyle": "standard",
      "customDateFormat1": "yyyy/MM/dd E",
      "customDateFormat2": "M/d (EEE)",
      "customTimeFormat1": "HH:mm:ss",
      "customTimeFormat2": "H:mm",
      "useIndicatorColors": true,
      "bgColorOff": "#2c3e50",
      "bgColorOn": "#c0392b",
      "bgOpacity": 90,
      "textColor": "#ecf0f1",
      "analogColor": "#f1c40f",
      "font": "Georgia",
      "fontSize": 20,
      "windowWidth": 280,
      "windowHeight": 280,
      "analogClockSize": 240
    },
    "indicator": {
      "colors": {"ja": "#e74c3c", "en": "#2980b9", "ko": "#8e44ad", "zh-Hant": "#27ae60", "zh-Hans": "#16a085"},
      "texts": {"ja": "あ", "en": "A", "ko": "한", "zh-Hant": "繁", "zh-Hans": "简"},
      "size": 48,
      "fontSizeRatio": 0.45,
      "opacity": 90,
      "position": {"x": 90, "y": 10}
    }
  }'::jsonb,
  TRUE,
  'default3'
);
