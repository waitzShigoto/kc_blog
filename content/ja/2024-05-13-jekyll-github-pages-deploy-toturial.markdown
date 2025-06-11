---
layout: post
title: "【デプロイ手順】Github PagesをJekyll 4.x以上のバージョンに移行する方法 - 2024年5月適用"
date: 2024-05-13 14:21:13 +0800
image: cover/jekyll_github_deploy.png
tags: [Jekyll,html,githubpages]
permalink: /jeykll_deploy_4_x
categories: Jekyll部署
excerpt: "この記事では、Github PagesサイトをJekyll 4.x以上のバージョンに移行するための詳細なガイドを提供しています。各設定ステップを網羅し、Jekyllの最新バージョンの強力な機能をスムーズにアップグレードして享受できるようにしています。"
---

## 前言
私最近ウェブサイトのレイアウトを少し変更しました

そしてCSSでrgb()関数を使用したいと思いました

しかし、Jekyll 3.9.xバージョンではこの機能を使用できないことがわかりました

これにより、Jekyllのバージョンを4.x以上にアップグレードせざるを得ませんでした

アップグレード後、非常に興奮しました

ローカルで `bundle exec jekyll serve` を実行してテストしました

すべてがうまく動作しているように見えました

しかし、変更をGitHubリポジトリにプッシュした後

いくつかの問題に直面しました

GitHub Pagesにデプロイする際にエラーメッセージが表示されました

`GitHub Pages: github-pages v231 GitHub Pages: jekyll v3.9.5 `
<img src="/images/jekyll_deploy/001.png" alt="jekyll deploy 4.x" />

問題はGitHub Pagesの設定にありました

これにより、デフォルトの設定では更新を正常にデプロイできませんでした

GitHub Pagesは無料で使用制限があるサービスであることを考えると

それが`デフォルト`で最新バージョンのJekyllをサポートしていないのも理解できます

したがって、自分で手動で調整するしかありませんでした

以下は何度も失敗した後の

<img src="/images/jekyll_deploy/007.png" alt="jekyll deploy 4.x" />

ついにビルドに成功したメモです

皆さんと共有します

## 部署步驟
<div class="c-border-content-title-1">1. 調整部署方式</div>

まず、デプロイするリポジトリに入ります

そして設定ページに入ります

<img src="/images/jekyll_deploy/002.png" alt="jekyll deploy 4.x" />

次に、Code and automationの下のPagesを順にクリックします
`Source`でGitHub Actionsを選択します 

<img src="/images/jekyll_deploy/003.png" alt="jekyll deploy 4.x" />

その後、自分の環境を設定し始めます...

<div class="c-border-content-title-1">2. 設置ruby版本</div>

Jekyllプロジェクトをビルドする際にはrubyが必要です

rubyをインストールすると、システムにデフォルトバージョンが設定されます

Jekyllをビルドする際に

rubyバージョンを指定しない場合

Jekyllはデフォルトのシステムバージョンを使用します

このコマンドを使用してバージョンを確認します
<script src="https://gist.github.com/waitzShigoto/9002c7e6d63823d0c59dc2c4720e323d.js"></script>

GitHubにデプロイしてJekyll 4.xバージョンを使用するためには

ruby 3.2.3バージョンが必要です

3.2.3がない場合は、いくつかのツールを使用してインストールできます

ここでは、私のコンピュータにrbenvがインストールされているので

rbenvを例にします

<script src="https://gist.github.com/waitzShigoto/e02a03b088c850d4c4bb6802295d7704.js"></script>
もちろん、他の一般的なコマンドツールも使用できます

例：RVM、chruby、またはasdf

各自の習慣に応じてrubyを調整、インストールしてください~

最後に、Jekyllプロジェクトのルートディレクトリの下に

`.ruby-version`ファイルを作成する必要があります

類似の指令を使って直接行うことができます

<script src="https://gist.github.com/waitzShigoto/bce26899b505b01d4380bbbd2ae29ebb.js"></script>

または手動で作成することもできます

<img src="/images/jekyll_deploy/004.png" alt="jekyll deploy 4.x" />

ファイルの内容はバージョン番号です

<img src="/images/jekyll_deploy/005.png" alt="jekyll deploy 4.x" />

<div class="c-border-content-title-1">3. Jekyllプロジェクトのビルド</div>

rubyのインストールが完了したら、Jekyllプロジェクトの設定を始めます

まず、`Gemfile`に以下の設定を行います

ruby 3.2.3版を導入します 

`ruby "3.2.3"`

次に使用するJekyllのバージョンを設定します

`gem "jekyll", "~> 4.3.3"`

必要な指令は以下の通りです：

<script src="https://gist.github.com/waitzShigoto/b64bfac8864bd597792c65ec75b9f099.js"></script>

完全な設定は以下の通りです

参考にしてください

私が使用しているいくつかのJekyllプラグインも含まれています

必要に応じて追加してください

<script src="https://gist.github.com/waitzShigoto/67631c36472fc3781800e847033d5250.js"></script>

次に、Jekyllのルートディレクトリで以下を実行します

<script src="https://gist.github.com/waitzShigoto/f860bebfabda529bd7bb3d21e51467ae.js"></script>
これは`Gemfile.lock`ファイルを生成し、プロジェクトが正常に実行できるようにするためです

生成後、以下を使用して

`bundle exec jekyll serve`でテストし、正常に動作するか確認します

成功すると以下のメッセージが表示されます

<img src="/images/jekyll_deploy/006.png" alt="jekyll deploy 4.x" />

<div class="c-border-content-title-1">4. GitHub CIファイルの設定</div>

最後に、

GitHubの自動デプロイ設定ファイルを設定する必要があります。

通常、`.yml`を使用して設定します。

こちらが公式推奨のJekyll初期設定です：<a href="https://github.com/actions/starter-workflows/blob/main/pages/jekyll.yml
">公式推奨</a>

公式推奨の`.yml`ファイルの数行を変更するだけです：

- ターゲットブランチを調整します：

  `branches: ["master"]`

- 使用するRubyを指定します：

  `uses: ruby/setup-ruby@v1`

- Rubyのバージョン：

  `ruby-version: '3.2.3'`

以下が最終的な完全な`.yml`設定です

そのまま使用して修正することができます

<script src="https://gist.github.com/waitzShigoto/4f7e0968d7028a9c23e5749db9cc91e8.js"></script>

## まとめ
実際の手順は非常に簡単です

ruby環境、Jekyll、GitHub環境を設定するだけです

最終的に`git push remote branch`でパッチをプッシュすれば

GitHub Actionsがウェブサイトをビルドしてくれます

そしてデプロイ設定を追加すれば、自動的にGitHub Pagesにデプロイされます

ただし、デプロイ設定は公式のサンプルに既に含まれています

変更が必要なのはrubyの環境とターゲットブランチだけです~

成功しました
<img src="/images/jekyll_deploy/008.png" alt="jekyll deploy 4.x" />
