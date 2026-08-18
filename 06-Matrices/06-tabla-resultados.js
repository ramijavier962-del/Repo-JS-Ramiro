//mostrar resultados de los partidos de futbol en una tabla
let grupos=[
    ["japon",3,0],
    ["argentina",2,1],
    ["francia",2,1],
    ["brasil",1,2]
];
for (let i=0; i<grupos.length; i++){
    console.log(+grupos[i][0]+" | Partidos Ganados: "+grupos[i][1]+" | Partidos Perdidos: "+grupos[i][2]);
}