import PortfolioSection from './PortfolioSection';
import { AppItem } from '@/types/portfolio';

export default function AndroidPortfolioContentEn({ locale = 'en' }: { locale?: string }) {
  const studioApps: AppItem[] = [
    {
      id: "chatai",
      title: "AI Chat Assistant (ChatInsight.AI)",
      category: "ai",
      categoryLabel: "AI app",
      description: "AI chat app supporting mainstream LLM models, internal enterprise AI bots, workflows, model switching, and group chats.",
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
        "Built 100% in Kotlin with modern Jetpack Compose for declarative UI and fluid animations.",
        "Adopted Navigation-Compose to construct a clean single-activity navigation architecture.",
        "Integrated mainstream LLM model APIs with real-time AI thinking streaming and Markdown rendering.",
        "Implemented session history management, internal enterprise AI bot exploration, and dynamic model switching.",
        "Integrated backend RESTful APIs and AWS S3 storage with production telemetry and debugging tools."
      ],
      featureCategories: [
        {
          id: "chat",
          name: "AI Chat Interaction",
          badge: "01 / CORE CHAT",
          description: "Real-time streaming conversations, Markdown rich formatting, thinking time indicator, regeneration, and multi-turn context memory.",
          tags: ["Jetpack Compose", "Azure GPT-4o", "SSE Streaming", "Kotlin Flow", "Markdown"],
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
          name: "Enterprise Bot Marketplace",
          badge: "02 / BOT MARKETPLACE",
          description: "Internal AI bot and workflow directory filtered by department and creation time, with bookmarks, usage metrics, and knowledge base integration.",
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
          name: "Model & Workspace Switcher",
          badge: "03 / WORKSPACE & MODEL",
          description: "Seamless switching across different LLMs (Azure GPT-4o, etc.) and categorizing conversation sessions into separate project workspaces.",
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
          name: "Auth & Account Settings",
          badge: "04 / AUTH & SETTINGS",
          description: "Corporate email secure authentication, terms of service, privacy policies, permission management, and profile customization.",
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
          title: "Modern Declarative UI with Jetpack Compose",
          content: "Constructed using 100% Kotlin with Jetpack Compose and Navigation-Compose in a single-activity architecture, completely decoupling UI state from business logic."
        },
        {
          index: "02 / REAL-TIME STREAMING",
          title: "Asynchronous Streaming & Instant Rendering",
          content: "Leveraged Coroutines and Kotlin Flow to consume Server-Sent Events (SSE), delivering typewriter token streaming and minimizing perceived latency."
        },
        {
          index: "03 / ENTERPRISE BOT PIPELINE",
          title: "Enterprise Bot & Knowledge Base Integration",
          content: "Connected backend REST APIs with AWS S3 storage, facilitating department-specific knowledge retrieval, session persistence, and offline caching."
        },
        {
          index: "04 / PERFORMANCE & RELIABILITY",
          title: "Performance Monitoring & Recomposition Optimization",
          content: "Implemented global exception handlers and embedded vConsole diagnostics, optimizing long chat list recomposition to prevent jank and crashes."
        }
      ]
    },
    {
      id: "browser",
      title: "AirDroid Kid Browser app",
      category: "mdm",
      categoryLabel: "MDM & Safe Surfing",
      description: "Dedicated safe browser application designed for children and teens, featuring real-time URL black/whitelist filtering, parental monitoring, and history tracking.",
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
        "Researched and evaluated Android browser core implementation strategies prior to project kickoff.",
        "Implemented custom requirement screens and UI widgets 100% in Kotlin.",
        "Engineered cross-app binding, parental authorization workflows, history tracking, and token refresh.",
        "Integrated backend APIs using OkHttp and Retrofit for resilient bidirectional communication.",
        "Led maintenance, release upgrades, and bug fixes."
      ],
      featureCategories: [
        {
          id: "safe-browsing",
          name: "Safe Browsing & Whitelisting",
          badge: "01 / SAFE BROWSING",
          description: "Configures real-time URL whitelist/blacklist policies locally and remotely, automatically blocking explicit or malicious domains.",
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
          name: "Device Pairing & Onboarding",
          badge: "02 / PAIRING & ONBOARDING",
          description: "Initial startup guide pairing with parent AirDroid app for cross-app authorization and token management.",
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
          name: "Bookmarks & History",
          badge: "03 / BOOKMARKS & HISTORY",
          description: "Tab manager, customizable bookmarks, browsing history logs, and search engine preferences.",
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
          name: "Updates & Downloads",
          badge: "04 / SETTINGS & UPDATES",
          description: "OTA update notes, light/dark theme toggles, incognito mode, and cache cleaner utilities.",
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
          title: "Android WebView Core Architecture",
          content: "Researched Android WebView rendering architecture, implementing customized WebViewClient and WebChromeClient for smooth page rendering and request interception."
        },
        {
          index: "02 / CROSS-APP IPC",
          title: "Cross-App Identity & Token Refresh",
          content: "Engineered secure IPC with the parent supervisor app, verifying signatures and automatically renewing tokens without disrupting child browsing."
        },
        {
          index: "03 / CONTENT FILTERING",
          title: "High-Performance URL Interception",
          content: "Utilized localized Trie-tree caching and regex patterns inside shouldInterceptRequest to achieve near-zero-latency policy enforcement."
        },
        {
          index: "04 / ROBUST NETWORKING",
          title: "Retrofit & OkHttp Network Layer",
          content: "Encapsulated network interceptors, telemetry loggers, and offline queuing to ensure reliable logging under weak network conditions."
        }
      ]
    },
    {
      id: "remote-support",
      title: "AirDroid Remote Support app",
      category: "mdm",
      categoryLabel: "Remote Assistance",
      description: "Enterprise cross-device remote assistance solution featuring 9-digit code instant connections, AR 3D marker guidance, unattended remote management, and custom input plugins.",
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
        "Maintained core app and led new feature module development.",
        "Built QR code generation, scanning, onboarding tutorials, enterprise binding, attended/unattended mode switching, and permissions from scratch.",
        "Integrated backend APIs and maintained low-latency bidirectional WebSocket connection.",
        "Authored all new features in Kotlin for clean code and heightened reliability.",
        "Integrated proprietary helper plugin, guided installations, and built-in keyboard (InputMethodService) mapping.",
        "Upgraded build system dependencies to Gradle Version Catalogs (libs.versions.toml)."
      ],
      featureCategories: [
        {
          id: "quick-connect",
          name: "Connection Code & VoIP",
          badge: "01 / QUICK CONNECTION",
          description: "One-click 9-digit dynamic connection code with low-latency VoIP calling and screen streaming.",
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
          name: "QR Code & Enterprise Pairing",
          badge: "02 / ENTERPRISE PAIRING",
          description: "Scan enterprise QR code to quickly join organization fleet and inherit corporate security policies.",
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
          name: "AR 3D Spatial Guidance",
          badge: "03 / AR GUIDANCE",
          description: "Technicians place 3D arrows and markers directly onto remote camera streams to guide on-site operations.",
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
          name: "Unattended & Keyboard Plugin",
          badge: "04 / UNATTENDED & INPUT",
          description: "Unattended mode for zero-touch access, paired with custom InputMethodService plugin for precise keystroke injection.",
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
          title: "Persistent Signaling & Real-time Connectivity",
          content: "Maintained WebSocket heartbeat and automatic reconnection to transmit remote control signals within milliseconds."
        },
        {
          index: "02 / INPUT PLUGIN INTEGRATION",
          title: "Custom InputMethodService Plugin Architecture",
          content: "Engineered plugin installation flow and utilized Android InputMethodService for cross-platform keyboard mapping and shortcut injection."
        },
        {
          index: "03 / ATTENDED VS UNATTENDED",
          title: "Dual Mode Switching & Security Enforcement",
          content: "Dynamically adjusted permission prompts based on security policies, leveraging Accessibility Services for continuous unattended standby."
        },
        {
          index: "04 / VERSION CATALOGS",
          title: "Gradle Dependency Modernization",
          content: "Migrated legacy multi-module dependencies to modern Gradle Version Catalogs (libs.versions.toml) for standardized dependency management."
        }
      ]
    },
    {
      id: "biz",
      title: "AirDroid Business - Enterprise MDM App",
      category: "mdm",
      categoryLabel: "Enterprise MDM",
      description: "Enterprise mobile device management (MDM/EMM) client offering Device Owner deep policies, Samsung Knox API integration, single-app Kiosk lockdown, and configuration provisioning.",
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
        "Maintained enterprise app and supported continuous MDM feature evolution.",
        "Built robust enterprise-grade UI components and system management screens.",
        "Researched and implemented device policy management features.",
        "Integrated Samsung Knox SDK for hardware-level enterprise controls."
      ],
      featureCategories: [
        {
          id: "device-policy",
          name: "Device Policy & Knox Control",
          badge: "01 / DEVICE POLICY",
          description: "Device Owner privileges and Knox integration to remotely restrict camera, USB transfers, Bluetooth, and settings.",
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
          name: "Kiosk Mode & App Distribution",
          badge: "02 / KIOSK & APP MANAGEMENT",
          description: "Locks devices into designated enterprise applications to prevent misuse, supporting silent enterprise APK distribution.",
          tags: ["Kiosk Mode", "Silent Install", "PackageInstaller"],
          images: [
            "/images/portfolio/app/biz/05.png",
            "/images/portfolio/app/biz/06.png",
            "/images/portfolio/app/biz/07.png"
          ]
        },
        {
          id: "system-security",
          name: "Device Status & Security Audit",
          badge: "03 / SECURITY & AUDIT",
          description: "Real-time battery, storage, location tracking, and network anomaly telemetry reporting to enterprise admin dashboards.",
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
          title: "Samsung Knox SDK Integration",
          content: "Integrated Knox Enterprise License (KLM/ELM) activation workflows to unlock deep hardware restrictions on Samsung enterprise devices."
        },
        {
          index: "02 / DEVICE OWNER ARCHITECTURE",
          title: "Android Enterprise Privileged Architecture",
          content: "Followed Android Enterprise standards, provisioning Device Owner status via NFC/DPC for rootless enterprise governance."
        },
        {
          index: "03 / BACKGROUND RESILIENCY",
          title: "Background Services & Keep-Alive Watchdog",
          content: "Combined Foreground Services with JobScheduler to withstand aggressive OEM battery optimizers and guarantee prompt command execution."
        }
      ]
    },
    {
      id: "kp",
      title: "AirDroid Kids - Parental Control App",
      category: "mdm",
      categoryLabel: "Parental Supervision",
      description: "Child protection and supervision client featuring geofence alerts, scheduled screen time limits, app blocking, and alert notifications.",
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
        "Maintained client app stability across diverse Android versions and screen sizes.",
        "Built responsive UI views matching comprehensive design specifications.",
        "Refactored the primary 'My Page' profile and child settings screens.",
        "Resolved UI display defects and fixed historical layout rendering bugs."
      ],
      featureCategories: [
        {
          id: "screen-time",
          name: "Screen Time & App Limits",
          badge: "01 / SCREEN TIME",
          description: "Flexible daily time allowances and bedtime curfews that lock down restricted apps when time limits are reached.",
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
          name: "Live Location & Geofencing",
          badge: "02 / LOCATION & GEOFENCE",
          description: "High-accuracy GPS positioning and geofence boundary alerts keeping parents informed of child safety zones.",
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
          name: "Activity Reports & Profile",
          badge: "03 / ACTIVITY REPORT",
          description: "Daily/weekly app usage charts, device unlock count metrics, and child account personalization.",
          tags: ["Data Visualization", "My Page UI", "Custom Views"],
          images: [
            "/images/portfolio/app/kp/09.png",
            "/images/portfolio/app/kp/010.png",
            "/images/portfolio/app/kp/011.png",
            "/images/portfolio/app/kp/012.png"
          ]
        }
      ],
      technicalDetails: [
        {
          index: "01 / MY PAGE REFACTORING",
          title: "Profile & Settings Screen Modernization",
          content: "Refactored legacy nested layout hierarchies in My Page, eliminating frame drops and achieving smooth 60fps scrolling."
        },
        {
          index: "02 / PERMISSION STABILITY",
          title: "OEM Accessibility & Usage Stats Guarding",
          content: "Designed customized onboarding wizards for major OEM ROMs (Xiaomi, Huawei, OPPO) to prevent accidental permission revocation."
        },
        {
          index: "03 / REAL-TIME REPORTING",
          title: "Local Usage Event Aggregation",
          content: "Locally aggregated and compressed UsageEvents before batch transmission, substantially minimizing network bandwidth and battery draw."
        }
      ]
    }
  ];

  const otherApps: AppItem[] = [
    {
      id: "exercise",
      title: "Sports IoT app (Vitality Coach & BLE Sensors)",
      category: "iot",
      categoryLabel: "IoT",
      description: "Smart fitness IoT mobile application integrating BLE fitness equipment and wearable sensors, offering live vitality coaching, resistance tuning, and workout metrics.",
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
        "Independently implemented the Vitality Coach UI, animations, and training routines.",
        "Architected and maintained local Room Database for high-frequency sensor readings and workout sessions.",
        "Resolved device compatibility quirks during BLE advertisement scanning across varied Android vendors."
      ],
      featureCategories: [
        {
          id: "coach-ui",
          name: "Vitality Coach UI & Workout",
          badge: "01 / COACH UI",
          description: "Dynamic coach prompts, cadence meters, and real-time resistance/incline visual feedback.",
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
          name: "BLE Equipment Sync",
          badge: "02 / BLE SENSOR SYNC",
          description: "Scans smart stationary bikes and treadmills, establishing stable GATT connections to ingest wattage, cadence, and heart rate telemetry.",
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
          name: "Performance Charts & Metrics",
          badge: "03 / METRICS & CHARTS",
          description: "Dynamic line charts for calorie burn, heart rate zones, and speed curves to guide training adjustments.",
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
          name: "Workout History & Goals",
          badge: "04 / WORKOUT HISTORY",
          description: "Persists workout milestones into local Room Database, enabling historical reviews and weekly goal completions.",
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
          title: "Time-series Fitness Database Architecture",
          content: "Designed Room entities for workout sessions with second-by-second telemetry records, supporting fast aggregate queries."
        },
        {
          index: "02 / COACH UI IMPLEMENTATION",
          title: "Custom Coach Animation Views",
          content: "Built custom Views and property animators for coach rhythm indicators and power gauges, achieving solid 60fps animations."
        }
      ]
    },
    {
      id: "dispatch_car",
      title: "Dispatch Taxi app (Rider Platform)",
      category: "service",
      categoryLabel: "Mobility & Dispatch",
      description: "Commercial taxi dispatch passenger app evolved from v8.0 to v9.0, refactored to Kotlin with map routing, fare estimation, FCM push matching, and ad integration.",
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
        "Maintained version 8.0 and resolved critical production defects.",
        "Refactored the application from Java to Kotlin, modernizing the codebase.",
        "Built version 9.0 UI from scratch according to updated product designs.",
        "Engineered login, ride booking, push notifications, smooth vehicle tracking, ad mediation, and Crashlytics.",
        "Employed industry-standard toolset: Retrofit, OkHttp, RxJava, Dagger2, etc."
      ],
      featureCategories: [
        {
          id: "booking-map",
          name: "Map Navigation & Booking",
          badge: "01 / MAP & BOOKING",
          description: "Google Maps positioning, autocomplete suggestions, instant fare calculation, and scheduled ride reservations.",
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
          name: "Driver Matching & Tracking",
          badge: "02 / DISPATCH & TRACKING",
          description: "Real-time push order dispatching with smooth vehicle marker animation and estimated arrival countdowns.",
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
          name: "Payment & Trip Review",
          badge: "03 / PAYMENT & REVIEW",
          description: "Credit card, mobile pay, and coupon discounts with automated digital receipts and driver rating workflows.",
          tags: ["Payment Gateway", "Coupon System", "Rating Flow"],
          images: [
            "/images/portfolio/app/call_car/09.png",
            "/images/portfolio/app/call_car/10.png",
            "/images/portfolio/app/call_car/11.png"
          ]
        },
        {
          id: "member-center",
          name: "Rider Profile & History",
          badge: "04 / PROFILE & HISTORY",
          description: "Trip history invoices, electronic receipt carrier settings, lost-and-found reports, and user preferences.",
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
          title: "Full Codebase Migration to Kotlin",
          content: "Spearheaded the migration of legacy Java code to Kotlin, leveraging Null Safety and extension functions to eliminate NullPointerExceptions."
        },
        {
          index: "02 / ARCHITECTURE EVOLUTION",
          title: "MVVM Architecture with Dagger2",
          content: "Introduced Dagger2 dependency injection alongside Retrofit + OkHttp + RxJava to establish clean separation of concerns."
        },
        {
          index: "03 / MAP POLYLINE DECODING",
          title: "Google Maps Polyline Decoding & Route Drawing",
          content: "Integrated Google Maps API to parse route JSON, implemented Polyline decoding algorithm (overview_polyline), and accurately rendered real-time route estimates."
        },
        {
          index: "04 / CRASHLYTICS & ADS",
          title: "Crash Monitoring & Ad Monetization",
          content: "Integrated Firebase Crashlytics to monitor stability while incorporating Google AdMob SDK for commercial revenue generation."
        }
      ]
    },
    {
      id: "wm_app",
      title: "Bluetooth IoT app (Industrial Inverter Controller)",
      category: "iot",
      categoryLabel: "Industrial IoT",
      description: "Industrial-grade BLE diagnostics and control system directly connecting to inverters, parsing Modbus protocol packets, tuning frequencies, and synchronizing with MQTT clouds.",
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
        "Maintained core application and implemented new features for industrial clients.",
        "Integrated robust BLE device discovery, connection, and characteristic notification mechanisms.",
        "Decoded Modbus communication protocol, translating raw binary packets into readable telemetry.",
        "Implemented critical control capabilities: authentication, device state reading, and dynamic frequency/voltage/temperature adjustments.",
        "Synchronized operational data with central MQTT telemetry servers.",
        "Authored automated UI test suites with Appium."
      ],
      featureCategories: [
        {
          id: "ble-scan",
          name: "BLE Discovery & Auth",
          badge: "01 / BLE SCAN & AUTH",
          description: "Rapidly discovers industrial inverters and motor drives, supporting cryptographically authenticated logins.",
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
          name: "Modbus Telemetry Gauges",
          badge: "02 / MODBUS TELEMETRY",
          description: "Decodes Modbus RTU/TCP packets in real time to monitor output frequency, electric current, bus voltage, and motor temperatures.",
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
          name: "Parameter Tuning & Diagnostics",
          badge: "03 / PARAMETER TUNING",
          description: "Configures acceleration/deceleration durations, frequency ceilings, and reads fault codes and alarm logs.",
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
          name: "MQTT Cloud Sync & Trends",
          badge: "04 / CLOUD MQTT & CHARTS",
          description: "Syncs operational data with remote MQTT brokers for historical trend curves and predictive maintenance.",
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
          title: "Custom Modbus Binary Parsing Engine",
          content: "Built custom CRC16 check and byte parsing utilities for packet chunking across BLE MTU limits, reconstructing integer and floating-point registers."
        },
        {
          index: "02 / MQTT TELEMETRY PIPELINE",
          title: "Bidirectional MQTT Cloud Communication",
          content: "Implemented MQTT with QoS 1 message delivery guarantees to feed industrial telemetry into cloud dashboards."
        },
        {
          index: "03 / APPIUM UI AUTOMATION",
          title: "Automated QA with Appium",
          content: "Wrote automated Appium Python regression test suites validating critical parameter limits and boundary validation rules."
        }
      ]
    },
    {
      id: "pos_terminal",
      title: "Terminal Management System (POS & IoT Solution)",
      category: "system",
      categoryLabel: "POS Terminal App",
      description: "End-to-end POS hardware startup, multi-process AIDL IPC, Management Client, third-party SDK, ticketing transactions, and AWS Lambda remote provisioning.",
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
        "Comprises Management App, System SDK, Startup Splash App, AWS Lambda integration, Update Service, and Ticketing System.",
        "Management App with Terminal Agent: Built UI, networking, storage, and AIDL inter-process communication.",
        "System SDK designed for third-party developers: Provided clean API contracts and integration libraries.",
        "Startup Splash app: Listened for boot signals, initialized POS hardware, and performed startup authentication.",
        "AWS Lambda + S3: Triggered automated POS configuration commands based on cloud business rules.",
        "Update Service and Ticketing App: Delivered customized transaction experiences leveraging POS peripheral hardware."
      ],
      featureCategories: [
        {
          id: "startup-boot",
          name: "Boot & Initialization",
          badge: "01 / BOOT & INITIALIZATION",
          description: "Startup Splash App intercepts BOOT_COMPLETED broadcast, running hardware self-tests, key authentication, and route redirection.",
          tags: ["BootReceiver", "Hardware Self-check", "Splash Flow"],
          images: [
            "/images/portfolio/app/ctms/01.png",
            "/images/portfolio/app/ctms/02.png",
            "/images/portfolio/app/ctms/03.png"
          ]
        },
        {
          id: "mgmt-aidl",
          name: "Management App & AIDL IPC",
          badge: "02 / MANAGEMENT & AIDL",
          description: "Management App talks with Terminal Agent over AIDL IPC to manage peripherals (thermal printers, barcode scanners, card readers).",
          tags: ["AIDL", "IPC Service", "Hardware Peripheral"],
          images: [
            "/images/portfolio/app/ctms/04.png",
            "/images/portfolio/app/ctms/05.png",
            "/images/portfolio/app/ctms/06.png"
          ]
        },
        {
          id: "ticketing-pos",
          name: "Ticketing & Payments",
          badge: "03 / TICKETING & PAYMENT",
          description: "Touchscreen ticketing, receipt barcode printing, shift settlement, and customized retail checkout interfaces.",
          tags: ["Thermal Printer", "Transaction Engine", "Custom UI"],
          images: [
            "/images/portfolio/app/ctms/07.png",
            "/images/portfolio/app/ctms/08.png",
            "/images/portfolio/app/ctms/09.png"
          ]
        },
        {
          id: "cloud-ota",
          name: "AWS Lambda & Cloud OTA",
          badge: "04 / CLOUD CONFIG & OTA",
          description: "Integrates AWS Lambda and S3 to dispatch configuration payloads to fleets of POS terminals with silent background updates.",
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
          title: "AIDL Multi-Process Interface Design",
          content: "Designed low-latency AIDL contracts linking the UI application with background hardware daemons for secure peripheral multiplexing."
        },
        {
          index: "02 / THIRD-PARTY SDK",
          title: "Developer-Friendly System SDK",
          content: "Abstracted complex low-level POS protocols into an intuitive Android SDK complete with JavaDoc and sample reference implementations."
        },
        {
          index: "03 / AWS SERVERLESS INTEGRATION",
          title: "AWS Lambda + S3 Event-Driven Architecture",
          content: "Architected cloud event-driven workflows where operational triggers in Lambda dispatch commands down to targeted POS fleets."
        }
      ]
    }
  ];

  const allApps = [...studioApps, ...otherApps];

  return (
    <PortfolioSection
      title="App Portfolio"
      apps={allApps}
      enableFilter={true}
      locale={locale}
    />
  );
}