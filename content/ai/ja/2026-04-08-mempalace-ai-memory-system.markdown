---
title: "【AI ツール推薦】MemPalace：世界最高水準のオープンソース AI メモリシステム、Claude や GPT に「忘れない」記憶を"
date: "2026-04-08 00:50:00"
author: "Elegant Access"
image: "/images/cover/mempalace_intro.png"
topic: "AI ツール"
tags: ["MemPalace", "AI Memory", "Open Source", "MCP", "AAAK"]
categories: ["AI 観察", "ツール推薦"]
summary: "MemPalace は、LongMemEval で過去最高スコアを記録したオープンソースの AI メモリシステムです。独自の「宮殿（Palace）」構造と AAAK 圧縮技術により、AI が会話終了後にコンテキストを失う問題を解決します。"
---

# なぜ AI はいつも忘れてしまうのか？

Claude や ChatGPT、Cursor を頻繁に使用しているなら、誰もがこの悩みに直面したことがあるはずです。セッションが終了すると、AI はそれまで議論してきた意思決定、アーキテクチャの議論、あるいはデバッグの記録をすべて忘れてしまいます。既存の「メモリ」機能を使っても、AI は「ユーザーは Postgres を好む」といった断片的な情報しか抽出できず、最も重要な**コンテキスト（文脈）**や**推論プロセス**を失ってしまいます。

これを解決するために生まれたのが **MemPalace** です。

## MemPalace とは？

[MemPalace](https://github.com/milla-jovovich/mempalace) は、完全にオープンソースで無料の AI メモリシステムです。最新の **LongMemEval** ベンチマークでは、有料のソリューションを抑えて過去最高のスコアを記録しました。

その核心的な理念は、AI に「何を覚えるべきか」を「判断させる」のではなく、**「すべて保存し、見つけやすくする」**ことにあります。

## コア技術：記憶の宮殿と AAAK

### 1. 記憶の宮殿（The Palace）
古代ギリシャの演説家が使っていた「場所法（記憶の宮殿）」にヒントを得て、MemPalace は会話を以下のように整理します：
- **Wing（翼）**：特定のプロジェクト、人物、またはトピック。
- **Room（部屋）**：Wing 下の具体的な詳細。
- **Closet（クローゼット）**：要約とインデックス。
- **Drawer（引き出し）**：元のファイルや会話の全文。

この構造化された組織化により、検索能力は **34%** 向上します。

### 2. AAAK 圧縮技術
これは MemPalace のもう一つの秘密兵器です。AAAK は AI エージェント専用に設計された「無損速記方言」です。数ヶ月分のコンテキストを、情報の欠落なしに **30倍** に圧縮できます。
これにより、本来なら数万トークンを消費する歴史的背景を、AAAK を通じてわずか **120トークン** 程度で AI に注入することが可能になります。

## プライバシーとパフォーマンス：完全ローカル動作

MemPalace はあなたのローカルマシン上で動作します：
- **クラウド API 不要**：すべての検索と保存はローカルで行われます。
- **オフライン LLM にも対応**：Llama や Mistral などのローカルモデルと組み合わせて、データプライバシーを完全に確保できます。
- **高速な検索**：1年分に及ぶ会話ログの中からでも、数秒で答えを見つけ出すことができます。

## 始め方

MemPalace のインストールは非常に簡単です：

```bash
pip install mempalace
mempalace init ~/projects/my_project
mempalace mine ~/projects/my_project # プロジェクトデータのマイニング
```

Claude や Cursor を使っている場合は、**MCP (Model Context Protocol)** を通じて統合でき、19種類のメモリツールを AI に自動で呼び出させることができます。

## 結論

AI 時代の最も大きなコストはトークンではなく、**失われるコンテキスト**です。MemPalace は、エレガントで効率的なソリューションを提供し、あなたの AI を単なる「一過性のパートナー」から、共に成長し続ける真のインテリジェント・アシスタントへと変えてくれます。

GitHub でプロジェクトをチェックしてください：[milla-jovovich/mempalace](https://github.com/milla-jovovich/mempalace)
