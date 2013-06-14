/*Ext.define('Decal', {
 extend:'Ext.data.Model',
 fields:[
 {name:'id', type:'int'},
 {name:'price', type:'int'},
 'name', 'url', 'colors', 'dimensions'
 ,'desc'
 ]
 });*/

var globalColors = [
    {name:'negru', hex:'000000'},
    {name:'alb', hex:'FFFFFF'},
    {name:'rosu', hex:'FF0000'},
    {name:'verde', hex:'008000'},
    {name:'galben', hex:'FFFF00'},
    {name:'albastru', hex:'0000FF'},
    {name:'mov', hex:'9400D3'},
    {name:'portocaliu', hex:'FFA500'}
];

var abstractDecalsData = [
    {id:1, name:'Scriptural', desc:'Frumos', url:'abstraction150.jpg', price:28, colors:globalColors, dimensions:['120 x 90 cm', '85 x 60 cm'] },
    {id:2, name:'Bule', url:'boules300.jpg', price:139, colors:globalColors, dimensions:['120 x 90 cm', '85 x 60 cm', '60 x 45 cm'] },
    {id:3, name:'Cercuri', url:'cercles_Delaunay150.jpg', price:22, colors:globalColors },
    {id:4, name:'Tablou', url:'graphisme_abstraction150.jpg', price:56, colors:globalColors }
//    {id:5, name:'Tablou F', url:'module_abstrait_7150.jpg', price:44, colors:globalColors },
//    {id:6, name:'Vartej', url:'Vortex150.jpg', price:82, colors:globalColors }
];

var animalsDecalsData = [
    {id:1, name:'Libelula', url:'libellule_st-top150.jpg', price:28, colors:globalColors },
    {id:2, name:'2 Panda', url:'2_panda_st-top150.jpg', price:139, colors:globalColors },
    {id:3, name:'Panda', url:'panda_st-top150.jpg', price:22, colors:globalColors },
    {id:4, name:'Elefant', url:'Elefant150.jpg', price:56, colors:globalColors },
    {id:5, name:'Angel panda', url:'Angelpanda150.jpg', price:44, colors:globalColors },
    {id:6, name:'Evil panda', url:'Evilpanda150.jpg', price:82, colors:globalColors },
    {id:7, name:'Girafa', url:'girafe_st-top150.jpg', price:82, colors:globalColors },
    {id:8, name:'Pescarus', url:'pescarus_dzf150.jpg', price:82, colors:globalColors },
    {id:9, name:'Elefant', url:'elefant_2_150.jpg', price:82, colors:globalColors }
];