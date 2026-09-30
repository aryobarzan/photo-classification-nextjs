const apiUrl = process.env.API_URL;
if (!apiUrl) throw new Error("API_URL is not set");

export const environment = {
  production: process.env.NODE_ENV === "production",
  apiUrl,
};
