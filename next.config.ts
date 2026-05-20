import type { NextConfig } from "next";

// 所有文章 permalink 短網址清單
// dev 模式：透過 redirects 重導向到預設 locale (zh)，解決 generateStaticParams 錯誤
// 生產環境（static export）：靠 404.html 的 JS 做瀏覽器語言自動偵測後重導向
const PERMALINK_SLUGS = [
  'adapted-for-android-15-with-16-kb-page-size',
  'android-16-note',
  'android-emulator-detection',
  'android-jetpack-compose-structure-part1',
  'android-jetpack-compose-structure-part2',
  'android-jetpack-compose-structure-part3',
  'android-jetpack-compose-structure-part4',
  'android-kt-jetpack-compose-base',
  'android-kt-jetpack-compose-list',
  'android-kt-jetpack-compose-splash',
  'android-kt-jetpack-compose-swiperefresh',
  'android-kt-rxjava',
  'android-qrcode-scanner-with-mlkit',
  'android-target-sdk-35',
  'android-upgrade-to-toml-tutorial',
  'android-webview-kotlin-compose-next-js',
  'android_aidl',
  'android_custom01',
  'android_custom02',
  'android_custom03',
  'android_huawei_map',
  'app_portfolio',
  'clear_use_extension_to_set_margin',
  'compose-multiplatform-datastore',
  'compose-multiplatform-day-1',
  'compose-multiplatform-day-2',
  'compose-multiplatform-day-3',
  'compose-multiplatform-day-4',
  'compose-multiplatform-day-5',
  'compose-multiplatform-day-6',
  'compose-multiplatform-day-7',
  'compose-multiplatform-day-8',
  'compose-multiplatform-day-9',
  'compose-multiplatform-day-10',
  'compose-multiplatform-day-11',
  'compose-multiplatform-day-12',
  'compose-multiplatform-day-13',
  'compose-multiplatform-day-14',
  'compose-multiplatform-day-15',
  'compose-multiplatform-di-context',
  'compose-multiplatform-guide',
  'compose-multiplatform-ios-cocoapods',
  'compose-multiplatform-koin',
  'compose-multiplatform-room',
  'compose-multiplatform-sqldelight',
  'cursor-ai-note',
  'cursor-ai-with-android',
  'deepwiki',
  'easy_use_chat_gpt_with_line_bot',
  'flutter-newer',
  'flutter-use-cursor',
  'jeykll_deploy_4_x',
  'kotlin_flow_refactor',
  'kotlin_room',
  'kotlin_snake_game',
  'navigation_with_kotlin',
  'safe_browser',
  'use-atlassian-mcp-to-solve-jira-problem',
  'wbc-tournament-simulator',
];

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // dev 模式不啟用 output: 'export'，讓 redirects 生效且解除 generateStaticParams 嚴格驗證
  // prod build 才啟用 static export
  ...(isDev ? {} : { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // redirects 只在 dev 模式加入 config，prod build 完全不包含此設定，消除 ⚠ 警告
  ...(isDev ? {
    async redirects() {
      return PERMALINK_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/zh/posts/${slug}`,
        permanent: false,
      }));
    },
  } : {}),
};

export default nextConfig;
