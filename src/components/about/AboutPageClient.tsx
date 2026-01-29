'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import {
  Github,
  Twitter,
  Instagram,
  Facebook,
  Code,
  Smartphone,
  Database,
  Cloud,
  Zap,
  Users,
  Award,
  ChevronDown
} from 'lucide-react';

interface AboutPageClientProps {
  locale: string;
}

export default function AboutPageClient({ locale }: AboutPageClientProps) {
  const getText = (zh: string, en: string, ja: string) => {
    switch (locale) {
      case 'en': return en;
      case 'ja': return ja;
      default: return zh;
    }
  };

  const skills = [
    {
      category: getText('程式語言', 'Programming Languages', 'プログラミング言語'),
      items: ['Kotlin', 'Java'],
      icon: <Code className="w-5 h-5" />
    },
    {
      category: getText('Android 視圖', 'Android Views', 'Android ビュー'),
      items: ['Jetpack Compose', 'AndroidX Layout'],
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      category: getText('常用函式庫', 'Common Libraries', '一般的なライブラリ'),
      items: ['LiveData', 'ViewModel', 'ViewBinding', 'NavGraph'],
      icon: <Code className="w-5 h-5" />
    },
    {
      category: getText('本地資料', 'Local Data', 'ローカルデータ'),
      items: ['Room', 'SQLite'],
      icon: <Database className="w-5 h-5" />
    },
    {
      category: getText('架構模式', 'Architecture', 'アーキテクチャ'),
      items: ['MVVM'],
      icon: <Code className="w-5 h-5" />
    },
    {
      category: getText('第三方服務', 'Third-Party Services', 'サードパーティサービス'),
      items: ['Facebook', 'AWS S3', 'Lambda', 'Google Map', 'Huawei SDK', 'Line API', 'Samsung Knox'],
      icon: <Cloud className="w-5 h-5" />
    },
    {
      category: getText('推播通知', 'Push Notifications', 'プッシュ通知'),
      items: ['FCM', 'Huawei Push Kit'],
      icon: <Zap className="w-5 h-5" />
    },
    {
      category: getText('非同步程式設計', 'Asynchronous Programming', '非同期プログラミング'),
      items: ['Thread', 'AsyncTask', 'Handler', 'Coroutine'],
      icon: <Zap className="w-5 h-5" />
    },
    {
      category: getText('相容性', 'Compatibility', '互換性'),
      items: ['Android 5~16'],
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      category: getText('依賴注入', 'Dependency Injection', '依存性注入'),
      items: ['Dagger', 'Koin'],
      icon: <Code className="w-5 h-5" />
    },
    {
      category: getText('流程控制', 'Flow Control', 'フロー制御'),
      items: ['RxJava', 'Kotlin Flow'],
      icon: <Zap className="w-5 h-5" />
    },
    {
      category: getText('網路通訊', 'Network', 'ネットワーク'),
      items: ['OkHttp', 'Retrofit', 'HttpClient'],
      icon: <Cloud className="w-5 h-5" />
    },
    {
      category: getText('程序間通訊', 'IPC', 'プロセス間通信'),
      items: ['Socket', 'AIDL', 'BroadCast', 'Messenger', 'ContentProvider'],
      icon: <Users className="w-5 h-5" />
    }
  ];

  const projects = [
    {
      title: getText('Android 行動裝置管理解決方案', 'Android Mobile Device Management Solution', 'Android モバイルデバイス管理ソリューション'),
      description: getText(
        '我在這裡主要使用 Kotlin 維護和開發多個應用程式。這些應用程式提供完整的 UI/UX 設計和圖形，我能夠完全實現它們。我們使用 ViewBinding、ViewModel 和 LiveData 等函式庫來實現強大的功能。',
        'I am maintaining and developing multiple apps primarily using Kotlin here. These apps offer complete UI/UX design with accompanying graphics, and I am capable of fully implementing them. We utilize libraries such as ViewBinding, ViewModel, and LiveData to enable robust functionality.',
        'ここでは主にKotlinを使用して複数のアプリを保守・開發しています。これらのアプリは完全なUI/UXデザインとグラフィックを提供し、私はそれらを完全に実装することができます。ViewBinding、ViewModel、LiveDataなどのライブラリを使用して堅牢な機能を実現しています。'
      ),
      image: '/images/about/personal.png',
      link: '/posts/app_portfolio#airdroid',
      tags: ['Android', 'Kotlin', 'Java']
    },
    {
      title: getText('計程車調度應用', 'Taxi Dispatch App', 'タクシー配車アプリ'),
      description: getText(
        '我們的應用程式是一個按需計程車調度平台，通過向後端 GIS 系統請求來檢索相關服務。我使用 VIPER 架構並使用 Kotlin 重構了應用程式。我的職責包括開發新功能、開發自定義 UI 以及與後端服務或第三方服務整合。',
        'Our app is an on-demand taxi dispatching platform that retrieves relevant services through a request to the backend GIS system. I used the VIPER architecture and refactored the app using Kotlin. My responsibilities included developing the new features, developing custom UI, and integrating with backend services or third-party services.',
        '私たちのアプリは、バックエンドGISシステムへのリクエストを通じて関連サービスを取得するオンデマンドタクシー配車プラットフォームです。VIPERアーキテクチャを使用し、Kotlinでアプリをリファクタリングしました。私の責任には、新機能の開発、カスタムUIの開発、バックエンドサービスやサードパーティサービスとの統合が含まれていました。'
      ),
      image: '/images/about/personal.png',
      link: '/posts/app_portfolio#dispatch_car',
      tags: ['Android', 'Kotlin', 'Java']
    },
    {
      title: getText('藍牙控制器 Android 應用', 'Bluetooth Controller Android App', 'Bluetooth コントローラー Android アプリ'),
      description: getText(
        '此應用程式旨在使用 Modbus 暫存器遠端控制藍牙設備。用戶可以與應用程式互動，通過各種 Modbus 地址操作藍牙設備的狀態。此外，我還使用 Appium 對此專案進行了自動化測試。',
        'This app is designed to remotely control Bluetooth devices using Modbus registers. User can interact with the app to manipulate the status of the Bluetooth device through various Modbus address. In addition, I have also utilized Appium for automated testing of this project.',
        'このアプリは、Modbusレジスタを使用してBluetoothデバイスをリモート制御するように設計されています。ユーザーはアプリと対話して、さまざまなModbusアドレスを通じてBluetoothデバイスのステータスを操作できます。さらに、このプロジェクトの自動テストにAppiumも使用しました。'
      ),
      image: '/images/about/wm.jpeg',
      link: '/posts/app_portfolio#wm_app',
      tags: ['Android', 'Kotlin', 'Java', 'Appium']
    },
    {
      title: getText('健康與健身數據應用', 'Health and Fitness Data App', '健康・フィットネスデータアプリ'),
      description: getText(
        '我負責此應用程式的「活力教練」部分，主要使用 Kotlin 開發。在開發過程中，我還使用了 NavGraph、viewbinding、MVVM 架構和 MPAndroidchart 等工具。',
        'I am responsible for the "Vitality Coach" section of this app, developed primarily using Kotlin. During the development process, I also utilized NavGraph, viewbinding, MVVM architecture, and MPAndroidchart, among other tools.',
        'このアプリの「バイタリティコーチ」セクションを担当し、主にKotlinを使用して開発しました。開発プロセス中に、NavGraph、viewbinding、MVVMアーキテクチャ、MPAndroidchartなどのツールも使用しました。'
      ),
      image: '/images/about/app_exercise.png',
      link: '/posts/app_portfolio#exercise',
      tags: ['Android', 'Kotlin']
    }
  ];

  const capabilities = [
    getText('精通官方 Android 函式庫，如 Jetpack Compose、LiveData、ViewBinding、NavGraph、Coroutine 等', 'Proficient in official Android libraries such as Jetpack Compose, LiveData, ViewBinding, NavGraph, Coroutine, etc.', '公式AndroidライブラリであるJetpack Compose、LiveData、ViewBinding、NavGraph、Coroutineなどに精通'),
    getText('具有原生 Android 應用程式開發經驗，精通 Kotlin 或 Java 程式語言', 'Experienced in native Android app development, proficient in Kotlin or Java programming languages.', 'ネイティブAndroidアプリ開発の経験があり、KotlinまたはJavaプログラミング言語に精通'),
    getText('能夠協助使用 MVVM 架構進行開發', 'Capable of assisting in development using the MVVM architecture.', 'MVVMアーキテクチャを使用した開発を支援可能'),
    getText('能夠開發藍牙應用程式（之前使用 Modbus 協議整合藍牙）', 'Able to develop Bluetooth apps (previously integrated Bluetooth using Modbus protocol).', 'Bluetoothアプリの開発が可能（以前にModbusプロトコルを使用してBluetoothを統合）'),
    getText('能夠為 POS 終端開發 Android 應用程式', 'Capable of developing Android apps for POS terminals.', 'POSターミナル用のAndroidアプリ開発が可能'),
    getText('精通使用 AIDL 進行開發', 'Proficient in using AIDL for development.', 'AIDL開発に精通'),
    getText('能夠完全實現設計師提供的 UI/UX 設計到 Android 應用程式中', 'Capable of fully implementing UI/UX designs as provided by designers into Android apps.', 'デザイナーが提供するUI/UXデザインをAndroidアプリに完全に実装可能'),
    getText('能夠調整資料庫或持久化資料儲存，如 Room、SQLite、MMKV、SharedPreferences', 'Capable of adjusting databases or persistent data storage, such as Room, SQLite, MMKV, SharedPreferences.', 'Room、SQLite、MMKV、SharedPreferencesなどのデータベースや永続データストレージの調整が可能'),
    getText('能夠協助開發無障礙服務和裝置擁有者功能', 'Capable of assisting in developing accessibility services, and Device Owner features.', 'アクセシビリティサービスとDevice Owner機能の開発を支援可能'),
    getText('能夠協助從 Android 5.0 到 16 的版本相容性', 'Able to assist in version compatibility from Android 5.0 to 16.', 'Android 5.0から16までのバージョン互換性を支援可能'),
    getText('具有從零開始開發 Android 應用程式的經驗', 'Experienced in developing Android apps from scratch.', 'Androidアプリをゼロから開発した経験あり'),
    getText('開發過各種商業應用程式，經驗豐富（超過 5000 萬次下載）', 'Developed various commercial apps with extensive experience (over 50M downloads).', '様々な商用アプリを開発し、豊富な経験（5000万ダウンロード以上）'),
    getText('精通整合常見的第三方函式庫，如 OkHttp、Retrofit，以及依賴注入工具如 Dagger、Koin 等', 'Proficient in integrating common third-party libraries such as OkHttp, Retrofit, and dependency injection tools like Dagger, Koin, etc.', 'OkHttp、Retrofitなどの一般的なサードパーティライブラリや、Dagger、Koinなどの依存性注入ツールの統合に精通'),
    getText('能夠整合第三方 API，如 Facebook API、AWS S3、Lambda、Google、Line、Huawei SDK 等', 'Capable of integrating third-party APIs such as Facebook API, AWS S3, Lambda, Google, Line, Huawei SDK, etc.', 'Facebook API、AWS S3、Lambda、Google、Line、Huawei SDKなどのサードパーティAPIの統合が可能'),
    getText('可以根據提供的文件學習和開發，為其他整合需求提供協助', 'Can provide assistance for other integration needs by studying and developing based on provided documentation.', '提供された文書に基づいて学習・開発し、その他の統合ニーズに対してサポートを提供可能'),
    getText('能夠除錯錯誤，如 QA 測試期間發現的錯誤，並可以檢查任何原始碼以識別問題', 'Capable of debugging bugs, such as those discovered during QA testing, and can review any source code to identify issues.', 'QAテスト中に発見されたバグなどのデバッグが可能で、問題を特定するためにソースコードをレビュー可能'),
    getText('可以指導您閱讀專案的原始碼', 'Can guide you through reading source code of projects.', 'プロジェクトのソースコードの読み方を指導可能'),
    getText('願意使用 Git 協作以確保程式碼同步', 'Willing to collaborate using Git to ensure code synchronization.', 'コードの同期を確保するためにGitを使用した協力を喜んで行う'),
    getText('可以協助使用 Git 指令並在需要時提供指導', 'Can assist in using Git commands and provide guidance if needed.', 'Gitコマンドの使用を支援し、必要に応じて指導を提供可能')
  ];

  // 滾動到下一個區塊的函數
  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderWrapper locale={locale} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src={siteConfig.author.avatar}
              alt="WaitZ"
              width={150}
              height={150}
              className="mx-auto rounded-full border-4 border-white shadow-xl"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            WaitZ
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {getText('程式設計師 • Android 開發者', 'Programmer • Android Developer', 'プログラマー • Android 開発者')}
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href={siteConfig.author.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Twitter className="w-6 h-6 text-blue-500" />
            </a>
            <a
              href={siteConfig.author.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-6 h-6 text-pink-500" />
            </a>
            <a
              href={siteConfig.author.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Facebook className="w-6 h-6 text-blue-600" />
            </a>
            {siteConfig.author.social.github && (
              <a
                href={siteConfig.author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </a>
            )}
          </div>

          <button
            onClick={scrollToNextSection}
            className="animate-bounce cursor-pointer hover:text-primary transition-colors"
            aria-label={getText('滾動到下一個區塊', 'Scroll to next section', '次のセクションにスクロール')}
          >
            <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {getText('關於我', 'About Me', '私について')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {getText(
                '我能為您做什麼？',
                'What can I do for you?',
                'あなたのために何ができるでしょうか？'
              )}
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 hover:border-primary/20"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <Award className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-foreground leading-relaxed">{capability}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {getText('Android 開發經驗', 'Android Experience', 'Android 開発経験')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {skill.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{skill.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {getText('精選專案', 'Featured Projects', '注目プロジェクト')}
            </h2>
          </div>

          <div className="space-y-20">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="relative group">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {project.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/${locale}${project.link}`}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      <span>{getText('更多詳情', 'More Details', '詳細を見る')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2026 <a href="https://elegantaccess.org/" className="text-primary hover:underline">Elegant Access</a>
          </p>
        </div>
      </footer>
    </div>
  );
} 