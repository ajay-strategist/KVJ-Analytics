import crypto from "crypto";

/**
 * Decodes a Base32 string to a Buffer
 */
function decodeBase32(base32: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanBase32 = base32.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
  
  let bits = "";
  for (let i = 0; i < cleanBase32.length; i++) {
    const val = alphabet.indexOf(cleanBase32[i]);
    if (val === -1) {
      throw new Error(`Invalid base32 character: ${cleanBase32[i]}`);
    }
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substring(i, i + 8);
    if (byte.length === 8) {
      bytes.push(parseInt(byte, 2));
    }
  }
  
  return Buffer.from(bytes);
}

/**
 * Generates a 6-digit TOTP token at a specific time step counter
 */
export function generateTOTPAtCounter(secret: string, counter: number): string {
  try {
    const key = decodeBase32(secret);
    const buffer = Buffer.alloc(8);
    
    // Write counter as 64-bit integer
    buffer.writeUInt32BE(0, 0);
    buffer.writeUInt32BE(counter, 4);

    const hmac = crypto.createHmac("sha1", key);
    hmac.update(buffer);
    const hmacResult = hmac.digest();

    // Dynamic truncation
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const binary =
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, "0");
  } catch (err) {
    console.error("TOTP generation error:", err);
    return "000000";
  }
}

/**
 * Generates the current TOTP token for a given base32 secret
 */
export function generateTOTP(secret: string, timeStepSeconds: number = 30): string {
  const counter = Math.floor(Date.now() / 1000 / timeStepSeconds);
  return generateTOTPAtCounter(secret, counter);
}

/**
 * Verifies a TOTP token against a secret.
 * Checks a window of steps (default 1 = +/- 30 seconds drift allowed)
 */
export function verifyTOTP(token: string, secret: string, windowSteps: number = 1): boolean {
  const timeStepSeconds = 30;
  const currentCounter = Math.floor(Date.now() / 1000 / timeStepSeconds);

  for (let i = -windowSteps; i <= windowSteps; i++) {
    const checkToken = generateTOTPAtCounter(secret, currentCounter + i);
    if (checkToken === token) {
      return true;
    }
  }
  
  return false;
}

/**
 * Utility to generate a new random Base32 secret for batch creation
 */
export function generateBase32Secret(length: number = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let result = "";
  for (let i = 0; i < length; i++) {
    const rand = crypto.randomInt(0, chars.length);
    result += chars[rand];
  }
  return result;
}
