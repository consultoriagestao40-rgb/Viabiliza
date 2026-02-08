import { NextResponse } from "next/server";

// import mercadopago from "mercadopago";
// mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ticketId, amount, title } = body;

        console.log("---------------------------------------------------");
        console.log(`[Mercado Pago] Creating preference for Ticket ${ticketId}`);
        console.log(`Item: ${title} - Amount: ${amount}`);
        console.log("---------------------------------------------------");

        // Mock preference creation
        const preference = {
            id: `pref_mock_${Date.now()}`,
            init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mock",
            sandbox_init_point: "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=mock"
        };

        // In real impl:
        // const preference = await mercadopago.preferences.create({
        //   items: [{ title, unit_price: amount, quantity: 1 }],
        //   external_reference: ticketId
        // });

        return NextResponse.json({
            id: preference.id,
            url: preference.init_point
        });
    } catch (error) {
        console.error("Mercado Pago Error:", error);
        return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
    }
}
