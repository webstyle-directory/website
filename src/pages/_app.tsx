import * as Sentry from '@sentry/node';
import Head from 'next/head';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, darkColors } from '../common/styleguide';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CustomAppearanceContext from '../context/CustomAppearanceContext';
// eslint-disable-next-line
import CustomAppearanceProvider from '../context/CustomAppearanceProvider';

import '../styles/styles.css';
import PreviewStyles from '../styles/PreviewStyles';

Sentry.init({
  dsn: 'https://f6af5c9c86424f13bfe4643dca461259@o440700.ingest.sentry.io/5410249',
  enabled: process.env.NODE_ENV === 'production',
});

const App = ({ pageProps, Component }) => {
  return (
    <AppearanceProvider>
      <CustomAppearanceProvider>
        <CustomAppearanceContext.Consumer>
          {(context) => (
            <SafeAreaProvider
              style={{
                flex: 1,
                backgroundColor: context.isDark ? darkColors.background : colors.white,
              }}>
              <Head>
                <title>Web Style Directory - A directory to find style libraries for your Websites, Web Applications and React Native apps.</title>
              </Head>
              <Header />
              <Component {...pageProps} />
              <Footer />
              <PreviewStyles />
            </SafeAreaProvider>
          )}
        </CustomAppearanceContext.Consumer>
      </CustomAppearanceProvider>
    </AppearanceProvider>
  );
};

export default App;
