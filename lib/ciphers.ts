export const normalize = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');
const letters = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, '');
export type Cipher = 'Caesar' | 'Vigenère' | 'XOR hex' | 'Columnar' | 'Rail Fence';
export function transform(cipher: Cipher, input: string, key: string, decode: boolean): string {
  if (cipher === 'Caesar') {
    const shift = Number(key);
    if (!Number.isInteger(shift) || shift < 0 || shift > 25) throw new Error('Use a shift from 0 to 25.');
    return input.replace(/[a-z]/gi, c => String.fromCharCode((c.toUpperCase().charCodeAt(0)-65+(decode?-shift:shift)+26)%26+65));
  }
  if (cipher === 'XOR hex') {
    if (!key || !/^[\x20-\x7e]+$/.test(key)) throw new Error('Use a non-empty ASCII key (case sensitive).');
    const hex = input.replace(/\s/g, '');
    if (decode && (!/^[\da-f]*$/i.test(hex) || hex.length%2)) throw new Error('Enter complete hexadecimal byte pairs.');
    const bytes = decode ? (hex.match(/../g)||[]).map(h=>parseInt(h,16)) : Array.from(new TextEncoder().encode(input));
    const result = bytes.map((b,i)=>b^key.charCodeAt(i%key.length));
    return decode ? new TextDecoder().decode(new Uint8Array(result)) : result.map(b=>b.toString(16).padStart(2,'0')).join(' ');
  }
  const text = letters(input);
  if (cipher === 'Rail Fence') {
    const rails = Number(key);
    if (!Number.isInteger(rails) || rails<2 || rails>10) throw new Error('Use 2–10 rails.');
    const pattern = Array.from({length:text.length},(_,i)=>{const t=i%(2*(rails-1));return t<rails?t:2*(rails-1)-t;});
    if (!decode) return Array.from({length:rails},(_,r)=>Array.from(text).filter((_,i)=>pattern[i]===r).join('')).join('');
    const tracks: string[][] = []; let offset=0;
    for(let r=0;r<rails;r++){const count=pattern.filter(n=>n===r).length;tracks[r]=Array.from(text.slice(offset,offset+count));offset+=count;}
    return pattern.map(r=>tracks[r].shift()).join('');
  }
  const secret = letters(key);
  if (!secret) throw new Error('Enter a keyword containing A–Z letters.');
  if (cipher === 'Vigenère') return Array.from(text,(c,i)=>String.fromCharCode((c.charCodeAt(0)-65+(decode?-1:1)*(secret.charCodeAt(i%secret.length)-65)+26)%26+65)).join('');
  // Standard columnar transposition: row-wise fill, alphabetically ordered columns.
  // Equal keyword letters retain their original left-to-right order.
  const order=Array.from(secret, (c,i)=>({c,i})).sort((a,b)=>a.c.localeCompare(b.c)||a.i-b.i).map(v=>v.i);
  const width=secret.length;
  if (!decode) {
    const padded=text.padEnd(Math.ceil(text.length/width)*width,'X');
    return order.map(col=>Array.from({length:padded.length/width},(_,row)=>padded[row*width+col]).join('')).join('');
  }
  if (text.length%width) throw new Error('Ciphertext length must be a multiple of the keyword length.');
  const rows=text.length/width, columns:string[]=[];
  order.forEach((col,rank)=>columns[col]=text.slice(rank*rows,(rank+1)*rows));
  return Array.from({length:text.length},(_,i)=>columns[i%width][Math.floor(i/width)]).join('');
}
export async function answerDigest(answer: string): Promise<string> {
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalize(answer)));
  return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
}
export function readProgress(raw: string|null): number[] {
  try { const value=JSON.parse(raw||'[]'); return [0,1,2].map(i=>Array.isArray(value)&&Number.isInteger(value[i])&&value[i]>=0&&value[i]<=2?value[i]:0); } catch { return [0,0,0]; }
}
