import app from '@/../server/server'; // Path to your server/server.js file

// Helper function to process Next.js requests through Express
async function handleRequest(req: Request) {
  return new Promise<Response>((resolve) => {
    // Mock Node response object for Express compatibility
    const res: any = {
      statusCode: 200,
      headers: {},
      setHeader(key: string, value: string) {
        this.headers[key] = value;
      },
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        resolve(
          new Response(JSON.stringify(data), {
            status: this.statusCode,
            headers: { 'Content-Type': 'application/json', ...this.headers },
          })
        );
      },
      send(data: any) {
        resolve(
          new Response(data, {
            status: this.statusCode,
            headers: this.headers,
          })
        );
      },
      end(data: any) {
        resolve(
          new Response(data, {
            status: this.statusCode,
            headers: this.headers,
          })
        );
      },
    };

    // Convert web Request to express-friendly format and dispatch
    app(req as any, res);
  });
}

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}

export async function PUT(request: Request) {
  return handleRequest(request);
}

export async function DELETE(request: Request) {
  return handleRequest(request);
}