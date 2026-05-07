import { PrismaClient } from "@prisma/client";
import https from "https";
import fs from "fs";
import path from "path";
import { createWriteStream, mkdirSync } from "fs";

const prisma = new PrismaClient();

const uploadsDir = path.join(process.cwd(), "public", "uploads");

const books = [
  { isbn: "9780747532743", category: "Fantasi",          price: 149, stock: 20, description: "Den første boken i den legendariske Harry Potter-serien. Elleve år gamle Harry oppdager at han er en trollmann og begynner på Galtvort skole for hekseri og trolldom." },
  { isbn: "9780261103573", category: "Fantasi",          price: 169, stock: 15, description: "Det første bindet i Ringenes Herre-trilogien. Hobbiten Frodo Lommelun arver en farlig ring og må begi seg ut på en farefull reise for å ødelegge den." },
  { isbn: "9780743273565", category: "Klassiker",        price: 129, stock: 18, description: "En tidløs klassiker som utforsker temaer som rikdom, kjærlighet og den amerikanske drømmen i 1920-tallets New York." },
  { isbn: "9780385333481", category: "Klassiker",        price: 139, stock: 12, description: "En satirisk roman om menneskenes absurde eksistens, fortalt gjennom vitenskapsmannen Felix som utilsiktet bidrar til jordens undergang." },
  { isbn: "9780060935467", category: "Klassiker",        price: 139, stock: 14, description: "En gripende roman om rasisme og urettferdighet i det amerikanske sørstatene, sett gjennom øynene til den unge Scout Finch." },
  { isbn: "9780525559474", category: "Skjønnlitteratur", price: 159, stock: 22, description: "Nora Seed befinner seg i et bibliotek mellom liv og død, der hver bok representerer et liv hun kunne ha levd. En rørende roman om valg og meningen med livet." },
  { isbn: "9781501156700", category: "Skrekk",           price: 169, stock: 10, description: "En familie flytter til Maine og oppdager en mystisk kirkegård i skogen bak huset. Stephen Kings mest skremmende roman om sorg og det overnaturlige." },
  { isbn: "9780679720201", category: "Klassiker",        price: 119, stock: 16, description: "Albert Camus' eksistensialistiske mesterverk om Meursault, en franskmann i Algerie som begår et tilsynelatende motivløst drap og møter sin skjebne med likegyldighet." },
  { isbn: "9780316769174", category: "Klassiker",        price: 129, stock: 13, description: "Holden Caulfield forteller om sin flukt fra kostskolen og vandring gjennom New York City. En ikonisk roman om ungdomsopprør og fremmedgjøring." },
  { isbn: "9780062316097", category: "Sakprosa",         price: 199, stock: 25, description: "En kortfattet historie om menneskeheten fra steinalderen til i dag. Yuval Noah Harari utforsker hvordan Homo sapiens ble jordens dominerende art." },
  { isbn: "9781250301697", category: "Krim",             price: 159, stock: 20, description: "Psykologen Mariana Andros etterforsker en rekke mord ved Cambridge universitetet, koblet til den stille pasienten Alicia som ikke har sagt et ord på seks år." },
  { isbn: "9780553380163", category: "Sakprosa",         price: 179, stock: 17, description: "Stephen Hawking forklarer universets opprinnelse, svarte hull og tidens natur på en måte som er tilgjengelig for alle. En av tidenes mest solgte vitenskapsbøker." },
  { isbn: "9780385490818", category: "Skjønnlitteratur", price: 159, stock: 18, description: "I en nær fremtid har den totalitære staten Gilead underlagt kvinner fullstendig kontroll. Offred er en håndmaid som tvinges til å bære barn for de mektige. Et dystopisk mesterverk." },
  { isbn: "9780374528379", category: "Klassiker",        price: 169, stock: 10, description: "Dostojevskijs siste og mest ambisiøse roman, som utforsker tro, tvil, moral og frifinnelse gjennom tre brødre og farens mystiske død." },
  { isbn: "9780374533557", category: "Sakprosa",         price: 199, stock: 20, description: "Daniel Kahneman avslører hvordan to systemer i hjernen styrer måten vi tenker og tar beslutninger på. En revolusjonerende bok om menneskelig psykologi." },
  { isbn: "9780307277671", category: "Krim",             price: 149, stock: 22, description: "Robert Langdon blir kalt til Louvre midt på natten etter et mystisk mord. Han oppdager et nettverk av spor som peker mot en 2000 år gammel hemmelighet." },
  { isbn: "9781250178619", category: "Skjønnlitteratur", price: 169, stock: 15, description: "Under støvstormenes tid på 1930-tallet trosser Elsa Martinelli alle odds for å redde familien sin og finne håp i en brutal verden. En episk roman om mot og kjærlighet." },
  { isbn: "9780735224292", category: "Skjønnlitteratur", price: 159, stock: 14, description: "Når Elena Richardson og familien hennes tar inn en mystisk leietaker, rystes hele det velstående samfunnet i Shaker Heights. En roman om hemmeligheter, privilegier og morskap." },
  { isbn: "9780525478812", category: "Ungdom",           price: 139, stock: 25, description: "Hazel Grace Lancaster har kreft og forventer ikke å leve lenge. Så møter hun Augustus Waters på en støttegruppe. En hjerteskjærende kjærlighetshistorie om å leve fullt ut." },
  { isbn: "9780307588371", category: "Krim",             price: 149, stock: 18, description: "Nick Dunne melder kona Amy savnet på bryllupsdagen deres. Ettersom etterforskningen skrider frem, avsløres løgner og manipulasjon på begge sider. En mesterlig psykologisk thriller." },
  { isbn: "9780385543781", category: "Skjønnlitteratur", price: 169, stock: 12, description: "Den direkte oppfølgeren til Tjenerinnens beretning. To kvinner med svært ulike bakgrunner kjemper for frihet i det undertrykkende Gilead. Vinner av Booker Prize 2019." },
  { isbn: "9780593230572", category: "Sakprosa",         price: 219, stock: 16, description: "En grundig undersøkelse av slaveriets arv og dets vedvarende innflytelse på det amerikanske samfunnet, med utgangspunkt i 1619 da de første afrikanske slavene ankom Virginia." },
  { isbn: "9780385737951", category: "Ungdom",           price: 149, stock: 20, description: "Thomas våkner opp uten minner i en labyrint befolket av andre gutter. For å overleve må han løse mysteriet med labyrinten før den stenger for alltid." },
  { isbn: "9780804139021", category: "Skjønnlitteratur", price: 159, stock: 18, description: "Mark Watney blir forlatt på Mars og må bruke sin kunnskap som botaniker og ingeniør for å overleve alene på den røde planeten. En vitenskapelig overlevelsesthriller." },
  { isbn: "9780385545990", category: "Krim",             price: 149, stock: 14, description: "En advokat på Camino Island oppdager at noe er galt på den lille øya han alltid har elsket. John Grishams solrike krim med en mørk hemmelighet i kjernen." },
  { isbn: "9781982110574", category: "Skrekk",           price: 169, stock: 12, description: "Barn forsvinner fra en liten by i Maine og havner i et mystisk institutt der de utsettes for eksperimenter for å utnytte deres overnaturlige evner. Stephen King på sitt beste." },
  { isbn: "9780735219090", category: "Skjønnlitteratur", price: 169, stock: 20, description: "Kya Clark vokser opp alene i sumpmarkene i North Carolina etter at familien forlater henne. En roman om ensomhet, naturens skjønnhet og et uoppklart drap." },
  { isbn: "9781501175466", category: "Skrekk",           price: 179, stock: 10, description: "En klovn ved navn Pennywise terroriserer barn i den lille byen Derry, Maine. En gruppe venner må konfrontere sin største frykt for å stoppe det onde. Stephen Kings magnum opus." },
  { isbn: "9780525521143", category: "Skjønnlitteratur", price: 159, stock: 15, description: "På et hotell midt i havet forsvinner en kvinne sporløst. Romanen veksler mellom fortid og nåtid og utforsker hvordan valg vi tar former livene vi lever." },
  { isbn: "9780316346627", category: "Sakprosa",         price: 169, stock: 22, description: "Malcolm Gladwell undersøker det magiske øyeblikket når en idé, trend eller sosial atferd krysser en terskel og sprer seg som en epidemi. En banebrytende bok om sosiale forandringer." },
  { isbn: "9780385545952", category: "Skjønnlitteratur", price: 169, stock: 16, description: "Bonnie Garmus' debutroman om kjemiker Elizabeth Zott som på 1960-tallet havner som programleder på et matlagingsprogram og bruker det til å utdanne og frigjøre kvinner." },
];

async function downloadImage(url: string, filename: string): Promise<string> {
  mkdirSync(uploadsDir, { recursive: true });
  const dest = path.join(uploadsDir, filename);
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(`/uploads/${filename}`); });
    }).on("error", (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function fetchBookData(isbn: string) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
  const res = await fetch(url);
  const data = await res.json() as Record<string, any>;
  return data[`ISBN:${isbn}`] ?? null;
}

async function main() {
  console.log("Seeding books...\n");

  for (const book of books) {
    const data = await fetchBookData(book.isbn);
    if (!data) {
      console.log(`MISS  ${book.isbn} — not found on Open Library`);
      continue;
    }

    const title: string = data.title;
    const author: string = data.authors?.[0]?.name ?? "Ukjent";
    const coverUrl: string = data.cover?.large ?? data.cover?.medium ?? "";

    const existing = await prisma.book.findUnique({ where: { isbn: book.isbn } });

    let imageUrl: string | null = existing?.imageUrl ?? null;
    if (coverUrl && !imageUrl) {
      try {
        const ext = coverUrl.split(".").pop()?.split("?")[0] ?? "jpg";
        const filename = `${Date.now()}-${isbnSlug(book.isbn)}.${ext}`;
        imageUrl = await downloadImage(coverUrl, filename);
      } catch {
        console.warn(`  Could not download cover for ${book.isbn}`);
      }
    }

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title,
        author,
        description: book.description,
        price: book.price,
        category: book.category,
        imageUrl,
      },
      create: {
        isbn: book.isbn,
        title,
        author,
        description: book.description,
        price: book.price,
        stock: book.stock,
        category: book.category,
        imageUrl,
      },
    });

    console.log(`${existing ? "UPDATE" : "OK    "}  ${title} (${book.isbn})`);
  }

  console.log("\nDone.");
}

function isbnSlug(isbn: string) {
  return isbn.replace(/\D/g, "");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
