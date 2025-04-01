interface Config {
  NODE_ENV: string;
  apiUrl: string;
  b2cAppUrl: string;
  mocks: boolean;
  faro?: {
    url: string;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
    measurementId: string;
  };
  googlePlaceApiKey: string;
  syncfusion: {
    url: string;
    license: string;
  };
  firebaseEmulator?: {
    active: boolean;
    endpoint: string;
  };
}
declare global {
  interface Window {
    config: Config;
  }
}

function configuration(): Config {
  if (!window.config) {
    window.config = {
      NODE_ENV: "development",
      apiUrl: "http://127.0.0.1:3000",
      b2cAppUrl: "https://app.preproduction.wealthcome.fr",
      mocks: false,
      firebase: {
        apiKey: "AIzaSyCup3fLJk23DnLTeVeIhsz-ifj2R4Hg69I",
        authDomain: "cgp-preproduction.firebaseapp.com",
        projectId: "cgp-preproduction",
        appId: "1:341518100568:web:3c8e5f9c2190c386d6822d",
        measurementId: "G-J48EEE567J",
      },
      syncfusion: {
        url: "https://syncfusion.preproduction.wealthcome.fr/api/documenteditor/",
        license:
          "Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1feXRcRmZdWUxyV0U=",
      },
      googlePlaceApiKey: "",
    };
  }

  return window.config;
}
export const config = configuration();
