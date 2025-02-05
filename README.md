Live - https://car-rental-frontend-ruddy.vercel.app/


Automobilių Nuomos Sistema - Frontend

Tai yra automobilių nuomos sistemos frontend dalis, sukurta naudojant React (Vite). Sistema leidžia vartotojams rezervuoti automobilius, o administratoriams - valdyti rezervacijas bei automobilių informaciją.

Projekto įdiegimas ir paleidimas
npm install,
npm run dev


Pagrindiniai Funkcionalumai

Vartotojai gali:
Užsiregistruoti ir prisijungti.
Peržiūrėti automobilių katalogą.
Filtruoti pagal metus, kuro tipą, pavarų dėžę.
Atlikti rezervaciją su kalendoriumi.
Matyti savo rezervacijas atskiroje skiltyje.
Redaguoti savo rezervacijų datą arba jas atšaukti.
Keisti savo vardą, el.paštą ir slaptažodį.


Administratorius gali:
Užsiregistruoti ir prisijungti.
Pridėti, redaguoti ir ištrinti automobilius.
Pakeisti automobilio būseną kad nebūtu rodomas vartotojams.
Matyti visas rezervacijas ir keisti jų būseną.
Peržiūrėti statistiką apie rezervacijas.
Keisti savo vardą, el.paštą ir slaptažodį.



Automobilių Nuomos Sistema - Backend

Tai yra automobilių nuomos sistemos backend dalis, sukurta naudojant Node.js ir Express. Sistema apdoroja API užklausas, valdo autentifikaciją bei sąveikauja su MongoDB duomenų baze.

Technologijos
Node.js: Serverio paleidimui.
Express: API sukūrimui.
MongoDB: Duomenų bazė.
JWT: Autentifikacijai.
bcrypt: Slaptažodžių šifravimui.
dotenv: Aplinkos kintamųjų valdymui.

Paleidimas
npm install,
nodemon server

