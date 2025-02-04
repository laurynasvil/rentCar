import "../styles/about.css"; 
const About = () => {
  return (
    <div className="about-container">
      <h1>Apie mus</h1>
      <p>
        Sveiki atvykę į <strong>Automobilių nuomą</strong> – jūsų patikimą partnerį automobilių nuomos srityje!
      </p>

      <h2>Kas mes esame?</h2>
      <p>
        Esame profesionali automobilių nuomos įmonė, kuri siūlo aukščiausios kokybės paslaugas tiek vietiniams, tiek tarptautiniams klientams. 
        Mūsų tikslas – suteikti patogią, greitą ir patikimą transporto priemonės nuomą už konkurencingą kainą.
      </p>

      <h2>Kodėl rinktis mus?</h2>
      <ul>
        <li> Platus automobilių pasirinkimas – nuo ekonomiškų miesto automobilių iki prabangių modelių.</li>
        <li> Lankstūs nuomos terminai – nuomokite automobilį tiek dienai, tiek ilgesniam laikotarpiui.</li>
        <li> Skaidrios kainos – jokių paslėptų mokesčių ar papildomų išlaidų.</li>
        <li> Puikus klientų aptarnavimas – mūsų komanda pasiruošusi padėti 24/7.</li>
        <li> Draudimo ir pagalbos paketas – visiems mūsų automobiliams suteikiamas pilnas draudimas ir 24/7 pagalba kelyje.</li>
      </ul>

      <h2>Kaip su mumis susisiekti?</h2>
      <p> <strong>Adresas:</strong> Vilnius, Lietuva</p>
      <p> <strong>Telefonas:</strong> +370 612 34567</p>
      <p> <strong>El. paštas:</strong> info@automobiliunuoma.lt</p>
      <p> <strong>Interneto svetainė:</strong> <a href="/" target="_blank" rel="noopener noreferrer">www.automobiliunuoma.lt</a></p>
    </div>
  );
};

export default About;
