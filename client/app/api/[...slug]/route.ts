import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

// Helper function to resolve and load the Express app dynamically
function getExpressApp() {
  try {
    // Force Node's native require to bypass Webpack static bundling restrictions
    const nativeRequire = eval("require");
    
    // Resolve absolute path to server/server.js relative to execution root
    const serverPath = path.resolve(process.cwd(), "../server/server.js");
    const serverModule = nativeRequire(serverPath);
    
    return serverModule.default || serverModule;
  } catch (error: any) {
    console.error("CRITICAL: Failed to load Express app module:", error);
    throw error;
  }
}

async function handleRequest(req: NextRequest) {
  try {
    const app = getExpressApp();

    return new Promise<NextResponse>((resolve) => {
      // Mock Express response object for Next.js App Router
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