---
layout: post
title: Deepwikiツールで第三者ライブラリを素早く理解する
date: '2025-05-02 06:28:10 +0800'
image: cover/deepwiki.png
tags:
  - deepwiki
permalink: /deepwiki
categories: AI
excerpt: Deepwikiツールで第三者ライブラリを素早く理解する
---

## Deepwiki
* このAIツールは`Githubリポジトリのスキャン分析`と`ドキュメント生成`を提供し、ユーザーがGithub上の第三者ライブラリをより迅速に理解できるようにします

：https://deepwiki.com/

 例：GreenDao、lottie-android

 第三者ライブラリをより早く理解するのに役立ちます

 またはドキュメントを直接AIに渡して理解させ、コードを修正させることもできます

## 機能概要
- 自動ドキュメント生成

      - DeepWikiはコード、READMEファイル、設定ファイルを分析し、プロジェクトの目標、コアモジュール、依存関係図などを含む構造化された技術ドキュメントを自動生成します。生成されるドキュメントは従来のREADMEよりも詳細で、ドキュメントが不足しているプロジェクトにも明確な説明を提供できます。
  - 対話型AIアシスタント

      - ユーザーは自然言語で質問でき、「ディープリサーチ（Deep Research）」モードでは潜在的な脆弱性、最適化提案、またはクロスリポジトリ比較分析を検出できます。

## 使用方法
  - すでに誰かがスキャンしたGithubリポジトリは直接検索できます。そうでない場合は、次のステップを確認してください

<img src="/images/cursor/056.png" alt="flutter">

  - GitHubに接続する際、ドメイン名を`github.com`から`deepwiki.com`に変更します。例：
https://github.com/microsoft/vscode → https://deepwiki.com/microsoft/vscode。
  - まだ分析されていないリポジトリは、インデックス化・分析されていないと表示され、しばらく待つ必要があります
    
<img src="/images/cursor/057.png" alt="flutter">

  - 次にメールアドレスを入力し、`indexing repository`をクリックすると分析が開始されます

<img src="/images/cursor/058.png" alt="flutter">

  - 分析が完了すると、ホームページでインデックス化された内容を検索できるようになります

<img src="/images/cursor/059.png" alt="flutter">

## 応用シナリオ
  - 新人が複雑なプロジェクト構造を迅速に理解するのを支援し、学習コストを削減します。共有ドキュメントを通じてチームのコラボレーション効率を向上させます。

  - ドキュメント不足の問題を解決します。オープンソースのコンテンツに公式ドキュメントがない場合、理解するのが難しいことがあります。

  例：RSでは過去に`lottie`という第三者ライブラリを使用してアニメーションを表示していました。ここではAIを使って最適化の余地があるかどうかを確認します

<img src="/images/cursor/060.png" alt="flutter">

  第三者ライブラリを使用する際に締め切りが短い場合、ソースコードを詳しく見る時間がない可能性があります。このような場合、AI提案に従って最適化することができます。例えばリソースの最適化：

<img src="/images/cursor/061.png" alt="flutter">

## 課題
* 精度の検証：AI生成コンテンツには誤差がある可能性があり、特に複雑なロジックや極端なケースでは人間による検証と組み合わせる必要があります。

## 公式ドキュメント
* https://deepwiki.com/deepskies/DeepWiki/1-home 
