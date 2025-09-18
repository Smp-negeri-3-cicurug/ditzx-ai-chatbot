export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    let text, model;

    if (req.method === "POST") {
      // Ambil dari body JSON
      const body = await req.json();
      text = body.text;
      model = body.model;
    } else {
      // Fallback: ambil dari query param (kalau GET)
      const { searchParams } = new URL(req.url);
      text = searchParams.get("text");
      model = searchParams.get("model");
    }

    if (!text || !model) {
      return new Response("Missing text or model", { status: 400 });
    }

    // Panggil upstream API
    const upstreamUrl = `https://api-faa-skuarta2.vercel.app/faa/chatai?text=${encodeURIComponent(
      text
    )}&model=${model}`;

    const response = await fetch(upstreamUrl);

    if (!response.ok) {
      throw new Error("Upstream API error");
    }

    const data = await response.json();
    const result = data.result || "Maaf, tidak ada hasil.";

    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    return new Response("Internal server error", { status: 500 });
  }
                        }
