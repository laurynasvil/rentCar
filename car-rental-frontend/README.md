Automobilių Nuomos Sistema - Frontend

Tai yra automobilių nuomos sistemos frontend dalis, sukurta naudojant React (Vite). Sistema leidžia vartotojams rezervuoti automobilius, o administratoriams - valdyti rezervacijas bei automobilių informaciją.



Projekto Struktūra

car-rental-frontend/
├── src/
│   ├── components/         # Bendri komponentai
│   │   ├── Footer.jsx      # Puslapio apačios komponentas
│   │   ├── Navbar.jsx      # Navigacijos juosta
│   │   ├── footer.css      # Footer stiliai
│   │   └── navbar.css      # Navbar stiliai
│   ├── pages/              # Puslapiai
│   │   ├── About.jsx       # Apie projektą puslapis
│   │   ├── AdminPanel.jsx  # Administratoriaus skydelis
│   │   ├── AddCar.jsx      # Automobilio pridėjimas
│   │   ├── CarDetails.jsx  # Automobilio detalių puslapis
│   │   ├── Cars.jsx        # Automobilių sąrašas
│   │   ├── EditCar.jsx     # Automobilio redagavimas
│   │   ├── Home.jsx        # Pradinis puslapis
│   │   ├── Login.jsx       # Prisijungimo puslapis
│   │   ├── MyReservations.jsx  # Mano rezervacijos puslapis
│   │   ├── Privacy.jsx     # Privatumo politika
│   │   ├── Profile.jsx     # Vartotojo profilis
│   │   ├── Register.jsx    # Registracijos puslapis
│   │   └── Terms.jsx       # Naudojimosi sąlygos
│   ├── styles/             # Stiliai atskiriems puslapiams
│   │   ├── about.css       # Apie projektą stiliai
│   │   ├── addCar.css      # Automobilio pridėjimo stiliai
│   │   ├── adminPanel.css  # Administratoriaus skydelio stiliai
│   │   ├── calendarStyles.css  # Kalendoriaus stiliai
│   │   ├── carDetails.css  # Automobilio detalių puslapio stiliai
│   │   ├── cars.css        # Automobilių sąrašo stiliai
│   │   ├── editCar.css     # Automobilio redagavimo stiliai
│   │   ├── home.css        # Pradžios puslapio stiliai
│   │   ├── login.css       # Prisijungimo puslapio stiliai
│   │   ├── myReservations.css # Mano rezervacijų puslapio stiliai
│   │   ├── privacy.css     # Privatumo politikos stiliai
│   │   ├── profile.css     # Vartotojo profilio stiliai
│   │   ├── register.css    # Registracijos stiliai
│   │   └── terms.css       # Naudojimosi sąlygų stiliai
├── App.jsx                 # Pagrindinis programos komponentas
├── main.jsx                # Programos paleidimo failas
├── styles.css              # Bendrieji stiliai
├── .gitignore              # Git ignoruojami failai
├── index.html              # HTML šablonas
├── package.json            # Priklausomybės ir skriptai
├── package-lock.json       # Priklausomybių tikslus sąrašas
├── README.md               # Projekto aprašymas
└── vite.config.js          # Vite konfigūracija



Projekto įdiegimas ir paleidimas

git clone https://github.com/tavo-repo/frontend.git
cd car-rental-frontend
npm install
npm run dev


Pagrindiniai Funkcionalumai

Vartotojai gali:

Peržiūrėti automobilių katalogą

Filtruoti pagal metus, kuro tipą, pavarų dėžę

Atlikti rezervaciją su kalendoriumi

Redaguoti savo rezervacijas arba jas atšaukti

Administratorius gali:

Pridėti, redaguoti ir ištrinti automobilius

Matyti visas rezervacijas ir keisti jų būseną

Peržiūrėti statistiką apie rezervacijas.




Automobilių Nuomos Sistema - Backend

Tai yra automobilių nuomos sistemos backend dalis, sukurta naudojant Node.js ir Express. Sistema apdoroja API užklausas, valdo autentifikaciją bei sąveikauja su MongoDB duomenų baze.



Technologijos

Node.js: Serverio paleidimui
Express: API sukūrimui
MongoDB: Duomenų bazė
JWT: Autentifikacijai
bcrypt: Slaptažodžių šifravimui
dotenv: Aplinkos kintamųjų valdymui

Projekto Struktūra

car-rental/
├── middleware/           # Tarpiniai sluoksniai
│   └── authMiddleware.js # Autentifikacijos patikra
├── models/               # MongoDB modeliai
│   ├── Car.js            # Automobilių schema
│   ├── Reservation.js    # Rezervacijų schema
│   └── User.js           # Vartotojų schema
├── routes/               # API maršrutai
│   ├── adminRoutes.js    # Administratoriaus maršrutai
│   ├── authRoutes.js     # Autentifikacijos maršrutai
│   ├── carRoutes.js      # Automobilių maršrutai
│   └── reservationRoutes.js # Rezervacijų maršrutai
├── .env                  # Aplinkos kintamųjų failas
├── server.js             # Pagrindinis serverio failas
├── package.json          # Priklausomybės ir skriptai
├── package-lock.json     # Tikslus priklausomybės sąrašas

Paleidimas

nodemon server



API Maršrutai

Autentifikacija (authRoutes.js)
POST /api/auth/register: Registracija
POST /api/auth/login: Prisijungimas

Automobiliai (carRoutes.js)
GET /api/cars: Gauti visus automobilius
POST /api/cars: Pridėti naują automobilį (tik admin)
PUT /api/cars/:id: Atnaujinti automobilį (tik admin)
DELETE /api/cars/:id: Ištrinti automobilį (tik admin)

Rezervacijos (reservationRoutes.js)
GET /api/reservations: Gauti visas rezervacijas (tik admin)
POST /api/reservations: Sukurti naują rezervaciją
PUT /api/reservations/:id: Atnaujinti rezervacijos būseną (tik admin)
DELETE /api/reservations/:id: Ištrinti rezervaciją

Administratoriaus Maršrutai (adminRoutes.js)
GET /api/admin/users: Gauti visus vartotojus
DELETE /api/admin/users/:id: Ištrinti vartotoją