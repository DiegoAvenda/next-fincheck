import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplifyClientSide";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FinCheck | Control de Finanzas, Presupuestos e Inversión",
  description: "Web app para el control de finanzas personales: registro de gastos e ingresos, desglose por categoría, alertas de presupuesto, y recomendaciones inteligentes de ahorro e inversión. Lista para desplegar en AWS Amplify con Amazon Cognito y DynamoDB.",
  keywords: ["finanzas personales", "control de gastos", "presupuesto", "ahorro", "inversión", "AWS Amplify", "DynamoDB", "Cognito"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080b12] text-slate-100">
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
