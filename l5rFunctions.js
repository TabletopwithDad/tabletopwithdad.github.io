const PAPER='#EAE9E7', goodBorder='#ffffff', badBorder='#000000';

const clans={
 crab:{name:'Crab',bg:'#9eb9c1',deep:'#2D395A',pale:'#e7f0ed',mon:'1',ink:'#5a6669',inkText:'#ffffff'},
 crane:{name:'Crane',bg:'#a9d9e8',deep:'#88c6f2',pale:'#edf7f7',mon:'2',ink:'#BED3E9',inkText:'#000000'},
 dragon:{name:'Dragon',bg:'#a8c6b1',deep:'#5B8E52',pale:'#edf2e8',mon:'3',ink:'#61451d',inkText:'#ffffff'},
 lion:{name:'Lion',bg:'#e6c56e',deep:'#C8A000',pale:'#f8f0d9',mon:'4',ink:'#61451d',inkText:'#ffffff'},
 phoenix:{name:'Phoenix',bg:'#e6a17d',deep:'#f0571a',pale:'#fbede0',mon:'5',ink:'#e6a910',inkText:'#ffffff'},
 scorpion:{name:'Scorpion',bg:'#d69b9d',deep:'#94000B',pale:'#f5e9e5',mon:'6',ink:'#302025',inkText:'#ffffff'},
 unicorn:{name:'Unicorn',bg:'#c9b6df',deep:'#654991',pale:'#f3edf7',mon:'7',ink:'#d2bce6',inkText:'#000000'},
 naga:{name:'Naga',bg:'#b8c8a2',deep:'#7D9256',pale:'#eef1e2',mon:'9',ink:'#3c4d23',inkText:'#ffffff'},
fox:{    name:'Fox', bg:'#DDBFAC', deep:'#943A0E', pale:'#F7F1E6', mon:'<', ink:'#adb2b8',inkText:'#000000'},
 mantis:{name:'Mantis',bg:'#b8d7b3',deep:'#1C6B4A',pale:'#eef5e8',mon:'=',ink:'#0B5E3D',inkText:'#ffffff'},
 hare:{name:'Hare',bg:'#dcbfc2',deep:'#C92032',pale:'#faf1f0',mon:';',ink:'#f5e4e4',inkText:'#000000'},
 neutral:{name:'Neutral',bg:'#d5c7b1',deep:'#544d42',pale:'#f1ece2',mon:'8',ink:'#676053',inkText:'#ffffff'},
 shadow:{name:'Shadowlands',bg:'#544d42',deep:'#1c1c1a',pale:'#f1ece2',mon:':',ink:'#2e1e19',inkText:'#ffffff'}
};

function hexToRgb(hex,opacity) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return `rgba(${parseInt(result[1],16)},${parseInt(result[2],16)},${parseInt(result[3],16)},${opacity})`;
 }
 function drawMon(c,x,y,r,cl){

const grad=c.createLinearGradient(x-.2*r,y-.9*r, x-.9*r,y-.2*r);
grad.addColorStop(1, PAPER);
grad.addColorStop(0, cl.deep);
 c.save();c.fillStyle=grad;c.strokeStyle=cl.deep;
 c.font=` ${r}px "L5RSymbols"`;c.textAlign='center';c.textBaseline='middle';c.fillText(cl.mon,x,y);c.restore();
}
function drawMonReverse(c,x,y,r,cl){

const grad=c.createLinearGradient((1.2*r)-800,0,0-800,(1.2*r));
grad.addColorStop(0, PAPER);
grad.addColorStop(1, cl.deep);
 c.save();c.fillStyle=grad;c.strokeStyle=cl.deep;
 c.font=` ${r}px "L5RSymbols"`;c.textAlign='center';c.textBaseline='middle';c.fillText(cl.mon,x,y);c.restore();
}
function iconToken(ctx,token,x,y,size,color){
  ctx.save();
  const symbols={'&':'S','#':'O', '@':'D', v:'V',a:'A',f:'F',e:'E',w:'W'};
  ctx.font=`${size*2.5}px "L5RSymbols"`;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(symbols[token]||'AAA',x+16,y-3);
 ctx.restore();
}
function drawBow(ctx,x,y,size,color){
 ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.lineWidth=size*.08;
 ctx.beginPath();ctx.arc(-size*.15,0,size*.45,-Math.PI/2.2,Math.PI/2.2);ctx.stroke();
 ctx.beginPath();ctx.moveTo(size*.15,-size*.45);ctx.lineTo(size*.15,size*.45);ctx.stroke();
 ctx.restore();
}
function drawRich(ctx,text,x,y,maxWidth,font,color,lineH,iconSize=24,maxHeight=Infinity){
 let italics = false;
 const re=/(\[v\]|\[a\]|\[f\]|\[e\]|\[w\]|[&@#])/g;
 const tokens=text.split(re).filter(Boolean);
 let lines=[[]],width=0;
 let stretch = .8;
 ctx.font=font;
 function addText(str){
  for(let chunk of str.split(/(\s+)/)){
    if(!chunk) continue;

    if(chunk.startsWith('*')){
      italics = true;
      chunk = chunk.slice(1);
    }

    const endItalic = chunk.includes('*');

    if(endItalic){
      chunk = chunk.replace('*','');
    }

    if(!chunk) continue;

    const style = italics;

    ctx.font = style ? `italic ${font}` : font;
	
    const w = ctx.measureText(chunk).width*stretch;

    if(width+w > maxWidth && width > 0){
      lines.push([]);
      width = 0;
    }

    lines.at(-1).push({
      t: chunk,
      w,
      italics: style
    });

    width += w;

    if(endItalic){
      italics = false;
    }
  }
}
 for(const t of tokens){
  if(t.includes('\n')){
   const parts=t.split('\n');
   parts.forEach((p,i)=>{if(p)addText(p);if(i<parts.length-1){lines.push([]);width=0}});
   continue;
  }
  const isIcon=/^(\[v\]|\[a\]|\[f\]|\[e\]|\[w\]|[&@#])$/.test(t);
  const w=isIcon?iconSize:ctx.measureText(t).width;
  if(isIcon&&width+w>maxWidth&&width){lines.push([]);width=0}
  if(isIcon){lines.at(-1).push({t,w,isIcon});width+=w}else addText(t);
 }
 const maxLines=Number.isFinite(maxHeight)?Math.max(0,Math.floor(maxHeight/lineH)):lines.length;
 const shown=lines.slice(0,maxLines);
 ctx.save();
 ctx.fillStyle=color;ctx.font=font;
 const totalHeight = shown.length * lineH;
const startY = y + ((maxHeight - totalHeight) / 2);

shown.forEach((line,i)=>{
    const lineWidth = line.reduce((s,p)=>s+p.w,0);

    let xx = x + (maxWidth - lineWidth)/2;
    let yy = startY + i*lineH;
  for(const p of line){
   if(p.isIcon){const key=p.t==='&'?'&':p.t==='@'?'@':p.t==='#'?'#':p.t[1];
   colRich={'&':color,'@':color,'#':color,'a':'#9BC4CF','f':'#F07F09','e':'#4BB062','v':'#7E519C','w':'#4152A0'};
   iconToken(ctx,key,xx+iconSize/2,yy+lineH*.4,iconSize,colRich[key]);xx+=p.w}
   else{
   
   ctx.fillStyle=color;
  ctx.font=p.italics?`italic ${font}`
  : font;
  ctx.textAlign='left';ctx.save();
ctx.scale(stretch, 1);

ctx.fillText(
    p.t,
    xx / stretch,
    yy
);

ctx.restore();
  xx+=p.w}
  }
 });
 ctx.restore();
 return shown.length*lineH;
}
function fitFont(ctx,text,maxWidth,base,min=18,family='Cormorant Garamond'){
 let size=base;
 while(size>min){ctx.font=`${size}px "${family}"`;if(ctx.measureText(text).width<=maxWidth)break;size--}
 return size;
}
function panelFrame(ctx,x,y,w,h,cl,hole=false){
 
 ctx.save();ctx.fillStyle=hexToRgb(PAPER,0.6);ctx.strokeStyle=cl.deep;ctx.lineWidth=5;
 ctx.beginPath();ctx.moveTo(x+35,y);ctx.lineTo(x+w-35,y);ctx.lineTo(x+w-35,y+18);ctx.lineTo(x+w-17,y+18);ctx.lineTo(x+w-17,y+42);ctx.lineTo(x+w,y+42);ctx.lineTo(x+w,y+h-42);ctx.lineTo(x+w-17,y+h-42);ctx.lineTo(x+w-17,y+h-18);ctx.lineTo(x+w-35,y+h-18);ctx.lineTo(x+w-35,y+h);ctx.lineTo(x+35,y+h);ctx.lineTo(x+35,y+h-18);ctx.lineTo(x+17,y+h-18);ctx.lineTo(x+17,y+h-42);ctx.lineTo(x,y+h-42);ctx.lineTo(x,y+42);ctx.lineTo(x+17,y+42);ctx.lineTo(x+17,y+18);ctx.lineTo(x+35,y+18);ctx.closePath();ctx.fill();
 if (hole)
 {
	  ctx.beginPath();ctx.moveTo(x+w-115,y);ctx.lineTo(x+w-35,y);ctx.lineTo(x+w-35,y+18);ctx.lineTo(x+w-17,y+18);ctx.lineTo(x+w-17,y+42);ctx.lineTo(x+w,y+42);ctx.lineTo(x+w,y+h-42);ctx.lineTo(x+w-17,y+h-42);ctx.lineTo(x+w-17,y+h-18);ctx.lineTo(x+w-35,y+h-18);ctx.lineTo(x+w-35,y+h);ctx.lineTo(x+35,y+h);ctx.lineTo(x+35,y+h-18);ctx.lineTo(x+17,y+h-18);ctx.lineTo(x+17,y+h-42);ctx.lineTo(x,y+h-42);ctx.lineTo(x,y+42);ctx.lineTo(x+17,y+42);ctx.lineTo(x+17,y+18);ctx.lineTo(x+35,y+18);ctx.lineTo(x+35,y);ctx.lineTo(x+115,y);
 }
 
 ctx.stroke();ctx.restore();
}