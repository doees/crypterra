const {test}=require('node:test');
const assert=require('node:assert/strict');
const {transform,answerDigest,normalize,readProgress}=require('../.test-build/ciphers.js');
const {campaignStages}=require('../.test-build/missions.js');
test('known Vigenère and Rail Fence vectors',()=>{
 assert.equal(transform('Vigenère','ATTACK AT DAWN','LEMON',false),'LXFOPVEFRNHR');
 assert.equal(transform('Vigenère','LXFOPVEFRNHR','LEMON',true),'ATTACKATDAWN');
 assert.equal(transform('Rail Fence','WEAREDISCOVEREDFLEEATONCE','3',false),'WECRLTEERDSOEEFEAOCAIVDEN');
 assert.equal(transform('Rail Fence','WECRLTEERDSOEEFEAOCAIVDEN','3',true),'WEAREDISCOVEREDFLEEATONCE');
});
test('columnar handles uneven payloads and duplicate keyword letters',()=>{
 for(const key of ['VECTOR','PRISM','BALLOON'])for(const text of ['A','HELLOWORLD','TWENTYONELETTERPAYLOAD']){
  const encoded=transform('Columnar',text,key,false);
  assert.equal(transform('Columnar',encoded,key,true),text.padEnd(Math.ceil(text.length/key.length)*key.length,'X'));
 }
});
test('XOR follows known bytes and preserves UTF-8 round trips',()=>{
 assert.equal(transform('XOR hex',"Burning 'em",'ICE',false),'0b 36 37 27 2a 2b 2e 63 62 2c 2e');
 const text='Sinyal rahasia 🔑';
 assert.equal(transform('XOR hex',transform('XOR hex',text,'NOVA',false),'NOVA',true),text);
 for(const bad of ['a','GG','01-02'])assert.throws(()=>transform('XOR hex',bad,'KEY',true));
 assert.throws(()=>transform('Rail Fence','ABC','1',true));
 assert.throws(()=>transform('Columnar','ABC','VECTOR',true));
 assert.throws(()=>transform('Vigenère','ABC','123',true));
});
test('all six campaign layers decrypt and verify through their intended chain',async()=>{
 const stages=campaignStages;
 const first=transform('Vigenère',stages[0][0].code,'ORBIT',true);
 const relayKey=first.slice('RELAYKEYIS'.length);
 const second=transform('Columnar',stages[0][1].code,relayKey,true).replace(/X+$/,'');
 const packet=normalize(transform('XOR hex',stages[1][0].code,'NOVA',true));
 const routeKey=packet.slice('ROUTEKEYIS'.length);
 const schedule=transform('Vigenère',stages[1][1].code,routeKey,true);
 const vault=transform('Rail Fence',stages[2][0].code,'4',true);
 const vaultKey=vault.slice('VAULTKEYIS'.length);
 const inner=transform('Columnar',stages[2][1].code,'PRISM',true);
 assert.equal(inner.length,25);assert.equal(inner.slice(-4),'XXXX');
 const archive=transform('Vigenère',inner.slice(0,-4),vaultKey,true);
 const decoded=[first,second,packet,schedule,vault,archive];
 for(let i=0;i<decoded.length;i++){
  const stage=stages[Math.floor(i/2)][i%2];
  assert.equal(await answerDigest(decoded[i]),stage.digest);
  assert.equal(await answerDigest(decoded[i].toLowerCase().split('').join(' ')),stage.digest);
  assert.notEqual(await answerDigest(decoded[i].slice(1)),stage.digest);
  assert.notEqual(await answerDigest(['ORIGIN','GHOST','OBSIDIAN'][Math.floor(i/2)]),stage.digest);
 }
});
test('progress accepts only valid completed stage counts',()=>{
 assert.deepEqual(readProgress('[1,2,0]'),[1,2,0]);
 for(const raw of ['bad','null','{}','[3,-1,1.5]','[true,"2",null]'])assert.deepEqual(readProgress(raw),[0,0,0]);
});
