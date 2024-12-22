import { client } from "@/app/openapi-client/sdk.gen";

const configureClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  client.setConfig({
    baseURL: baseURL,
  });
};

configureClient();
