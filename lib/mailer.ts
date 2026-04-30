import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

export async function sendOrderConfirmation({
  to,
  customerName,
  orderId,
  items,
  total,
  discountCode,
  discountPercent,
}: {
  to: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  discountCode?: string | null;
  discountPercent?: number | null;
}) {
  const itemRows = items
    .map((i) => `${i.title} × ${i.quantity} — ${Math.round(i.price * i.quantity * 100) / 100} kr`)
    .join("\n");

  const discountLine = discountCode
    ? `\nRabatt (${discountCode} – ${discountPercent}%): inkludert\n`
    : "";

  await transporter.sendMail({
    from: `"Bokhandelen" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Ordrebekreftelse – #${orderId.slice(-8).toUpperCase()}`,
    text: `Hei ${customerName},

Takk for din bestilling! Her er en oppsummering:

${itemRows}
${discountLine}
Totalt inkl. mva: ${total} kr

Ordrenummer: ${orderId}

Vi behandler ordren din så snart som mulig.

Hilsen Bokhandelen`,
  });
}
