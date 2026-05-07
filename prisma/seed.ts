import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { mkdirSync } from "fs";

const prisma = new PrismaClient();

const uploadsDir = path.join(process.cwd(), "public", "uploads");

const books = [
  // Originals — all verified to have covers on Open Library
  { isbn: "9780747532743", category: "Fantasi",          price: 149, stock: 20, description: "Den første boken i den legendariske Harry Potter-serien. Elleve år gamle Harry oppdager at han er en trollmann og begynner på Galtvort skole for hekseri og trolldom." },
  { isbn: "9780261103573", category: "Fantasi",          price: 169, stock: 15, description: "Det første bindet i Ringenes Herre-trilogien. Hobbiten Frodo Lommelun arver en farlig ring og må begi seg ut på en farefull reise for å ødelegge den." },
  { isbn: "9780743273565", category: "Klassiker",        price: 129, stock: 18, description: "En tidløs klassiker som utforsker temaer som rikdom, kjærlighet og den amerikanske drømmen i 1920-tallets New York." },
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
  { isbn: "9780062060624", category: "Fantasi",          price: 159, stock: 18, description: "Madeline Millers gjenfortelling av kjærligheten mellom Akilles og Patroklos, satt mot bakteppet av den trojanske krig. En lyrisk og hjerteskjærende roman om gudene og menneskene." },
  { isbn: "9780062073488", category: "Krim",             price: 139, stock: 22, description: "Ti fremmede inviteres til en isolert øy. Én etter én blir de drept i tråd med en gammel barnesang. Agatha Christies mest oppfinnsomme mordmysterium og en av de mest solgte krimromanene noensinne." },
  { isbn: "9780143127550", category: "Skjønnlitteratur", price: 159, stock: 15, description: "Lydia Lee, favoritten i en kinesisk-amerikansk familie i 1970-tallets Ohio, blir funnet død i en innsjø. Celeste Ngs debutroman utforsker familieforventninger, identitet og hemmeligheter." },
  { isbn: "9780451524935", category: "Klassiker",        price: 129, stock: 25, description: "Winston Smith arbeider for Sannhetsministeriet i et totalitært samfunn der Big Brother overvåker alt. Orwells dystopiske mesterverk om tankekontroll, sensur og motstand." },
  { isbn: "9780141439518", category: "Klassiker",        price: 119, stock: 20, description: "Elizabeth Bennet og Mr. Darcy starter i misforståelse og fordommer, men gjennom samtaler og sosiale forviklinger oppdager de både seg selv og hverandre. Jane Austens mest elskede roman." },
  { isbn: "9780141439600", category: "Klassiker",        price: 129, stock: 14, description: "Charles Dickens' historiske roman om London og Paris under den franske revolusjon, med tema som offer, gjenoppstandelse og resignasjon. En av tidenes mest solgte bøker." },
  { isbn: "9780141439587", category: "Klassiker",        price: 119, stock: 12, description: "Den vakre, smarte og rike Emma Woodhouse mener hun er en mester i matchmaking. Jane Austens komedie om selvbedrag, kjærlighet og personlig vekst i den engelske landsbyen Highbury." },
  { isbn: "9780375842207", category: "Ungdom",           price: 159, stock: 20, description: "Markus Zusaks roman fortalt av Døden selv. I Tyskland under andre verdenskrig stjeler den unge Liesel bøker for å overleve – og for å gi mening til en verden i kaos." },
  { isbn: "9780099518471", category: "Klassiker",        price: 129, stock: 16, description: "Aldous Huxleys dystopi om en fremtid der mennesker dyrkes på fabrikker, og lykke kommer fra piller og underholdning. En profetisk advarsel mot teknologisk konformitet." },
  { isbn: "9780006546061", category: "Klassiker",        price: 129, stock: 14, description: "Ray Bradburys klassiske dystopi om en brannmann hvis jobb er å brenne bøker. Når Guy Montag begynner å lese, oppdager han hva samfunnet har mistet." },
  { isbn: "9780393327342", category: "Skjønnlitteratur", price: 149, stock: 12, description: "Chuck Palahniuks rasende debutroman om en mann som starter en hemmelig fight club med karismatiske Tyler Durden. En av 90-tallets mest innflytelsesrike romaner." },
  { isbn: "9780099273936", category: "Klassiker",        price: 159, stock: 10, description: "Sethe har rømt fra slaveriet, men fortiden hjemsøker henne i form av et spøkelse i hennes hjem i Ohio. Toni Morrisons Pulitzer-vinnende roman om frihet, sorg og morskap." },
  { isbn: "9780062315007", category: "Skjønnlitteratur", price: 149, stock: 25, description: "Gjeteren Santiago drar fra Spania til Egypt på leting etter en skatt. Paulo Coelhos moderne fabel om å følge sine drømmer er oversatt til over 80 språk." },
  { isbn: "9780525536291", category: "Skjønnlitteratur", price: 169, stock: 18, description: "To svarte tvillingsøstre rømmer fra hjembyen som tenåringer. Ti år senere lever de svært ulike liv: én svart, én som hvit. Brit Bennetts roman om identitet, familie og rase." },
  { isbn: "9780375507250", category: "Skjønnlitteratur", price: 179, stock: 12, description: "David Mitchells genre-sprengende roman som veksler mellom seks fortellinger spredt over fem århundrer, fra 1850-tallets Stillehav til en post-apokalyptisk fremtid." },
  { isbn: "9780812973815", category: "Sakprosa",         price: 199, stock: 16, description: "Nassim Nicholas Taleb undersøker hvordan høyst usannsynlige hendelser med ekstreme konsekvenser former historien, finansmarkedene og våre liv – og hvorfor vi konstant feilbedømmer dem." },
  { isbn: "9780156012195", category: "Ungdom",           price: 119, stock: 30, description: "En liten prins fra asteroide B-612 møter en flyger som har styrtet i Sahara. Antoine de Saint-Exupérys filosofiske fabel om kjærlighet, vennskap og hva som er viktig i livet." },
  { isbn: "9780812984965", category: "Sakprosa",         price: 189, stock: 14, description: "Bryan Stevenson forteller historien om Walter McMillian, en svart mann uskyldig dømt til døden i Alabama. En kraftfull memoar om rettferdighet, rasisme og tilgivelse i det amerikanske rettssystemet." },
  { isbn: "9780151010264", category: "Klassiker",        price: 169, stock: 12, description: "George Orwells to dystopiske mesterverk i ett bind. Animal Farm – den allegoriske historien om dyrene som overtar gården – og 1984, romanen som ga oss begrepene Big Brother og tankekontroll." },
  { isbn: "9780156030083", category: "Skjønnlitteratur", price: 149, stock: 16, description: "Charlie Gordon har lav IQ, men en eksperimentell behandling gjør ham til geni – først. Daniel Keyes' rørende roman om intelligens, vennskap og hva som gjør oss menneskelige." },
];

async function downloadImage(url: string, filename: string): Promise<string> {
  mkdirSync(uploadsDir, { recursive: true });
  const dest = path.join(uploadsDir, filename);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return `/uploads/${filename}`;
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

    let imageUrl: string | null = null;
    if (coverUrl) {
      try {
        const ext = coverUrl.split(".").pop()?.split("?")[0] ?? "jpg";
        const filename = `${Date.now()}-${isbnSlug(book.isbn)}.${ext}`;
        imageUrl = await downloadImage(coverUrl, filename);
      } catch (e: any) {
        console.warn(`  Could not download cover for ${book.isbn}: ${e.message}`);
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
        imageUrl: imageUrl ?? existing?.imageUrl ?? null,
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
