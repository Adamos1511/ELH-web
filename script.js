let hraciData = [];
/* === PŘEHLED KLUBŮ === */
const kluby = [
  { nazev: "HC Dynamo Pardubice", zkratka: "PCE" },
  { nazev: "HC Sparta Praha", zkratka: "SPA" },
  { nazev: "HC Oceláři Třinec", zkratka: "TRI" },
  { nazev: "HC Kometa Brno", zkratka: "KOM" },
  { nazev: "HC Škoda Plzeň", zkratka: "PLZ" },
  { nazev: "Mountfield HK", zkratka: "MHK" },
  { nazev: "HC Vítkovice Ridera", zkratka: "VIT" },
  { nazev: "HC Olomouc", zkratka: "OLO" },
  { nazev: "BK Mladá Boleslav", zkratka: "MBL" },
  { nazev: "HC Energie Karlovy Vary", zkratka: "KVA" },
  { nazev: "HC Motor České Budějovice", zkratka: "CBU" },
  { nazev: "HC Litvínov", zkratka: "LIT" },
  { nazev: "Bílí Tygři Liberec", zkratka: "LIB" },
  { nazev: "Rytíři Kladno", zkratka: "KLA" }
];
// --- MAPA ZKRATEK TÝMŮ ELH ---
const zkratkyTymu = {
  "HC Dynamo Pardubice": "PCE",
  "HC Sparta Praha": "SPA",
  "HC Oceláři Třinec": "TRI",
  "HC Kometa Brno": "BRN",
  "HC Škoda Plzeň": "PLZ",
  "Mountfield HK": "HKM",
  "HC Vítkovice Ridera": "VIT",
  "HC Olomouc": "OLO",
  "BK Mladá Boleslav": "MBL",
  "HC Energie Karlovy Vary": "KVA",
  "HC Motor České Budějovice": "CBU",
  "HC Litvínov": "LIT",
  "Bílí Tygři Liberec": "LIB",
  "Rytíři Kladno": "KLA"
};

// --- FUNKCE PRO ZOBRAZENÍ LOGA TÝMU ---
function logoTymu(nazev) {
  if (!nazev) return "";
  const zkratka = zkratkyTymu[nazev] || nazev;
  const path = `https://raw.githubusercontent.com/Adamos1511/ELH-web/main/loga_tymu/${zkratka}.png`;
  return `<img src="${path}" alt="${zkratka}" class="logoMale">`;
}

// --- NAČTENÍ DAT Z CSV ---
async function nactiData() {
  const response = await fetch("https://raw.githubusercontent.com/Adamos1511/ELH-web/refs/heads/main/hraciELH.csv");
  const text = await response.text();
  const radky = text.trim().split("\n").slice(1);

  hraciData = radky.map(r => {
    const [jmeno, prijmeni, smlouva, pozice, tym, vek, drzeni, narodnost, foto] = r.split(";");
    return {
      jmeno: jmeno?.trim(),
      prijmeni: prijmeni?.trim(),
      smlouva: smlouva?.trim(),
      pozice: pozice?.trim(),
      tym: tym?.trim(),
      vek: parseInt(vek?.trim()) || "",
      drzeni: drzeni?.trim(),
      narodnost: narodnost?.trim(),
      foto: foto?.trim().replace(/\r/g, "")

    };
  });

  naplnitFiltry();
  zobrazHrace(hraciData);
}

// --- ZOBRAZENÍ HRÁČŮ ---
function zobrazHrace(data) {
  const container = document.getElementById("hraci");
  if (!container) return;
  
  if (data.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Žádní hráči nenalezeni.</p>";
    return;
  }

  container.innerHTML = data.map(h => `
    <div class="hrac" onclick="zobrazDetail('${h.jmeno}', '${h.prijmeni}', '${h.tym}', '${h.pozice}', '${h.vek}', '${h.smlouva}', '${h.drzeni}', '${h.narodnost}', '${h.foto}')">
      
      <div class="foto-box">
        ${h.foto 
          ? `<img src="${h.foto}" alt="${h.jmeno} ${h.prijmeni}" class="fotoHraceKarta">`
          : `<div class="fotoPlaceholder"></div>`}
      </div>

      <div class="hrac-info">
        <h3>${h.jmeno} ${h.prijmeni}</h3>
        <p><b>Tým:</b> 
          ${zkratkyTymu[h.tym] ? zkratkyTymu[h.tym] : h.tym} 
          ${logoTymu(h.tym)} 
          
        </p>
        <p><b>Pozice:</b> ${h.pozice || "-"}</p>
        <p><b>Věk:</b> ${h.vek || "-"}</p>
        <p><b>Smlouva:</b> ${h.smlouva || "-"}</p>
        <p><b>Držení hole:</b> ${h.drzeni || "-"}</p>
        <p><b>Národnost:</b> ${h.narodnost || "-"}</p>
      </div>
    </div>
  `).join("");
}


// --- DETAIL HRÁČE ---
function zobrazDetail(jmeno, prijmeni, tym, pozice, vek, smlouva, drzeni, narodnost, foto) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      ${foto ? `<img src="${foto}" alt="${jmeno} ${prijmeni}" class="fotoDetail">` : ""}
      <h2>${jmeno} ${prijmeni}</h2>
      <p><b>Tým:</b> ${zkratkyTymu[tym] || tym} ${logoTymu(tym)} ${tym}</p>
      <p><b>Pozice:</b> ${pozice}</p>
      <p><b>Věk:</b> ${vek}</p>
      <p><b>Smlouva:</b> ${smlouva}</p>
      <p><b>Držení hole:</b> ${drzeni}</p>
      <p><b>Národnost:</b> ${narodnost}</p>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.remove();
  });
}


// --- FILTRY ---
function naplnitFiltry() {
  const tymy = [...new Set(hraciData.map(h => h.tym))].sort();
  const pozice = [...new Set(hraciData.map(h => h.pozice))].sort();
  const drzeni = [...new Set(hraciData.map(h => h.drzeni))].sort();
  const narody = [...new Set(hraciData.map(h => h.narodnost))].sort();
  const smlouvy = [...new Set(hraciData.map(h => h.smlouva))].sort();
  

  function naplnSelect(id, pole, popisek) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = `<option value="">${popisek}</option>`;
    pole.forEach(val => {
      if (val) {
        const option = document.createElement("option");
        option.value = val;
        option.textContent = val;
        select.appendChild(option);
      }
    });
    select.addEventListener("change", filtruj);
  }

  naplnSelect("filtrTymu", tymy, "Všechny týmy");
  naplnSelect("filtrPozice", pozice, "Všechny pozice");
  naplnSelect("filtrDrzeni", drzeni, "Všechna držení");
  naplnSelect("filtrNarodnost", narody, "Všechny národnosti");
  naplnSelect("filtrSmlouva", smlouvy, "Všechny smlouvy");

  const vyhledavani = document.getElementById("vyhledavani");
  if (vyhledavani) vyhledavani.addEventListener("input", filtruj);
}

/* --- FUNKCE PRO FILTROVÁNÍ --- */
function naplnitFiltry() {
  const tymy = [...new Set(hraciData.map(h => h.tym))].sort();
  const pozice = [...new Set(hraciData.map(h => h.pozice))].sort();
  const drzeni = [...new Set(hraciData.map(h => h.drzeni))].sort();
  const narody = [...new Set(hraciData.map(h => h.narodnost))].sort();
  const smlouvy = [...new Set(hraciData.map(h => h.smlouva))].sort();

  function naplnSelect(id, pole, popisek) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = `<option value="">${popisek}</option>`;
    pole.forEach(val => {
      if (val) {
        const option = document.createElement("option");
        option.value = val;
        option.textContent = val;
        select.appendChild(option);
      }
    });
    select.addEventListener("change", filtruj);
  }

  naplnSelect("filtrTymu", tymy, "Všechny týmy");
  naplnSelect("filtrPozice", pozice, "Všechny pozice");
  naplnSelect("filtrDrzeni", drzeni, "Všechna držení");
  naplnSelect("filtrNarodnost", narody, "Všechny národnosti");
  naplnSelect("filtrSmlouva", smlouvy, "Všechny smlouvy");

  const vyhledavani = document.getElementById("vyhledavani");
  if (vyhledavani) vyhledavani.addEventListener("input", filtruj);

  const razeni = document.getElementById("razeni");
  if (razeni) razeni.addEventListener("change", filtruj);
}

function filtruj() {
  const hledani = document.getElementById("vyhledavani")?.value.toLowerCase() || "";
  const tym = document.getElementById("filtrTymu")?.value || "";
  const pozice = document.getElementById("filtrPozice")?.value || "";
  const drzeni = document.getElementById("filtrDrzeni")?.value || "";
  const narodnost = document.getElementById("filtrNarodnost")?.value || "";
  const smlouva = document.getElementById("filtrSmlouva")?.value || "";
  const razeni = document.getElementById("razeni")?.value || "";

  let filtrovani = hraciData.filter(h =>
    (!tym || h.tym === tym) &&
    (!pozice || h.pozice === pozice) &&
    (!drzeni || h.drzeni === drzeni) &&
    (!narodnost || h.narodnost === narodnost) &&
    (!smlouva || h.smlouva === smlouva) &&
    (`${h.jmeno} ${h.prijmeni}`.toLowerCase().includes(hledani))
  );



/* === PO KLIKNUTÍ NA KLUB === */
function otevriKlub(zkratka) {
  const klub = kluby.find(k => k.zkratka === zkratka);
  const hraciTymu = hraciData.filter(h => h.tym.includes(klub.nazev));

  let okno = window.open("", "_blank");
  okno.document.write(`
    <html>
      <head>
        <title>${klub.nazev} - Soupiska</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body style="padding:20px;">
        <h1>${klub.nazev}</h1>
        <img src="https://raw.githubusercontent.com/Adamos1511/ELH-web/main/loga_tymu/${zkratka}.png" style="height:100px;"><br><br>
        <h2>Soupiska týmu</h2>
        <div class="hraci-grid">
          ${hraciTymu.map(h => `
            <div class="hrac-karta">
              ${h.foto ? `<img src="${h.foto}" style="width:100%;border-radius:8px;">` : ""}
              <h3>${h.jmeno} ${h.prijmeni}</h3>
              <p><b>Pozice:</b> ${h.pozice}</p>
              <p><b>Věk:</b> ${h.vek}</p>
              <p><b>Národnost:</b> ${h.narodnost}</p>
              <p><b>Smlouva:</b> ${h.smlouva}</p>
            </div>
          `).join("")}
        </div>
      </body>
    </html>
  `);
}

  if (razeni) {
  filtrovani.sort((a, b) => {
    switch (razeni) {
      case "prijmeni_az":
        return a.prijmeni.localeCompare(b.prijmeni, "cs");
      case "prijmeni_za":
        return b.prijmeni.localeCompare(a.prijmeni, "cs");

      case "vek_asc":
        return (a.vek || 0) - (b.vek || 0);
      case "vek_desc":
        return (b.vek || 0) - (a.vek || 0);

      case "tym_az":
        return a.tym.localeCompare(b.tym, "cs");
      case "tym_za":
        return b.tym.localeCompare(a.tym, "cs");

      case "pozice_az":
        return a.pozice.localeCompare(b.pozice, "cs");
      case "pozice_za":
        return b.pozice.localeCompare(a.pozice, "cs");

      case "narodnost_az":
        return a.narodnost.localeCompare(b.narodnost, "cs");
      case "narodnost_za":
        return b.narodnost.localeCompare(a.narodnost, "cs");

      case "smlouva_asc":
        return a.smlouva.localeCompare(b.smlouva, "cs");
      case "smlouva_desc":
        return b.smlouva.localeCompare(a.smlouva, "cs");

      default:
        return 0;
    }
  });
}


  zobrazHrace(filtrovani);
}
/* === FUNKCE PRO ZOBRAZENÍ KLUBŮ === */


// Po kliknutí na "Kluby" v menu
document.addEventListener("DOMContentLoaded", () => {
  const odkazKluby = document.getElementById("odkazKluby");
  if (odkazKluby) {
    odkazKluby.addEventListener("click", (e) => {
      e.preventDefault();
      zobrazKluby();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

function zobrazKluby() {
  const container = document.getElementById("seznam-klubu");
  if (!container) return;
  container.innerHTML = kluby.map(k => `
    <div class="klub-karta" onclick="otevriKlub('${k.zkratka}')">
      <img src="https://raw.githubusercontent.com/Adamos1511/ELH-web/main/loga_tymu/${k.zkratka}.png" alt="${k.nazev}">
      <h3>${k.nazev}</h3>
    </div>
  `).join("");

  document.getElementById("kluby").style.display = "block";
}



// --- NAČTENÍ DAT PO STARTU ---
naplnitFiltry();
zobrazHrace(hraciData);
nactiData();
