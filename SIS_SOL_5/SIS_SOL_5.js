let sol, tierra; // definiciones de planetas
let Ms=1.98e30; // Masa del sol
let G = 6.674e-11; // constante universal gravitatoria
let ua = 1.49597870700e11; // unidad astronómica
let dia = 24*3600; // duracion día en segundos
let dTierra = 12984; // diamtero júpiter de referencia, en km
// let dJupiter = 142984; // diamtero júpiter de referencia, en km

// variables de control
let trazoO= 1; // trazo órbita. Inicialmente ON
let trazoE = 0; // trazo elementos
let trazoV = 0; // trazo velocidad
let instrucciones=1; // ver instrucciones, por defecto sí
let perspectiva = 1; // ver en modo perspectiva
let modo = 0 ;
let mensaje="Se debe introducir una fecha para comenzar la simulación";

// variables temporales
let tinicial = "15/01/1985";
let tcalculo = "08/08/2007";

// tiempo de ejecución en pantalla
let tiempo = 0;
let gap = 200; // cambiar parámetro para velocidad de la animación.
let ventanainformacion = 5000; // tiempo en ms en el que se abre una ventana de texto.
let objetoinformacion=0;

// tiempo sideral
let ts = 0; // tiempo sideral.
let gaps = 1; // en dias

// variables de pantalla
let ancho, alto, desfase;
let px = 0; // 2 veces el perihelio más 20%. Mínimo porque son valores negativos
let py = 0; // 2 veces el afelio
let px0 = 0; // valor inicial del tamaño de pantalla relativo
let planeta = [];

let i;

// *****
// SETUP
// *****
function setup() {
  createCanvas(windowWidth, windowHeight);  
  background(0);
  // crear planetas
  // Nombre, masa, diametro,perihelio,afelio,
  // período,inclinacion,omega o long. nodo ascendente, longitud del perihelio (wm=omega+w),longitud media tiempo t0 (15/1/1985)
  // imagen, simbolo,color trayectoria
  /*
  planeta.push(new planetas("Nombre",masa,diametro,perihelio_negativo,afelio,
                            periodo*dia,inclinacion,omega,wm,lambda0,
                            "data/nombre.png","codigo","#color", factorTamaño)); // ---> Generic
  */
  planeta.push(new planetas("Sol",Ms,1.39e6,-1,-1,-1,-1,-1,-1,-1,"data/sun.png","\u2609","",1)); // 0 --> sol    /*
  planeta.push(new planetas("Mercurio",3.302e23,4879.4,-0.307499*ua,0.466697*ua,
                            115.88*dia,7.004,48.331,77.434,209.6643,
                            "data/mercurio.png","\u263f","#43AA8B",1)); // 1 --> Mercurio 
  planeta.push(new planetas("Venus",4.869e24,12103.6,-0.71844*ua,0.728213*ua,
                            224.701*dia,3.39471,76.678,131.864,67.1413,
                            "data/venus.png","\u2640","#F3722C",1)); //2 --> Venus 
  planeta.push(new planetas("Tierra",5.97e24,12742,-1.47098290e11,152.1e9,
                         365.25*dia,0.002,348.73936,102.972,354.9,
                         "data/tierra.svg","\u2641","#577590",1)); // 3 --> tierra
  planeta.push(new planetas("Marte",6.4185e23,6786,-1.381497*ua,1.665861*ua,
                            779.96*dia,1.8509,49.562,336.059,11.8733,
                            "data/marte.png","\u2642","#F9C74F",1)); // 4 --> Marte
  planeta.push(new planetas("Júpiter",1.899e27,142984,-4.950429*ua,5.458104*ua,
                            4330.0458*dia,1.30530,100.492,15.558,300.3429,
                            "data/jupiter.png","\u2643","#90BE6D",3)); // 5 --> Júpiter
  planeta.push(new planetas("Saturno",5.688e26,120536,-9.04807635*ua,10.11595804*ua,
                            10387.0279167*dia,2.48446,113.642811,(113.642811+336.013862)%360,227.2512,
                            "data/saturno.png","\u2644","#F94144",3)); // 6 --> Saturno
  planeta.push(new planetas("Urano",8.686e25,51118,-18.37551863*ua,20.08330526*ua ,
                            30799.095*dia,0.772556,73.989821,(73.989821+96.541318)%360,249.2488,
                            "data/urano.png","\u2645","#577590",3)); // 7 --> Urano
  planeta.push(new planetas("Neptuno",1.024e26,49572,-29.76607095*ua,30.44125206*ua,
                            60190*dia,1.767975,131.794310,(131.794310+265.646853)%360,272.2648,
                            "data/neptuno.png","\u2646","#F8961E",3)); // 8 --> Neptuno  

  // tamaño pantalla inicialmente
  px0 = 1.1*2*abs(planeta[planeta.length-1].afelio); // 2 veces el perihelio más 10%. Del último planeta
  px = px0; py = px; 
  
  // Entrada de textos
  getDia = createInput();
  getDia.size(150, 20);
  getDia.position(625, 60);
  // Botón
  boton = createButton('Aceptar');
  boton.position(800, 60);
  boton.mousePressed(changeBG);
  // mensaje
}

// **************
// Windows Resize
// **************
function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
}

// *****
// DRAW
// *****
function draw() {   

   textSize(20);
   fill(255);  
   // inicialización de variables   
   if (perspectiva==1) {ancho = width;   alto = height;  desfase=0;} //desfase = alto/35; 
   if (perspectiva==0) {ancho = height;   alto = height;  desfase=0;} // caso proporcional
   
     // Introducción de fechas
  if (modo==0) {   
     background(0);
     text("Día de comienzo de la simulación (fecha posterior a 15/01/1985): "+getDia.value(),15,40);
     text(mensaje,15,80);
     text("Please, introduce a day after 15-January-1985, in format 'dd/mm/yyyy' and accept",15,140);
   } 
   
   // Dibujo de las órbitas
   if ((millis()>(tiempo+gap)) && modo==1) { // permite controlar el tiempo de la animación
   
       background(0);     
       // empieza en 1, la Tierra.
       for (i=1;i<planeta.length;i++) {
         if (trazoO==1 && planeta[i].checkOrbita()==0) {planeta[i].orbita(); planeta[i].imagen.show();} 
                    else {planeta[i].imagen.hide();}  //antes que la trayectoria. Dibujar la órbita. Si no dibujo la ŕbita, no muestro el planeta
         if (trazoE==1 && trazoO==1 && planeta[i].checkOrbita()==0) {planeta[i].elementos();} // antes de la trayectoria. Dibujar los elementos de la órbita
         if (planeta[i].checkOrbita()==0) {
           planeta[i].trayectoria(); // calculo la trayectoria
           planeta[i].representar(planeta[i].xx,planeta[i].yy); // represento el planeta en el cielo
           planeta[i].seguimiento(); // comprueba si he pasado el ratón por el mismo
         }
         // velocidad después del cálculo de la trayectoria
         if (trazoV==1 && planeta[i].checkOrbita()==0) { planeta[i].v(); }  // representar la velocidad
       }   
       
       // SOL
       planeta[0].representar(0,0); // dibujo el sol en el centro
       planeta[0].seguimiento();
       
       // Instrucciones
       if (instrucciones==1) {
         fill(200,200,200,200);
         rect(0,0,width,140); // dibujo de ventana
         textAlign(LEFT);
         textSize(20);
         stroke(0);
         strokeWeight(1);
         fill(0);
         text("Tecla 'i' para conectar o desconectar las instrucciones",10,25);
         text("Tecla 'espacio' para conectar o desconectar la visualización de las órbitas",10,45);
         text("Tecla 'e' elementos de las órbitas (sólo con órbitas conectadas) ",10,65);
         text("Tecla 'p' para conectar o desconectar modo a escala o en perspectiva",10,85);
         text("Tecla '+'"+"/"+"'-' para avanzar y retroceder, acelerar o decelerar el movimiento planetario",10,105);
         text("Cursores izquierda y derecha para acercar y alejar órbitas",10,125);
         text("Alejamiento relativo al sol (zoom): "+nfp(30+log(px/px0)/log(1.2),0,1),1000,25);
         text("Avance/retroceso: "+nfp(gaps,0,1)+" Días transcurridos: "+nfp(ts,0,1),1000,45);
         text("Sitúate con el cursor sobre un planeta para ver sus datos",1000,65);
         text("Valor de la activación de la velocidad: "+trazoV,1000,85);
       }
       
       ts+=gaps;
       tiempo=millis(); // permite controlar el tiempo
   }  // fin del if por cada tiempo...
}


// ****************
// Clase planetas
// ****************

class planetas {
  
  constructor(name,mass,diameter,per,afe,T,inc,om,wwm,lo,rutaImagen,sim,co,fT) {
    this.nombre=name; // nombre
    this.masa=mass; // masa
    this.diametro=diameter; // diametro
    this.perihelio=per; // perihelio - más cercano -
    this.afelio=afe; // afelio - más lejano -
    this.periodo=T; // período
    this.inclinacion=inc; // inclinación de la órbita en grados
    this.omega=om; // omega o long. nodo ascendente
    this.wm=wwm; // longitud del perihelio 
    this.lambda0=lo; // longitud media tiempo t0 (15/1/1985)
    this.ri=rutaImagen; // ruta de la imagen
    this.simbolo=sim; // símbolo del planeta
    this.cc=co; // color de la trayectoria
    // cálculos
    this.a = (this.afelio-this.perihelio)/2; // semieje mayor de la órbita
    this.c = this.afelio-this.a; // parámetro c (distancia al foco) de la elipse
    this.b = sqrt(sq(this.a)-sq(this.c)); // semieje menor de la órbita   
    this.ex = this.c/this.a; // excentricidad (planetas <1)
    this.d = this.a*(1-sq(this.ex)); //parámetro d 
    this.n1 = sqrt(G*(Ms+this.masa)/pow(this.a,3))*24*3600*180/PI; //  n1[i]=sqrt(G*(Ms+m[i])/pow(a[i],3))*24*3600*180/PI; // en grados por día, como en la tabla
    this.w = this.wm-this.omega; // argumento del perihelio   
    this.M=0; this.E=0; // anomalias medias y escéntricas. Inicializo
    this.rr=0; this.vang=0; this.xx=0; this.yy=0; this.zz=0; // parámetros órbita, r, anomalía verdadera, coordenadas. Inicializo
    // Cálculos físicos
    this.energia = (log(G)+log(Ms)+log(this.masa)-log(2)-log(this.a)); // Energy[i] = (log(G)+log(Ms)+log(m[i])-log(2)-log(a[i]));
    this.L= log(2)+log(PI)+log(this.a)+log(this.b)+log(this.masa)-log(this.periodo); // L[i]=log(2)+log(PI)+log(a[i])+log(b[i])+log(m[i]/1e3)-log(T[i]);
    // imagen
    // this.imagen = loadImage(this.ri); // carga el objeto imagen del planeta
    this.imagen = createImg(this.ri,this.name); // carga el objeto imagen del planeta como un elemento del DOM
    this.planetSize = int(tp(this.diametro,1)); // después hay que cambiarlo en el programa planetSize[i]= int(25*diam[i]/sol.diam); 
    this.factorTamaño = fT;
    // ventana de informacion
    this.vInf = 0; // tiempo que se muestra la ventana
    // velocidad
    this.vv=0; // inicialmente cero la velocidad
    this.vmin = exp(this.L-log(this.masa)-log(this.afelio)); // vmin en el afelio
    this.vmax = exp(this.L-log(this.masa)-log(-this.perihelio)); // vmin en el afelio
    
  } // fin del constructor
  
  //*********************
  // planeta en el cielo
  //********************* 
  representar(coordX,coordY) { // método que dibuja en pantalla el planeta a su tamaño.
    let fc=px/px0; // cuanto más pequeña sea la órbita (zoom) más pequeño el planeta
    // console.log("Tamaño planeta: "+this.planetSize );
    this.planetSize = int(tp(this.diametro,fc)); // con diametro de tierra
    // if (this.nombre=="Sol") {this.planetSize=50;} // else {text("Zoom: x"+fc,10,40);}  // El sol siempre del mismo tamaño
    // this.imagen.resize(this.planetSize,0);
    // imageMode(CENTER);
    // image(this.imagen,tx(coordX),ty(coordY));
    this.imagen.size(this.planetSize,this.planetSize);  
    this.imagen.position(tx(coordX)-this.planetSize/2,ty(coordY)-this.planetSize/2);  
    // texto en pantalla   
    if (this.vInf>=millis() && objetoinformacion==this.nombre && this.nombre!="Sol" ){ // Si se ha activado con la funcion seguimiento 
          fill(200,200,200,200);
          rect(0,height-500,width*3/8,height); // dibujo de ventana
          textAlign(LEFT); textSize(20);  stroke(0); strokeWeight(1);  fill(0);
         text("Planeta "+this.nombre+" ("+this.simbolo+") de masa "+this.masa+" kg y diámetro "+this.diametro+" km.",20,height-500+25);
         text("Perihelio: "+nf(abs(this.perihelio),0,2)+" km = "+nf(abs(this.perihelio/ua),0,2)+" UA",20,height-500+50);
         text("Afelio: "+nf(this.afelio,0,2)+" km= "+nf(abs(this.afelio/ua),0,2)+" UA",20,height-500+75);
         text("Período sideral: "+nf(this.periodo/dia,0,2)+" dias = "+nf(this.periodo/(365.25*dia),0,2)+" años terrestres",20,height-500+100);
         text("Longitud del nodo ascendente (\u03A9): "+nf(this.omega,0,2)+"º // Inclinación: "+nf(this.inclinacion,0,2)+"º",20,height-500+125);
         text("Argumento del perihelio: "+nf(this.w,0,2)+"º // long. perihelio: "+nf(this.wm,0,2),20,height-500+150);
         text("Longitud media tiempo t0 (15/1/1985): "+nf(this.lambda0,0,2)+"º",20,height-500+175);
         text("Semieje a: "+nf(this.a,0,2)+" km = "+nf(this.a/ua,0,2)+" UA",20, height-500+200);
         text("Semieje b: "+nf(this.b,0,2)+" km = "+nf(this.b/ua,0,2)+" UA",20, height-500+225);
         text("Excentricidad: "+nf(this.ex,0,8)+" Velocidad orbital: "+nf(this.n1,0,4)+" º/día",20,height-500+250);
         text("Energía de la órbita: -"+exp(this.energia)+ " J",20,height-500+275);
         text("Momento angular de la órbita: "+exp(this.L)+ " kg m2/s2",20,height-500+300);
         text("Velocidad mínima y máxima: "+nf(this.vmin/1000,0,2)+ " // "+nf(this.vmax/1000,0,2)+" km/s",20,height-500+325);
    } else if (this.vInf>=millis() && objetoinformacion==this.nombre && this.nombre=="Sol") {
          fill(200,200,200,200);
          rect(0,height-500,width*3/8,height); // dibujo de ventana
          textAlign(LEFT); textSize(20);  stroke(0); strokeWeight(1);  fill(0);
          text("Estrella: "+this.nombre+" ("+this.simbolo+") de masa "+this.masa+" kg y diámetro "+this.diametro+" km.",20,height-500+25);
          for(i=1;i<planeta.length;i++) {
             text("Foco respecto a "+planeta[i].nombre+": c="+nf(planeta[i].c/ua,0,2)+" UA",20,height-500+25*(i+1)); 
          }
         
    }
  }
  
  // **********************************
  // ventana de información. Triggering
  // **********************************
  seguimiento() {
    let distancia = dist(tx(this.xx),ty(this.yy),mouseX,mouseY);
    if (distancia<floor(this.planetSize/2)) {
        objetoinformacion = this.nombre; // almacena en la variable global qué objeto se dispara
        this.vInf=millis()+ventanainformacion; // variable que cuenta el tiempo de disparo.
    }
  }
  
  //*******************
  //anomalia excéntrica
  //*******************
  calcularE() { //anomalia excéntrica
      // mejor la fórmula en radianes, 
      // Y paso después datos a grados, para que coincida con la tabla
      // llamo a calcularM() para actualizar el valor this.M
      // Método de Newton-Ramphson
      let iteracciones=0;
      let aE=0;
      let aEant=this.M*PI/180;
      while (abs(aE-aEant)>0.00001) { // formula en radianes
        aEant=aE;
        aE=aEant+(this.M*(PI/180)-aEant+this.ex*sin(aEant))/(1-this.ex*cos(aEant));
        iteracciones=iteracciones+1;
      }
      this.E=(aE*180/PI)%360; // la convierto a grados
      return this.E; 
  }
  
  //*************
  // radio vector
  //*************  
  r (semieje,excentricidad,anomE) {
    return semieje*(1-excentricidad*cos(radians(anomE)));
  }
  
  //*******************
  // anomalía verdadera
  //*******************
  phi (excentricidad,anomE) {
    return 2*atan( sqrt((1+excentricidad)/(1-excentricidad)) * tan(0.5*radians(anomE)));
  }
  
  //***********************
  // coordenadas eclípticas
  //***********************
  xxf(semieje,excentricidad,anomE) {
     // si lo pongo así, esta función la puedo usar más adelante para otras cosas.
     let aa=radians(this.omega); // convertido a radianes
     let bb=radians(this.w)+this.phi(excentricidad,anomE); // vang ya está en radianes
     return this.r(semieje,excentricidad,anomE)*(cos(aa)*cos(bb)-sin(aa)*sin(bb)*cos(radians(this.inclinacion))); // coord X respecto del plano de la eclíptica    
  }
  
  yyf(semieje,excentricidad,anomE) {
     // si lo pongo así, esta función la puedo usar más adelante para otras cosas.
     let aa=radians(this.omega); // convertido a radianes
     let bb=radians(this.w)+this.phi(excentricidad,anomE); // vang ya está en radianes
     return this.r(semieje,excentricidad,anomE)*(sin(aa)*cos(bb)+cos(aa)*sin(bb)*cos(radians(this.inclinacion))); // coord X respecto del plano de la eclíptica    
  }
  
  zzf(semieje,excentricidad,anomE) {
     // si lo pongo así, esta función la puedo usar más adelante para otras cosas.
     let aa=radians(this.omega); // convertido a radianes
     let bb=radians(this.w)+this.phi(excentricidad,anomE); // vang ya está en radianes
     return this.r(semieje,excentricidad,anomE)*(sin(bb)*sin(radians(this.inclinacion))); // coord X respecto del plano de la eclíptica    
  }
  
  //*******************
  // Trayectoria
  //*******************
  trayectoria() {
     // 1º) Calculo la anomalía media
     this.M = this.n1*((numeroDias(tinicial,tcalculo)+ts)+this.lambda0-this.wm)%360;
     // 2º) me aseguro que calculo E. Anomalía excéntrica.
     this.calcularE(); 
     // 3º) radio vector y anomalía verdadera
     this.rr = this.r(this.a,this.ex,this.E);
     this.vang = this.phi(this.ex,this.E);
     // 4º) posiciones xx,yy,zz en el plano de la eclíptica
     this.xx = this.xxf(this.a,this.ex,this.E);
     this.yy = this.yyf(this.a,this.ex,this.E);
     this.zz = this.zzf(this.a,this.ex,this.E);
  }
  
  //********
  // órbita
  //********
  orbita() {
   let aEng=0;
   let numP=1000;
   let aa,bb,ii;
   let x1,y1,xant,yant;
   stroke(this.cc);
   strokeWeight(1);
   for (ii=0;ii<=numP;ii++) {       
       aEng=360*ii/numP;
       x1 = this.xxf(this.a,this.ex,aEng);
       y1 = this.yyf(this.a,this.ex,aEng);
       line(tx(x1),ty(y1),tx(xant),ty(yant));
       xant = x1; yant = y1;
   } 
  } // fin de la órbita
  
  // ***********
  // checkOrbita
  // ***********
  checkOrbita() {
    // comprueba si está fuera de la pantalla o no la órbita
    // o si es demasiado pequeña
   let aEng=0;
   let numP=100;
   let aa,bb,ii;
   let x1,y1;
   let fuera=0;
   for (ii=0;ii<=numP;ii++) {       
       aEng=360*ii/numP;
       x1 = this.xxf(this.a,this.ex,aEng);
       y1 = this.yyf(this.a,this.ex,aEng);
       if (abs(tx(x1))<0 || abs(tx(x1))>width || abs(ty(y1))<0 || abs(ty(y1))>height) { fuera=1; break;}
       if (dist(tx(x1),ty(y1),width/2,height/2)<10) {fuera=1; break;}
   } 
   return fuera;
  }
  
  //********************
  // elementos orbitales
  //********************
  elementos() {
    let xa,ya,xp,yp; // x e y afelio, x e y perihelio
    stroke(this.cc);
    strokeWeight(1);
    textSize(8);
    textAlign(CENTER);
    fill(this.cc);
    // Línea del eje mayor de la elipse
    xa = this.xxf(this.a,this.ex,180); // en el perihelio
    ya = this.yyf(this.a,this.ex,180);
    xp = this.xxf(this.a,this.ex,0); // en el afelio
    yp = this.yyf(this.a,this.ex,0); 
    if (tx(this.xxf(this.a,this.ex,180))>0 && abs(tx(this.xxf(this.a,this.ex,180)))<width &&
        ty(this.yyf(this.a,this.ex,180))>0 && abs(ty(this.yyf(this.a,this.ex,180)))<height ) {
      // con el if solo lo dibuja si están en pantalla
      line(tx(xa),ty(ya),tx(xp),ty(yp)); // linea del eje mayor    
      text("P["+nf(this.perihelio/ua,0,2)+"UA]",tx(xp),ty(yp)); // Perihelio
      text("A["+nf(this.afelio/ua,0,2)+"UA]",tx(xa),ty(ya)); // Afelio
      // Línea del eje menor de la elipse
      xa = this.xxf(this.a,this.ex,90); // a la mitad
      ya = this.yyf(this.a,this.ex,90);
      xp = this.xxf(this.a,this.ex,270); // a 180 de la mitad
      yp = this.yyf(this.a,this.ex,270);
      line(tx(xa),ty(ya),tx(xp),ty(yp)); // linea del eje mayor 
    } // findel if
  }
  
  //********************
  // velocidad
  //********************
  v() {
     stroke(this.cc);
     strokeWeight(2);
    // L = mr x v --> en modulo v = L/mr ; L es constante
    // conozco el logaritmo del momento angular L[i] 
    this.vv = exp(this.L-log(this.masa)-log(this.r(this.a,this.ex,this.E)));
    let unx=tx(this.xxf(this.a,this.ex, this.E+0.01))-tx(this.xx);
    let uny=ty(this.yyf(this.a,this.ex, this.E+0.01))-ty(this.yy);
    let ux = unx/sqrt(sq(unx)+sq(uny));
    let uy = uny/sqrt(sq(unx)+sq(uny)); // normaliado
    line(tx(this.xx),ty(this.yy),tx(this.xx) + 2*ux* (this.vv/1000) ,ty(this.yy) + 2*uy*(this.vv/1000) );
    fill(255);          
    textSize(12);
    textAlign(CENTER);
    text(nf(this.vv/1000,0,1)+" km/s",tx(this.xx) + 2*ux* (this.vv/1000) ,ty(this.yy) + 2*uy*(this.vv/1000));
    console.log("Valor de la velocidad instantáneo: "+this.vv);
    console.log("ux y uy: "+ux+" // "+uy);
  }
  
} // fin de la clase planetas


// *******************
// Funciones
// *******************

// Funciones transforma posicion a coordenadas pantalla
function ty(y) { // transformo y en puntos de la pantalla
   // desfase para dibujarla algo más abajo
  return desfase+(alto/2)*(y/(py/2)+1);
}
function tx(x) { // transformo x en puntos de la pantalla
  return (ancho/2)*(x/(px/2)+1)+((width-ancho)/2);
}

// funcion tamaño planeta
function tp(diametro, zoom) {
 let minimo = 20;
 let maximo = 50;
 let A = (maximo-minimo)/log(142990/4880); // diametro júpiter entre diámetro mercurio
 let B = minimo - A*log(4880);
 let x = 10*(1-exp(-10*zoom));
 // console.log("valor tp: "+(A*log(diametro)+B)-x+" // valor x: "+x+" // zoom: "+zoom);
 return (A*log(diametro)+B)-x; 
}

// ********************
// Funciones de control
// ********************
function keyPressed() {  
  if (unchar(key)==32){ // Espacio - órbita
    trazoO = trazoO ^ true;  
  }    
 
  if (key=='e' || key=='E') { // elementos
     trazoE = trazoE ^ true; 
  }
  
  if (key=='v' || key=='V') { // velocidad
     trazoV = trazoV ^ true; 
  }
  
  if (key=='i' || key=='I') { // instrucciones
     instrucciones = instrucciones ^ true; 
  }
  
  if (key=='p' || key=='P') { // perspectiva
     perspectiva = perspectiva ^ true; 
  }
  
  
  if (key=='+') {
    gaps+=1;
    if (gaps>20) {gaps=20;}
  }  
  if (key=='-') {
    gaps+=-1;
    if (gaps<-20) {gaps=-20;}
  }  
  
  if (keyCode===LEFT_ARROW) {
    if ((30+log(px/px0)/log(1.2))<40) {px = px*1.2; py=px;} // disminuye zoom    
  }  
  
  if (keyCode===RIGHT_ARROW) {
    if ((30+log(px/px0)/log(1.2))>2) {px = px/(1.2); py=px;}
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
    // let ventana = document.getElementById('Contenedor3');
    // ventana.remove();
    getDia.remove();
    boton.remove();
  } else {
    modo=0;
    mensaje = fechaIni+" no es una fecha correcta o no es superior al día "+tinicial; 
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
