import localFont from "next/font/local";
import { Pacifico } from 'next/font/google';
import '../app/global.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
});

export const metadata = {
  title: "RecipeShare",
  description: "Share and discover delicious recipes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}