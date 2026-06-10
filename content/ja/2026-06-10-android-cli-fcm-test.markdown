---
layout: post
title: "Android で CLI を使用して FCM メッセージの送信テストを行う方法"
date: '2026-06-10 11:30:00 +0800'
image: cover/generated/2026-06-10-android-cli-fcm-test-cover.png
tags:
  - Android
  - Firebase
  - CLI
permalink: /android-cli-fcm-test
categories: Android
excerpt: gcloud と curl を使用して FCM HTTP API を呼び出し、単一の Android デバイスへプッシュ通知をテスト送信する手順を解説します。
---

Android アプリの開発において、FCM（Firebase Cloud Messaging）のプッシュ通知テストは不可欠です。Firebase Console の管理画面からもテストメッセージを送信できますが、開発効率や自動化テストの観点からは、コマンドラインインターフェース（CLI）から送信する方が柔軟で便利です。

本記事では、**gcloud + curl** を用いて FCM HTTP API を呼び出し、特定のデバイスにテストメッセージを送信する手順を紹介します。

---

## 1. Google Cloud SDK のインストール（macOS）

まず、認証用トークンを取得するために Google Cloud SDK をインストールします。

```bash
brew install --cask google-cloud-sdk
```

---

## 2. ログインとプロジェクト設定

gcloud で認証を行い、対象となる Firebase プロジェクトを設定します。

```bash
# ブラウザが起動し、ログインを求められます
gcloud auth login
gcloud config set project <your-firebase-project-id>
```

---

## 3. FCM トークンの取得

Android デバイス上でアプリを起動し、FCM 登録トークンを取得します。adb を使って Logcat をフィルタリングすることで簡単に見つけることができます。

```bash
adb logcat -s FCMRepository FIMessage | grep -i "FCM Token"
```

ログに出力されたトークンをコピーし、ターミナルで以下の環境変数を設定します。

> [!TIP]
> もちろん、環境変数を設定せずにコマンドへ直接値を入力（または貼り付け）して実行しても構いません。FCM トークンやアクセストークンは頻繁に変更されるため、その都度環境変数を再設定する手間を省きたい場合は、直接指定する方が便利です。

```bash
export FCM_TOKEN="<取得したトークン>"
export PROJECT_ID="<your-firebase-project-id>"
export ACCESS_TOKEN="$(gcloud auth print-access-token)"
```

---

## 4. データメッセージの送信 (Data Message)

データメッセージは、アプリのバックグラウンドサービスによって直接処理され、通知センターに自動でポップアップを表示しません。

```bash
curl -X POST "https://fcm.googleapis.com/v1/projects/$PROJECT_ID/messages:send" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "'"$FCM_TOKEN"'",
      "data": {
        "key1": "value1",
        "key2": "value2"
      }
    }
  }'
```

---

## 5. 通知メッセージの送信 (Notification Message)

通知メッセージは、アプリがバックグラウンドにある場合、Android システムによって通知領域に直接表示されます。

```bash
curl -X POST "https://fcm.googleapis.com/v1/projects/$PROJECT_ID/messages:send" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "'"$FCM_TOKEN"'",
      "notification": {
        "title": "Test Title",
        "body": "Test body message"
      }
    }
  }'
```

---

## 6. 通知＋データメッセージの送信 (Notification + Data)

通知とデータを組み合わせて送信することで、通知をタップしたときにカスタムデータを基にして特定の画面へ遷移させることができます。

```bash
curl -X POST "https://fcm.googleapis.com/v1/projects/$PROJECT_ID/messages:send" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "'"$FCM_TOKEN"'",
      "notification": {
        "title": "Hello",
        "body": "Tap to open"
      },
      "data": {
        "screen": "home",
        "item_id": "99"
      }
    }
  }'
```

---

## 7. アクセストークンの再取得（有効期限切れの場合）

gcloud で生成されたアクセストークンの有効期限は通常 1 時間です。期限切れエラーが発生した場合は、以下のコマンドで環境変数を更新してください。

```bash
export ACCESS_TOKEN="$(gcloud auth print-access-token)"
```

---

## 8. デバイスログの検証

アプリがメッセージを正しく受信できているかを Logcat から確認します。

```bash
adb logcat -s FIMessage
```

---

## 9. 権限エラー時の再ログイン

権限や認証関連のエラー（`PERMISSION_DENIED` など）が発生した場合は、再ログインとアプリケーションのデフォルト認証情報の再設定を行います。

```bash
gcloud auth login
gcloud auth application-default login
```
