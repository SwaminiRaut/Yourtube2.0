import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export const sendInvoiceEmail = async (to: string, plan: string, amount: number) => {
  const doc = new PDFDocument();
  let buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", async () => {
    const pdfData = Buffer.concat(buffers);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"YourTube Clone" <${process.env.SMTP_USER}>`,
      to,
      subject: `Invoice for ${plan} Plan`,
      text: `Thank you for purchasing the ${plan} plan!`,
      attachments: [
        {
          filename: `${plan}-invoice.pdf`,
          content: pdfData,
        },
      ],
    });
  });

  doc.fontSize(20).text("YourTube Clone Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Plan: ${plan}`);
  doc.text(`Amount Paid: ₹${amount / 100}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.end();
};
