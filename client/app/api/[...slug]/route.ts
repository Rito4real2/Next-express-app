import { NextRequest, NextResponse } from "next/server";
// Static import allows Next.js/Turbopack to bundle express and its dependencies
import app from "../../../../server/server";

export const dynamic = "force-dynamic";

async function handleRequest(req: NextRequest) {
  try {
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