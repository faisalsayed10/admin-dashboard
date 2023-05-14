import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html className="h-full bg-gray-50">
        <Head />
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
