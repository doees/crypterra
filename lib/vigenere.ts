export const normalize = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
export const letters = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, '');
/** Standard repeating-key Vigenère; key alignment starts at the first letter. */
export function vigenere(input: string, keyword: string, decode: boolean): string {
 const secret=keyword.trim().toUpperCase();
 if (!/^[A-Z]+$/.test(secret)) throw new Error('Enter a keyword using only A–Z letters.');
 return Array.from(letters(input),(c,i)=>String.fromCharCode((c.charCodeAt(0)-65+(decode?-1:1)*(secret.charCodeAt(i%secret.length)-65)+26)%26+65)).join('');
}
/** Known-plaintext analysis of Vigenère, K = C - P (mod 26). */
export function recoverKeySegment(ciphertext: string, plaintext: string): string {
 const c=letters(ciphertext),p=letters(plaintext);
 if (!c || c.length!==p.length) throw new Error('Use matching ciphertext and known-plaintext excerpts of equal letter length.');
 return Array.from(c,(ch,i)=>String.fromCharCode((ch.charCodeAt(0)-p.charCodeAt(i)+26)%26+65)).join('');
}
export async function answerDigest(answer: string): Promise<string> {
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalize(answer)));
  return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
}
export function readProgress(raw: string|null): number[] {
  try { const value=JSON.parse(raw||'[]'); return [0,1,2].map(i=>Array.isArray(value)&&Number.isInteger(value[i])&&value[i]>=0&&value[i]<=2?value[i]:0); } catch { return [0,0,0]; }
}
