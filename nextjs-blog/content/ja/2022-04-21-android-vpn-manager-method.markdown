---
layout: post
title: "[Android開発の考え方] 自分のVPNアプリを作成する：Android VpnManager開発の考え方と心得"
date: 2022-04-21 18:09:28 +0800
image: cover/android-vpn-app-develop-1.png
tags: [Android,Debug]
categories: Android教學
excerpt: "以下は私が過去にAndroidを開発していた際に直面した問題です：アプリ内でVPNソリューションを実現する方法。この投稿では、その時の研究ノートと関連する解決策を共有します。"

---

## 前書き

<p>
  この投稿では、

  自分で研究したAndroid VPNアプリの開発の考え方を共有します。

  初心者でも経験豊富な開発者でも、

  これらのノートは実用的なガイドを提供します。

  皆さんの役に立てば幸いです。

</p>

## 事前に考慮すべき問題
<div class="c-border-content-title-4">どのように実装するかを考えるため、まずはネイティブにどのようなVPN暗号化接続方式があるかを調査しました</div>

  * ここでは、ネイティブのAndroid AOSPソースコード内にあるVPN接続暗号化方式を見ました：
    - PPTP  
    - L2TP/IPSec PSK
    - IPSec Xauth Psk
    - IPSec IKEv2 PSK
    - L2TP/IPSec RSA
    - IPSec Xauth RSA
    - IPSec 混合 RSA
    - IPSec IKEv2 RSA

  <div class="c-border-content-title-4">もしVPN接続暗号化モード機能を実装する必要がある場合：</div>
  - 公式のネイティブ提供方法には:<a herf="https://developer.android.com/reference/android/net/VpnManager">VpnManager、</a>
  <a herf="https://developer.android.com/reference/android/net/VpnService">VpnService</a>
    調査の結果：
      - `VpnManager`を使用する場合、一部のVpn接続モードのみが提供されており、高バージョン（API 30以上）でのみ利用可能
      - `VpnService`を使用する場合、基本的な設定のみが提供されており、上層で使用するための接続モードのインターフェースは開放されていない

  - `VpnManager`はAPI 30以上で使用可能で、一部のプロトコルのみが開放されている
      - また、Googleのissue trackerサイトで、

   他の開発者が類似の問題を抱えており、`公式に下層の接続モードを上層で使用できるように開放してほしい`と質問しているのを見ました。

   公式の回答では、将来的に開放される可能性があるとのこと：[こちらをクリック](https://issuetracker.google.com/issues/203461112)

   つまり、他にも同様のニーズがあるが、現時点では公式の開発予定はない

 *  以前述べたように、公式は一部の暗号化方式のみをサポートしており、その他は自分で実装するか、サードパーティのライブラリを統合する必要があります。

    この図は、公式がサポートする3つの暗号化方式を示しています：IPSec IKEv2 PSK、IPSec IKEv2 RSA、IPSec User Pass。

    ![vpn_limit.png](/images/others/vpn_limit.png)

## VPN実装の考え方の参考

* `公式提供`の方法を使用する場合、以下のように実装できます：
     - `'接続タイプ'`：[VpnManager](https://developer.android.com/reference/android/net/VpnManager) (APIレベル30以上)の[provisionVpnProfile](https://developer.android.com/reference/android/net/VpnManager#provisionVpnProfile(android.net.PlatformVpnProfile))メソッドを使用して`PlatformVpnProfile`を設定
         - 公式は新しいクラス[PlatformVpnProfile](https://developer.android.com/reference/android/net/PlatformVpnProfile)を定義しています
           - AOSPと組み合わせて見ると、公式はこのクラスを提供して`一部の接続プロトコルを設定`できるようにしています
             最終的に下層のサービスに到達すると、サービスで使用されるVpnProfileクラスに変換されます
           - つまり、VpnManagerの`line 335`：[provisionVpnProfile(@NonNull PlatformVpnProfile profile)](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/VpnManager.java;l=339;drc=03ba62861cd60978ba51c144071512b4aac291b7)
        最終的にはtoVpnProfile()を使用して`PlatformVpnProfile`を`VpnProfile`に変換します

- その[Ikev2VpnProfile.Builder](https://developer.android.com/reference/android/net/Ikev2VpnProfile.Builder#setRequiresInternetValidation(boolean))はIkev2関連の接続設定を行うことができ、このクラスは実際には`PlatformVpnProfile`を実装して、オープンなプロトコルモードを設定するためのものです。

- `'VPN設定関連'` : [VpnService](https://developer.android.com/reference/android/net/VpnService)を通じて、ローカルトンネルを作成する際に`VpnService.Builder()`を追加します。
  - 公式の [VpnServiceアーキテクチャ図](https://developer.android.com/guide/topics/connectivity/vpn#service)
    - この方法は接続時のトンネルを設定し、公式には以下の例に示す方法のみが提供されています。
    - AOSPには関連するプロトコル接続が提供されていますが、`まだ公開されていません`。
    したがって、関連するプロトコルで接続する必要がある場合は、自分で開発する必要があります。
    - 例 :
    ```kotlin
    /***  Android level 14 up ***/
    val builder = VpnService.Builder()
    val localTunnel = builder
                       .setSession('VPN名前')  
                       .addAddress('サーバー', 'prefix length')
                       .addRoute('転送ルート', 'prefix length')
                       .addDnsServer('DNSサーバー')
                       .addSearchDomain('DNS検索ドメイン')
                       .establish()
    ```

## 他の方法やサードパーティのソリューションを使用してVPNアプリを実装する
<div class="c-border-content-title-4">公式に提供されている方法では要件を満たせない場合、以下を検討できます：</div>

- AnyConnect：サードパーティのVPNプロバイダーで、現在サードパーティのVPNサービスが見られます。
  - [AnyConnect公式ドキュメント](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect410/release/notes/release-notes-android-anyconnect-4-10-.html)には、TLS、DTLS、IPsec IKEv2などのプロトコルが提供されていると記載されています。
  - 別の[AnyConnectドキュメント](https://www.cisco.com/c/en/us/products/collateral/security/anyconnect-secure-mobility-client/data_sheet_c78-527494.html)には、IPsec IKEv2接続を使用するには[Cisco Adaptive Security Appliance](https://www.cisco.com/c/en/us/products/security/adaptive-security-appliance-asa-software/index.html#~features) 8.4以上が必要と記載されています。
  - このオプションを使用する場合、[ベンダーと連絡](https://www.cisco.com/c/en/us/products/security/anyconnect-secure-mobility-client/index.html#~deployment)を取る必要があり、開発方法や詳細を知ることができます。
  - [この表](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect40/feature/guide/AnyConnect_Mobile_Platforms_and_Features_Guide.html)の下部には、各プラットフォームがサポートするトンネリングについて説明する表があります。
  - [AnyConnect 4.10リリースノート](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect410/release/notes/release-notes-android-anyconnect-4-10-.html)には、Androidバージョンに関する一部の互換性問題についても記載されています：
    - 例えば、Android 5.0、6.0の省電力モードはこのサービスと競合します。
    - Split DNSはAndroid 4.4またはSamsung 5.x Androidデバイスでは動作しません。
- `(参考)` ネット上で見つけた方法で、反射フレームワーク内のメソッドを直接使用してVpnProfileを設定する：[Create VPN profile on Android](https://stackoverflow.com/questions/9718289/create-vpn-profile-on-android)
  - しかし、Android 9.0以上ではこの方法は修正されているため、古いデバイスではこの方法が使用されている可能性があります（対象デバイスがこれ以前の場合、検討できます）。
  - [修正アナウンス](https://developer.android.com/distribute/best-practices/develop/restrictions-non-sdk-interfaces)
- `(参考)` サードパーティの[openVpn](https://github.com/schwabe/ics-openvpn)はAndroidのオープンソースを提供しています。
  - [ドキュメント](https://community.openvpn.net/openvpn/wiki/Openvpn23ManPage)には、`SSL/TLS`プロトコルをサポートしていると記載されています（`このプロトコルのみサポート`）。
  - openVpnをAndroidプロジェクトに追加する方法：[こちら](https://www.youtube.com/watch?v=gBMhaCujwrM)
  - [ics-openvpn FAQ](https://ics-openvpn.blinkt.de/FAQ.html)には、Samsung 5.0デバイスの問題についても記載されています。

## その他の知識ポイント

- アプリを通じてカスタムVpnServiceを起動する際、Android 8.0以上ではサービスの動作に[バックグラウンド実行制限](https://developer.android.com/about/versions/oreo/background?hl=zh-cn#services)が追加されました。
   

- [android-10.0.0_r1 aosp内の VpnService.java](https://cs.android.com/android/platform/superproject/+/android-10.0.0_r1:frameworks/base/core/java/android/net/VpnService.java;bpv=1;bpt=1)の`line:176~179`では
   [IConnectivityManager.aidl](https://cs.android.com/android/platform/superproject/+/android-10.0.0_r10:frameworks/base/core/java/android/net/IConnectivityManager.aidl;bpv=0;bpt=0)が使用されていますが、現在のところframework層でaidlの実装の痕跡は見つかっていません。
   そのため、binderなどに置かれている可能性があり、実装方法を理解するにはさらに低レベルのコードを調査する必要があります。
   

- [Android 12 aosp内の VpnService.Java](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/VpnService.java;bpv=1;bpt=1;l=178)の`line:178~181`ではaidlが[IVpnManager.aidl](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/IVpnManager.aidl)に変更されています。
   ソースコード内にはもう一つのファイルとして[VpnManagerService.Java](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/services/core/java/com/android/server/VpnManagerService.java;l=33;bpv=0;bpt=1)があります。

   その`line:293`の `provisionVpnProfile(VpnProfile profile,...)`
   このメソッドは変数[VpnProfile](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/com/android/internal/net/VpnProfile.java;l=61;bpv=0;bpt=0?q=VpnProfile&ss=android%2Fplatform%2Fsuperproject)を提供することを要求します。

   VpnProfileの`line:97`を確認すると、そのデフォルト接続方式は：`public int type = TYPE_PPTP`です。

   また、VpnProfileで設定可能な接続モードは以下の通りです：

   ![vpn_aosp_type.png](/images/others/vpn_aosp_type.png)

   ただし、これらは現在aosp内でのみサポートされています。

   公開されていないため、アプリ内で直接使用することはできません。

   まとめると、

   一般ユーザーは携帯電話の設定から変更するしかありません。

   開発者はaospから手をつけるしかありません。
