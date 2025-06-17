---
layout: post
title: Cursor IDEを使用してコード開発を支援する
date: '2025-03-23 09:29:10 +0800'
image: cover/cursor-ide-cover.svg
tags:
  - cursor
permalink: /cursor-ai-note
categories: AI
excerpt: Cursorとは？
---

## 実際の効果
* IDE内に統合されたAIチャットを通じて、`自分でコードを書かなくても`アプリ開発が可能
<img src="/images/cursor/001.gif" alt="flutter">

* `特定の部分だけ`AIと対話することもでき、`エディタのカーソル位置`で直接`cmd+k`を使用できます。
<img src="/images/cursor/002.png" alt="flutter">

#### 目次
* [特徴](#feature)
* [使用手順](#usage-steps)
* [成果](#results)
* [使用テクニック](#tips)
* [Cursor IDEの個人設定共有](#personal-config)
* [感想](#thoughts)
* [おすすめサイト](#useful-sites)

<a id="feature"></a>
## Cursorの特徴
* Cursorはvscodeベースで作られた`IDE`です
  - 内蔵AIチャット機能があり、AIにプログラムを開発させ`直接ファイルを修正`してもらえます
  - `チャット中にファイルを指定してAIにリファレンスとして提供`でき、より正確な結果が得られます
  <img src="/images/cursor/003.png" alt="flutter">

* Cursorは一般的なLLMの設定をサポート
   - 自分が慣れているAIを使って開発できます

<img src="/images/cursor/004.png" alt="flutter">

   - 自分のAPIキーも使用できます

<img src="/images/cursor/005.png" alt="flutter">

* `Cursor Tab`：コーディング中にIDEがコードに基づいて提案します。他のIDEのタブ補完や提案に似ています。
    - `無料ユーザー`：2000回の提案制限があり、無料です。
    - `プロフェッショナルおよびビジネスユーザー`：支払い後、無制限のCursor Tab提案が利用可能です。
* `Cursor Composer`：IDE内で直接プログラムコードを書いてファイルを修正でき、プロンプトだけでコードを書く`真の`体験を実現します。
* `CmdK`：IDEのコード編集ページでAIを直接使用してコードを修正できます。カーソル位置で直接ショートカットキー`cmd+k`を使用します
  <img src="/images/cursor/006.png" alt="flutter">

* `.cursorrules`：AIに`基本ルール`を設定でき、AI開発をより正確にしてエラーを減らせます。
    - `ルートディレクトリ`に`.cursorrules`ファイルを作成し、関連するプロンプトを設定できます
    - または直接`setting > General > Rule for AI`でグローバルルールを設定できます
* `.cursorignore`：AIに対して`無視するファイル`を設定できます。
* チャット中に`@`を入力して関連するリファレンスを取り込むことができます
  <img src="/images/cursor/007.png" alt="flutter">

<a id="usage-steps"></a>
## 使用手順
* まず公式サイトからcursorを`ダウンロードしてインストール`：https://www.cursor.com/
* プロジェクトを開く
    - open projectをクリックしてプロジェクトを開く

      <img src="/images/cursor/008.png" alt="flutter">

* 右上の<img src="/images/cursor/009.png" alt="flutter">
をクリックしてチャットウィンドウを展開
  またはショートカットキー`CTRL / CMD + l`を使用

  <img src="/images/cursor/010.png" alt="flutter">

* Cursorの特徴は、AIに参照させるファイルを指定できること。`+ Add context`をクリックしてファイルを選択できます

  <img src="/images/cursor/011.png" alt="flutter">

  <img src="/images/cursor/012.png" alt="flutter">

* または対話ボックスに直接`@codebase`と入力すると、cursorはコードベース全体を参照として使用します

  <img src="/images/cursor/013.png" alt="flutter">

* その他は一般的なAIチャットと同様で、llmモデルの切り替えや画像のアップロードなどができます

  <img src="/images/cursor/014.png" alt="flutter">

* AIに手伝ってほしい内容を入力します
    - 例：よく使われる方法として、画像をAIに入れてプロンプトを追加し、AIに作成してもらう

      <img src="/images/cursor/015.png" alt="flutter">

* 次はコードマージのようなプロセスで、AIが変更した内容をレビューします
    - チャットウィンドウで直接acceptまたはrejectをクリックできます

      <img src="/images/cursor/016.png" alt="flutter">

    - または直接ファイルに移動してクリックすることもできます

      <img src="/images/cursor/017.png" alt="flutter">

<a id="results"></a>
## 成果
* `claude-3.5.sonnet`で生成された結果は、UIの図に非常に近いものになりました
    - 後で行う必要があるのは、`UI/UXで設定された詳細`に基づいて各コンポーネントの間隔、サイズ、色、画像リソース、コード結合度のレビューなどの調整だけです

      <img src="/images/cursor/018.png" alt="flutter">

* または新しい文字列がある場合、まずAIに生成してもらい、後で微調整するという方法も便利です

  <img src="/images/cursor/019.png" alt="flutter">

<a id="tips"></a>
## 使用テクニック
#### `.cursorrules`と`.cursorignore`を適切に活用する
* `.cursorrules`の設定
    - (Global) setting > Generalの Rules for AIでcursor ruleを設定できます
      <img src="/images/cursor/020.png" alt="flutter">

    - (このプロジェクトのみ) もう一つの方法はプロジェクト内に`.cursorrules`を作成すること
      <img src="/images/cursor/021.png" alt="flutter">

    - Project rule（プロジェクト固有のルール）：Setting > Project Rule > +Add new rule > ファイル名を直接入力してEnterを押すと、プロジェクト内の`../.cursor/xxx.mdc`に.mdcファイルが作成されます
      <img src="/images/cursor/022.png" alt="flutter">

* `.cursorignore`の設定
    - [ドキュメント](https://docs.cursor.com/context/ignore-files)
    - `ルートディレクトリ`に`.cursorignore`ファイルを作成し、無視したいファイル/フォルダを追加します

      <img src="/images/cursor/023.png" alt="flutter">

    - ルールは.gitignoreに似ており、設定するとcursorAIが`インデックス（またはスキャン）`するときに指定されたファイルを含めません
        - 不要なファイルのスキャンに無駄な時間を節約できます
        - また、機密データやファイルを追加して、機密情報の漏洩やAIプロバイダのサーバーへのアップロードを防止できます
        - ただし、公式では現在、無視するインデックスを最大限に達成するよう努力していると述べています

          <img src="/images/cursor/024.png" alt="flutter">

          最大限に以下を達成しようとしています

          <img src="/images/cursor/025.png" alt="flutter">

    - これは.gitignoreをベースにしており、`.gitignore`が既に存在する場合はそれを基礎とします
    - 場所がわからない場合は、IDE内の`Cursor Setting > Feature > Codebase indexing > Ignore file > Configure ignored files`から見つけることができます

      <img src="/images/cursor/026.png" alt="flutter">

* `.cursorindexingignore`
    - このファイルは.gitignoreの関連内容を自動的に継承します
        - cursorがコードベースをインデックス化して参照することを知っているため、このファイルの概念は主に大きなファイルや開発に不要なバイナリファイルを除外して、チャットの全体的なパフォーマンスを向上させることです

          <img src="/images/cursor/027.png" alt="flutter">

    - また、不要なファイルがデフォルトで設定されていますが、内容が長いので必要に応じて[ドキュメント](https://docs.cursor.com/context/ignore-files)を確認してください

      <img src="/images/cursor/028.png" alt="flutter">

* `.cursorignore`と`.cursorrules`の設定はgitからダウンロードして参考にできます
  http://192.168.201.72:8080/admin/repos/CursorConfig,general

#### AIチャット
* 入力が多すぎてAIが処理できない場合は、内容を小さく分割したり、範囲を狭めたり、プロンプトをより明確に書くことをお勧めします。
* Cursorチャットウィンドウでは、`@`を入力して特定のタイプのコンテンツをAIのリファレンスとして設定できます
    - 例：`@Doc`で、ドキュメントを参照として追加できます。サードパーティAPIなどがある場合、直接渡して参照させることができます（@Docは現在、URL型のドキュメントの追加のみをサポートしています）

      <img src="/images/cursor/029.png" alt="flutter">

      <img src="/images/cursor/030.png" alt="flutter">

* `git`を活用する：ファイルの変更をこまめに保存しましょう。cursorは直接ファイルを修正するため、もしacceptした後に要件に合わないことがわかった場合でも、前のポイントに戻すことができます（`全体の変更に適しています`）
* `チャットルーム`内の`restore`を活用する：現在の対話で行われた修正結果を復元できます（`単一の変更に適しています`）

  <img src="/images/cursor/031.png" alt="flutter">

#### 設定
* `Cursor setting > General > Private mode`のドロップダウンメニューでプライバシーモードを有効にできます

  <img src="/images/cursor/032.png" alt="flutter">

* Cursorに参照させたいMCP Serverがある場合は、`Cursor setting > feature > MCP Server`で追加できます

  <img src="/images/cursor/033.png" alt="flutter">

* `Cursor setting > feature > Docs`で対応するドキュメントを追加し、AIチャットのデフォルトの参照項目にすることができます

  <img src="/images/cursor/034.png" alt="flutter">

#### Git

* Cursor IDEには`source control`というgit guiが提供されており、クリックでgit操作を直接行うことができます

  <img src="/images/cursor/035.png" alt="flutter">

    - commit messageフィールドの`右端`には、`generate commit message`機能があり、現在のgit graph内のcommit messageに基づいて生成します

      <img src="/images/cursor/036.png" alt="flutter">

    - ただし、現在の実験ではAirDroidのデフォルトテンプレートを生成できず、ローカルのgitにデフォルトのフォーマットを追加しても同様です。
      `期待値`：<img src="/images/cursor/037.png" alt="flutter">

      `実際`：<img src="/images/cursor/038.png" alt="flutter">

* もう一つの方法は、`Chat`内で`@Commit generate commit message`を使って指定された形式を生成することです。これは実験的に私たちのデフォルトテンプレートを生成できることが確認されています

  <img src="/images/cursor/039.png" alt="flutter">

<a id="personal-config"></a>
## Cursor IDEの個人設定共有
* IDEの左側を`縦方向`に変更する
    - ショートカットキー`CTRL/CMD + Shift + P`でコマンド機能を開く
    - `Setting.json`と入力し、`Preferences: Open User Settings (JSON)`をクリック

      <img src="/images/cursor/040.png" alt="flutter">

    - Jsonファイルにキー`workbench.activityBar.orientation`、値`vertical`を追加し、Cursorを再起動

* `.cursorrules`
    - 各プロジェクトの要件に応じて追加します。よく使用するものを共有します
      ```
      - Don't make assumptions. 
      - Don't silently fix errors
      - Use my existing theme for colors,typography and spacing. 
      - Ask questions when uncertain about my code or design. 
      - Provide a list of tasks for accomplishing an implementation.
      - always include a :) at the end of your response
      ```
      （ここでの`include a :)`は現在の`.cursorrules`が有効かどうかを確認する方法です）
    - インターネット上の[cursorディレクトリ](https://cursor.directory/)を併用して生成します
* プラグインのインストール
    - cursorは現在vscodeをベースにしており、デフォルトではkotlin関連リソースがありません。kotlinがcursor内で認識されるようにするには、
      プラグインをダウンロードします（これはAIのパフォーマンスには影響しませんが、IDE内で.ktファイルを識別できるようにします）
    - `MARKPLACE`または`EXTENSION`を見つけて検索すれば見つかります
    - 自分のニーズに応じて他のプラグイン（git、javaなど）をインストールします

      <img src="/images/cursor/041.png" alt="flutter">

<a id="thoughts"></a>
## 感想
* Cursor IDEは複数の機能を統合し、AIによる開発プロセスをよりシンプルにしています。AIの提案内容を既存のプロジェクトに直接適用できるなどの機能があります
    - ただし残念なことに、これは`vscode`をベースに拡張されたIDEなので、Android Studioのようなアンドロイド関連機能はありません
    - 海外の上級者は、cursorでコードを生成し、ASでコードをビルド・デバッグするような使い方をしています。例：[I Made an Android App in MINUTES with This AI Tool](https://www.youtube.com/watch?v=FbCA_qQSvYM)
* 今日`Android開発ではなく`、初めて触れる言語のプロジェクトを行う場合、`理論的には`ファイルを配置する場所をより速く知ることができ、より早く入門できます。また`関連する仕事をしていない人でも、開発を素早く学ぶことができます`。
* AIで生成することは確かに便利ですが、なぜそのように書かれているのかを理解することをお勧めします。そうすれば、AIの書き方を受け入れるかどうかを判断できます。
* [価格](https://www.cursor.com/cn/pricing)：無料で使える回数があるので、まずは試用して自分の開発スタイルに合うかどうかを確認してから購入を決めるといいでしょう。

  <img src="/images/cursor/042.png" alt="flutter">

* 私の無料期間が終了し、`cursor composer`がロックされ、以前のAIモデルも使用できなくなりましたXD。
  しかし、完全に無料の`chat`（チャットのみ使用可能）が提供されており、モデルを`cursor-small`に設定すれば、まだ無料で使うことができます。

  <img src="/images/cursor/043.png" alt="flutter">

<a id="useful-sites"></a>
## おすすめサイト
* [cursor使用ドキュメント](https://cursor.document.top/tips/usage/basic-setting/)
* [cursorディレクトリ](https://cursor.directory/) ：いくつかの`.coursorrule`設定を検索できます
* [cursorリスト](https://cursorlist.com/) ：いくつかの`.coursorrule`設定を検索できます
* [cursor maker](https://cursorrules.agnt.one/chat)：Web上のAIチャットを使用して`.coursorrule`設定を生成します
* [Generate Cursor Project Rules](https://cursor.directory/generate)：Web上のAIチャットを使用して`.mdc`設定を生成します
* [ユーザーがまとめたcursor rule](https://github.com/PatrickJS/awesome-cursorrules) 
