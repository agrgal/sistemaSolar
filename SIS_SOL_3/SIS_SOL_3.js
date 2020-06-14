// Datos
// Tierra, venus, mercurio,marte
let nombre = ["tierra","venus","mercurio","marte"];
let m=[5.97e24,4.869e24,3.302e23,6.4185e23];
let diam=[12756,12100,4878,6786];
let Ms=1.98e30;
let G = 6.674e-11;


// coordenadas de los planetas
let ua = 1.49597870700e11;
// Tierra, venus, mercurio,marte
let perihelio = [-1.47098290e11,-0.718490*ua,-0.307499*ua,-1.381497*ua]; // m --> perihelio
let afelio = [152.1e9,0.728213*ua,0.466697*ua,1.665861*ua]; // m --> el afelio
let dia = 24*3600;
let T = [365.25*dia,224.7*dia,115.88*dia,779.96*dia]; // seg

// coordenadas y datos de la órbita 
let numPlanetas = perihelio.length;

let Energy = new Array(numPlanetas); // Energía de la órbita (J) - double 64 bits
let c = new Array(numPlanetas); // parámetro c de la elipse
let b =new Array(numPlanetas); // semieje menor
let d = new Array(numPlanetas);
let L =new Array(numPlanetas); //momento angular

// Datos necesarios para la órbita
let a =new Array(numPlanetas);// semieje 
let ex = new Array(numPlanetas); // excentricidad de la órbita
let inc = [0.002,3.3947,7.0059,1.8509]; // inclinaciones de las órbitas (3)
let n1 = new Array(numPlanetas); // movimiento medio que es mu = n2 a3, siendo mu=G(m1+m2)
let omega = [348.73936,76.678,48.331,49.562]; // letitud del nodo ascendente (4)
let wm = [102.972,131.8639,77.4554, 336.059] ; // letitud del perihelio wm= Omega + w
let w = new Array(numPlanetas); // argumento del perihelio. 
let lambda0 = [354.9,67.1413,209.6643,11.8733] ; // letitud media tiempo t0 (15/1/1985)
let tinicial = "15/01/1985";
let tcalculo = "08/02/2007";
// Anomalia media M[i];
let M = new Array(numPlanetas);
// Anomalia excentrica M[i];
let E = new Array(numPlanetas);

// let pasoTheta = 0.01; // en radianes

// Tamaño de la pantalla en metros
let px = 1.1*2*Math.abs(Math.max(...afelio)); // 2 veces el perihelio más 20%. Mínimo porque son valores negativos
let py = px; // 2 veces el afelio
let ancho = 0;
let alto = 0;

// tiempo de ejecución en pantalla
let tiempo = 0;
let gap = 200; // cambiar parámetro para velocidad de la animación.

// tiempo sideral
let ts = 0; // tiempo sideral.
let gaps = 1; // en dias


// Imagen 
let planeta=new Array(numPlanetas);
let sol;
// Tierra, venus, mercurio,marte
let imagen = ["data/tierra.png","data/venus.png","data/mercurio.png","data/marte.png"];
let simbolo = ["\u2641","\u2640","\u263f","\u2642"];
let planetSize= new Array(numPlanetas);

// Trazo de la trayectoria
// let puntos = new let[2][numPlanetas][(let) (max(T)/dia)+1];
let desfase = 0; // dibujar algo más bajo
let centroElipse = 0;
let factor = [1.1,1.1,1.2,1.1]; // para los textos con información
let colores = ["#8DB2F2","#67A344","#A34467","#BDBB0D"]; // colores órbitas

// contadores y control
let i = 0;
let j = 0;
let n = 0;
let trazo = true;
let trazoV = true;

// introduccion fecha
let modo = 0;
let valorId;
let getDia;
let boton;
let mensaje="Se debe introducir una fecha para comenzar la simulación";

// **********************
// Pre carga de imágenes
// **********************

function preload() {
  sol = loadImage("data/sun.png");
  for (i=0;i<=numPlanetas-1;i++) {
    planeta[i]=loadImage(imagen[i]);
  }
}

// *******************
// SETUP
// *******************

function setup() {
  // createCanvas(400, 400);
  let myCanvas = createCanvas(900, 900); // debe ser igual de ancho que de alto.
  myCanvas.parent('Contenedor1'); // así puedo ponerlo donde quiera
  myCanvas.id("Uno");
  // inicialización de variables
  ancho = width;   alto = height;  desfase = alto/35; 

  // Framerate
  frameRate(30); // velocidad de la animación
  
  // Cálculo de parámetros
    for (i=0;i<=(numPlanetas-1);i++) {
     a[i] =((afelio[i]-perihelio[i])/2); // (1)
     Energy[i] = (log(G)+log(Ms)+log(m[i])-log(2)-log(a[i]));
     c[i] = (afelio[i]-a[i]);
     b[i] = sqrt(sq(a[i])-sq(c[i]));
     ex[i] = c[i]/a[i]; // (2)
     // L[i]=log(2)+log(PI)+log(a[i])+log(b[i])+log(m[i]/1e3)-log(T[i]);
     L[i]=log(2)+log(PI)+log(a[i])+log(b[i])+log(m[i])-log(T[i]);
     d[i]=a[i]*(1-sq(ex[i]));
     // la inclinacion inc(3), Omega (4), longitud del perihelio wm (5), (6) longitud media tiempo t0 (15/1/1985) son datos
     n1[i]=sqrt(G*(Ms+m[i])/pow(a[i],3))*24*3600*180/PI; // en grados por día, como en la tabla
     w[i]= wm[i]-omega[i]; // argumento del perihelio.      
     planetSize[i]= int(25*diam[i]/diam[0]);          
  }   
  
  // Tamaños
  sol.resize(50,0); // 50 de ancho y proporcional de alto
  for (i=0;i<=numPlanetas-1;i++) {
    planeta[i].resize(planetSize[i],0);
  }
  
  // Entrada de textos
  getDia = createInput();
  getDia.parent('Contenedor3'); 
  getDia.size(150, 20);
  getDia.position(40, 150);
  // Botón
  boton = createButton('Aceptar');
  boton.parent('Contenedor3'); 
  boton.position(250, 150);
  boton.mousePressed(changeBG);
}

// *******************
// DRAW
// *******************

function draw() {
  
  // Introducción de fechas
  if (modo==0) {   
     background(0);
     fill(255);
     textSize(20);   
     text("Día de comienzo de la simulación: "+getDia.value(),80,80);
     text(mensaje,80,110);
  }
  
  
  // Dibujo de las órbitas
  if ((millis()>(tiempo+gap)) && modo>0) { // permite controlar el tiempo de la animación
  
    background(0); 
    fill(255);
    
    // ***************************************
    // Dibujo por cada planeta
        for(j=0;j<=numPlanetas-1;j++) {
          
          // Cálculos básicos: anomalía media y anomalía excéntrica
          M[j]= (n1[j]*(numeroDias(tinicial,tcalculo)+ts)+lambda0[j]-wm[j])%360; //se calcula en grados. n1[j] está en grados por día.
          E[j] = aEx(M[j],ex[j]); // Cálculo de la anomalía excéntrica
                    
          // Velocidades en afelio y perihelio
          // Se utilizan después en el dibujo de velocidades e información
          let vmin = (exp(L[j]-log(m[j])-log(afelio[j])))/1000; // vmin en el afelio
          let vmax = (exp(L[j]-log(m[j])-log(-perihelio[j])))/1000; // vmax en el perihelio
          
         //********************
         // Dibujando la órbita
         //********************
          if (trazo==1) {
            stroke(colores[j]);
            strokeWeight(2);
            noFill();
            centroElipse=ancho/2;
            /*
            ellipseMode(RADIUS);            
            push(); // la elipse la dibujo centrada en su CM y girada el ángulo w + omega.            
            translate(tx(-c[j]*cos(radians(wm[j]))),ty(-c[j]*sin(radians(wm[j])))); // me traslado al centro
            rotate(radians(wm[j])); // giro el mismo ángulo Omega + w, wm, la longitude del perihelio
               // suma del argumento del perihelio (w) y Omega, longitud del nodo ascendente. Aproximación inclinación pequeña.
            ellipse(0,0,tx(a[j])-centroElipse,ty(b[j])-alto/2-desfase); // órbita, de semieje mayor a y semieje menor b.
            pop(); // termina el giro más la traslación
            */
            orbita(j); // prefiero dibujarlo así porque permite el dibujo de las órbitas compatible con redimensionar la pantalla.
            textAlign(CENTER);
            strokeWeight(1);
            fill(colores[j]);
            text("P["+nf(perihelio[j]/ua,0,2)+"UA]",tx(factor[j]*perihelio[j]*cos(radians(wm[j])+PI)),ty(factor[j]*perihelio[j]*sin(radians(wm[j])+PI))); // Perihelio
            text("A["+nf(afelio[j]/ua,0,2)+"UA]",tx(factor[j]*afelio[j]*cos(radians(wm[j])+PI)),ty(factor[j]*afelio[j]*sin(radians(wm[j])+PI))); // Afelio
            line(tx(afelio[j]*cos(radians(wm[j])+PI)),ty(afelio[j]*sin(radians(wm[j])+PI)),tx(perihelio[j]*cos(radians(wm[j])+PI)),ty(perihelio[j]*sin(radians(wm[j])+PI)));
            ellipse(tx(perihelio[j]*cos(radians(wm[j])+PI)),ty(perihelio[j]*sin(radians(wm[j])+PI)),4,4);
            ellipse(tx(afelio[j]*cos(radians(wm[j])+PI)),ty(afelio[j]*sin(radians(wm[j])+PI)),4,4);
            noFill();
          } // fin del trazado de las órbitas
          
         //***********************
         // Dibujando la velocidad
         //***********************
          if (trazoV==true) {            
            stroke(colores[j]); // color
            let vv = v(r(a[j],ex[j],E[j]),j); // fórmula de la velocidad. A partir de momento angular.
            let urx = tx(xx(j))-centroElipse;
            let ury = ty(yy(j))-(alto/2)-desfase;
            // angulo aparente es el ángulo que recorre la elipse en proyección
            // lo calculo de estar forma porque me parece más sencilla.
            // la otra forma es calculando la velocidad en coordenadas eclípticas enn xx, yy, zz
            let angulo = atan(ury/urx);
            if (urx<0) {angulo=angulo+PI; }
            if (urx>0 & ury<0) {angulo=angulo+2*PI;} // varía desde 0 a 2PI
            // velocidad en cada punto
            let vx = vv*cos(angulo+(PI/2));
            let vy = vv*sin(angulo+(PI/2)); // ángulo que gira
            // factor variable para ver bien el vector velocidad
            let ff = (vv-vmin)/(vmax-vmin); // permite variar más el tamaño de la flecha de velocidad
            // dibujo del vector velocidad. Línea perpendicular a la órbita
            line(tx(xx(j)),ty(yy(j)),tx(xx(j)+(0.5+ff)*vx*1e9),ty(yy(j)+(0.5+ff)*vy*1e9));
            fill(255);          
            textAlign(CENTER);
            text(nf(vv,0,1)+" km/s",tx(xx(j)+(0.5+ff)*vx*1e9),ty(yy(j)+(0.5+ff)*vy*1e9));
          }   
          
           //************************
           // Información en pantalla
           //************************          
          if (n>=1 && n<=4 && j==n-1) {
            textAlign(LEFT);
            fill(colores[j]);
            text("Datos del planeta "+nombre[j].toUpperCase()+" (" +simbolo[j]+")",10,25);
            text("POSICION: a="+nf(a[j]/ua,0,0)+"UA // e="+nf(ex[j],0,6)+"// n="+nf(n1[j],0,3)+"º/dia // M="+nf(M[j],0,2)+"º // E="+nf(E[j],0,2)+"º// r(UA),vang(rad)="+nf(r(a[j],ex[j],E[j])/ua,0,2)+"/"+nf(vang(ex[j],E[j]),0,2)+
                 " -- [x,y,z](UA)="+nf(xx(j)/ua,0,2)+"/"+nf(yy(j)/ua,0,2)+"/"+nf(zz(j)/ua,0,2),10,40);  
            text("VELOCIDADES: vmin|Afelio="+nf(vmin,0,2)+"km/s // vmax|Perihelio="+nf(vmax,0,2)+" km/s // v="+nf(v(r(a[j],ex[j],E[j]),j),0,2)+"km/s",10,55);
            text("P.ORBITALES: long. nodo asc="+omega[j]+"º // arg. perihelio w="+w[j]+"º // long. perihelio wm="+wm[j]+"º // i="+inc[j]+"º // long. media 15-1-1985 lo="+lambda0[j]+"º",10,70);
            text("P.FISICOS: E="+(-1*exp(Energy[j]))+" J // L\u2243"+exp(L[j]-log(1e6))+" MKg m2/s2 ",10,85);
            text("Dia referencia "+tinicial+": "+gregJuliano(tinicial)+" - Dia empieza: "+tcalculo+": "+gregJuliano(tcalculo)+
                 " - Diferencia: "+numeroDias(tinicial,tcalculo)+" dias - Tiempo: "+ts+" dias - Avance: "+nfp(gaps,0,0),10,100);
          } else if ((n==0 || n>=5) && j==1) {
            textAlign(LEFT);
            fill(255);
            text("INSTRUCCIONES",10,25);
            text("Teclas + y - aumenta/disminuye velocidad || Espacio: órbitas ON/OFF || Tecla v: velocidades ON/OFF ",10,40);
            text("Números 1 al 4: información de planetas Tierra, Venus, Mercurio y Marte || otro número: instrucciones",10,55);
            text("Órbita: dibujo de la elipse, eje mayor, perihelio y afelio. Velocidad: representada en el sentido del movimiento, en km/s",10,70); 
            text("Con las teclas + y - se puede avanzar o retroceder hasta de 20 en 20 días; parámetro 'Avance'",10,85);
            text("Dia referencia "+tinicial+": "+gregJuliano(tinicial)+" - Dia empieza: "+tcalculo+": "+gregJuliano(tcalculo)+
                 " - Diferencia: "+numeroDias(tinicial,tcalculo)+" dias - Tiempo: "+ts+" dias - Avance: "+nfp(gaps,0,0),10,100);
          }
          
          
          // Dibujo de las imágenes
          imageMode(CENTER);          
          // image(planeta[j],i,200+j*40);
          image(planeta[j],tx(xx(j)),ty(yy(j)));
          image(sol,tx(0),ty(0));
    
        } // fin del for por cada planeta
     // ***************************************
      
    ts+=gaps;
    tiempo=millis(); // permite controlar el tiempo
   }  // fin del if por cada tiempo...
}

// *******************
// Funciones
// *******************

// Funciones transforma posicion a coordenadas pantalla
function ty(y) { // transformo y en puntos de la pantalla
   // 10% para dibujarla algo más abajo
  return desfase+(alto/2)*(y/(py/2)+1);
}
function tx(x) { // transformo x en puntos de la pantalla
  return (ancho/2)*(x/(px/2)+1);
}

// Cálculo de la velocidad
function v ( r,  i) {
  // L = mr x v --> en modulo v = L/mr ; L es constante
  // conozco el logaritmo del momento angular L[i] 
  let velocidad = L[i]-log(m[i])-log(r);
  return exp(velocidad)/1000; // km por segundo
}

// *******************************
// Funciones calculos astronómicos
// *******************************
function aEx( mm,  exc) { // calculo anomalía excéntrica método Newton-Rapshon
  // mejor la fórmula en radianes, 
  // Y paso después datos a grados, para que coincida con la tabla
  let iteracciones=0;
  let aE=0;
  let aEant=mm*PI/180;
  while (abs(aE-aEant)>0.00001) { // formula en radianes
    aEant=aE;
    aE=aEant+(mm*(PI/180)-aEant+exc*sin(aEant))/(1-exc*cos(aEant));
    iteracciones=iteracciones+1;
  }
  return (aE*180/PI)%360; // la convierto a grados
}


// *********************************
// Radiovector y anomalía verdaderas
// *********************************
function r ( a,  exc,  aE) {
  // a en m, aE en grados
   return a*(1-exc*cos(aE*PI/180));
}

function vang ( exc,  aE) {
  // aE en grados
  let aErad = aE*PI/180;
  return 2*atan( sqrt((1+exc)/(1-exc)) * tan(0.5*aErad) ); // radianes
}

// *********************************
// Posiciones eclíptica xx,yy,zz
// *********************************
function xx(orden) {
  let aa=omega[orden]*PI/180; // convertido a radianes
  let bb=w[orden]*(PI/180)+vang(ex[orden],E[orden]); // vang ya está en radianes
  return r(a[orden],ex[orden],E[orden])*(cos(aa)*cos(bb)-sin(aa)*sin(bb)*cos(inc[orden]*PI/180));
}

function yy(orden) {
  let aa=omega[orden]*PI/180; // convertido a radianes
  let bb=w[orden]*(PI/180)+vang(ex[orden],E[orden]); // vang ya está en radianes
  return r(a[orden],ex[orden],E[orden])*(sin(aa)*cos(bb)+cos(aa)*sin(bb)*cos(inc[orden]*PI/180));
}

function zz(orden) {
  let aa=omega[orden]*PI/180; // convertido a radianes
  let bb=w[orden]*(PI/180)+vang(ex[orden],E[orden]); // vang ya está en radianes
  return r(a[orden],ex[orden],E[orden])*(sin(bb)*sin(inc[orden]*PI/180));
}

// ********************
// Funciones de control
// ********************
function keyPressed() {  
  if (unchar(key)==32){ // Espacio
    trazo = trazo ^ true;  
  }    
  if (key=='v' || key=='V') { // velocidad
     trazoV = trazoV ^ true; 
  }
  if (key=='+') {
    gaps+=1;
    if (gaps>20) {gaps=20;}
  }  
  if (key=='-') {
    gaps+=-1;
    if (gaps<-20) {gaps=-20;}
  }    
  
  if (unchar(key)>=48 && unchar(key)<=57) {
     n=unchar(key)-48; // elijo los números 0,1,2,3,4,5
  }
}

function changeBG() {
  let fechaIni = getDia.value(); // obtiene la fecha de inicio
  if (numeroDias(tinicial,fechaIni)>0) { // Si la fecha es válida
    textSize(10);
    tcalculo=fechaIni;
    modo = 1;
    // 'destruir' Contenedor3
    let ventana = document.getElementById('Contenedor3');
    ventana.remove();
  } else {
    modo=0;
    mensaje = fechaIni+" no es una fecha correcta o no es superior al día "+tinicial; 
  }
}

// ********************
// dibujo órbita
// ********************

function orbita(s) {
 let aEng=0;
 let numP=1000;
 let aa,bb;
 let x1,y1,xant,yant;
 for (ii=0;ii<=numP;ii++) {
     aEng=360*ii/numP;
     aa=omega[s]*PI/180; // convertido a radianes
     bb=w[s]*(PI/180)+vang(ex[s],aEng); // vang ya está en radianes
     x1=r(a[s],ex[s],aEng)*(cos(aa)*cos(bb)-sin(aa)*sin(bb)*cos(inc[s]*PI/180));
     y1=r(a[s],ex[s],aEng)*(sin(aa)*cos(bb)+cos(aa)*sin(bb)*cos(inc[s]*PI/180));
     line(tx(x1),ty(y1),tx(xant),ty(yant));
     xant = x1; yant = y1;
 }  
}

// ********************
// Funciones temporales
// ********************

function numeroDias(antes,ahora) {
  // tiene que estar en el formato dd/mm/yyyy
  // fechas a partir del 15 de enero de 1985
  return gregJuliano(ahora)-gregJuliano(antes);  
}

function gregJuliano(fecha) {
  // formula aplicada de Lito, de la Asociación Astronómica Magallanes
  // https://agrupacionastronomicamagallanes.wordpress.com/experimento-de-eratostenes/conversion-de-fecha-a-dia-juliano/
  let f1 = fecha.split("/");
  let d = parseFloat(f1[0]);
  let m = parseFloat(f1[1]);
  let y = parseFloat(f1[2]);
  if (!(isValidDate(fecha))) {return -1;}
  // Si m<=2 le sumo 12 y resto 1 al año, y si no lo dejo igual
  if (m<=2) {m=m+12; y=y-1;}
  // Cálculo de magnitudes auxiliares
  let a=int(y/100);
  let b=2-a+int(a/4); 
  // Una vez obtenida, obtengo la fórmula
  // INT(365,25(Y+4716) )+INT(30,6001(M+1) )+D+B-1524,5
  return int(365.25*(y+4716))+int(30.6001*(m+1))+d+b-1524.5;
}

// función javascript que comprueba fechas
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        { return false;}

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        {return false;}

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        {monthLength[1] = 29;}

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}
