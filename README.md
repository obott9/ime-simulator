# IME Indicator Clock Simulator

macOS アプリ [IME Indicator Clock](https://obott9.github.io/imeindicatorclock.html) のWebシミュレーター。
時計ウインドウとIMEインジケータの外観をブラウザ上でプレビュー・カスタマイズできます。

**Live Demo:** https://obott9.github.io/ime-simulator/

## Architecture

```
Browser ─── GitHub Pages (Frontend)
              ├── Supabase Auth (認証: 直接接続)
              └── Render (Backend API) ─── Supabase (データ)
```

| Layer | Tech | Hosting |
|-------|------|---------|
| Frontend | React 19 + Vite 7 + Tailwind CSS 4 | GitHub Pages |
| Backend | Express 5 + Node.js 22 | Render (Docker) |
| Database | Supabase (PostgreSQL) | Supabase Cloud |
| Auth | Supabase Auth (Email + GitHub OAuth) | Supabase Cloud |

## Features

- 時計プレビュー（アナログ / デジタル）
- IMEインジケータプレビュー
- 日付・時刻フォーマットのカスタマイズ
- プリセット保存・共有・いいね
- 5言語対応（日本語・英語・韓国語・中国語簡体字・中国語繁体字）
- ロケール対応の日付・時刻表示

## Design Decisions

### API ローディング表示とコールドスタート対応

バックエンドは Render の無料枠でホストしており、一定時間アクセスがないとサーバーがスリープ状態になります（コールドスタート）。復帰には最大30秒程度かかるため、以下のローディングUIを意図的に実装しています:

- **サイドバー上部バナー**: 時計・インジケータタブ表示中でもAPI接続状況がわかるよう、「サーバーに接続中...」のバナーを表示
- **プリセットタブ**: スピナー + 接続メッセージ + 「初回接続には最大30秒ほどかかる場合があります」の注意書き
- **個別操作ボタン**: 保存・更新・共有ボタンにインラインスピナーを表示し、処理中であることを明示

無料枠の制約上、コールドスタートの遅延を排除することはできないため、ユーザーに「正常動作である」ことを伝えるUXを優先しています。

### 3層アーキテクチャ (Frontend → Express API → Supabase)

フロントエンドから直接 Supabase にアクセスする構成も可能ですが、以下の理由で Express API レイヤーを挟んでいます:

- **セキュリティ**: Supabase の `service_role` キー（管理者権限）をフロントエンドに露出しない
- **柔軟性**: RLS (Row Level Security) に依存せず、サーバーサイドで認可ロジックを制御できる
- **拡張性**: 将来的に外部API連携やバッチ処理を追加しやすい

### 認証は Supabase Auth 直接接続

認証フローのみ、フロントエンドから Supabase Auth SDK に直接接続しています:

- OAuth リダイレクトフローは Supabase Auth が直接処理する必要がある
- JWT トークンはフロントエンドで取得し、API リクエスト時に `Authorization` ヘッダーで送信
- バックエンドは JWT を検証してユーザーを特定する

## Setup

### Prerequisites

- Node.js 22+
- Supabase プロジェクト

### Frontend

```bash
cd frontend
cp .env.example .env.local
# .env.local に Supabase の URL と anon key を設定
npm install
npm run dev
```

### Backend

```bash
cd backend
cp .env.example .env
# .env に Supabase の URL と service_role key を設定
npm install
npm run dev
```

### Database

`supabase-setup.sql` を Supabase の SQL Editor で実行してテーブル・RLS・シード データを作成してください。

## Environment Variables

### Frontend (.env.local)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase プロジェクト URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (公開) キー |
| `VITE_API_URL` | バックエンド API URL (本番用) |

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase プロジェクト URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role キー |
| `CORS_ORIGIN` | 許可するオリジン (カンマ区切り) |
| `PORT` | サーバーポート (デフォルト: 3001) |
