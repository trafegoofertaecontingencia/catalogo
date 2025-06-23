export async function GET() {
  return new Response("Auth desativado temporariamente", { status: 200 });
}

export const POST = GET;
