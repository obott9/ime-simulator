# IME Settings Simulator - 設計仕様書

## 概要

IMEIndicatorClockアプリの設定をブラウザ上でリアルタイムにカスタマイズ・プレビューできるWebアプリ。
ポートフォリオ作品として、React + Node.js のフルスタックスキルを示す目的。

- **製品ページ**: https://obott9.github.io/imeindicatorclock.html
- **ポートフォリオ**: https://obott9.github.io/
- **作者**: obott9 (Hideki Obote)
- **ローカルパス**: `/Users/obote/Documents/_Programing/Web/ime-simulator/`

### 関連プロジェクト
| プロジェクト | パス |
|---|---|
| macOS版 (Swift) | `/Users/obote/Documents/_Programing/XCode/IMEIndicatorClock/` |
| Windows版 (C#) | `/Users/obote/Documents/_Programing/VisualStudioCode/IMEIndicatorClockW/` |
| Webシミュレーター | `/Users/obote/Documents/_Programing/Web/ime-simulator/` |

---

## 技術構成

| 層 | 技術 | ホスティング |
|---|---|---|
| フロントエンド | React (Vite) + Tailwind CSS | GitHub Pages (`obott9.github.io/ime-simulator/`) |
| バックエンド | Node.js + Express | Render (無料枠) |
| データベース | PostgreSQL | Supabase (無料枠) |
| 認証 | Supabase Auth (JWT) | Supabase |

---

## 機能一覧

### 1. 時計プレビュー (Clock Preview)

ブラウザ上でIMEIndicatorClockの時計表示をリアルタイムにカスタマイズ。

| 設定項目 | UI | デフォルト値 |
|---|---|---|
| 表示モード | トグル（アナログ / デジタル） | アナログ |
| 背景色 | カラーピッカー | IME言語に連動（日本語=赤、英語=青 等） |
| 文字色 | カラーピッカー | #FFFFFF |
| フォント | ドロップダウン | System default |
| フォントサイズ | スライダー (8-72pt) | 24pt |
| ウィンドウサイズ | スライダー (50-300px) | 150px |
| 日付表示 | トグル (ON/OFF) | ON |

#### アナログ時計の描画（Canvas）
- 時針・分針・秒針
- 文字盤の数字（12時間）
- 背景色がIME言語選択に連動して変化
- リアルタイムで動作（実際に時刻を表示）

#### デジタル時計の描画
- HH:MM:SS 形式
- フォント・色・サイズがスライダーに連動
- 背景色がIME言語選択に連動

### 2. IMEインジケーター プレビュー (IME Indicator Preview)

| 設定項目 | UI | デフォルト値 |
|---|---|---|
| 背景色（言語別） | カラーピッカー ×5言語 | 日=赤, 英=青, 韓=紫, 繁=黄緑, 簡=緑 |
| サイズ | スライダー (20-100px) | 40px |
| 透明度 | スライダー (0-100%) | 100% |
| 表示位置 | ドラッグ or 座標入力 | 画面右上 |
| 表示文字 | 自動（言語に連動） | あ / A / 한 / 繁 / 简 |

#### 言語切替デモ
- 5つの言語ボタン: 🇯🇵 🇺🇸 🇰🇷 🇹🇼 🇨🇳
- ボタンを押すと即座にインジケーターの色・文字が変化
- 時計の背景色も連動して変化
- ※実際のIME検知はWebでは不可能。手動切替のシミュレーション。

### 3. プリセット機能 (Presets)

#### 未ログイン状態
- デフォルトプリセット（Dark, Light, Classic 等）を読み込み可能
- 設定変更はローカル（ブラウザ内）のみ

#### ログイン状態
- 自分のプリセットを保存・読込・更新・削除
- プリセットに名前を付けて管理
- 共有URL生成（例: `ime-simulator/s/abc123`）
- 人気プリセット一覧の閲覧

### 4. ユーザー認証 (Auth)

Supabase Authを使用。

- メールアドレス + パスワードで登録・ログイン
- GitHubアカウントでOAuthログイン（オプション）
- ログイン状態でプリセット保存・共有が可能
- 未ログインでもプレビュー・カスタマイズは全機能使用可能

### 5. 多言語対応 (i18n)

UIの表示言語を5言語に対応（製品ページと同じ）。

| 言語 | コード |
|---|---|
| English | en |
| 日本語 | ja |
| 繁體中文 | zh-Hant |
| 简体中文 | zh-Hans |
| 한국어 | ko |

- ブラウザの言語設定を自動検出
- 言語切替セレクター（ヘッダー右上）
- react-i18next 使用

---

## API設計

**Base URL**: `https://api-ime-simulator.onrender.com/api`

### 認証
Supabase Authが発行するJWTをAuthorizationヘッダーで送信。
```
Authorization: Bearer <supabase_jwt>
```

### エンドポイント

#### プリセット

| Method | Path | Auth | 説明 |
|---|---|---|---|
| GET | `/presets/default` | 不要 | デフォルトプリセット一覧 |
| GET | `/presets/popular` | 不要 | 人気プリセットランキング |
| GET | `/presets/:id` | 不要 | プリセット読み込み（共有用） |
| GET | `/presets/mine` | 必要 | 自分のプリセット一覧 |
| POST | `/presets` | 必要 | プリセット保存 |
| PUT | `/presets/:id` | 必要 | プリセット更新（自分のもののみ） |
| DELETE | `/presets/:id` | 必要 | プリセット削除（自分のもののみ） |
| POST | `/presets/:id/share` | 必要 | 共有URL生成 |

#### プリセット保存リクエスト例
```json
{
  "name": "My Dark Theme",
  "settings": {
    "clock": {
      "mode": "analog",
      "backgroundColor": "#1a1a2e",
      "textColor": "#ffffff",
      "font": "monospace",
      "fontSize": 24,
      "windowSize": 150,
      "showDate": true
    },
    "indicator": {
      "colors": {
        "ja": "#e74c3c",
        "en": "#3498db",
        "ko": "#9b59b6",
        "zh-Hant": "#a8e063",
        "zh-Hans": "#2ecc71"
      },
      "size": 40,
      "opacity": 100,
      "position": { "x": 90, "y": 10 }
    }
  }
}
```

---

## DBスキーマ (Supabase PostgreSQL)

### users テーブル
Supabase Authが自動管理（auth.users）。追加のプロフィール情報が必要な場合のみ。

### presets テーブル
```sql
CREATE TABLE presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  settings JSONB NOT NULL,
  share_code VARCHAR(8) UNIQUE,
  is_default BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_presets_user_id ON presets(user_id);
CREATE INDEX idx_presets_share_code ON presets(share_code);
CREATE INDEX idx_presets_popular ON presets(likes_count DESC);
```

### likes テーブル
```sql
CREATE TABLE likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preset_id UUID REFERENCES presets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, preset_id)
);
```

---

## 画面構成

```
┌─────────────────────────────────────────────────┐
│ Header: ロゴ / タイトル / 言語切替 / ログイン   │
├────────────────────┬────────────────────────────┤
│                    │                            │
│   設定パネル       │     プレビューエリア       │
│   (左サイドバー)   │                            │
│                    │   ┌──────────────────┐     │
│   □ 時計設定       │   │                  │     │
│     - モード切替   │   │   時計プレビュー  │     │
│     - 色           │   │   (Canvas)        │     │
│     - フォント     │   │                  │     │
│     - サイズ       │   └──────────────────┘     │
│                    │                            │
│   □ IME設定        │   ┌────┐                   │
│     - 言語別色     │   │ あ │ ← インジケーター  │
│     - サイズ       │   └────┘                   │
│     - 透明度       │                            │
│                    │   🇯🇵 🇺🇸 🇰🇷 🇹🇼 🇨🇳       │
│   □ プリセット     │   ↑ 言語切替ボタン         │
│     - 保存/読込    │                            │
│     - 共有         │                            │
│                    │                            │
├────────────────────┴────────────────────────────┤
│ Footer: GitHub / 製品ページリンク / © obott9    │
└─────────────────────────────────────────────────┘
```

### レスポンシブ対応
- デスクトップ: 左右2カラム（設定 | プレビュー）
- モバイル: 上下1カラム（プレビュー → 設定パネル）

---

## ファイル構成

```
ime-simulator/
├── frontend/                    # React (Vite)
│   ├── public/
│   │   └── locales/             # i18n翻訳ファイル
│   │       ├── en/translation.json
│   │       ├── ja/translation.json
│   │       ├── zh-Hant/translation.json
│   │       ├── zh-Hans/translation.json
│   │       └── ko/translation.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ClockPreview.jsx        # 時計Canvas描画
│   │   │   ├── AnalogClock.jsx         # アナログ時計
│   │   │   ├── DigitalClock.jsx        # デジタル時計
│   │   │   ├── IMEIndicator.jsx        # IMEインジケーター表示
│   │   │   ├── SettingsPanel.jsx       # 設定パネル全体
│   │   │   ├── ClockSettings.jsx       # 時計設定UI
│   │   │   ├── IndicatorSettings.jsx   # インジケーター設定UI
│   │   │   ├── PresetManager.jsx       # プリセット管理
│   │   │   ├── LanguageSwitcher.jsx    # IME言語切替ボタン
│   │   │   ├── AuthModal.jsx           # ログイン/登録モーダル
│   │   │   └── ShareDialog.jsx         # 共有ダイアログ
│   │   ├── hooks/
│   │   │   ├── useSettings.js          # 設定state管理
│   │   │   ├── useAuth.js              # Supabase認証
│   │   │   └── usePresets.js           # プリセットCRUD
│   │   ├── lib/
│   │   │   ├── supabase.js             # Supabaseクライアント初期化
│   │   │   └── api.js                  # APIクライアント
│   │   ├── i18n.js                     # i18n設定
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── presets.js              # プリセットAPI
│   │   ├── middleware/
│   │   │   └── auth.js                 # JWT検証ミドルウェア
│   │   ├── lib/
│   │   │   └── supabase.js             # Supabase Admin初期化
│   │   └── index.js                    # Express起動
│   ├── package.json
│   └── Dockerfile                      # Renderデプロイ用
│
└── README.md                    # プロジェクト説明（英語）
```

---

## デプロイ手順

### フロントエンド → GitHub Pages
1. `vite.config.js` で `base: '/ime-simulator/'` を設定
2. `npm run build` で `dist/` を生成
3. GitHub Actionsまたは `gh-pages` パッケージで自動デプロイ

### バックエンド → Render
1. `backend/` ディレクトリをGitHubリポジトリに配置
2. Renderで Web Service 作成、ルートディレクトリに `backend/` を指定
3. 環境変数を設定:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `CORS_ORIGIN=https://obott9.github.io`
4. UptimeRobot でスリープ防止のping設定

### Supabase
1. プロジェクト作成
2. SQLでテーブル作成（上記スキーマ）
3. Row Level Security (RLS) 設定
4. Auth設定（メール認証 + GitHub OAuth）

---

## 開発の優先順位

### Phase 1: コアUI（目標: 2-3日）
1. Vite + React プロジェクト初期設定
2. アナログ時計Canvas描画
3. デジタル時計表示
4. IMEインジケーター表示
5. 設定パネル（スライダー、カラーピッカー）
6. 言語切替ボタン（IMEシミュレーション）

### Phase 2: バックエンド + 認証（目標: 2-3日）
1. Supabaseプロジェクトセットアップ
2. Express API 構築
3. Supabase Auth連携
4. プリセットCRUD API
5. 共有URL生成

### Phase 3: 多言語 + 仕上げ（目標: 1-2日）
1. react-i18next 導入
2. 5言語の翻訳ファイル作成
3. レスポンシブ対応
4. デプロイ（GitHub Pages + Render）

### Phase 4: ポートフォリオ統合（目標: 半日）
1. README.md 作成（英語）
2. 製品ページにシミュレーターへのリンク追加
3. ポートフォリオトップに追加
4. Upwork/LinkedInプロフィールに掲載

---

## 備考

- 実際のIME状態検知はWebブラウザの制限により不可能。言語ボタンによる手動切替でシミュレーションする。
- シミュレーターのUIに「※実際のIME自動検知にはデスクトップ版が必要です → ダウンロード」の誘導リンクを配置。
- Developed in collaboration with Claude AI のクレジットを製品ページと同様に表示。
