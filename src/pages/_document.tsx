import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import Favicons from '../components/Favicons';
import GoogleAnalytics from '../components/GoogleAnalytics';

const site = {
  title: 'Web Style Directory',
  description: 'A directory to find style libraries for your Websites, Web Applications and React Native apps.',
};

class DirectoryWebsite extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render = () => (
    <Html lang="en">
      <Head>
        <Favicons />
        <GoogleAnalytics id="UA-176753436-1" />
        {injectMeta.map((value, index) => (
          <meta key={`meta-${index}`} {...value} />
        ))}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

const themeColor = '#fff';

const injectMeta = [
  {
    name: 'description',
    content: site.description,
  },
  {
    property: 'og:description',
    content: site.description,
  },
  {
    property: 'og:title',
    content: site.title,
  },
  {
    property: 'og:site_name',
    content: site.title,
  },
  {
    property: 'og:url',
    content: 'https://webstyle-directory.vercel.app/',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    key: 'viewport',
    name: 'viewport',
    content:
      'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover',
  },
  {
    name: 'msapplication-TileColor',
    content: themeColor,
  },
  {
    name: 'theme-color',
    content: themeColor,
  },
  { name: 'twitter:card', content: 'Find libraries for your Websites, Web Applications and React Native apps' },
  { name: 'twitter:title', content: site.title },
  { name: 'twitter:description', content: site.description },

  // Image
  // { property: 'og:image', content: image.url },
  // { property: 'og:image:secure_url', content: image.secureUrl },
  // { property: 'og:image:type', content: image.type },
  // { property: 'og:image:width', content: image.width },
  // { property: 'og:image:height', content: image.height },
  // { property: 'og:image:alt', content: image.description },
];

export default DirectoryWebsite;
