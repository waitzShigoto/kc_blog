---
layout: post
title: 加速あなたのWebRtcとMqttの理解：用語解説ノート共有
date: '2022-02-14 13:50:12 +0800'
image: cover/mqtt-noun-1.png
tags:
  - Coding
categories: Others
excerpt: >-
  この記事では、WebRtcとMqttの用語解説ノートを整理し、これらの技術の応用と原理をより深く理解できるようにします。WebRtcとMqttに興味があるなら、この記事は見逃せません！
---

## 前書き
  - `Androidの仕事の要件`で出会ったため、

MqttとwebRtcを接続する必要があり、

いくつかの用語の意味を大まかに理解しましたが、

この部分は主にバックエンドが担当しています。

ここではAndroidエンジニアとして大まかに理解し、

記録しておき、将来出会ったときに素早く思い出せるようにします。

##  MQTT ノート
  - <a> QoS (Quality of Service)</a> : メッセージ送信サービスの品質には3つのモードがあります
    * <a>At most once</a>  : 最大1回、パケットが失われやすく、データの受信を気にしない環境に適しています。次回のパブリッシュがすぐにプッシュされるため

    * <a>At least once</a> : 少なくとも1回、パケットが必ず届くことを保証しますが、重複したパケットを受信する可能性があります

    * <a>Exactly once</a>  : 正確に1回、パケットが1回だけ届くことを保証しますが、重複パケットやパケットの紛失が発生した場合、エラーハンドリングが必要で、リソース消費が多くなります

    * <a> MQTT Header</a> : 固定2バイトで、消費が少ない

    * <a>MQTT Session</a>：MQTTクライアントがサーバーに接続するとき、'Clean Session'フラグでその状態を制御できます

      a. <a>'Clean Session' is 0</a> : 永続的なセッションに属し、クライアントが切断されても、セッションはタイムアウトするまで保持されます

      b. <a>'Clean Session' is 1</a> : 一時的なセッションに属し、クライアントが切断されるとセッションは破壊されます

    * <a>MQTT CONNECT Keep Alive </a>: MQTT接続時に、Keep Alive時間を表すバイトを持ち、何も送受信がない場合、PINGREQを送って状態を維持し、サーバーはPINGRESPで応答します。

     Keep Aliveタイムアウト時には接続を閉じます（通常の状態ではKeep Aliveタイムアウト*1.5がタイムアウト時間で、主にサーバー設定によります）。
    * <a>LWT (last will and testament)</a> : 一種の遺言の概念で、MQTTクライアントが異常な状態で切断された場合、例えば切断時にdisconnectを呼び出さなかった場合、サーバーはwillメッセージをプッシュします。
    * <a>MQTT retained message </a> : RETAINフラグを使ってretained messageを設定でき、retained messageはブローカーに保存され、このトピックをサブスクライブしている人に送信されます。また、1つのトピックには1つのretained messageしか存在できません。

## WebRtc関連
  - 以下の用語を理解する：
      * <a>Signaling</a> : デバイス間でメタデータや情報を交換するために使用されるもので、一般的にはSDPが使われます。WebRTC1.0ではSignalingの柔軟性を保つため、特に定義を強制していません ([参考記事](https://ithelp.ithome.com.tw/articles/10267612))

      * <a> SDP (Session Description Protocol)</a> : Signalingサーバーが通信時に持つデータ規範で、特定の文字が特定の情報を表すように定められています。例えば、vはプロトコルバージョン、sはセッション名、pは電話番号など

      * <a> STUN (Session Traversal Utilities for NAT) </a> : NATをサポートするネットワークプロトコルの一種で、STUNを通じて利用可能なデータを取得できます ([参考記事](https://www.netadmin.com.tw/netadmin/zh-tw/technology/D790BCA2F14F46B4A02EAAF008577963))

      例えば：公有IPの取得（実際のIP、NAT下のプライベートIPではない）、ポート
      * <a> TURN (Traversal Using Relay NAT) </a> : NATをサポートするネットワークプロトコル、その特徴：

         a. データ転送はサーバーを介して行われ、サーバーのリソースを消費する

         b. すべての呼び出しが環境全体で実行できることを保証する

         c. 通信過程でエラーが発生した場合、フォールバックを提供できる

      * <a> ICE (Interactive Connectivity Establishment) </a> : STUN & TURNの通信標準を規定するもの
      特徴：サーバー間の通信の最適な距離を見つけようとする
