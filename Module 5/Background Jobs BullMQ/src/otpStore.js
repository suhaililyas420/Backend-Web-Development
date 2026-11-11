'use strict';

const crypto = require('node:crypto');

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

const store = new Map();

/**
 * Generates a random 6-digit numeric OTP string.
 */
function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Stores an OTP for an email with a 10-minute expiry and zero attempts.
 */
function storeOTP(email, otp) {
  store.set(email, {
    otp: String(otp),
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}

/**
 * Verifies an OTP checking existence, expiry, attempt limit, and code match in order.
 */
function verifyOTP(email, code) {
  const entry = store.get(email);
  if (!entry) {
    return { ok: false, reason: 'not_found' };
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (entry.otp !== String(code)) {
    entry.attempts += 1;
    return { ok: false, reason: 'wrong_code' };
  }

  store.delete(email);
  return { ok: true };
}

/**
 * Marks an email address as verified.
 */
function markVerified(email) {
  console.log(`Email verified: ${email}`);
}

module.exports = { generateOTP, storeOTP, verifyOTP, markVerified, _store: store };
