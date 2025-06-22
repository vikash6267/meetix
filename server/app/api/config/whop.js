// lib/whop-sdk.js
const { WhopServerSdk } = require("@whop/api");

const whopSdk = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID || "fallback",
  appApiKey: process.env.WHOP_API_KEY || "fallback",
  onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID, // optional
  companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID, // optional
});

module.exports = whopSdk;
