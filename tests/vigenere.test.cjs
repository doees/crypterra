const {test}=require('node:test');
const assert=require('node:assert/strict');
const {vigenere,recoverKeySegment,answerDigest,readProgress}=require('../.test-build/vigenere.js');
const {campaignStages}=require('../.test-build/missions.js');
test('standard Vigenère vector, normalization, wrapping and invalid keys',()=>{
 assert.equal(vigenere('ATTACK AT DAWN','LEMON',false),'LXFOPVEFRNHR');
 assert.equal(vigenere('LXFOPVEFRNHR','LEMON',true),'ATTACKATDAWN');
 assert.equal(vigenere('a z!','b',false),'BA');
 assert.equal(vigenere('','KEY',true),'');
 for(const key of ['','123','KEY-1','A B','é'])assert.throws(()=>vigenere('ABC',key,true));
 for(const text of ['A','SECRETMESSAGE','THISISALONGERTRANSMISSION'])for(const key of ['A','Z','ORBIT','EXTENDEDKEYWORD'])assert.equal(vigenere(vigenere(text,key,false),key,true),text);
});
test('known-plaintext recovery derives the aligned key segment',()=>{
 assert.equal(recoverKeySegment('LXFOPV','ATTACK'),'LEMONL');
 const encrypted=vigenere('FOLLOWTHESIGNAL','CIPHER',false);
 assert.equal(recoverKeySegment(encrypted.slice(0,6),'FOLLOW'),'CIPHER');
 assert.throws(()=>recoverKeySegment('ABC','AB'));
 assert.throws(()=>recoverKeySegment('',''));
});
test('all missions use exactly Vigenère and every intended puzzle chain verifies',async()=>{
 const stages=campaignStages;
 assert.equal(new Set(stages.flat().map(s=>s.algorithm)).size,1);
 assert.equal(stages[0][0].algorithm,'Vigenère');
 const logKey=stages[0][0].evidence.split('\n').map(line=>line[0]).join('');
 const relay=vigenere(stages[0][0].code,logKey,true);
 const rendezvous=vigenere(stages[0][1].code,relay.slice('RELAYKEYIS'.length),true);
 const recovered=recoverKeySegment(stages[1][0].code.slice(0,6),'FOLLOW');
 const route=vigenere(stages[1][0].code,recovered,true);
 const blackout=vigenere(stages[1][1].code,route.split('THEROUTEKEYIS')[1],true);
 const fragments=stages[2][0].evidence.split('\n').slice(0,4).sort().map(line=>line.split(' — ')[1]).join('');
 assert.equal(fragments.length,14);
 const vault=vigenere(stages[2][0].code,fragments,true);
 const [,inner,outer]=vault.match(/^INNERKEYIS(.+)OUTERKEYIS(.+)$/);
 const intermediate=vigenere(stages[2][1].code,outer,true);
 const archive=vigenere(intermediate,inner,true);
 assert.notEqual(await answerDigest(intermediate),stages[2][1].digest);
 const results=[relay,rendezvous,route,blackout,vault,archive];
 for(let i=0;i<results.length;i++){
  const stage=stages[Math.floor(i/2)][i%2];
  assert.equal(await answerDigest(results[i]),stage.digest);
  assert.equal(await answerDigest(results[i].toLowerCase().split('').join(' ')),stage.digest);
  assert.notEqual(await answerDigest(results[i].slice(1)),stage.digest);
  assert.notEqual(await answerDigest(['ORIGIN','GHOST','OBSIDIAN'][Math.floor(i/2)]),stage.digest);
 }
});
test('persisted progress rejects malformed, fractional and out-of-range values',()=>{
 assert.deepEqual(readProgress('[1,2,0]'),[1,2,0]);
 for(const raw of ['bad','null','{}','[3,-1,1.5]','[true,"2",null]'])assert.deepEqual(readProgress(raw),[0,0,0]);
});
