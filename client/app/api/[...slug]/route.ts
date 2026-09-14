import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

function getExpressApp() {
  try {
    const nativeRequire = eval("require");
    // Path relative to the client execution directory
    const serverPath = path.resolve(process.cwd(), "../server/server.js");
    const serverModule = nativeRequire(serverPath);
    return serverModule.default || serverModule;
  } catch (error: any) {
    console.error("Failed to load Express module:", error);
    throw error;
  }
}

async function handleRequest(req: NextRequest) {
  try {
    const app = getExpressApp();

    return new Promise<NextResponse>((resolve) => {
      const res: any = {
        statusCode: 200,
        headers: {} as Record<string, string>,
        setHeader(key: string, value: string) {
          this.headers[key] = value;
        },
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(data: any) {
          resolve(
            new NextResponse(JSON.stringify(data), {
              status: this.statusCode,
              headers: { "Content-Type": "application/json", ...this.headers },
            })
          );
        },
        send(data: any) {
          resolve(
            new NextResponse(data, {
              status: this.statusCode,
              headers: this.headers,
            })
          );
        },
        end(data: any) {
          resolve(
            new NextResponse(data, {
              status: this.statusCode,
              headers: this.headers,
            })
          );
        },
      };

      app(req as any, res);
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server Initialization Error", details: err.message },
      { status: 500 }
    );
  }
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