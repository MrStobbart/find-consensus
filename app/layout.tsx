import "antd/dist/reset.css";
import "./globals.css";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "./AntdRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Find consensus",
  description: "A lightweight tool to simplify descrion making in groups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
