---
layout: post
title: "PM、RDの皆さん、ゼロからアプリブラウザを作成・開発しよう！"
date: 2023-06-08 18:35:06 +0800
image: cover/safe_browser_post-1.png
tags: [Kotlin,Android]
permalink: /safe_browser
categories: 其他筆記
excerpt: "便利で使いやすいアプリブラウザは現代生活に欠かせないものとなっています。この記事では、アプリブラウザの作成・開発の方向性について探ります。"
---

## 前書き
<p>

  <div class = "table_container">
    <p>自作ブラウザガイド</p>
    便利で使いやすいアプリブラウザは現代生活に欠かせないものとなっています。

    この記事では、アプリブラウザの作成・開発の方向性について探り、

    プロジェクト管理（PM）と研究開発チーム（RD）の協力に関する参考情報を提供し、前期調査を通じて開発プロセスの円滑さと高品質な成果を確保します。

  </div>

</p>

<div class="c-border-content-title-4">
    以下は私たちが直面する可能性のある問題です
</div>
<p>
<ol>
    <li><b>要件</b>
      <ul>
        <li>自分でアプリブラウザを作りたい場合、市場にあるほとんどのブラウザ機能（検索、タブ、ダウンロード、お気に入り、共有など）を含める必要があります。</li>
        <li>URLのフィルタリング、サイトのブロックなどの機能をサポートする必要があります。</li>
      </ul>
    </li>

    <li><b>互換性テスト：</b>
      <ul>
        <li>
        自分でブラウザを開発するので、

        ほとんどの機能が揃っていることを確認する必要があります。

        他のブラウザにある機能が自分のブラウザにないと困るので...

        </li>

        <li>ウェブを開発する際に各ページを開くと互換性の問題が発生する可能性があります。<a href="https://blog.user.today/inapp-browser-webview-problem">この記事</a>を参照してください。</li>

        <li>自作のブラウザがHTMLタグをサポートしているかどうかをテストする必要があります：
          <ul>
            <li><a href="http://beta.html5test.com/">HTML5機能テスト</a></li>
          </ul>
        </li>
      </ul>
    </li>

    <li><b>自作ブラウザの要件確認</b>
      <ul>
        <li>まだ開発を開始していないため、まず自分の目標ブラウザがどの程度の機能を持つべきかを確認する必要があります。

          具体的な開発目標がまだ明確でない場合、

          いくつかのサードパーティブラウザを研究し、

          WebViewから始めるか、オープンソースを利用するかを決定します。

          もちろん、オープンソースを使用する場合はライセンスの問題にも注意が必要です。

        </li>

        <li>
        この表は、WebViewから始めるブラウザとサードパーティブラウザの違いを示しています。

        後続の要件の参考にし、実際に必要な機能を議論するためのものです。

        また、サードパーティソースを使用するか自分で開発するかの決定にも役立ちます。

        <img src="/images/browser/001.png" alt="safe browser 01" />

        </li>
      </ul>
    </li>

</ol>
</p>

## URL内容フィルタリング

<p>

  <div class = "table_container">
    <p>アプリの安全ブラウザを開発する...</p>
      安全なブラウザを実現するためには、ウェブ閲覧内容をフィルタリングする必要があります。

      例えば、特定のレーティングのサイトの閲覧を制限することで、自分のブラウザをより安全にします。

      そのためにはURLをフィルタリングする必要があります。
  </div>

</p>

<div class="c-border-content-title-4">
    参考となる方向性（PMに推奨）
</div>

<ul>
  <li>
  <b>内容フィルタリング</b>の実装方法は、

  主に<b>サードパーティSDKの導入</b>と<b>自分で実装</b>に分かれます。

  </li>

<li><b>この2つの方法を考慮する必要があります</b>
    <ul>
        <li>ブラウザのコンテンツフィルタリングを自分で開発する場合は比較的単純ですが、システム内のすべてのブラウザを制限する場合は、補助権限の方法を使用するかどうかを検討する必要があります（以下の方法には競合製品の実装方法が参考として記載されています）。また、プロキシやDNSを使用して解決するベンダーもいますが、補助権限やプロキシの開発には**より多くの時間**が必要となるため、これも考慮に入れることができます。</li>
        <li>これらの方法を検討する際には、両プラットフォームで使用可能かどうかを考慮する必要があります。</li>
    </ul>
</li>
<li>**サードパーティSDKの導入** :
    <ul>
        <li>異なるサードパーティSDKは提供する脅威の種類が異なるため、いくつかの種類がない場合は自分でメンテナンスする必要があります。</li>
        <li>Googleサービスの**Web Risk API**（ネットワークリクエストAPIを使用する場合、両プラットフォームで使用可能）を使用する場合は、以下を参照してそのルールを理解してください：
            <ol>
                <li><a href="https://cloud.google.com/web-risk/sla">Web Risk Service Level Agreement</a></li>
                <li><a href="https://cloud.google.com/web-risk/quotas?hl=zh-cn">クォータと制限</a></li>
                <li><a href="https://cloud.google.com/web-risk/docs/reference/rest/v1/ThreatType?hl=zh-cn">脅威の種類</a></li>
            </ol>
        </li>
        <li>**トレンドマイクロ HNS SDK**を導入する場合は、そのSDKが我々の目標データを提供しているかどうかを確認する必要があります。
            <ul>
                <li>このSDKはその会社のカスタマーサポートと連絡を取る必要があり、ウェブサイトには開発ドキュメントが表示されていないため、以下の図から提供される範囲を大まかに理解することができます：</li>
                <li>提供範囲と詳細項目</li>
                <img src="/images/browser/002.png" alt="safe browser 02" />
                <img src="/images/browser/003.png" alt="safe browser 03" />
                <li>システム要件と両プラットフォームのサポート範囲</li>
                <img src="/images/browser/004.png" alt="safe browser 04" />
                <li>また、以下にトレンドマイクロのアプリを解析したものがあり、その内容がこのアプリと類似している可能性があります。</li>
            </ul>
        </li>
        <li>**CleanBrowsing**を導入する場合、以下の注意事項があります：
            <ol>
                <li>Android 9.0以上をサポートし、設定内で**DNS-over-TLS (DOT)プロトコル**を使用してDNSを設定します：<a href="https://cleanbrowsing.org/help/docs/setup-private-dns-on-android-version-9/">方法</a>
                （この実装方法はAndroidの機能を使用しているため、iOSはサポートしていないと推測されます）</li>
                <li>また、この会社のカスタマーサポートと連絡を取る必要があり、以下はウェブサイトで提供されているフィルタリング範囲です：</li>
                <img src="/images/browser/005.png" alt="safe browser 05" />
            </ol>
        </li>
    </ul>
</li>

<li><b>コンテンツフィルタリングブラウザの自社開発</b>
    <ul>
        いくつかのサードパーティのオープンソースを使用することができます。例えば、`PhishTank`（下に実際の例が記載されています）は、フィッシングサイトの可能性があるオープンソースデータを提供しています。
    </ul>
    <ul>また、提供される目標の種類が予期しているものであるかどうかを考慮し、そうでない場合はどのようにメンテナンスするかなどを検討する必要があります。</ul>
</li>
</ul>

<div class="c-border-content-title-4">
    開発<b>コンテンツフィルタリング</b>機能の参考（RD推奨）
</div>

<ul>
    <li>
        市場にある既存のSDKを導入する、例えばGoogleの
        <a href="https://developers.google.com/safe-browsing">Safe Browsing API</a>、
        <a href="https://cloud.google.com/web-risk?hl=zh-cn">Web Risk API</a>やトレンドマイクロの
        <a href="https://www.trendmicro.com/zh_tw/business/products/iot/home-network-security-sdk.html">HNS SDK</a>などの製品。

        <a href="https://cleanbrowsing.org/filters/">CleanBrowsing</a>はDNS設定を通じてフィルタリングを行うことができます。

        以下に各種方法の作業手順を開発者向けに記載します。

        <ul>
            <li>
                <b>Safe Browsing API</b>（非商用） vs <b>Web Risk API</b>（このプランは有料）
                <ul>
                    <li>
                        Safe Browsing APIは非商用利用のみで、商用利用には
                        <a href="https://cloud.google.com/web-risk?hl=zh-tw">Web Risk API</a>を使用する必要があります。
                    </li>
                    <li>
                        <a href="https://cloud.google.com/web-risk/docs/apis">Web Risk Rest API ドキュメント</a>
                         ：このAPIはURLが脅威であるかどうかをチェックし、フィルタリングします。実際の開発ではHTTPSリクエストを通じて行います。
                    </li>
                    <li>
                        Web Riskが提供するAPIの種類
                        <ol>
                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/update-api?hl=zh-cn">Lookup API</a>
                                : 指定された<b>threatTypes</b>とターゲットURLを送信し、バックエンドで検索して脅威の種類と最終有効時間を返します。
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/update-api?hl=zh-cn">Update API</a>
                                : Web Riskのハッシュリストをダウンロードし、ローカルに保存します。ローカルでチェックし、一致するものがあれば他のAPIで確認します。
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/evaluate-api?hl=zh-cn">Evaluate API</a>
                                : 指定された<b>threatTypes</b>とターゲットURLを送信し、バックエンドで検索して脅威の種類と信頼レベルを返します。
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/submission-api?hl=zh-cn">Submission API</a>
                                : リスクがあると考えられるURLをサーバーに報告します。
                            </li>

                        </ol>
                    </li>
                    <li>
                        Web Risk APIが提供する脅威の種類
                        

                        <img src="/images/browser/006.png" alt="safe browser 06" >
                    </li>
                </ul>
            </li>
            <li>
                <b>HNS SDK</b> このプラットフォームではSDK開発ドキュメントが提供されていません。このプランを使用する場合は、連絡を取ってから詳細を確認する必要があります（ただし、同社のセキュリティ製品を調査したところ、このSDKはこれらの要件を含むと推測されます）。
            </li>
            <li>
                CleanBrowsing このプランを使用する場合、コードを通じてEncrypted DNS – DNS over TLSサポートを設定できるかどうかを確認する必要があります。
                <ul>
                    <li>
                        この製品を確認し、補助権限と管理者権限を取得する必要があります：
                        <a href="https://cleanbrowsing.org/help/docs/cleanbrowsing-on-android/#step-2-give-accessibility-control-to-app">手順ドキュメント</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
    <li>
        <b>自社内での開発</b>
        <ul>
            <li>
                URLブラックリスト、コンテンツ解析フィルタリングのデータソース
                <ul>
                    <li>
                        オープンソースで維持されている第三者のフィッシングサイトリスト <a href="https://www.phishtank.com/phish_search.php?verified=u&active=y">PhishTank</a>
                        現在も継続的に維持されており、約7万件の確認済みオンラインフィッシングサイトを提供しています。また、疑わしいフィッシングサイトも提供しています。
                        

                        <img src="/images/browser/007.png" alt="safe browser 07" >

                       </li>
        </ul>
        <li>
          <b>
            公式FAQに商用利用が可能と記載
          </b>

          <img src="/images/browser/008.png" alt="safe browser 08" >
        </li>
        </li>
        <li>
          競合製品を参考に開発、URLブラックリスト、コンテンツ解析フィルタリング
          <ul>
            <li>
              <a href="https://www.trendmicro.com/zh_tw/forHome/products/ms.html">トレンドマイクロのモバイルセキュリティアプリ</a>でも、ブラウザ保護機能を提供していることを確認

            </li>
        
            <li>
              推測するに、ブラウザのURLを取得し、対応する処理を行うために補助権限を使用している

              この方法を使用することが、アプリの補助権限の設定で言及されている

              <img src="/images/browser/009.png" alt="safe browser 09" width="40%" >
            </li>
        
            <li>
              ここではChromeのURLを取得するデモを作成

              まずAccessibilityを設定し、XML宣言部分に<b>ターゲットパッケージ名</b>を追加

              次にコード内でedittextを取得し、画面上のURLを取得できるようにする：

              <div>
                <img src="/images/browser/010.png" alt="safe browser 10" width="45%"/>
                <img src="/images/browser/011.png" alt="safe browser 11" width="45%"/>
              </div>
            </li>

        
            <li>
              実際のURLログを取得

              <img src="/images/browser/012.png" alt="safe browser 12" >
            </li>

        
            <li>
              さらに、

              主要なアプリに対して処理を行うと推測される

              あまり使用されない、またはパッケージ名を取得しにくいアプリの場合、

              その競合製品は保護対象のアプリを選択する機能を提供し、

              VPNを通じて接続する（推測されるに、プロキシやDNSフィルタリングが設定されている）

              <img src="/images/browser/013.png" alt="safe browser 13" >
            </li>

        
            <li>
              そのアプリはウェブサイトタイプのフィルタリングも行っている

              カテゴリごとにサイトを分類し、フィルタリングを実行しているように見える

              <img src="/images/browser/015.png" alt="safe browser 15" >
              <img src="/images/browser/014.gif" alt="safe browser 14" >
            </li>

          </ul>
        </li>  
        </ul>
        </li>
</ul>

## 開発ブラウザ機能 方向参考
<p>

  <div class = "table_container">
    <p>自作ブラウザガイド</p>
    この章は、主にいくつかのブラウザ機能を実現するためのもので、現在記録しているのは、私がかつて遭遇したことのあるものです。
  </div>

</p>

<div class="c-border-content-title-4">
    custom tabs
</div>

<ul>
  <li>
  この方法は主に、

  google 自身のライブラリ内で提供されているもので、

  intentを発行することで、

  指定されたURLをchromeで開くことができます。

  デバイスにchromeがない場合やcustom tabsをサポートしていないブラウザがある場合でも、

intentを発行してシステムブラウザ（通常はデフォルトブラウザ）を呼び出します。

  さらに、custom tabsを使用するページには固定のメニューオプションがあり、

  その中の1つはchromeで開くことを許可します。

  ページのカスタマイズ可能な範囲もchrome内に限定されます。

  <a href="https://qq157755587.github.io/2016/08/12/custom-tabs-best-practices/"><b>参考</b></a>

  </li>
</ul>

<div class="c-border-content-title-4">
  ブラウザ制限ホワイトリスト・ブラックリスト
</div>

<ul>
  <li>
    webviewでwebViewClientを設定する際に

    制限に合わないURLを発見した場合は別のページにリダイレクトします。

     <pre>
     public boolean shouldOverrideUrlLoading(WebView view, String url) {
         if (!isUrlValid(url)) {
             view.loadUrl("file:///android_asset/error.html");
             return true;
         }
         return false; // falseを返すと、そのURLを通常通りに読み込みます。
     }
     </pre>

  </li>
</ul>

<div class="c-border-content-title-4">
  バージョン問題に遭遇した場合
</div>

<ul>
  <li>
    webviewのuserAgentStringを設定し、

    バージョンに応じて適応させます（ただし、そのURLのサーバー側がサポートしている必要があります）。

     <pre>
     currentWebView!!.settings.userAgentString = resources.getStringArray(R.array.user_agent_data)[2]
     currentWebView!!.reload()
     </pre>

  </li>
  <li>
    user_agent_dataにはデフォルトのブラウザエージェントの設定が含まれています。

    <img src="/images/browser/016.png" alt="safe browser 16" >

  </li>

  <li>
    一部のwebコンポーネントが表示されない場合、そのコンポーネントがJavaScriptを必要としているかどうかを確認してみてください。

    <pre>
    currentWebView!!.settings.javaScriptEnabled = true // または false
    </pre>
  </li>

  <li>
    webview検索をサポートする必要がある場合、

    目標の検索エンジンに対応するURLを入力し、後ろに値を追加するだけです。

    <pre>
    例としてGoogle検索を使用：
    https://www.google.com/search?q=検索内容
    </pre>
    アプリでユーザーにどの検索エンジンをデフォルトにするかを提供します。

    <img src="/images/browser/017.png" alt="safe browser 17" >

  </li>
</ul>

<div class="c-border-content-title-4">
    オープンソースを直接使用する場合の参考
</div>

<p>

  <div class = "table_container">
    <p>サードパーティのオープンソースを使用して改造する</p>
    現在、多くのオープンソースが存在するため、他の人が公開した多くの良いものがあります。

    そのため、彼らのプロジェクトから直接改造することができれば、

    多くの時間を節約できます。

    ただし、この部分は改造する能力が必要です。

    また、ソリューションを策定する際には、そのオープンソースライセンスが商用利用可能かどうかにも注意が必要です。

    以下にいくつかの例を研究しましたので、

    参考にしてください。

  </div>

<h4>1. <a href="https://github.com/arunkumar9t2/lynket-browser">lynket</a></h4>

<ul>
  <li>ライセンス : GNU v3 パブリックライセンス。</li>
</ul>

<h4>2.<a href="https://github.com/duckduckgo/Android"> duckduckgo </a> </h4>
<p></p>
<ul>
  <li>現在のところ、より完全なものはduckduckgoです。

  純粋なKotlinで実装されており、ソースコードが読みやすいです。</li>
  <li>ライセンス : Apache 2.0 ライセンス。</li>
</ul>

<h4>3. <a href="https://github.com/scoute-dich/browser">foss browser</a></h4>

<ul>
  <li>ライセンス: AGPL-3.0</li>
  <li>ライセンスの問題で、現在は考慮していません。</li>
  <li>FOSSで、純粋なJavaで開発されています。</li>
  <li>このオープンソースにはいくつかの機能があります。</li>
</ul>

<h4>4. <a href="https://github.com/hazuki0x0/YuzuBrowser">Yuzu browser</a> </h4>
<ul>
  <li>Apache ライセンス 2.0</li>
  <li>純粋なKotlinで実装されていますが、

  公式コードをダウンロードしてビルドする際に、

  macバージョンの問題に遭遇しました。

  必要に応じて調整してください。</li>
</ul>
</p>
