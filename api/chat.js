export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const body = await req.json();
    const { messages, model } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0 || !model) {
      return new Response(
        JSON.stringify({ status: false, error: "Missing messages or model" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Gabungkan riwayat percakapan
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const upstreamUrl = `https://api-faa-skuarta2.vercel.app/faa/chatai?text=${encodeURIComponent(prompt)}&model=${model}`;
    const response = await fetch(upstreamUrl);
    const data = await response.json();

    const result = data?.result?.response?.response || "Maaf, tidak ada hasil.";

    return new Response(
      JSON.stringify({
        status: true,
        creator: "Faa",
        model,
        response: result,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ status: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
