# Design Patterns 学習プログレス

## 学習フロー

各パターンについて、以下の順番で進める：

1. **日本語で理解** — Claudeに質問しながら概念を固める
2. **自分の言葉でまとめる** — YouTube台本レベルで要点を整理する
3. **YouTube動画を撮る** — VS Code画面収録 + 声で解説（無編集OK）
4. **英語で読み直す** — 理解済みの内容をREADMEで英語の練習として読む

---

## 進捗一覧

| パターン | カテゴリ | 1. 日本語理解 | 2. 自分の言葉で整理 | 3. YouTube撮影 | 4. 英語で読み直し |
|----------|----------|:---:|:---:|:---:|:---:|
| Singleton | Creational | Done | - | - | - |
| Factory | Creational | Done | - | - | - |
| Abstract Factory | Creational | Done | - | - | - |
| Strategy | Behavioral | Done | - | - | - |
| Observer | Behavioral | Done | Done | Done | Done |
| Decorator | Structural | Done | Done | Done | Done |
| Adapter | Structural | Done | Done | Done | - |
| Facade | Structural | Done | Done | Done | - |

> ステータス: `Done` / `In Progress` / `-`（未着手）

---

## 学習ログ

### 2026-02-18
- Facade パターンの README・コード・デモを追加（ホームシアターの例）
- Facade パターンのステップ1〜3完了（日本語理解→自分の言葉で整理→YouTube撮影）
- YouTube へのアップロードまで完了
- 「ホテルのフロント」のアナロジーが不適切（判断を含む）→「TVリモコンの映画ボタン」に修正
- 「関数でよくない？」問題を深掘り → Facade の本当の使い所はモジュールの境界（他の人が使う入口）

### 2026-02-17
- Adapter パターンの README・コード・デモを追加（決済システムの例）
- Adapter パターンのステップ1〜3完了（日本語理解→自分の言葉で整理→YouTube撮影）
- YouTube へのアップロードまで完了
- Strategy との違い、「リファクタすればいいのでは？」「Adapter 自体がアンチパターンでは？」等を深掘り

### 2026-02-16
- Strategy・Observer のアンチパターンを日本語で理解（行動ミッション形式）
- Decorator パターンを全体的に日本語で理解（アンチパターン含む）
- Decorator パターンのステップ1〜3完了（日本語理解→自分の言葉で整理→YouTube撮影）
- YouTube へのアップロードまで完了

### 2026-02-14
- Observer パターン全ステップ完了（日本語理解→自分の言葉で整理→YouTube撮影→英語で読み直し）
- YouTube へのアップロードまで完了
- `Subscriber.ts` を `ConcreteObservers.ts` にリネーム（ファイル名をより明確に）
- Decorator パターンの README・コード・デモを追加（初の Structural パターン）

### 2025-02-13
- Observer パターンの「何が嬉しいか」をClaudeと確認
- 学習フローの見直し：英語とデザインパターンの学習を分離する方針に決定
- YouTube撮影の進め方を検討（画面収録 + 声、5〜10分、無編集でOK）
- Observer README の品質改善：
  - 簡略版コードの未定義参照・不整合を多数修正（constructor 漏れ、未使用引数、インターフェース不一致など）
  - 「How to Make an Observer (3 Steps)」セクションを削除（Complete Example と重複・不整合のため）
  - Common Mistakes を分割（observer リスト変更の問題と無限ループの問題を別々に解説）
- CLAUDE.md にコードスニペットの品質ルール・ライティングスタイルルールを追加
- Observer パターンの深掘り：Subject/Observer の英語の意味、Hollywood Principle、onMessage の呼ばれるタイミング、constructor の使い分け、無限ループの仕組み

---

## 次にやること

- [x] ~~既習パターンの中から1つ選んで「自分の言葉でまとめ」を作る~~ → Observer で完了
- [x] ~~最初のYouTube動画を1本撮ってみる~~ → Observer で完了・アップロード済み
- [x] ~~Decorator パターンのステップ1（日本語理解）から始める~~ → 完了
- [ ] 他の既習パターン（Singleton, Factory, Abstract Factory, Strategy）のYouTube動画を撮る

---

## メモ

- 日付の記録は「体感日付」で。深夜〜早朝は前日扱い。微妙な時間帯はClaudeから確認する
- 最初から完璧を目指さない。1本撮ることが最優先
- 動画ファイルはYouTubeアップ後にローカルから削除してOK
- 新しいパターンを追加するときは、まずステップ1から始める
