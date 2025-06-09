---
layout: post
title: "連接 Android アプリケーション：異なるプロセス間で簡単に通信するIPCソリューションのチュートリアル！"
date: 2022-04-15 15:36:28 +0800
image: cover/android-ipc-method-share-1.png
tags: [Android,Debug]
categories: Android教學
excerpt: "Androidアプリケーション間のプロセス間通信技術（IPC）を探求し、異なるプロセス間で簡単に通信し、より良い協力効果を達成する方法を紹介します。"
---

## 前書き

* 今日は「アプリケーション間通信」に関するソリューションを共有します。

  以前の仕事経験で、クライアントからこの分野について質問されたことがありました。

  そのため、関連情報を整理し、ここで皆さんと共有します。

  この共有は、複数のIPC関連ソリューションをカバーしており、

  この分野に関心のある方が一度に多くのソリューションを取得し、

  アプリケーション間の通信と協力を迅速に実現できるようにします。

## 一般的なAndroidアプリ層のIPCソリューション
  * `IPC科普：Inter-Process Communication`、プロセス間通信またはクロスプロセス通信と訳されます
    - `ContentProvider` : ネイティブコンポーネントで、外部インターフェースを提供します（このライブラリの追加、削除、変更、検索を実装）。異なるアプリ間でプロセスを超えて共通データにアクセスできます。
      - 使用シーン : 異なるアプリが共通データを必要とする場合に適しています。例えば、SQLデータベースへのアクセス、共通ファイルなど。また、連絡先や電話帳もこの方法を採用しており、他のアプリが取得できるようにしています。
      - データの更新状態を知るには、追加でObserverを登録する必要があります

    - `AIDL`：外部インターフェースの言語で、.aidlファイルを定義し、そのインターフェースを実装した後、バインダーを介してプロセス間のアクセスを実現します。入力、出力タイプをカスタマイズでき、マルチスレッドで複数のリクエストを処理できます

       - [公式 - AIDL 実装参考](https://developer.android.com/guide/components/aidl)
     ```
     Binder : Linuxカーネル下のドライバの一種
     ```
     

    - `Messenger`：公式が提供するソリューションで、AIDLに比べて軽量です。Handler、Messageを使用して実装し、同じくバインダーを介して動作しますが、一度に一つのリクエストしか処理できません

        - [公式- Messenger実装参考](https://developer.android.com/guide/components/bound-services#Messenger)

        

    - AIDL vs Messenger
       <table class="rwd-table">
         <thead>
           <tr>
             <th class="tg-vrid"></th>
             <th class="tg-vrid">特性</th>
             <th class="tg-vrid">開発上の違い</th>
             <th class="tg-vrid">使用時機</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td class="tg-3b1y">AIDL</td>
             <td class="tg-3b1y">1.リアルタイム通信
2.複数のリクエストを同時に受信し、同時に処理</td>
             <td class="tg-3b1y">1.  <span style="color:#DD496E;background-color:#181B1C">.aidl</span> でインターフェースの入力、出力を定義できる
開発が直感的で、呼び出し時に直接インターフェースを呼び出すだけ
             
2.複数のデータタイプ（Int、Stringなど）をサポート</td>
             <td class="tg-3b1y">インターフェースが多い場合
頻繁にリクエストを処理する必要がある場合</td>
           </tr>
           <tr>
             <td class="tg-3rup">Messenger</td>
             <td class="tg-3rup">1.リアルタイム通信
2.複数のリクエストを同時に受信するが、順番に処理</td>
             <td class="tg-3rup">1. サーバー側とクライアント側でそれぞれMessengerを作成する必要がある
Messageの送受信を処理するため<span style="font-weight:400;font-style:normal"></span>
2.Messageクラスを通じてデータを伝達</td>
             <td class="tg-3rup">インターフェースが少ない場合
時々リクエストを処理するだけで良い場合</td>
           </tr>
         </tbody>
       </table>

- `Socket` : 双方がIPを約束し、ローカルで接続を行い、C/S構造を形成してリクエストを処理する。展開範囲は広い（ローカルネットワーク内）。

  <table class="rwd-table">
  <thead>
    <tr>
      <th class="tg-vrid"></th>
      <th class="tg-vrid">性能</th>
      <th class="tg-vrid">安全性</th>
      <th class="tg-vrid">開発上の違い</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-3b1y">Binder</td>
      <td class="tg-3b1y">リクエストの転送は一度だけコピー</td>
      <td class="tg-3b1y">リクエストの転送はBinder層内に制限</td>
      <td class="tg-3b1y">インターフェースが多い場合
頻繁にリクエストを処理する必要がある</td>
    </tr>
    <tr>
      <td class="tg-3rup">Socket</td>
      <td class="tg-3rup">リクエストの転送は二度コピーが必要
</td>
      <td class="tg-3rup">リクエストの転送はローカルネットワーク全体に露出
</td>
      <td class="tg-3rup">インターフェースが少ない場合
時折リクエストを処理するだけでよい</td>
    </tr>
  </tbody>
  </table>

  - [コピー回数の違いの詳細はこちら](https://tw511.com/a/01/9215.html)

- `BroadCast` : Androidシステム内でアプリ間でブロードキャストを受信・送信する方法で、プロセス間で情報を交換する手法。

  - ブロードキャストの受信 ： ブロードキャストレシーバーを登録すると、ブロードキャストを受信できる。登録方法は2種類ある。

     1. 静的登録 : AndroidManifest.xml 内で登録すると、そのアプリが起動していない場合でも関連するブロードキャストを受信するとアプリが起動する。
     （Android 8.0以降は静的登録が削除された）
     2. 動的登録 : Contextを通じて登録。この方法ではcontextが存在する限りブロードキャストを受信する。

  - ブロードキャストの送信 ：

     1. `sendOrderedBroadcast`: 優先順位に従って、一度に一つのレシーバーがブロードキャストを受信し、途中で送信を停止することができる。
         - 複数のアプリのレシーバーの優先順位が同じ場合、最初にインストールされたアプリに送信される。
     2. `sendBroadcast` : ランダムな順序で全てのレシーバーに送信し、効率が高いが、全ての登録されたレシーバーに一度にデータを送信する。
     3. `LocalBroadcastManager.sendBroadcast` : 同じアプリ内でのみブロードキャストを送信する。

  - 特性 ：

     1. 同じブロードキャストを登録しているレシーバーは全てブロードキャストを受信できる。全体にブロードキャストが届かないようにするには、カスタム権限を追加して特定のアプリだけが受信できるようにする。また、Android 4.0以上では`setPackage(String)`を提供しており、特定のアプリに受信を設定できる。
     2. BroadcastReceiverを登録してブロードキャストを受信する際、onReceive()メソッドはメインスレッドで実行されるため、時間のかかる操作がメインスレッドに影響を与える可能性がある。したがって、操作は10秒以内に維持することが推奨される。

  - セキュリティ考慮 ：

     1. 第三者がカスタム権限文字列や設定されたpackageNameを取得し、自分のアプリに追加してブロードキャストデータを受信する可能性がある。
     2. ブロードキャストの名前はグローバルであるため、誰かが同じ名前で悪意のある登録を行うと、偽装してリクエストを送信することができる。

  - [公式 - ブロードキャスト関連](https://developer.android.com/guide/components/broadcasts)

##  Androidアプリ層のIPCソリューションで遭遇する可能性のあるセキュリティ問題

* インターフェースが未承認ユーザーに盗用される：
  - `BroadCast` :
    - ブロードキャストを送信する際、誰でもブロードキャスト内容を傍受できる。
      - 対策：
         1. Android 4 ではsetPackage(String)を使用してパッケージ名を指定して受信。
         2. 権限フィールドを追加し、同じフィールドを宣言しているアプリだけが受信できるようにする。
    - 権限やパッケージ名を指定した後、誰かがそのフィールドを取得したり、パッケージ名を偽装した場合、ブロードキャストを傍受・送信できる。
      - 対策：
         1. 関連コードを難読化し、解読時間を増やす。
  - `Socket`：
    - 公開インターフェースはローカルネットワーク全体に露出し、IPを知っている人は誰でも使用できる。
      - 対策：
         1. ユーザーの身元を確認（カスタムトークン：sha256、md5、aes、desなどで暗号化）、権限。
         2. Binder関連のIPCソリューションを使用し、露出範囲を減らす。
  - `AIDL`：
    - .aidlファイルを持っている人は、新しいクライアントを開発して接続できる。
      - 対策：
        1. インターフェースにアクセスしているUIDを確認（android.os.Process.myUid()）。
        2. アプリの権限`signature`を確認し、署名を持っているアプリだけがアクセスできるようにする：[権限ガイド](https://developer.android.com/guide/topics/manifest/permission-element?hl=zh-cn#plevel)。
  - `Messenger`：
    - bindService時に、`Intent().component = ComponentName("パッケージ名", "パッケージ名:サービス名")`を使用すると、パッケージ名やサービス名を知っている人も接続できる。
      - 対策：
           1. 上記のAIDLの解決策と同様に、UIDを確認し、署名を確認する。
  - `ContentProvider`：
    - contentProviderはURIを通じてデータベースの位置を特定するため、URIが漏洩するとデータを簡単に読み取ることができる。
      - URIが漏洩した後のその他の派生：
           1. drozerコマンドを使用すると、contentProviderの機密情報を読み取ることができる。
           2. SQLインジェクション：ContentProviderはデータベースを使用して共有データを保存するため、カスタムSQL文が適切に設計されていない場合、パラメータ化されていない設定によりSQLインジェクション攻撃を受ける可能性がある。
      - 対策：
           1. 権限、署名を確認する。
           2. コードを難読化する。
           3. SQL文を使用する場合、公式が提供する関数を使用し、手動で定義する際のエラーの可能性を避ける。

~~~
  * 以上有用到 Manifest.xml 宣言的コンポーネント、例えば：BroadCast、ContentProvider は以下のように設定できます：
     android:exported="true" の場合、何も処理をしないと他のアプリからのアクセスを受け入れることができます
     android:exported="false" の場合、同じアプリまたは同じ `user ID` を持つアプリからのアクセスのみを許可します
    -> 現在のユーザーグループ内でのみ使用を制限するために使用されます（Android 4.2以降でマルチユーザーをサポート）

  * `user ID`：実際のユーザー数、つまり携帯電話のメインアカウント、ゲストなどのマルチユーザー
    `uid`：アプリプロセスに関連し、各ユーザーの各アプリのuidは異なります。
    `appid`：パッケージ名が同じであれば、異なるユーザーでもappidは同じです。
~~~

## IPCソリューションがサポートするデータタイプ (現在library内でサポートされているタイプに基づく)
  * `BoardCast` : Intentを介してデータを渡し、bundleを持つことができ、bundleはbyte、char、short、float、string、parcelable、serializableなどをサポートします
  * `Socket` ： BufferedWriterを介してデータを書き出し、BufferedReaderでデータを受信します。ソースコードに基づくと、現在サポートされているのは：string、int、char[]
  * `AIDL` ： int、long、char、boolean、string、charSequence、list、map、parcelable
  * `Messenger` ：Messageを介してデータを渡し、bundleを持つことができ、サポートされるタイプは上記のBoardCastに類似しています
  * `ContentProvider` ：ContentValuesを介してデータを対応するURIのデータベースに保存し、他の必要なデータを持つURIを取得します。ContentValuesがサポートするタイプは：String、Byte、Short、Integer、Long、Float、Double、Boolean、byte[]など

