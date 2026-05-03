import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export class EncryptionService {
  private key: Buffer;

  constructor(masterSecret: string) {
    // Derive key using HKDF
    this.key = crypto.hkdfSync('sha256', masterSecret, '', 'blood-donation-encryption-key', 32);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const tag = cipher.getAuthTag();
    
    // Format: iv:tag:encrypted
    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
  }

  decrypt(encryptedData: string): string {
    const [ivBase64, tagBase64, encrypted] = encryptedData.split(':');
    
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
