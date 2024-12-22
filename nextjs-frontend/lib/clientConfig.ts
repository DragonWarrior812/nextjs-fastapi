import { client } from "@/app/openapi-client/services.gen";

const configureClient = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  client.setConfig({
    baseUrl: baseUrl,
  });
};

client.interceptors.request.use((request, options) => {
  if (options.body) {
    const { contentLength } = calculateContentLength(options.body);
    request.headers.set("Content-Length", contentLength.toString());
  }
  return request;
});

configureClient();

type RequestBody =
  | URLSearchParams
  | string
  | object
  | number
  | null
  | undefined;

function calculateContentLength(body: RequestBody) {
  let requestBody: string;

  // Determine the body type and handle accordingly
  if (body instanceof URLSearchParams) {
    requestBody = body.toString();
  } else if (typeof body === "string" || typeof body === "number") {
    requestBody = body.toString();
  } else if (body) {
    requestBody = JSON.stringify(body);
  } else {
    requestBody = ""; // Handle null or undefined body
  }

  // Calculate the byte length using UTF-8 encoding
  const contentLength = Buffer.byteLength(requestBody, "utf8");

  return {
    contentLength,
  };
}
