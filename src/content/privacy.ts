import type { Locale } from "@/lib/i18n";

export type PrivacySection = {
  heading: string;
  paragraphs: string[];
};

export type PrivacyContent = {
  title: string;
  /** ISO date (YYYY-MM-DD) of the last meaningful update. Bumped by the update-privacy-policy skill. */
  updated: string;
  intro: string;
  sections: PrivacySection[];
};

export const privacyPolicy: Record<Locale, PrivacyContent> = {
  pl: {
    title: "Polityka prywatności",
    updated: "2026-06-15",
    intro:
      "Niniejsza Polityka prywatności opisuje, w jaki sposób serwis daam.pl (dalej „Serwis”) przetwarza dane osób odwiedzających. Dbamy o Twoją prywatność i ograniczamy przetwarzanie danych do niezbędnego minimum.",
    sections: [
      {
        heading: "Administrator danych",
        paragraphs: [
          "Administratorem danych osobowych jest DAAM Mateusz Boroch, ul. Podleśna 6/5, 81-581 Gdynia, NIP 9581386418, właściciel Serwisu daam.pl.",
          "W sprawach dotyczących danych osobowych możesz skontaktować się pod adresem: kontakt@daam.pl.",
        ],
      },
      {
        heading: "Jakie dane przetwarzamy",
        paragraphs: [
          "Serwis ma charakter informacyjny („wizytówka”). Nie prowadzimy rejestracji, nie udostępniamy formularzy kontaktowych ani nie zbieramy danych podawanych dobrowolnie.",
          "Podczas korzystania z Serwisu nasz dostawca hostingu automatycznie zapisuje w logach serwera dane techniczne, takie jak adres IP, typ przeglądarki (user-agent), data i godzina żądania oraz adres żądanego zasobu. Dane te służą zapewnieniu bezpieczeństwa i prawidłowego działania Serwisu.",
        ],
      },
      {
        heading: "Pliki cookie i pamięć przeglądarki",
        paragraphs: [
          "Serwis nie wykorzystuje plików cookie, lokalnej pamięci przeglądarki (localStorage) ani technologii śledzących. Preferencja języka wynika wyłącznie z adresu URL i nie jest zapisywana na Twoim urządzeniu.",
        ],
      },
      {
        heading: "Narzędzia analityczne i marketingowe",
        paragraphs: [
          "Nie korzystamy z narzędzi analitycznych (np. Google Analytics), pikseli śledzących ani reklamy behawioralnej.",
        ],
      },
      {
        heading: "Czcionki i zasoby zewnętrzne",
        paragraphs: [
          "Czcionki są hostowane lokalnie w ramach Serwisu, dzięki czemu Twoja przeglądarka nie wysyła żądań do zewnętrznych dostawców (np. Google Fonts) w celu ich pobrania.",
        ],
      },
      {
        heading: "Odbiorcy danych i hosting",
        paragraphs: [
          "Serwis jest hostowany przez Vercel Inc. Dostawca hostingu, działając jako podmiot przetwarzający, może mieć dostęp do danych zapisywanych w logach serwera wyłącznie w celu świadczenia usługi hostingu.",
        ],
      },
      {
        heading: "Przekazywanie danych poza EOG",
        paragraphs: [
          "W związku z korzystaniem z usług dostawcy hostingu dane mogą być przetwarzane poza Europejskim Obszarem Gospodarczym. W takim przypadku przekazywanie odbywa się na podstawie odpowiednich zabezpieczeń, w szczególności standardowych klauzul umownych zatwierdzonych przez Komisję Europejską.",
        ],
      },
      {
        heading: "Podstawa prawna przetwarzania",
        paragraphs: [
          "Dane w logach serwera przetwarzamy na podstawie art. 6 ust. 1 lit. f RODO, tj. prawnie uzasadnionego interesu administratora polegającego na zapewnieniu bezpieczeństwa i prawidłowego działania Serwisu.",
        ],
      },
      {
        heading: "Okres przechowywania",
        paragraphs: [
          "Dane zapisane w logach serwera przechowywane są przez okres niezbędny do zapewnienia bezpieczeństwa i diagnostyki, zgodnie z polityką dostawcy hostingu, a następnie są usuwane lub anonimizowane.",
        ],
      },
      {
        heading: "Twoje prawa",
        paragraphs: [
          "Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, prawo do wniesienia sprzeciwu wobec przetwarzania oraz prawo do przenoszenia danych.",
          "Masz również prawo wniesienia skargi do organu nadzorczego — Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).",
        ],
      },
      {
        heading: "Zmiany Polityki prywatności",
        paragraphs: [
          "Polityka może być aktualizowana w przypadku zmian w Serwisie lub przepisach prawa. Data ostatniej aktualizacji jest wskazana na górze tej strony.",
        ],
      },
    ],
  },

  en: {
    title: "Privacy Policy",
    updated: "2026-06-15",
    intro:
      "This Privacy Policy explains how the daam.pl website (the “Site”) processes the data of its visitors. We respect your privacy and limit data processing to the necessary minimum.",
    sections: [
      {
        heading: "Data Controller",
        paragraphs: [
          "The controller of personal data is DAAM Mateusz Boroch, ul. Podleśna 6/5, 81-581 Gdynia, Poland, Tax ID (NIP) 9581386418, the owner of the daam.pl Site.",
          "For any matters regarding personal data, you can contact us at: kontakt@daam.pl.",
        ],
      },
      {
        heading: "What data we process",
        paragraphs: [
          "The Site is informational in nature (a “business card”). We do not provide registration, contact forms, or collect any data submitted voluntarily.",
          "When you use the Site, our hosting provider automatically records technical data in server logs, such as your IP address, browser type (user-agent), the date and time of the request, and the requested resource. This data is used to ensure the security and proper operation of the Site.",
        ],
      },
      {
        heading: "Cookies and browser storage",
        paragraphs: [
          "The Site does not use cookies, local browser storage (localStorage), or tracking technologies. Your language preference is derived solely from the URL and is not stored on your device.",
        ],
      },
      {
        heading: "Analytics and marketing tools",
        paragraphs: [
          "We do not use analytics tools (e.g. Google Analytics), tracking pixels, or behavioural advertising.",
        ],
      },
      {
        heading: "Fonts and external resources",
        paragraphs: [
          "Fonts are self-hosted within the Site, so your browser does not send requests to external providers (e.g. Google Fonts) to download them.",
        ],
      },
      {
        heading: "Recipients and hosting",
        paragraphs: [
          "The Site is hosted by Vercel Inc. Acting as a processor, the hosting provider may access data stored in server logs solely for the purpose of providing the hosting service.",
        ],
      },
      {
        heading: "Transfers outside the EEA",
        paragraphs: [
          "In connection with the use of the hosting provider, data may be processed outside the European Economic Area. In such cases, the transfer takes place on the basis of appropriate safeguards, in particular the Standard Contractual Clauses approved by the European Commission.",
        ],
      },
      {
        heading: "Legal basis for processing",
        paragraphs: [
          "We process server-log data on the basis of Article 6(1)(f) GDPR, i.e. the legitimate interest of the controller in ensuring the security and proper operation of the Site.",
        ],
      },
      {
        heading: "Retention period",
        paragraphs: [
          "Data stored in server logs is retained for the period necessary to ensure security and diagnostics, in accordance with the hosting provider’s policy, and is then deleted or anonymised.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "You have the right to access your data, rectify it, erase it, or restrict its processing, the right to object to processing, and the right to data portability.",
          "You also have the right to lodge a complaint with a supervisory authority — in Poland, the President of the Personal Data Protection Office (ul. Stawki 2, 00-193 Warsaw).",
        ],
      },
      {
        heading: "Changes to this Privacy Policy",
        paragraphs: [
          "This Policy may be updated in the event of changes to the Site or to applicable law. The date of the last update is shown at the top of this page.",
        ],
      },
    ],
  },

  it: {
    title: "Informativa sulla privacy",
    updated: "2026-06-15",
    intro:
      "La presente Informativa sulla privacy descrive come il sito daam.pl (il “Sito”) tratta i dati dei visitatori. Rispettiamo la tua privacy e limitiamo il trattamento dei dati al minimo necessario.",
    sections: [
      {
        heading: "Titolare del trattamento",
        paragraphs: [
          "Il titolare del trattamento dei dati personali è DAAM Mateusz Boroch, ul. Podleśna 6/5, 81-581 Gdynia, Polonia, partita IVA (NIP) 9581386418, proprietario del Sito daam.pl.",
          "Per qualsiasi questione relativa ai dati personali puoi contattarci all’indirizzo: kontakt@daam.pl.",
        ],
      },
      {
        heading: "Quali dati trattiamo",
        paragraphs: [
          "Il Sito ha carattere informativo (un “biglietto da visita”). Non prevediamo registrazioni, moduli di contatto né raccogliamo dati forniti volontariamente.",
          "Durante l’utilizzo del Sito, il nostro fornitore di hosting registra automaticamente nei log del server dati tecnici quali l’indirizzo IP, il tipo di browser (user-agent), la data e l’ora della richiesta e la risorsa richiesta. Questi dati servono a garantire la sicurezza e il corretto funzionamento del Sito.",
        ],
      },
      {
        heading: "Cookie e memoria del browser",
        paragraphs: [
          "Il Sito non utilizza cookie, memoria locale del browser (localStorage) né tecnologie di tracciamento. La preferenza linguistica deriva esclusivamente dall’URL e non viene memorizzata sul tuo dispositivo.",
        ],
      },
      {
        heading: "Strumenti di analisi e marketing",
        paragraphs: [
          "Non utilizziamo strumenti di analisi (es. Google Analytics), pixel di tracciamento o pubblicità comportamentale.",
        ],
      },
      {
        heading: "Font e risorse esterne",
        paragraphs: [
          "I font sono ospitati localmente nel Sito, pertanto il tuo browser non invia richieste a fornitori esterni (es. Google Fonts) per scaricarli.",
        ],
      },
      {
        heading: "Destinatari dei dati e hosting",
        paragraphs: [
          "Il Sito è ospitato da Vercel Inc. In qualità di responsabile del trattamento, il fornitore di hosting può accedere ai dati registrati nei log del server unicamente allo scopo di fornire il servizio di hosting.",
        ],
      },
      {
        heading: "Trasferimento dei dati al di fuori dello SEE",
        paragraphs: [
          "In relazione all’utilizzo del fornitore di hosting, i dati possono essere trattati al di fuori dello Spazio economico europeo. In tal caso, il trasferimento avviene sulla base di garanzie adeguate, in particolare le clausole contrattuali standard approvate dalla Commissione europea.",
        ],
      },
      {
        heading: "Base giuridica del trattamento",
        paragraphs: [
          "Trattiamo i dati dei log del server sulla base dell’art. 6, par. 1, lett. f) del GDPR, ossia il legittimo interesse del titolare a garantire la sicurezza e il corretto funzionamento del Sito.",
        ],
      },
      {
        heading: "Periodo di conservazione",
        paragraphs: [
          "I dati registrati nei log del server sono conservati per il periodo necessario a garantire sicurezza e diagnostica, in conformità con la politica del fornitore di hosting, e successivamente vengono cancellati o anonimizzati.",
        ],
      },
      {
        heading: "I tuoi diritti",
        paragraphs: [
          "Hai il diritto di accedere ai tuoi dati, di rettificarli, cancellarli o limitarne il trattamento, il diritto di opporti al trattamento e il diritto alla portabilità dei dati.",
          "Hai inoltre il diritto di proporre reclamo a un’autorità di controllo — in Polonia, il Presidente dell’Ufficio per la protezione dei dati personali (ul. Stawki 2, 00-193 Varsavia).",
        ],
      },
      {
        heading: "Modifiche all’Informativa sulla privacy",
        paragraphs: [
          "La presente Informativa può essere aggiornata in caso di modifiche al Sito o alla normativa applicabile. La data dell’ultimo aggiornamento è indicata in cima a questa pagina.",
        ],
      },
    ],
  },
};
