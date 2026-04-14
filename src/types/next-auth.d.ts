import "next-auth";

declare module "next-auth" {
  interface Session {
    orderId?: string;
    companyName?: string;
    plan?: string;
    siteUrl?: string;
    template?: string;
  }
}
