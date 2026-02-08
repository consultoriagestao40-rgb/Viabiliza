import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("---------------------------------------------------");
        console.log("[WhatsApp Webhook] Received payload:");
        console.log(JSON.stringify(body, null, 2));
        console.log("---------------------------------------------------");

        // Here we would process incoming messages
        // e.g., look for new message, match user phone, update ticket chat, etc.

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("WhatsApp Webhook Error:", error);
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
}

export async function GET(req: Request) {
    // WhatsApp verification challenge (Meta requirement)
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "my_secure_token";

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log("[WhatsApp Webhook] Verified!");
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse("Forbidden", { status: 403 });
        }
    }
    return new NextResponse("Hello WhatsApp", { status: 200 });
}
