---
layout: post
title: "How to Test Sending FCM Messages via CLI in Android"
date: '2026-06-10 11:30:00 +0800'
image: cover/generated/2026-06-10-android-cli-fcm-test-cover.png
tags:
  - Android
  - Firebase
  - CLI
permalink: /android-cli-fcm-test
categories: Android
excerpt: Learn how to test Firebase Cloud Messaging (FCM) by sending messages directly to a single Android device using the Google Cloud SDK (gcloud) and curl.
---

Testing Firebase Cloud Messaging (FCM) notifications is a crucial part of Android development. While the Firebase Console provides a graphical interface for sending test messages, using the Command Line Interface (CLI) is much more flexible and efficient for developer workflows and automation.

This article details how to use **gcloud + curl** to call the FCM HTTP API and send test messages to a single target device.

---

## 1. Install Google Cloud SDK (macOS)

First, install the Google Cloud SDK, which is required to obtain authorization credentials:

```bash
brew install --cask google-cloud-sdk
```

---

## 2. Login and Set Project

Authenticate with gcloud and set your default Firebase project ID:

```bash
# This command will open a browser window to complete authentication
gcloud auth login
gcloud config set project <your-firebase-project-id>
```

---

## 3. Retrieve FCM Token

Launch your app on the target Android device to get the FCM registration token. You can retrieve it from Logcat using `adb`:

```bash
adb logcat -s FCMRepository FIMessage | grep -i "FCM Token"
```

Copy the token value from the logs and set the following environment variables in your terminal:

> [!TIP]
> Alternatively, you can just paste these values directly into the commands. I personally prefer not to configure them as environment variables because the FCM token and access token change frequently, and redefining environment variables constantly can be tedious.

```bash
export FCM_TOKEN="<paste-your-token-here>"
export PROJECT_ID="<your-firebase-project-id>"
export ACCESS_TOKEN="$(gcloud auth print-access-token)"
```

---

## 4. Send a Data Message

Data messages are handled directly by the client app's background services and do not trigger default notification banners automatically.

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

## 5. Send a Notification Message

Notification messages are managed directly by the Android OS system tray when the app is in the background.

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

## 6. Send a Notification + Data Message

You can send both notifications and data payloads. Clicking the notification can trigger custom navigation based on the key-value data:

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

## 7. Refresh Access Token (Upon Expiration)

Gcloud access tokens expire after 1 hour. If you receive authentication errors, refresh your environment variable using:

```bash
export ACCESS_TOKEN="$(gcloud auth print-access-token)"
```

---

## 8. Verify Device Logs

Monitor device logs using `adb` to check if your message is successfully received and parsed:

```bash
adb logcat -s FIMessage
```

---

## 9. Re-authenticate on Permission Errors

If you encounter permission errors (like `PERMISSION_DENIED`), try logging in again and setting up application default credentials:

```bash
gcloud auth login
gcloud auth application-default login
```
