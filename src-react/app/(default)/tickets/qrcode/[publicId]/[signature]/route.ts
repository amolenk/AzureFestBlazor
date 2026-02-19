import { websiteSettings } from "@/src/config/website-settings";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ publicId: string; signature: string }> }
) {
    const { publicId, signature } = await context.params;

    const settings = websiteSettings.admitto;
    const encodedPublicId = encodeURIComponent(publicId);
    const encodedSignature = encodeURIComponent(signature);
    const url = `${settings.baseUrl}/teams/${settings.teamSlug}/events/${settings.eventSlug}/public/${encodedPublicId}/qr-code?signature=${encodedSignature}`;

    // Fetch the QR code from the Admitto API
    try
    {
        const res = await fetch(url);
        if (!res.ok) {
            console.error("Upstream error:", res.status, await res.text());
            return new Response("Failed to fetch QR code", { status: 502 });
        }

        // Get the image bytes and content type
        const contentType = res.headers.get("content-type") || "image/png";
        const imageBuffer = await res.arrayBuffer();
        return new Response(Buffer.from(imageBuffer), {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600"
            }
        });
    } catch (err) {
        console.error("Fetch threw an error:", err);
        return new Response("Upstream request failed", { status: 502 });
  }
}
