import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "ceylon-explore-tours-secure-session-key-change-in-production-2026";
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@ceylonexploretours.com";
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "Admin@CeylonTours2026!";

// Login rate limiting state (per IP/identifier)
const loginAttempts: Record<string, { count: number; firstAttempt: number }> = {};

export function checkLoginRateLimit(identifier: string): { allowed: boolean; waitTimeMs?: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const record = loginAttempts[identifier];
  if (!record) {
    loginAttempts[identifier] = { count: 1, firstAttempt: now };
    return { allowed: true };
  }

  if (now - record.firstAttempt > windowMs) {
    loginAttempts[identifier] = { count: 1, firstAttempt: now };
    return { allowed: true };
  }

  if (record.count >= maxAttempts) {
    const remainingMs = windowMs - (now - record.firstAttempt);
    return { allowed: false, waitTimeMs: remainingMs };
  }

  record.count += 1;
  return { allowed: true };
}

export function resetLoginAttempts(identifier: string) {
  delete loginAttempts[identifier];
}

export function verifyAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  const cleanEmail = email.trim().toLowerCase();
  const expectedEmail = ADMIN_EMAIL.trim().toLowerCase();
  return cleanEmail === expectedEmail && pass === ADMIN_PASSWORD;
}

export function createAdminToken(email: string, role = "ADMIN"): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      sub: email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

export function verifyAdminToken(token: string): { valid: boolean; payload?: any } {
  try {
    if (!token) return { valid: false };
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };

    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (signature !== expectedSig) {
      return { valid: false };
    }

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return { valid: false };
    }

    return { valid: true, payload: decoded };
  } catch (err) {
    return { valid: false };
  }
}
