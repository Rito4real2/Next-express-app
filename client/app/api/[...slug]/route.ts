// client/app/api/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper to safely load server code without Webpack tracing it at build time
function getExpressApp() {
  // eval('require') bypasses Webpack static analysis at build time
  const req = eval("require");
  const serverModule = req("../../../server/server");
  return serverModule.default || serverModule;
}

async function handleRequest(req: NextRequest) {
  const expressApp = getExpressApp();

  return new Promise<NextResponse>((resolve) => {
    // Pass request to Express app
    expressApp(req, {
      statusCode: 200,
      headers: {},
      setHeader(key: string, val: string) {
        this.headers[key] = val;
      },
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        resolve(NextResponse.json(data, { status: this.statusCode }));
      },
      send(data: any) {
        resolve(new NextResponse(data, { status: this.statusCode }));
      },
      end(data: any) {
        resolve(new NextResponse(data, { status: this.statusCode }));
      },
    });
  });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}