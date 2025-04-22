import "./globals.css";
import Provider from "./Provider";
import { Josefin_Sans } from 'next/font/google';

const roboto = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});


export const metadata = {
  title: "my album",
  description: "This the photo share web application",
  icons: {
    icon: '/pngimg.com - love_PNG57.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={roboto.className}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
