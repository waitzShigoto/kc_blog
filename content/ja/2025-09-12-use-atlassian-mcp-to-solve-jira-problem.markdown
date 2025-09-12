---
layout: post
title: 'Atlassian MCPを使用してJira Issueを取得し、問題を迅速に解決する'
date: '2025-09-12 18:31:48 +0800'
image: cover/default-cover.jpg
tags:
  - AI
  - MCP
permalink: /use-atlassian-mcp-to-solve-jira-problem
categories: AI
excerpt: >-
  新製品開発期間中のJira Issue解決チャレンジ。新製品開発段階では、通常、多方面の協力的なテスト期間に入ります。このMCPを使用してJira Issueを取得し、問題解決を支援します。
---

## はじめに

* 新製品開発期間中のJira Issue解決チャレンジ
  - 新製品開発段階では、通常、多方面の協力的なテスト期間に入ります。例：テスト、製品、BOSS、UI、フロントエンド、バックエンド、モバイル...など
  - 継続的な反復調整：要件仕様と発見された問題に対する繰り返し修正
  - 多角度検証：異なる役割がそれぞれの専門的な観点からフィードバックと問題を提起
  - 集中爆発期：特定の期間内でissue数が急激に増加する可能性

* そこで後にこのMCPを見つけました
Jira issueを取得し、問題解決を支援するために
https://github.com/sooperset/mcp-atlassian


## MCP設定
* 設定にmcp-atlassianを追加（主にJIRA_USERNAMEとJIRA_API_TOKENの入力が必要）
```json
{
    "mcpServers": {
        "mcp-atlassian": {
            "command": "docker",
            "args": [
            "run", "-i", "--rm",
            "-e", "JIRA_URL", "-e", "JIRA_USERNAME", "-e", "JIRA_API_TOKEN",
            "ghcr.io/sooperset/mcp-atlassian:latest"
            ],
            "env": {
            "JIRA_URL": "http://your-jira_url/",
            "JIRA_USERNAME": "Your user name",
            "JIRA_API_TOKEN": "Your token or password"
            }
        }
    }
}
```


* Dockerを使用するため
コマンドを使用
```
docker run -it --rm \
  -e JIRA_URL=http://192.168.40.37:8080 \
  -e JIRA_USERNAME=bot \
  -e JIRA_API_TOKEN=xmtb.2025 \
  ghcr.io/sooperset/mcp-atlassian:latest
```
Macの場合、Dockerアプリケーションを開く必要もあります
<img src="/images/mcp/001.png" alt="mcp">
Windowsの場合、コマンドだけで開けるかどうかは不明です（皆さんで試してみてください）

* 上記のユーザー名とパスワードが正しい場合
MCPが有効になっていることがわかります
<img src="/images/mcp/002.png" alt="mcp">

## 経験の共有
#### 開始クエリリファレンス

* 基本検索
project = ABC AND assignee = "Your assignee"

* 複数ステータス検索
status IN ("待处理", "处理中", "重新打开")

* 優先度検索
priority = High

* 時間範囲検索
created >= "2025-01-01"
updated >= -7d

* 組み合わせ検索
project = ABC AND assignee = "Your assignee" AND status IN ("待处理", "处理中", "重新打开") AND priority = High

* 使用例（プロジェクトで以下のプロンプトを使用）：
    ```
    jira_get_project_issuesを使用して あなたの プロジェクト内の
    重新打开, 处理中, 待处理で　Your assignee　が担当するissueを取得
    project = ABC AND assignee = "Your assignee" AND status IN ("重新打开", "处理中", "待处理")

    プロジェクト: project = ABC
    担当者: assignee = "Your assignee"
    ステータス: status IN ("待处理", "处理中", "重新打开")
    優先度: priority = High
    時間範囲: created >= "2025-01-01"

    すべてのJira issueを分析した後、issue番号、問題説明、対応するclass...などを含むテーブルに整理し、
    .mdファイルを作成
    ```
#### markdownを作成した後、この.mdをどう使うか考える

* 上記の共有を通じて、または自分で考えた類似のプロンプトを使用して、このような内容を生成：
```markdown
### **【メイン機能】関連Issue**
| Issue番号 | 問題説明 | 対応するAndroidクラス | 関連ファイル |
|-----------|----------|----------------------|-------------|
| ABC-1 | グループ名が長すぎて、リストグループ名の表示が不完全 | `PublishedChatScreen.kt` | `ui/drawer/` |
| ABC-2 | メンバーログイン、チャット履歴モジュールに入る、[全部]がない | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-3 | ボット/ワークフロー、メッセージプッシュを受信できない | `ConversationViewModel.kt`<br/>`PushNotificationViewModel.kt` | `ui/conversation/`<br/>`ui/push/` |
| ABC-4 | 一級グループ「チャットボット」に二級グループがあるが、Androidではすべてメインページに表示 | `ConversationViewModel.kt` | `ui/conversation/` |
| ABC-5 | 検索ボックスのプレースホルダーに検索名、備考、作成者と表示されるが、実際には名前のみ検索可能 | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-6 | 新しい会話Q&Aに入った後、AI回答後に会話メインページに戻る、手動更新、会話が会話履歴に表示、赤いドット表示 | `ConversationViewModel.kt` | `ui/conversation/` |
| ABC-7 | 会話履歴の最後の文字が正常に表示されない | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-8 | チャット履歴が空、ボットなしと表示 | `ConversationScreen.kt`<br/>`EmptyState.kt` | `ui/conversation/`<br/>`ui/
```

* 次に、AI生成されたテーブル内容がプロジェクトの実際のアーキテクチャと一致するかを検証する必要があります。実際の経験に基づくと：
    - `高精度部分`：APIを通じて取得されたissueと問題説明は通常正しく対応できる
    - `検証が必要な部分`：対応するクラス名の精度は100%に達しない
    - `考えられる理由`：LLMは主に問題説明とクラス命名規則に基づいて推測的対応を行うため、偏差が避けられない

* 人工審査の必要性：生成結果後も人工審査が必要です。実務開発には複数の影響要因が存在するため：
     - 一般的な影響要因：
        - 言語の違い：テスト説明は中国語を使用する可能性があり、コードの英語命名と一致しない
        - 用語習慣：テスト担当者の説明用語と開発者のクラス命名ロジックに違いがある可能性
        - 抽象レベル：問題説明の抽象度と実際のコード構造が一致しない可能性

* 私の実際の行動の共有、AI支援テーブルと人工最適化：
    - `問題分析`
    issueの処理を開始する際、まずLLM生成の対応テーブルをチェック
    テーブル内のクラスマッピングが正しいかを検証
    - `経験判断`
    `プロジェクトへの熟知度に基づいて`、テスト説明を素早く閲覧
    開発経験に基づいて、正しいマッピングクラス範囲を初期判断
    - `検証と修正`
    AI生成内容が正しい場合 → 直接採用
    エラーがある場合 → 正しいクラス情報を対応テーブルに手動更新
    - `継続最適化ループ`
    issueを繰り返し処理する過程で、AI生成テーブルを徐々に修正
    テーブル内容をプロジェクトの実際のアーキテクチャにより近づけ、後続の開発効率を向上
    - `問題説明の最適化`
    問題説明はAIによって初期作成されるため、実際のコードとギャップがある可能性があることを知っているため、
    ここでも手動で少し調整できますが、不確実な場合はまずAIに試させることもできます

* したがって、問題解決プロセスにおいて、このテーブルはますます正確になります。後でAIに@xxxx.mdこの文書を参照させるだけで、
AIがより正確に問題解決を支援できます

#### その他選択的に行えること

* 私は現在のプロジェクトのアーキテクチャをAIに分析させることもあります
例：`私のプロジェクトアーキテクチャのナビゲーション構造を分析してください`
経験上、AIも必ずしも正しい結果を生成するとは限りません。上記のテーブル修正ロジックに従って、AI生成内容を徐々に修正できます<br>

* また、`個人的な感覚`では、通常、アーキテクチャが追跡可能で結合度が低いほど、AIが分析する.mdの品質が高くなります。比較的古い書き方に遭遇した場合、
まず人工またはAIに大まかに整理してもらってから分析すると、より良い結果が得られる可能性があります。

#### 実際の使用

* この方法を通じて、AIに自動的に問題を解決させる：
```
@Issue_Android_Class_Mapping.mdに基づいて
私のプロジェクトアーキテクチャを理解し
ABC-2の問題内容、期待される結果を理解する

問題内容、期待される結果に基づいて、この問題を解決してください

```