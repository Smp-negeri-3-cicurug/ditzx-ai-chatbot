export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");
  const model = searchParams.get("model");

  if (!text || !model) {
    return new Response("Missing text or model", { status: 400 });
  }

  try {
    const upstreamUrl = `https://api-faa-skuarta2.vercel.app/faa/chatai?text=${encodeURIComponent(text)}&model=${model}`;
    const response = await fetch(upstreamUrl);

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status}`);
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
