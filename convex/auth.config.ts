import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";

export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
      type: "anonymous",
    },
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "password",
      type: "password",
    },
  ],
};
