---
layout: post
title: "PM、RD看過來，從零開始制定或開發App瀏覽器！"
date: 2023-06-08 18:35:06 +0800
image: cover/safe_browser_post-1.png
tags: [Kotlin,Android]
permalink: /safe_browser
categories: 其他筆記
excerpt: "擁有一個方便易用的應用程式瀏覽器已經成為現代生活不可或缺的一部分。本文將探討制定或開發應用程式瀏覽器方案的方向。"
---

## 前言
<p>

  <div class = "table_container">
    <p>自製瀏覽器指南</p>
    擁有一個方便易用的應用程式瀏覽器已經成為現代生活不可或缺的一部分。

    本文將探討制定或開發應用程式瀏覽器方案的方向，

    提供有關於專案管理（PM）和研發團隊（RD）合作的參考，透過前期調研，確保開發過程的流暢和高品質成果。

  </div>

</p>

<div class="c-border-content-title-4">
    以下是我們可能會遇到的問題
</div>
<p>
<ol>
    <li><b>需求</b>
      <ul>
        <li>想要自己做一個app瀏覽器，需要包含市面上大部分瀏覽器該有的功能，搜尋、分頁、下載、最愛、分享...等</li>
        <li>支援過濾網址url、篩選、攔截網站...等功能</li>
      </ul>
    </li>

    <li><b>兼容性測試：</b>
      <ul>
        <li>
        自己開發瀏覽器，

        所以要確保瀏覽器大部分功能都有，

        以免其他家的功能有，自家卻沒有，那就尷尬了...

        </li>

        <li>開發web開啟各網頁可能會有兼容性問題，可以看<a href="https://blog.user.today/inapp-browser-webview-problem">這篇文章</a>的說明</li>

        <li>需要測試下自己實作的瀏覽器是否支援考html tag：
          <ul>
            <li><a href="http://beta.html5test.com/">html5 功能檢測</a></li>
          </ul>
        </li>
      </ul>
    </li>

    <li><b>確認自製瀏覽器需求</b>
      <ul>
        <li>因為還沒開始做，首先得確認一下自家目標瀏覽器要達到什麼程度

          尚無明確要開發到怎樣的Browser時

          可以研究幾個第三方browser

          決定到底要從webview開始刻還是透過一些open source去改

          當然若要用open source 也需注意 授權問題

        </li>

        <li>
        這張表列出兩個第三方瀏覽器與自己從webview開始刻瀏覽器的差異

        提供給後續需求做參考、討論實際要的功能，

        也利於決策是否要用第三方source或自行開發

        <img src="/images/browser/001.png" alt="safe browser 01" />

        </li>
      </ul>
    </li>

</ol>
</p>

## Url內容過濾

<p>

  <div class = "table_container">
    <p>開發一個app的安全瀏覽器...</p>
      想要實現安全策略的瀏覽器，內容包含過濾網頁瀏覽內容，

      例如限制瀏覽一些分級的網站，讓自家的瀏覽器更安全...

      就得針對URL做過濾
  </div>

</p>

<div class="c-border-content-title-4">
    方案方向參考 (推薦PM閱讀)
</div>

<ul>
  <li>
  實作 <b>內容過濾</b> 的方案，

  主要分為 <b>接入第三方SDK</b> 跟 <b>自行實作</b>，

  </li>

    <li><b>這兩種方案都需考慮</b>
        <ul>
            <li>自行開發browser內容過濾的話較單純，
            若要限制系統內所有瀏覽器的話需再考慮是否使用輔助權限方案（下面方案有列出競品的實作方式供參考）
            或是也有廠商是用proxy或dns來解決，
            不過要開發輔助權限、代理就需**更多時間**，也可以列入考量。</li>
            <li>若在考慮這些方法時需考慮是否雙平台可用</li>
        </ul>
    </li>
    <li>**接入第三方SDK** :
        <ul>
            <li>不同的第三方SDK，提供的威脅類型不同，若有些類型沒有的話，也需自行維護</li>
            <li>若使用google服務**Web Risk API**(接網路請求API的話雙平台都可用)需查閱以下，了解其規則：
                <ol>
                    <li><a href="https://cloud.google.com/web-risk/sla">Web Risk Service Level Agreement</a></li>
                    <li><a href="https://cloud.google.com/web-risk/quotas?hl=zh-cn">配额和限制</a></li>
                    <li><a href="https://cloud.google.com/web-risk/docs/reference/rest/v1/ThreatType?hl=zh-cn">威脅類型</a></li>
                </ol>
            </li>
            <li>若接入**趨勢 HNS SDK** ，需了解該SDK是否有提供我方目標的資料。
                <ul>
                    <li>因該SDK需接洽該公司客服，在網頁上也無顯示開發文件，僅能以下圖了解大概有提供的範圍：</li>
                    <li>提供範圍與細項</li>
                    <img src="/images/browser/002.png" alt="safe browser 02" />
                    <img src="/images/browser/003.png" alt="safe browser 03" />
                    <li>系統要求與雙平台支援的範圍</li>
                    <img src="/images/browser/004.png" alt="safe browser 04" />
                    <li>或可參考下面有解析趨勢科技的app，推測內容行為可能跟該app類似</li>
                </ul>
            </li>
            <li>若接入**CleanBrowsering**，有以下注意事項：
                <ol>
                    <li>支援Android 9.0以上，透過設置內**DNS-over-TLS (DOT) protocol**去設定DNS：<a href="https://cleanbrowsing.org/help/docs/setup-private-dns-on-android-version-9/">方法</a>
                    (因看該實作方法是用Android內的功能實現，推測IOS應該無支援)</li>
                    <li>也需與該公司客服接洽，這邊是在網站上提供的過濾範圍：</li>
                    <img src="/images/browser/005.png" alt="safe browser 05" />
                </ol>
            </li>
        </ul>
    </li>

    <li><b>自行開發內容過濾的瀏覽器</b>
        <ul>
        可使用一些第三方開源，像是`PhishTank`（下方有列出實際範例），提供可能是釣魚網站的開源資料，
        </ul>
        <ul>另外需考量提供的目標類型，是不是預期的，若不是，希望怎麼維護...等等</ul>
    </li>
</ul>

<div class="c-border-content-title-4">
    開發<b>內容過濾</b>功能思路參考(推薦RD閱讀)
</div>

<ul>
    <li>
        接入市場上現有SDK,如Google的
        <a href="https://developers.google.com/safe-browsing">Safe Browsing api</a>、
        <a href="https://cloud.google.com/web-risk?hl=zh-cn">Web Risk API</a>或是趨勢的
        <a href="https://www.trendmicro.com/zh_tw/business/products/iot/home-network-security-sdk.html">HNS SDK</a>等等產品。

        <a href="https://cleanbrowsing.org/filters/">CleanBrowsing</a>可以透過設定DNS的方式去做到過濾的動作

        下方我們列出各種方法的作法讓開發者去參考

        <ul>
            <li>
                <b>Safe Browsing API</b> (非商用) vs <b>Web Risk API</b> (此方案需付費)
                <ul>
                    <li>
                        Safe Browsing API 僅供非商業用途使用，若要商用需使用
                        <a href="https://cloud.google.com/web-risk?hl=zh-tw">Web Risk API</a>
                    </li>
                    <li>
                        <a href="https://cloud.google.com/web-risk/docs/apis">Web Risk Rest API 文件參考</a>
                         ：這個API 檢查、過濾url是否是威脅類型，實際開發時透過https request完成。
                    </li>
                    <li>
                        Web Risk提供的API類型
                        <ol>
                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/update-api?hl=zh-cn">Lookup API</a>
                                : 丟指定<b>threatTypes</b>跟目標url後，由後台查詢後返回威脅類型與最後有效時間
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/update-api?hl=zh-cn">Update API</a>
                                : 下載web risk的 hash list，之後存在本地端，讓開發可以在本地檢查後，發現匹配可以再用其他API去確認
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/evaluate-api?hl=zh-cn">Evaluate API</a>
                                :丟指定<b>threatTypes</b>跟目標url後，由後台查詢後返回結果威脅類型與信任等級
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/submission-api?hl=zh-cn">Submission API</a>
                                :回報給服務端認為是風險url
                            </li>

                        </ol>
                    </li>
                    <li>
                        Web Risk API提供的威脅類型
                        

                        <img src="/images/browser/006.png" alt="safe browser 06" >
                    </li>
                </ul>
            </li>
            <li>
                <b>HNS SDK</b> 該平台上未提供SDK開發文件，若使用此方案需待接洽後才可得知（不過下方有研究該公司旗下的安全產品，大概看了下功能，推測此SDK應該可以包含這些需求）。
            </li>
            <li>
                CleanBrowsing 使用該方案的話，可能需了解是否可以透過code設定 Encrypted DNS – DNS over TLS support
                <ul>
                    <li>
                        查看該產品，也是有取得輔助權限與admin:
                        <a href="https://cleanbrowsing.org/help/docs/cleanbrowsing-on-android/#step-2-give-accessibility-control-to-app">流程文件</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
    <li>
        <b>自己內部開發</b>
        <ul>
            <li>
                網址黑名單、內容解析過濾資料來源
                <ul>
                    <li>
                        有個開源維護的第三方釣魚網站列表 <a href="https://www.phishtank.com/phish_search.php?verified=u&active=y">PhishTank</a>
                        目前看起來都有持續在維護，有提供確認是在線釣魚網站約7萬多筆，也有提供疑似釣魚網站
                        

                        <img src="/images/browser/007.png" alt="safe browser 07" >

                    </li>
                </ul>
                  <li>
                    <b>
                      官網FAQ內說明可以商用
                    </b>

                    <img src="/images/browser/008.png" alt="safe browser 08" >
                  </li>
            </li>
            <li>
                參考競品來開發 網址黑名單、內容解析過濾
                <ul>
                    <li>
                        後來查看  <a href="https://www.trendmicro.com/zh_tw/forHome/products/ms.html">趨勢科技的行動安全防護app</a> 內也有提供 瀏覽器防護相關功能
                        

                    </li>

                    <li>
                      推測其應該也是使用輔助權限去取得瀏覽器url再做對應處理

                      該app開啟輔助權限的地方也有提到以此法進行

                      <img src="/images/browser/009.png" alt="safe browser 09" width="40%" >
                    </li>

                    <li>
                      這邊做了一個抓chrome url 的demo

                      先建立Accessibility，在宣告xml的地方加入 <b>目標包名</b>

                      接著在code的地方去取其edittext就能實現取得螢幕上的url：

                      <div>
                           <img src="/images/browser/010.png" alt="safe browser 10" width = "45%"/>
                           <img src="/images/browser/011.png" alt="safe browser 11" width = "45%"/>
                       </div>
                    </li>

                    <li>
                      取得實際url的 log

                      <img src="/images/browser/012.png" alt="safe browser 12" >
                    </li>

                    <li>
                      另外，

                      其應該是針對常用app做處理，

                      若不是常用或是難以抓到包名的app，

                      該競品則是用提供選擇要防護的app，

                      然後透過vpn去連線(推測應該是有設proxy或dns去過濾)

                      <img src="/images/browser/013.png" alt="safe browser 13" >
                    </li>

                    <li>
                      該app也有做網站類型過濾，

                      看起來是依照分類去細分網站再進行過濾

                      <img src="/images/browser/015.png" alt="safe browser 15" >
                      <img src="/images/browser/014.gif" alt="safe browser 14" >
                    </li>

                </ul>
            </li>  
        </ul>
    </li>
</ul>

## 開發瀏覽器功能 方向參考
<p>

  <div class = "table_container">
    <p>自製瀏覽器指南</p>
    這個章節，主要是用來實現，某些瀏覽器功能，目前紀錄，我曾經有遇到過的
  </div>

</p>

<div class="c-border-content-title-4">
    custom tabs
</div>

<ul>
  <li>
  這個方案主要是，

  google 本身library裡面提供的，

  透過發intent的方式，

  讓指定url在chrome裡面打開

  如果設備上沒有chrome或是沒有支援custom tabs的browser，

還是會發intent調用系統browser(通常是預設browser)。

  另外使用custom tabs的頁面會有固定的menu選項，

  其中一個會允許open in chrome，

  頁面的上客制化可定制範圍也受限在chrome裡

  <a href="https://qq157755587.github.io/2016/08/12/custom-tabs-best-practices/"><b>reference</b></a>

  </li>
</ul>

<div class="c-border-content-title-4">
  瀏覽器限制黑白名單
</div>

<ul>
  <li>
    在webview 設定webViewClient時

    發現不符合限制的url 則跳轉到別頁

     <pre>
     public boolean shouldOverrideUrlLoading(WebView view, String url) {
         if (!isUrlValid(url)) {
             view.loadUrl("file:///android_asset/error.html");
             return true;
         }
         return false; // 返回 false 表示正常加載該 URL
     }
     </pre>

  </li>
</ul>

<div class="c-border-content-title-4">
  若是遇到版本問題
</div>

<ul>
  <li>
    去設定webview的userAgentString 

    再根據版本進行適配 (但也需要剛好該url的服務端有支援)

     <pre>
     currentWebView!!.settings.userAgentString = resources.getStringArray(R.array.user_agent_data)[2]
     currentWebView!!.reload()
     </pre>

  </li>
  <li>
    user_agent_data 裡面預設瀏覽器agent的設定

    <img src="/images/browser/016.png" alt="safe browser 16" >

  </li>

  <li>
    遇到部分web元件不顯示，可能試試看是否該元件需要JavaScript

    <pre>
    currentWebView!!.settings.javaScriptEnabled = ture // or false
    </pre>
  </li>

  <li>
    要支援webview搜尋

    可以根據目標搜尋引擎輸入對應url再修改後面帶的值即可

    <pre>
    範例用google搜尋：
    https://www.google.com/search?q=搜尋的內容
    </pre>
    再在app上提供使用者要預設何種搜尋引擎

    <img src="/images/browser/017.png" alt="safe browser 17" >

  </li>
</ul>

<div class="c-border-content-title-4">
    若要直接用open source可參考
</div>

<p>

  <div class = "table_container">
    <p>透過第三方開源來改</p>
    因為現在開源很多，所以其他人開源出來很多好東西，

    所以若能直接從他們的專案去改，

    剛然可以節省很多時間，

    但這部分就需有能力改的動才行，

    且制定方案的時候也需要注意該開源linense是否可以商用。

    以下我也順便研究了幾種，

    給大家參考。

  </div>

  <h4>1. <a href="https://github.com/arunkumar9t2/lynket-browser">lynket</a></h4>

<ul>
  <li>License : GNU v3 Public License.</li>
</ul>

<h4>2.<a href="https://github.com/duckduckgo/Android"> duckduckgo </a> </h4>
<p></p>
<ul>
  <li>目前看到較完整的是duckduckgo這款

  純Kotlin實現、source code易讀</li>
  <li>License : Apache 2.0 license.</li>
</ul>

<h4>3. <a href="https://github.com/scoute-dich/browser">foss browser</a></h4>

<ul>
  <li>License: AGPL-3.0</li>
  <li>因License問題，暫不考慮</li>
  <li>是 FOSS，以純Java開發</li>
  <li>該open source有的功能</li>
</ul>

<h4>4. <a href="https://github.com/hazuki0x0/YuzuBrowser">Yuzu browser</a> </h4>
<ul>
  <li>Apache License 2.0</li>
  <li>純Kotlin實現 ，

  不過我下載官方code來build時，

  有遇到一些mac版本問題，

  大家有遇到需要再自行調整</li>
</ul>
</p>
