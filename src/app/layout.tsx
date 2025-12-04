import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {

   return (
      <html lang="fr" className="font-aflp-regular">
         <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Système ERP/CRM Paramétrable</title>
            {/* <link rel="favicon" sizes="32x32" type="image/png" href="/favicon.png" />
            <link rel="icon" sizes="32x32" type="image/png" href="/favicon.png" />
            <link rel="apple-icon" sizes="32x32" type="image/png" href="/favicon.png" /> */}
         </head>
         <body >
            <LanguageProvider>
               <AuthProvider>
                  {children}
               </AuthProvider>
            </LanguageProvider>
         </body>
      </html>
   );
}


