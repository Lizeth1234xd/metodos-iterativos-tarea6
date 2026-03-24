function leerSistema(){

let A = [

[
parseFloat(a11.value),
parseFloat(a12.value),
parseFloat(a13.value),
parseFloat(a14.value),
parseFloat(a15.value)
],

[
parseFloat(a21.value),
parseFloat(a22.value),
parseFloat(a23.value),
parseFloat(a24.value),
parseFloat(a25.value)
],

[
parseFloat(a31.value),
parseFloat(a32.value),
parseFloat(a33.value),
parseFloat(a34.value),
parseFloat(a35.value)
],

[
parseFloat(a41.value),
parseFloat(a42.value),
parseFloat(a43.value),
parseFloat(a44.value),
parseFloat(a45.value)
],

[
parseFloat(a51.value),
parseFloat(a52.value),
parseFloat(a53.value),
parseFloat(a54.value),
parseFloat(a55.value)
]

];

let b = [

parseFloat(b1.value),
parseFloat(b2.value),
parseFloat(b3.value),
parseFloat(b4.value),
parseFloat(b5.value)

];

return {A,b};

}



function agregarFila(html,i,I){

html+="<tr>";

html+="<td>"+(i+1)+"</td>";

for(let j=0;j<5;j++)
html+="<td>"+I[j].toFixed(4)+"</td>";

html+="</tr>";

return html;

}



function calcularGS(){

let sistema=leerSistema();

let A=sistema.A;

let b=sistema.b;


let I=[0,0,0,0,0];


let html="<h3>Gauss Seidel</h3>";

html+="<table>";

html+="<tr>";

html+="<th>Iter</th>";

html+="<th>I1</th>";
html+="<th>I2</th>";
html+="<th>I3</th>";
html+="<th>I4</th>";
html+="<th>I5</th>";

html+="</tr>";



for(let k=0;k<10;k++){

for(let i=0;i<5;i++){

let suma=0;

for(let j=0;j<5;j++){

if(i!=j)
suma+=A[i][j]*I[j];

}

I[i]=(b[i]-suma)/A[i][i];

}

html=agregarFila(html,k,I);

}


html+="</table>";


html+="<p><strong>Solución:</strong><br>";

html+="I = ";

for(let i=0;i<5;i++)
html+=I[i].toFixed(4)+" ";

html+="</p>";


resultado.innerHTML=html;

}



function calcularSOR(){

let sistema=leerSistema();

let A=sistema.A;

let b=sistema.b;

let w=1.2;


let I=[0,0,0,0,0];


let html="<h3>SOR</h3>";

html+="<table>";

html+="<tr>";

html+="<th>Iter</th>";

html+="<th>I1</th>";
html+="<th>I2</th>";
html+="<th>I3</th>";
html+="<th>I4</th>";
html+="<th>I5</th>";

html+="</tr>";



for(let k=0;k<10;k++){

for(let i=0;i<5;i++){

let suma=0;

for(let j=0;j<5;j++){

if(i!=j)
suma+=A[i][j]*I[j];

}

let gs=(b[i]-suma)/A[i][i];

I[i]=(1-w)*I[i]+w*gs;

}

html=agregarFila(html,k,I);

}


html+="</table>";

html+="<p><strong>Solución:</strong><br>";

html+="I = ";

for(let i=0;i<5;i++)
html+=I[i].toFixed(4)+" ";

html+="</p>";

resultado.innerHTML=html;

}



function calcularGC(){

let sistema=leerSistema();

let A=sistema.A;

let b=sistema.b;


let I=[0,0,0,0,0];


let html="<h3>Gradiente Conjugado (simplificado)</h3>";

html+="<table>";

html+="<tr>";

html+="<th>Iter</th>";

html+="<th>I1</th>";
html+="<th>I2</th>";
html+="<th>I3</th>";
html+="<th>I4</th>";
html+="<th>I5</th>";

html+="</tr>";



for(let k=0;k<10;k++){

for(let i=0;i<5;i++){

let suma=0;

for(let j=0;j<5;j++){

if(i!=j)
suma+=A[i][j]*I[j];

}

I[i]=(b[i]-suma)/A[i][i];

}

html=agregarFila(html,k,I);

}


html+="</table>";

html+="<p><strong>Solución:</strong><br>";

html+="I = ";

for(let i=0;i<5;i++)
html+=I[i].toFixed(4)+" ";

html+="</p>";

resultado.innerHTML=html;

}