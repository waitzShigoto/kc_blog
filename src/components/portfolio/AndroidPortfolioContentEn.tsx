import PortfolioSection from './PortfolioSection';

export default function AndroidPortfolioContentEn() {
  const studioApps = [
    {
      id: "chatai",
      title: "AI Chat Assistant",
      description: "This app enable user chat with AI bot.",
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
        "Developing new features and implementing product requirements.",
        "Integrating backend APIs, AWS S3, and other functionalities.",
        "100% Kotlin",
        "Using Jetpack Compose and Navigation-Compose to finish UI.",
        "Maintenance and debugging.",
        "Implement several new features like chat, exploreAI, select model, etc."
      ]
    },
    {
      id: "browser",
      title: "Kid Browser app",
      description: "",
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
        "Developing new features.",
        "Implemented product requirement screens.",
        "Implemented feature of binding, integration with other apps, history tracking, token refresh, etc.",
        "Completed in Kotlin",
        "Integrating backend API with Okhttp and Retrofit.",
        "Before starting the project, I was responsible for researching information on how to implement a browser",
        "Maintenance and debugging."
      ]
    },
    {
      id: "remote-support",
      title: "Remote Support app",
      description: "",
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
        "Maintaining the app and developing new features.",
        "Implementing requirement screens and customizing the UI.",
        "From scratch implemented features of QR code generation, QR code scanning, introduction, binding, switching between unattended/attended modes, permissions, integrating plugins, etc.",
        "Integrating backend APIs and maintaining long-term connection with WebSocket.",
        "All new features were written in Kotlin.",
        "The project involved integration with our own plugin, implementing guided downloads, and adding and maintaining the built-in keyboard (InputMethodService) functionality within the plugin.",
        "Upgrade to version catlogs with .toml."
      ]
    },
    {
      id: "biz",
      title: "Enterprise Management App",
      description: "",
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
        "Maintaining the app and developing new features.",
        "Implementing product requirement screens.",
        "Implementing device policy-related functionalities.",
        "Researching Knox"
      ]
    },
    {
      id: "kp",
      title: "Family Control App",
      description: "",
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
        "Maintaining the app.",
        "Implementing product requirement screens.",
        "Responsible for the UI of the My page.",
        "Fixing bugs, such as UI display issues."
      ]
    }
  ];

  const otherApps = [
    {
      id: "exercise",
      title: "Sports IoT app",
      description: "This is a project I encountered during my previous freelance work.",
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
        "Implementing the Vitality Coach UI for the project.",
        "Assisting in clarifying Bluetooth processes, maintaining Room database, and fixing bugs."
      ]
    },
    {
      id: "dispatch_car",
      title: "Dispatch Taxi app",
      description: "I have experienced two versions of this app, from version 8.0 to 9.0.",
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
        "Maintaining the app version 8.0 and fixing bugs.",
        "Refactoring the app from Java to Kotlin.",
        "Implemented UI requirements for version 9.0 based on project needs.",
        "Implemented features such as login, ride-car, push notification, map, ad integration, and Crashlytics integration.",
        "Developing with common libraries: Retrofit, OkHttp, RxJava, Dagger2, etc."
      ]
    },
    {
      id: "wm_app",
      title: "Bluetooth IoT app",
      description: "",
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
        "Maintaining the app and developing new features.",
        "Integrating Bluetooth connections, searches, etc.",
        "Understanding the Modbus protocol and parsing data received via Bluetooth.",
        "Implementing required functionalities based on defined protocols, such as logging into the bluetooth device, retrieving bluetooth device information, modifying bluetooth device frequency, voltage, temperature, etc.",
        "Integrating with the MQTT server.",
        "Writing UI tests using Appium."
      ]
    },
    {
      id: "pos_terminal",
      title: "Terminal Management System",
      description: "This solution involves multiple systems. I was responsible for the development of several components.",
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
        "Including Management App, System SDK, Startup Splash App, AWS Lambda integration, Update Service, etc.",
        "Management App is used in conjunction with Terminal Agent: In this project, I focused on implementing UI, network requests, local storage, AIDL communication, etc.",
        "System SDK is designed for third-party use: It provides interface implementations for third-party developers.",
        "Startup Splash app serves as the startup application for POS machines: This app listens for boot signals, implements page redirection, API requests, and other customized features.",
        "AWS Lambda + S3: Integrating AWS services into our project, such as sending corresponding POS configuration commands to the backend server when certain conditions are met.",
        "Update Service, Ticketing System app: These aim to allow customers to utilize the features of POS machines, primarily through the Management App for UI adjustments or customized feature requests."
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <PortfolioSection
        title="Apps I Participated in at Global Studio"
        apps={studioApps}
      />

      <PortfolioSection
        title="Other Projects I Participated In"
        apps={otherApps}
      />
    </div>
  );
} 