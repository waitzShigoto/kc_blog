import PortfolioSection from './PortfolioSection';
import { AppItem } from '@/types/portfolio';

export default function AndroidPortfolioContent({ locale = 'zh' }: { locale?: string }) {
  const studioApps: AppItem[] = [
    {
      id: "chatai",
      title: "AI Chat Assistant (ChatInsight.AI)",
      category: "ai",
      categoryLabel: "AI app",
      description: "AI 對話 app，支援主流 LLM model 對話、企業內部 AI 機器人、工作流、模型切換與群聊。",
      images: [
        "/images/portfolio/app/chatAI/001.png",
        "/images/portfolio/app/chatAI/002.png",
        "/images/portfolio/app/chatAI/003.png",
        "/images/portfolio/app/chatAI/004.png",
        "/images/portfolio/app/chatAI/005.png",
        "/images/portfolio/app/chatAI/006.png",
        "/images/portfolio/app/chatAI/007.png",
        "/images/portfolio/app/chatAI/008.png",
        "/images/portfolio/app/chatAI/009.png",
        "/images/portfolio/app/chatAI/010.png",
        "/images/portfolio/app/chatAI/011.png",
        "/images/portfolio/app/chatAI/012.png",
        "/images/portfolio/app/chatAI/013.png",
        "/images/portfolio/app/chatAI/014.png",
        "/images/portfolio/app/chatAI/015.png",
        "/images/portfolio/app/chatAI/016.png",
        "/images/portfolio/app/chatAI/017.png",
        "/images/portfolio/app/chatAI/018.png",
        "/images/portfolio/app/chatAI/019.png",
        "/images/portfolio/app/chatAI/020.png",
        "/images/portfolio/app/chatAI/021.png",
        "/images/portfolio/app/chatAI/022.png",
        "/images/portfolio/app/chatAI/023.png",
        "/images/portfolio/app/chatAI/024.png"
      ],
      features: [
        "以 100% Kotlin 與現代化 Jetpack Compose 實作完整使用者介面與流暢動畫。",
        "使用 Navigation-Compose 構建清晰的單一 Activity 導航架構。",
        "串接主流 LLM model API，實現即時 AI thinking 解析與 Markdown 渲染。",
        "實作對話管理、企業內部 AI 機器人探索、模型動態切換等核心產品需求。",
        "串接後端 RESTful API 與 AWS S3 檔案儲存，維護線上版本穩定性與除錯監控。"
      ],
      featureCategories: [
        {
          id: "chat",
          name: "AI 對話",
          badge: "01 / CORE CHAT",
          description: "支援即時串流對話、Markdown 富文本排版、思考時間指示器、重新生成與多輪對話上下文記憶。",
          tags: ["Jetpack Compose", "Azure GPT-4o", "SSE 串流", "Kotlin Flow", "Markdown"],
          images: [
            "/images/portfolio/app/chatAI/005.png",
            "/images/portfolio/app/chatAI/006.png",
            "/images/portfolio/app/chatAI/007.png",
            "/images/portfolio/app/chatAI/008.png",
            "/images/portfolio/app/chatAI/009.png",
            "/images/portfolio/app/chatAI/010.png",
            "/images/portfolio/app/chatAI/011.png"
          ]
        },
        {
          id: "explore",
          name: "企業 AI 探索",
          badge: "02 / BOT MARKETPLACE",
          description: "企業內部對話機器人與工作流市集，支援依部門與時間分類檢視、收藏、歷史調用次數與知識庫讀取對接。",
          tags: ["Bot Marketplace", "StateFlow", "ViewModel", "Room Database"],
          images: [
            "/images/portfolio/app/chatAI/012.png",
            "/images/portfolio/app/chatAI/013.png",
            "/images/portfolio/app/chatAI/014.png",
            "/images/portfolio/app/chatAI/015.png",
            "/images/portfolio/app/chatAI/016.png"
          ]
        },
        {
          id: "project",
          name: "模型與專案管理",
          badge: "03 / WORKSPACE & MODEL",
          description: "靈活切換不同底層 AI 模型（Azure GPT-4o 多模態等），並支援將對話分組歸納至不同專案工作區。",
          tags: ["Navigation-Compose", "Model Switcher", "Workspace"],
          images: [
            "/images/portfolio/app/chatAI/017.png",
            "/images/portfolio/app/chatAI/018.png",
            "/images/portfolio/app/chatAI/019.png",
            "/images/portfolio/app/chatAI/020.png"
          ]
        },
        {
          id: "auth-settings",
          name: "登入與帳號設定",
          badge: "04 / AUTH & SETTINGS",
          description: "企業信箱安全身分驗證、使用者條款、隱私政策、權限管理與個人資訊維護。",
          tags: ["JWT Auth", "OkHttp", "EncryptedSharedPreferences"],
          images: [
            "/images/portfolio/app/chatAI/001.png",
            "/images/portfolio/app/chatAI/002.png",
            "/images/portfolio/app/chatAI/003.png",
            "/images/portfolio/app/chatAI/004.png",
            "/images/portfolio/app/chatAI/021.png",
            "/images/portfolio/app/chatAI/022.png",
            "/images/portfolio/app/chatAI/023.png",
            "/images/portfolio/app/chatAI/024.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / UI ARCHITECTURE",
          title: "Jetpack Compose 現代化宣告式 UI",
          content: "全專案採用 100% Kotlin 搭配 Jetpack Compose 與 Navigation-Compose 實作單一 Activity 架構，完全解耦視圖與業務狀態。"
        },
        {
          index: "02 / REAL-TIME STREAMING",
          title: "非同步串流與對話即時更新",
          content: "透過 Coroutine 與 Flow 串接後端 SSE（Server-Sent Events），實現即時回覆與實時 AI thinking 結果，大幅降低用戶等待感知。"
        },
        {
          index: "03 / ENTERPRISE BOT PIPELINE",
          title: "企業機器人與知識庫整合",
          content: "整合後端 API 與 AWS S3，支援企業內部不同部門知識庫調用、對話歷史持久化與離線快取機制。"
        },
        {
          index: "04 / PERFORMANCE & RELIABILITY",
          title: "效能監控與崩潰排查",
          content: "實作全域異常捕獲與 vConsole 除錯輔助，最佳化長對話列表重組（Recomposition）效能，確保長時間使用穩定不閃退。"
        }
      ]
    },
    {
      id: "browser",
      title: "AirDroid Kid Browser app",
      category: "mdm",
      categoryLabel: "MDM 與安全瀏覽",
      description: "專為兒童與青少年設計的安全瀏覽器應用，具備即時網址黑白名單過濾、瀏覽歷程即時追蹤、防沈迷管控與家長端連動。",
      images: [
        "/images/portfolio/app/browser/01.png",
        "/images/portfolio/app/browser/02.png",
        "/images/portfolio/app/browser/03.png",
        "/images/portfolio/app/browser/04.png",
        "/images/portfolio/app/browser/05.png",
        "/images/portfolio/app/browser/06.png",
        "/images/portfolio/app/browser/07.png",
        "/images/portfolio/app/browser/08.png",
        "/images/portfolio/app/browser/09.png",
        "/images/portfolio/app/browser/010.png",
        "/images/portfolio/app/browser/011.png",
        "/images/portfolio/app/browser/012.png",
        "/images/portfolio/app/browser/013.png",
        "/images/portfolio/app/browser/014.png",
        "/images/portfolio/app/browser/015.png",
        "/images/portfolio/app/browser/016.png",
        "/images/portfolio/app/browser/017.png"
      ],
      features: [
        "專案前期主導調研 Android 瀏覽器實作方案與核心架構選型。",
        "以 Kotlin 獨立完成需求介面與自定義 UI 開發。",
        "實作跨應用身分綁定、授權流程、歷程追蹤與 Token 自動刷新機制。",
        "使用 OkHttp 與 Retrofit 整合後端 API，實現穩定雙向資料通訊。",
        "負責後續功能維護、版本升級與 Bug 排查。"
      ],
      featureCategories: [
        {
          id: "safe-browsing",
          name: "安全防護與黑白名單",
          badge: "01 / SAFE BROWSING",
          description: "透過後端與本地政策設定網址黑白名單，自動攔截不良內容與惡意網站，保護孩童安全上網。",
          tags: ["WebView", "OkHttp", "URL Filter", "Regex Engine"],
          images: [
            "/images/portfolio/app/browser/05.png",
            "/images/portfolio/app/browser/06.png",
            "/images/portfolio/app/browser/07.png",
            "/images/portfolio/app/browser/08.png",
            "/images/portfolio/app/browser/09.png"
          ]
        },
        {
          id: "binding",
          name: "裝置綁定與導覽",
          badge: "02 / PAIRING & ONBOARDING",
          description: "首次啟動引導與家長端 AirDroid 進行跨應用授權綁定，完成身分驗證與 Token 安全更新。",
          tags: ["Token Refresh", "App Binding", "Onboarding Flow"],
          images: [
            "/images/portfolio/app/browser/01.png",
            "/images/portfolio/app/browser/02.png",
            "/images/portfolio/app/browser/03.png",
            "/images/portfolio/app/browser/04.png"
          ]
        },
        {
          id: "history-bookmark",
          name: "書籤與歷史紀錄",
          badge: "03 / BOOKMARKS & HISTORY",
          description: "分頁管理、常用書籤自定義、歷史造訪清單與搜尋引擎切換，兼顧流暢體驗與記錄上報。",
          tags: ["Tab Management", "SQLite", "History Tracking"],
          images: [
            "/images/portfolio/app/browser/010.png",
            "/images/portfolio/app/browser/011.png",
            "/images/portfolio/app/browser/012.png",
            "/images/portfolio/app/browser/013.png",
            "/images/portfolio/app/browser/014.png"
          ]
        },
        {
          id: "settings-privacy",
          name: "版本更新與下載",
          badge: "04 / SETTINGS & UPDATES",
          description: "支援在線版本更新日誌提示、深淺色主題切換、無痕模式與快取清理。",
          tags: ["App Update", "Theme Support", "Cache Cleaner"],
          images: [
            "/images/portfolio/app/browser/015.png",
            "/images/portfolio/app/browser/016.png",
            "/images/portfolio/app/browser/017.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / WEB ENGINE RESEARCH",
          title: "深入調研 Android WebView 核心架構",
          content: "專案前期負責調研 Android 瀏覽器核心實作，自定義 WebViewClient 與 WebChromeClient，兼顧載入效能與自定義 UI 攔截。"
        },
        {
          index: "02 / CROSS-APP IPC",
          title: "跨應用身分綁定與狀態連動",
          content: "實現與家長端主程式的跨 App 通訊、授權驗證與 Token 自動更新機制，維持連線安全性與操作連續性。"
        },
        {
          index: "03 / CONTENT FILTERING",
          title: "高效能即時網址攔截系統",
          content: "以本地黑白名單快取配合正則表示式，在 shouldInterceptRequest 中做到零延遲比對與違規阻斷。"
        },
        {
          index: "04 / ROBUST NETWORKING",
          title: "Retrofit 與 OkHttp 網路層封裝",
          content: "封裝統一網路攔截器、日誌追蹤與離線暫存，確保弱網環境下的穩定回報。"
        }
      ]
    },
    {
      id: "remote-support",
      title: "AirDroid Remote Support app",
      category: "mdm",
      categoryLabel: "遠端協作與服務",
      description: "企業級跨裝置遠端技術支援解決方案，支援 9 位連線碼直連、AR 擴增實境 3D 箭頭標記、無人值守遠端操控與輸入法輔助插件。",
      images: [
        "/images/portfolio/app/remotesupport/01.png",
        "/images/portfolio/app/remotesupport/02.png",
        "/images/portfolio/app/remotesupport/03.png",
        "/images/portfolio/app/remotesupport/04.png",
        "/images/portfolio/app/remotesupport/05.png",
        "/images/portfolio/app/remotesupport/06.png",
        "/images/portfolio/app/remotesupport/07.png",
        "/images/portfolio/app/remotesupport/08.png",
        "/images/portfolio/app/remotesupport/09.png",
        "/images/portfolio/app/remotesupport/10.png",
        "/images/portfolio/app/remotesupport/11.png",
        "/images/portfolio/app/remotesupport/12.png",
        "/images/portfolio/app/remotesupport/13.png",
        "/images/portfolio/app/remotesupport/14.png",
        "/images/portfolio/app/remotesupport/15.png",
        "/images/portfolio/app/remotesupport/16.png",
        "/images/portfolio/app/remotesupport/17.png",
        "/images/portfolio/app/remotesupport/18.png"
      ],
      features: [
        "維護核心應用並主導新功能模組開發。",
        "從零實作 QR Code 產生、QR Code 掃描、使用導覽、企業綁定、有人/無人值守模式切換與權限配置。",
        "串接後端 API 並透過 WebSocket 維持毫秒級雙向即時長連接。",
        "新功能全部以 Kotlin 編寫，提高系統強健度與開發效率。",
        "主導自研外掛插件整合，實現引導式下載與自帶輸入法（InputMethodService）功能維護。",
        "將專案依賴架構升級至 Gradle Version Catalogs (.toml)。"
      ],
      featureCategories: [
        {
          id: "quick-connect",
          name: "連線碼直連與通話",
          badge: "01 / QUICK CONNECTION",
          description: "9 位數動態連線碼一鍵連線，支援即時雙向語音通話與遠端螢幕鏡像串流。",
          tags: ["WebSocket", "WebRTC", "Audio Streaming"],
          images: [
            "/images/portfolio/app/remotesupport/01.png",
            "/images/portfolio/app/remotesupport/02.png",
            "/images/portfolio/app/remotesupport/03.png",
            "/images/portfolio/app/remotesupport/04.png"
          ]
        },
        {
          id: "qr-enterprise",
          name: "QR Code 與企業綁定",
          badge: "02 / ENTERPRISE PAIRING",
          description: "掃描企業 QR 碼快速加入團隊組織，自動繼承組織安全原則與遠端存取授權。",
          tags: ["QR Scanner", "CameraX", "MLKit", "Enterprise MDM"],
          images: [
            "/images/portfolio/app/remotesupport/05.png",
            "/images/portfolio/app/remotesupport/06.png",
            "/images/portfolio/app/remotesupport/07.png",
            "/images/portfolio/app/remotesupport/08.png"
          ]
        },
        {
          id: "screen-ar",
          name: "AR 擴增實境空間標記",
          badge: "03 / AR GUIDANCE",
          description: "技術人員可在遠端視訊畫面直接放置 3D 指示箭頭與空間筆刷，指導現場人員精準操作硬體。",
          tags: ["AR Core", "3D Marking", "Screen Share"],
          images: [
            "/images/portfolio/app/remotesupport/09.png",
            "/images/portfolio/app/remotesupport/10.png",
            "/images/portfolio/app/remotesupport/11.png",
            "/images/portfolio/app/remotesupport/12.png",
            "/images/portfolio/app/remotesupport/13.png"
          ]
        },
        {
          id: "unattended-plugin",
          name: "無人值守與輸入法插件",
          badge: "04 / UNATTENDED & INPUT",
          description: "無人值守模式自動授權連線，整合自研 InputMethodService 插件實現遠端鍵盤精準映射輸入。",
          tags: ["InputMethodService", "Accessibility", "Plugin Architecture"],
          images: [
            "/images/portfolio/app/remotesupport/14.png",
            "/images/portfolio/app/remotesupport/15.png",
            "/images/portfolio/app/remotesupport/16.png",
            "/images/portfolio/app/remotesupport/17.png",
            "/images/portfolio/app/remotesupport/18.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / WEBSOCKET PROTOCOL",
          title: "長連接信令與即時連線架構",
          content: "使用 WebSocket 維護長連接心跳與斷線重連機制，毫秒級傳遞遠端控制事件與信令。"
        },
        {
          index: "02 / INPUT PLUGIN INTEGRATION",
          title: "自研輸入法插件架構",
          content: "設計插件引導安裝流程，基於 InputMethodService 實現遠端字元與組合鍵的跨系統精確鍵盤映射。"
        },
        {
          index: "03 / ATTENDED VS UNATTENDED",
          title: "有人值守與無人值守雙模式切換",
          content: "依據安全原則動態調整授權彈窗與連線策略，搭配 Android Accessibility Service 保持背景待命。"
        },
        {
          index: "04 / VERSION CATALOGS",
          title: "專案依賴管理現代化升級",
          content: "主導將專案依賴管理全面升級至 Gradle Version Catalogs (libs.versions.toml)，規範多模組版本統一。"
        }
      ]
    },
    {
      id: "biz",
      title: "AirDroid Business - 企業設備管理 App",
      category: "mdm",
      categoryLabel: "企業 MDM 管控",
      description: "企業專用行動設備管理（MDM / EMM）用戶端，提供 Device Owner 深度管控、Samsung Knox API 整合、Kiosk 單一應用鎖定與企業原則配置。",
      images: [
        "/images/portfolio/app/biz/01.png",
        "/images/portfolio/app/biz/02.png",
        "/images/portfolio/app/biz/03.png",
        "/images/portfolio/app/biz/04.png",
        "/images/portfolio/app/biz/05.png",
        "/images/portfolio/app/biz/06.png",
        "/images/portfolio/app/biz/07.png",
        "/images/portfolio/app/biz/08.png",
        "/images/portfolio/app/biz/09.png",
        "/images/portfolio/app/biz/10.png"
      ],
      features: [
        "維護核心應用並持續推進企業級功能演進。",
        "實作嚴謹的產品需求介面與自定義 UI 元件。",
        "深度調研並實作設備原則（Device Policy）相關功能。",
        "調研並整合 Samsung Knox 企業專屬 SDK 功能。"
      ],
      featureCategories: [
        {
          id: "device-policy",
          name: "設備原則與 Knox 管控",
          badge: "01 / DEVICE POLICY",
          description: "啟用 Android Device Owner 與 Knox，遠端鎖定相機、USB 傳輸、藍牙與系統設定。",
          tags: ["DevicePolicyManager", "Samsung Knox SDK", "Rootless Control"],
          images: [
            "/images/portfolio/app/biz/01.png",
            "/images/portfolio/app/biz/02.png",
            "/images/portfolio/app/biz/03.png",
            "/images/portfolio/app/biz/04.png"
          ]
        },
        {
          id: "kiosk-mode",
          name: "Kiosk 專用模式與分發",
          badge: "02 / KIOSK & APP MANAGEMENT",
          description: "限制裝置僅能運行特定企業應用，防止員工誤觸其他功能；支援企業私有 App 靜默安裝與派送。",
          tags: ["Kiosk Mode", "Silent Install", "PackageInstaller"],
          images: [
            "/images/portfolio/app/biz/05.png",
            "/images/portfolio/app/biz/06.png",
            "/images/portfolio/app/biz/07.png"
          ]
        },
        {
          id: "system-security",
          name: "設備狀態與安全審計",
          badge: "03 / SECURITY & AUDIT",
          description: "即時監控裝置電量、儲存空間、位置軌跡與異常網路行為，上報至企業管理後台。",
          tags: ["Telemetry", "Security Audit", "Background Worker"],
          images: [
            "/images/portfolio/app/biz/08.png",
            "/images/portfolio/app/biz/09.png",
            "/images/portfolio/app/biz/10.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / SAMSUNG KNOX",
          title: "深度調研與整合 Samsung Knox SDK",
          content: "研究 Knox Enterprise License (KLM/ELM) 啟用機制，針對三星企業機型解鎖底層客製硬體管控功能。"
        },
        {
          index: "02 / DEVICE OWNER ARCHITECTURE",
          title: "Android 企業管理者特權架構",
          content: "遵循 Google Android Enterprise 規範，透過 NFC/DPC 註冊啟用 Device Owner 權限，實施硬體開關控制。"
        },
        {
          index: "03 / BACKGROUND RESILIENCY",
          title: "常駐守護進程與守衛服務",
          content: "結合 JobScheduler 與 Foreground Service 防止被系統清理，保證遠端指令下發 100% 到達。"
        }
      ]
    },
    {
      id: "kp",
      title: "AirDroid Kids - 家長守護與管控 App",
      category: "mdm",
      categoryLabel: "家庭守護與防沈迷",
      description: "兒童守護與安全監護客戶端，具備地理圍欄即時告警、螢幕使用時間排程、應用限額與危險內容通知監聽。",
      images: [
        "/images/portfolio/app/kp/01.png",
        "/images/portfolio/app/kp/02.png",
        "/images/portfolio/app/kp/03.png",
        "/images/portfolio/app/kp/04.png",
        "/images/portfolio/app/kp/05.png",
        "/images/portfolio/app/kp/06.png",
        "/images/portfolio/app/kp/07.png",
        "/images/portfolio/app/kp/08.png",
        "/images/portfolio/app/kp/09.png",
        "/images/portfolio/app/kp/10.png",
        "/images/portfolio/app/kp/11.png",
        "/images/portfolio/app/kp/12.png"
      ],
      features: [
        "維護核心應用穩定性與多螢幕適配。",
        "負責實作各階段產品需求介面。",
        "主責「我的頁面 (My Page)」與個人中心 UI 重構。",
        "排查並修復歷史遺留 Bug，顯著改善視圖渲染與顯示異常。"
      ],
      featureCategories: [
        {
          id: "screen-time",
          name: "螢幕時間與應用限額",
          badge: "01 / SCREEN TIME",
          description: "靈活設定各個應用的每日允許使用時間與停用時段，時間到達時自動鎖定應用介面。",
          tags: ["UsageStatsManager", "Overlay Window", "Accessibility"],
          images: [
            "/images/portfolio/app/kp/01.png",
            "/images/portfolio/app/kp/02.png",
            "/images/portfolio/app/kp/03.png",
            "/images/portfolio/app/kp/04.png"
          ]
        },
        {
          id: "location-fence",
          name: "即時定位與電子圍欄",
          badge: "02 / LOCATION & GEOFENCE",
          description: "高精度 GPS 定位與安全區域出入告警，讓家長隨時掌握孩童活動軌跡。",
          tags: ["FusedLocationProvider", "Geofencing", "MapKit"],
          images: [
            "/images/portfolio/app/kp/05.png",
            "/images/portfolio/app/kp/06.png",
            "/images/portfolio/app/kp/07.png",
            "/images/portfolio/app/kp/08.png"
          ]
        },
        {
          id: "activity-report",
          name: "活動報告與個人中心",
          badge: "03 / ACTIVITY REPORT",
          description: "產生每日/每週應用程式使用報表、手機喚醒次數統計與孩童帳號個人化設定。",
          tags: ["Data Visualization", "My Page UI", "Custom Views"],
          images: [
            "/images/portfolio/app/kp/09.png",
            "/images/portfolio/app/kp/10.png",
            "/images/portfolio/app/kp/11.png",
            "/images/portfolio/app/kp/12.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / MY PAGE REFACTORING",
          title: "個人中心 (My Page) 介面設計與重構",
          content: "主導負責個人化中心與孩童設定UI，修復舊版複雜層級巢狀渲染卡頓問題，大幅提升捲動幀率。"
        },
        {
          index: "02 / PERMISSION STABILITY",
          title: "無障礙與使用情況存取權限保活",
          content: "針對各家 Android OEM (小米/華為/OPPO) 建立引導流程，防止用戶或系統意外關閉關鍵權限。"
        },
        {
          index: "03 / REAL-TIME REPORTING",
          title: "高效能統計資料本地聚合計數",
          content: "在背景定期將 UsageEvents 進行分類聚合壓縮後批次上報，大幅降低行動網路流量與電量消耗。"
        }
      ]
    }
  ];

  const otherApps: AppItem[] = [
    {
      id: "exercise",
      title: "Sports IoT app (運動教練與藍牙傳感器)",
      category: "iot",
      categoryLabel: "IoT",
      description: "外包合作開發之運動健康物聯網 App，整合藍牙 BLE 運動器材與穿戴感測器，提供即時活力教練、阻力調節、心率分析與運動資料庫。",
      images: [
        "/images/portfolio/app/exercise-app/01.png",
        "/images/portfolio/app/exercise-app/02.png",
        "/images/portfolio/app/exercise-app/03.png",
        "/images/portfolio/app/exercise-app/04.png",
        "/images/portfolio/app/exercise-app/05.png",
        "/images/portfolio/app/exercise-app/06.png",
        "/images/portfolio/app/exercise-app/07.png",
        "/images/portfolio/app/exercise-app/08.png",
        "/images/portfolio/app/exercise-app/09.png",
        "/images/portfolio/app/exercise-app/10.png",
        "/images/portfolio/app/exercise-app/11.png",
        "/images/portfolio/app/exercise-app/12.png",
        "/images/portfolio/app/exercise-app/13.png",
        "/images/portfolio/app/exercise-app/14.png",
        "/images/portfolio/app/exercise-app/15.png",
        "/images/portfolio/app/exercise-app/16.png",
        "/images/portfolio/app/exercise-app/17.png",
        "/images/portfolio/app/exercise-app/18.png"
      ],
      features: [
        "獨立負責全案活力教練（Vitality Coach）介面與動畫互動實作。",
        "設計並維護本地 Room 資料庫，儲存高頻感測器數據與歷史鍛鍊紀錄。",
        "排查各品牌 Android 機型藍牙廣播掃描異常問題。"
      ],
      featureCategories: [
        {
          id: "coach-ui",
          name: "活力教練與課表",
          badge: "01 / COACH UI",
          description: "活力教練動態引導、運動節奏指示器與阻力/坡度即時視覺化呈現。",
          tags: ["Custom Canvas", "Animation", "Audio Cue"],
          images: [
            "/images/portfolio/app/exercise-app/01.png",
            "/images/portfolio/app/exercise-app/02.png",
            "/images/portfolio/app/exercise-app/03.png",
            "/images/portfolio/app/exercise-app/04.png",
            "/images/portfolio/app/exercise-app/05.png"
          ]
        },
        {
          id: "ble-sync",
          name: "藍牙器材搜尋與即時同步",
          badge: "02 / BLE SENSOR SYNC",
          description: "掃描飛輪、跑步機等 BLE 藍牙裝置，穩定握手連線並以高頻率接收瓦特數、踏頻與心率資料。",
          tags: ["Android BLE", "GATT Callback", "State Machine"],
          images: [
            "/images/portfolio/app/exercise-app/06.png",
            "/images/portfolio/app/exercise-app/07.png",
            "/images/portfolio/app/exercise-app/08.png",
            "/images/portfolio/app/exercise-app/09.png",
            "/images/portfolio/app/exercise-app/10.png"
          ]
        },
        {
          id: "analytics-charts",
          name: "運動數據圖表與分析",
          badge: "03 / METRICS & CHARTS",
          description: "燃燒卡路里、心率區間分佈、速度曲線即時動態繪製，幫助使用者調整訓練強度。",
          tags: ["MPAndroidChart", "Data Processing", "Realtime Graphs"],
          images: [
            "/images/portfolio/app/exercise-app/011.png",
            "/images/portfolio/app/exercise-app/012.png",
            "/images/portfolio/app/exercise-app/013.png",
            "/images/portfolio/app/exercise-app/014.png"
          ]
        },
        {
          id: "history-db",
          name: "歷史紀錄與個人目標",
          badge: "04 / WORKOUT HISTORY",
          description: "運動成果持久化儲存於本地 Room 資料庫，支援個人歷史紀錄回顧與每週成就解鎖。",
          tags: ["Room Database", "SQLite", "Data Migration"],
          images: [
            "/images/portfolio/app/exercise-app/015.png",
            "/images/portfolio/app/exercise-app/016.png",
            "/images/portfolio/app/exercise-app/017.png",
            "/images/portfolio/app/exercise-app/018.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / ROOM DATABASE",
          title: "運動數據庫持久化架構維護",
          content: "使用 Room Database 設計運動區段（Workout Session）與秒級採樣點結構，支援快速聚合統計查詢。"
        },
        {
          index: "02 / COACH UI IMPLEMENTATION",
          title: "活力教練視圖客製化",
          content: "以自定義 View 與屬性動畫打造教練節奏指示圈與即時能量條，維持每秒 60 幀平滑渲染。"
        }
      ]
    },
    {
      id: "dispatch_car",
      title: "Dispatch Taxi app (多元計程車派遣平台)",
      category: "service",
      categoryLabel: "出行與派遣",
      description: "經歷從 8.0 跨越至 9.0 大版本的計程車派遣乘客端 App，重構為 Kotlin 語言，涵蓋地圖定位、即時估價、推播司機配對、行程軌跡與行銷廣告整合。",
      images: [
        "/images/portfolio/app/call_car/01.png",
        "/images/portfolio/app/call_car/02.png",
        "/images/portfolio/app/call_car/03.png",
        "/images/portfolio/app/call_car/04.png",
        "/images/portfolio/app/call_car/05.png",
        "/images/portfolio/app/call_car/06.png",
        "/images/portfolio/app/call_car/07.png",
        "/images/portfolio/app/call_car/08.png",
        "/images/portfolio/app/call_car/09.png",
        "/images/portfolio/app/call_car/10.png",
        "/images/portfolio/app/call_car/11.png",
        "/images/portfolio/app/call_car/12.png",
        "/images/portfolio/app/call_car/13.png"
      ],
      features: [
        "維護既有 8.0 版本並修復重大線上問題。",
        "主導核心程式碼由 Java 全面重構為 Kotlin，顯著提升開發品質與維護效率。",
        "根據產品需求從零實作 9.0 全新介面與交互流程。",
        "實現登入、地圖即時叫車、推播派單、動態軌跡追蹤、廣告聚合與 Crashlytics 監控。",
        "使用現代化常用函式庫：Retrofit, OkHttp, RxJava, Dagger2 等。"
      ],
      featureCategories: [
        {
          id: "booking-map",
          name: "地圖定位與即時叫車",
          badge: "01 / MAP & BOOKING",
          description: "Google Maps 定位與地址自動補全，支援即時試算車資、多種車型選擇與預約叫車。",
          tags: ["Google Maps SDK", "Location API", "Places Autocomplete"],
          images: [
            "/images/portfolio/app/call_car/01.png",
            "/images/portfolio/app/call_car/02.png",
            "/images/portfolio/app/call_car/03.png",
            "/images/portfolio/app/call_car/04.png"
          ]
        },
        {
          id: "dispatch-tracking",
          name: "司機配對與行程追蹤",
          badge: "02 / DISPATCH & TRACKING",
          description: "即時推播派單通知，在地圖上動態展示司機車輛平滑移動軌跡與預計抵達倒數。",
          tags: ["FCM Push", "Marker Animation", "WebSocket"],
          images: [
            "/images/portfolio/app/call_car/05.png",
            "/images/portfolio/app/call_car/06.png",
            "/images/portfolio/app/call_car/07.png",
            "/images/portfolio/app/call_car/08.png"
          ]
        },
        {
          id: "payment-review",
          name: "多元支付與行程評價",
          badge: "03 / PAYMENT & REVIEW",
          description: "整合信用卡、行動支付與乘車券折抵，行程結束自動出具電子收據並支援星級評價。",
          tags: ["Payment Gateway", "Coupon System", "Rating Flow"],
          images: [
            "/images/portfolio/app/call_car/09.png",
            "/images/portfolio/app/call_car/10.png",
            "/images/portfolio/app/call_car/11.png"
          ]
        },
        {
          id: "member-center",
          name: "會員中心與乘車紀錄",
          badge: "04 / PROFILE & HISTORY",
          description: "歷史行程明細查詢、電子發票載具設定、遺失物回報與個人偏好設置。",
          tags: ["User Center", "History Details", "Crashlytics"],
          images: [
            "/images/portfolio/app/call_car/12.png",
            "/images/portfolio/app/call_car/13.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / JAVA TO KOTLIN REFACTOR",
          title: "專案代碼由 Java 全面重構至 Kotlin",
          content: "主導將 8.0 版本的核心模組以 Kotlin 重寫，引入 Null Safety、擴充函式與 Coroutine，消除 90% 以上潛在 Null 指標異常。"
        },
        {
          index: "02 / ARCHITECTURE EVOLUTION",
          title: "MVVM 架構升級與依賴注入",
          content: "引入 Dagger2 依賴注入，搭配 Retrofit + OkHttp + RxJava 建立高內聚低耦合的架構層次。"
        },
        {
          index: "03 / MAP POLYLINE DECODING",
          title: "Google Maps Polyline 路徑解碼與繪製",
          content: "串接 Google Maps API 解析路線 JSON，實作 Polyline 壓縮演算法解碼（overview_polyline），精準還原經緯度座標點並在地圖上繪製行車預估路徑。"
        },
        {
          index: "04 / CRASHLYTICS & ADS",
          title: "崩潰分析與廣告收益整合",
          content: "串接 Firebase Crashlytics 監控線上版本穩定性，並整合行動廣告 SDK（Google AdMob）增加商業變現。"
        }
      ]
    },
    {
      id: "wm_app",
      title: "Bluetooth IoT app (工業變頻器監控)",
      category: "iot",
      categoryLabel: "工業物聯網 IoT",
      description: "工業級藍牙 BLE 監控與遠端診斷系統，直連工業變頻器設備，支援 Modbus 協議雙向通訊、多通道暫存器讀寫、頻率電壓調節與 MQTT 雲端上報。",
      images: [
        "/images/portfolio/app/wm/01.png",
        "/images/portfolio/app/wm/02.png",
        "/images/portfolio/app/wm/03.png",
        "/images/portfolio/app/wm/04.png",
        "/images/portfolio/app/wm/05.png",
        "/images/portfolio/app/wm/06.png",
        "/images/portfolio/app/wm/07.png",
        "/images/portfolio/app/wm/08.png",
        "/images/portfolio/app/wm/09.png",
        "/images/portfolio/app/wm/10.png",
        "/images/portfolio/app/wm/11.png",
        "/images/portfolio/app/wm/12.png",
        "/images/portfolio/app/wm/13.png",
        "/images/portfolio/app/wm/14.png",
        "/images/portfolio/app/wm/15.png",
        "/images/portfolio/app/wm/16.png",
        "/images/portfolio/app/wm/17.png",
        "/images/portfolio/app/wm/18.png",
        "/images/portfolio/app/wm/19.png",
        "/images/portfolio/app/wm/20.png",
        "/images/portfolio/app/wm/21.png",
        "/images/portfolio/app/wm/22.png",
        "/images/portfolio/app/wm/23.png",
        "/images/portfolio/app/wm/24.png",
        "/images/portfolio/app/wm/25.png"
      ],
      features: [
        "維護核心系統並持續實作工業客戶新需求。",
        "整合高可靠性藍牙 BLE 設備搜尋、連線與特徵值監聽機制。",
        "深入理解 Modbus 通訊協議，負責將藍牙接收之原始二進位資料解析為可讀參數。",
        "根據通訊協定實現各項控制需求：設備登入、讀取變頻器狀態、動態調節頻率、電壓、溫度保護閥值等。",
        "串接 MQTT 伺服器實現工業物聯網雲端數據同步。",
        "使用 Appium 編寫自動化 UI 測試腳本，保障軟體品質。"
      ],
      featureCategories: [
        {
          id: "ble-scan",
          name: "設備搜尋與安全認證",
          badge: "01 / BLE SCAN & AUTH",
          description: "快速掃描鄰近工業變頻器與馬達驅動器，支援設備專屬通訊密鑰驗證登入。",
          tags: ["BLE ScanFilter", "Device Security", "Auto Reconnect"],
          images: [
            "/images/portfolio/app/wm/01.png",
            "/images/portfolio/app/wm/02.png",
            "/images/portfolio/app/wm/03.png",
            "/images/portfolio/app/wm/04.png",
            "/images/portfolio/app/wm/05.png",
            "/images/portfolio/app/wm/06.png"
          ]
        },
        {
          id: "telemetry-modbus",
          name: "Modbus 遙測與狀態監控",
          badge: "02 / MODBUS TELEMETRY",
          description: "深入解析 Modbus RTU/TCP 協議封包，即時監控輸出頻率、電流、母線電壓與馬達溫度。",
          tags: ["Modbus Protocol", "Byte Parser", "Realtime Gauges"],
          images: [
            "/images/portfolio/app/wm/07.png",
            "/images/portfolio/app/wm/08.png",
            "/images/portfolio/app/wm/09.png",
            "/images/portfolio/app/wm/10.png",
            "/images/portfolio/app/wm/11.png",
            "/images/portfolio/app/wm/12.png"
          ]
        },
        {
          id: "parameter-control",
          name: "參數配置與故障診斷",
          badge: "03 / PARAMETER TUNING",
          description: "修改加減速時間、最高頻率限制與保護閥值，即時讀取故障代碼與保護警報日誌。",
          tags: ["Register Read/Write", "Fault Logging", "Control Logic"],
          images: [
            "/images/portfolio/app/wm/13.png",
            "/images/portfolio/app/wm/14.png",
            "/images/portfolio/app/wm/15.png",
            "/images/portfolio/app/wm/16.png",
            "/images/portfolio/app/wm/17.png",
            "/images/portfolio/app/wm/18.png"
          ]
        },
        {
          id: "cloud-mqtt",
          name: "MQTT 雲端同步與圖表統計",
          badge: "04 / CLOUD MQTT & CHARTS",
          description: "將設備運行數據透過 MQTT 伺服器同步上雲，提供歷史趨勢圖表與遠端維護紀錄。",
          tags: ["MQTT Client", "Telemetry Sync", "Historical Trend"],
          images: [
            "/images/portfolio/app/wm/19.png",
            "/images/portfolio/app/wm/20.png",
            "/images/portfolio/app/wm/21.png",
            "/images/portfolio/app/wm/22.png",
            "/images/portfolio/app/wm/23.png",
            "/images/portfolio/app/wm/24.png",
            "/images/portfolio/app/wm/25.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / MODBUS PACKET PARSER",
          title: "Modbus 協議手寫位元組解析引擎",
          content: "針對藍牙 MTU 限制分包傳輸，手寫 CRC16 校驗與二進位位元組解析器，精確還原浮點數與整數暫存器。"
        },
        {
          index: "02 / MQTT TELEMETRY PIPELINE",
          title: "MQTT 雙向雲端通訊整合",
          content: "以 MQTT 實現 QoS 1 訊息可靠傳遞，將現場藍牙採集的工業數據即時傳輸至雲端中控平台。"
        },
        {
          index: "03 / APPIUM UI AUTOMATION",
          title: "以 Appium 建構自動化測試套件",
          content: "編寫 Appium Python 測試腳本，自動化驗證關鍵參數修改流程與邊界值校驗，確保工業操作安全。"
        }
      ]
    },
    {
      id: "pos_terminal",
      title: "Terminal Management System (POS 終端解決方案)",
      category: "system",
      categoryLabel: "POS 機終端應用",
      description: "涵蓋 POS 硬體開機啟動、多進程 AIDL 通訊、終端管理 Client、第三方 SDK 開發、票券交易與 AWS Lambda 雲端下發的端到端解決方案。",
      images: [
        "/images/portfolio/app/ctms/01.png",
        "/images/portfolio/app/ctms/02.png",
        "/images/portfolio/app/ctms/03.png",
        "/images/portfolio/app/ctms/04.png",
        "/images/portfolio/app/ctms/05.png",
        "/images/portfolio/app/ctms/06.png",
        "/images/portfolio/app/ctms/07.png",
        "/images/portfolio/app/ctms/08.png",
        "/images/portfolio/app/ctms/09.png",
        "/images/portfolio/app/ctms/10.png",
        "/images/portfolio/app/ctms/11.png"
      ],
      features: [
        "包含 Management App、System SDK、Startup Splash App、AWS Lambda 整合、Update Service 與 Ticketing System。",
        "Management App 與 Terminal Agent 配合使用：專注於 UI、網路請求、本地儲存與 AIDL 通訊實作。",
        "System SDK 專為第三方廠商設計：提供標準化介面與封裝良好之二開元件。",
        "Startup Splash App 作為 POS 機開機啟動應用：監聽開機廣播信號、頁面重定向、API 認證與客製化啟動流程。",
        "AWS Lambda + S3：整合 AWS 雲端服務，依據條件觸發向終端派發指令。",
        "Update Service 與票券系統應用：滿足客戶利用 POS 機硬體特性的各項客製化交易需求。"
      ],
      featureCategories: [
        {
          id: "startup-boot",
          name: "開機啟動與終端初始化",
          badge: "01 / BOOT & INITIALIZATION",
          description: "Startup Splash App 監聽系統 BOOT_COMPLETED 廣播，進行終端硬體自檢、金鑰認證與首頁導向。",
          tags: ["BootReceiver", "Hardware Self-check", "Splash Flow"],
          images: [
            "/images/portfolio/app/ctms/01.png",
            "/images/portfolio/app/ctms/02.png",
            "/images/portfolio/app/ctms/03.png"
          ]
        },
        {
          id: "mgmt-aidl",
          name: "管理端 App 與 AIDL 通訊",
          badge: "02 / MANAGEMENT & AIDL",
          description: "Management App 與底層 Terminal Agent 透過 AIDL 跨進程通訊，管理周邊設備（印表機、掃描頭、刷卡模組）。",
          tags: ["AIDL", "IPC Service", "Hardware Peripheral"],
          images: [
            "/images/portfolio/app/ctms/04.png",
            "/images/portfolio/app/ctms/05.png",
            "/images/portfolio/app/ctms/06.png"
          ]
        },
        {
          id: "ticketing-pos",
          name: "票券系統與交易流程",
          badge: "03 / TICKETING & PAYMENT",
          description: "觸控式票券發售、條碼列印、即時帳目日結與客戶客製化交易 UI 界面。",
          tags: ["Thermal Printer", "Transaction Engine", "Custom UI"],
          images: [
            "/images/portfolio/app/ctms/07.png",
            "/images/portfolio/app/ctms/08.png",
            "/images/portfolio/app/ctms/09.png"
          ]
        },
        {
          id: "cloud-ota",
          name: "AWS Lambda 與遠端配置",
          badge: "04 / CLOUD CONFIG & OTA",
          description: "整合 AWS Lambda 與 S3，雲端條件觸發時自動下發配置命令至特定 POS 機器，支援靜默版本更新。",
          tags: ["AWS Lambda", "AWS S3", "OTA Update Service"],
          images: [
            "/images/portfolio/app/ctms/10.png",
            "/images/portfolio/app/ctms/11.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / AIDL IPC MULTI-PROCESS",
          title: "AIDL 跨進程介面設計與通訊",
          content: "設計低延遲 AIDL 介面契約，協同 Management App 與背景系統服務，安全呼叫硬體裝置與狀態共享。"
        },
        {
          index: "02 / THIRD-PARTY SDK",
          title: "面向第三方開發者的 System SDK",
          content: "抽象底層複雜 POS 協議，封裝高易用性 Android SDK，提供詳細 JavaDoc 與範例代碼供合作廠商二開。"
        },
        {
          index: "03 / AWS SERVERLESS INTEGRATION",
          title: "AWS Lambda + S3 雲端指令架構",
          content: "架構雲端事件驅動模型，當特定營運條件滿足時透過 Lambda 觸發 POS 命令派發，實現集中式雲端運維。"
        }
      ]
    }
  ];

  const allApps = [...studioApps, ...otherApps];

  return (
    <PortfolioSection
      title="App 作品集"
      apps={allApps}
      enableFilter={true}
      locale={locale}
    />
  );
}