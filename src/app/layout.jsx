import "./globals.scss";
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Control de gastos",
  description: "Aplicación creada por Gonzalo Alvarez Porto GAPDev",
};

export default function RootLayout({ children }) {
  return (
    <html className={montserrat.variable} lang="es">
      <body>
        <main>
          <div className="d-flex fd-col g-1rem ai-center">
            <h1>GAP<span className="fc-green-logo">Dev</span> gastos</h1>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
