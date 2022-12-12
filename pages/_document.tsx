import * as React from 'react';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="pl">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <meta name="theme-color" content="#D4293D" />
          <meta
            name="description"
            content="Szybko sprawdź plan lekcji każdej klasy, a także nauczyciela czy sali."
          />
          <meta
            property="og:description"
            content="Szybko sprawdź plan lekcji każdej klasy, a także nauczyciela czy sali."
          />
          <meta property="og:image" content="/og-image.png" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body className="text-neutral-800 dark:text-neutral-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
