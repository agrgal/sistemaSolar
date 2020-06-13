  
import ddf.minim.*;
Minim minim;
AudioSample beep1;

// Datos
// Tierra, venus, mercurio,marte, jupiter, saturno, urano, neptuno, pluton
float m[]={5.97e24,4.869e24,3.302e23,6.4185e23,1.899e27, 5.688e26,8.686e25,1.024e26,1.25e22};
float diam[]={12756,12100,4878,6786,142984,120536,51118,49752,2370};
float Ms=1.98e30;
float G = 6.674e-11;

// coordenadas de los planetas
float ua = 1.49597870700e11;
// Tierra, venus, mercurio,marte
float perihelio[] = {-1.47098290e11,-0.718490*ua,-0.307499*ua,-1.381497*ua,-4.950429*ua,-ua*9.048,-ua*18.375,-ua*29.766,-ua*29.67}; // m --> perihelio
float afelio[] = {152.1e9,0.728213*ua,0.466697*ua,1.665861*ua,5.458104*ua,10.116*ua,20.083*ua,30.44*ua,48.83*ua}; // m --> el afelio
float dia = 24*3600;
float T[] = {365.25*dia,224.7*dia,115.88*dia,779.96*dia,4330.046*dia,10752.28*dia,30799.095*dia,60190*dia,90717.23*dia}; // seg

// coordenadas y datos de la órbita 
int numPlanetas = T.length;
float[] a =new float[numPlanetas];// semieje 
float[] E = new float[numPlanetas]; // Energía de la órbita (J) - double 64 bits
float[] c = new float[numPlanetas]; // parámetro c de la elipse
float[] b =new float[numPlanetas]; // semieje menor
float[] ex = new float[numPlanetas]; // excentricidad de la órbita
float[] d = new float[numPlanetas];
float[] L =new float[numPlanetas]; //momento angular
float[] Theta = new float[numPlanetas]; // ángulo a recorrer
// float pasoTheta = 0.01; // en radianes

// Tamaño de la pantalla en metros
float px = 1.1*(max(afelio)-min(perihelio)); // el máximo afelio más el máximo en abs en perihelio
float py = px; // 2 veces el afelio
int ancho = 1000;
int alto = 800;

// tiempo de ejecución en pantalla
long tiempo = 0;
float gap = 200; // cambiar parámetro para velocidad de la animación.

// tiempo sideral
float ts = 0; // tiempo sideral.
float gaps = 30; // en dias

// Imagen 
PImage[] planeta=new PImage[numPlanetas];
PImage sol;
// Tierra, venus, mercurio,marte
String[] imagen = {"data/tierra.png","data/venus.png","data/mercurio.png","data/marte.png","data/jupiter.png",
                   "data/saturno.png","data/urano.png","data/neptuno.png","data/pluton.png"};
int[] planetSize= new int[numPlanetas];


// contadores
int i,j = 0;

// *******************
// SETUP
// *******************
void setup() {
  // Dibujo de la pantalla
  size(1000,800);
  background(0);
  
  println(numPlanetas);
  // println(afelio[0],afelio[1],perihelio[0],perihelio[1]);
  
  for (i=0;i<=(numPlanetas-1);i++) {
     a[i] =((afelio[i]-perihelio[i])/2);
     E[i] = (log(G)+log(Ms)+log(m[i])-log(2)-log(a[i]));
     c[i] = (afelio[i]-a[i]);
     b[i] = sqrt(sq(a[i])-sq(c[i]));
     ex[i] = c[i]/a[i];
     L[i]=log(2)+log(PI)+log(a[i])+log(b[i])+log(m[i]/1e3)-log(T[i]);
     d[i]=a[i]*(1-sq(ex[i]));
     // println(a[i],d[i],ex[i]);
     planetSize[i]= int(5+20*diam[i]/diam[4]);     
     println(i,planetSize[i]);
  }   
  
  frameRate(30); // velocidad de la animación 1000/2000 con 500 en gaps
  
  for (i=0;i<=numPlanetas-1;i++) {
    planeta[i]=loadImage(imagen[i]);
    planeta[i].resize(planetSize[i],0);
  }
  sol = loadImage("data/sun.png");
  sol.resize(30,0); // 20 de ancho y proporcional de alto
  
  // para tocar un beep
  minim = new Minim(this);
  beep1 = minim.loadSample("data/beep-04.mp3");  

}
// *******************
// DRAW
// *******************
void draw() {
    
  if (millis()>(tiempo+gap)) { // permite controlar el tiempo 
        background(0);
        imageMode(CENTER);
        
        // representación del sol
        image(sol,tx(xs(ang(ts,0))),ty(ys(ang(ts,0))));
        
        // Información relativa a la Tierra
        text("Coordenadas Tierra: "+xt(ang(ts,0),0)+ " / "+yt(ang(ts,0),0)+" m // Coordenadas Sol: "+xs(ang(ts,0))+ " / "+ys(ang(ts,0))+" m",10,10);
        text("Tiempo en días: "+ts+ " // Ángulo: "+ ang(ts,0)+" rad.",10,25);        
        
        // Dibujo por cada planeta
        for(j=0;j<=numPlanetas-1;j++) {        
          image(planeta[j],tx(xt(ang(ts,j),j)),ty(yt(ang(ts,j),j)));     
        }       
        
        // paso del tiempo (días)
        ts+=gaps;
        tiempo=millis(); // permite controlar el tiempo
   }  

}

// *******************
// Funciones
// *******************
// Funciones transforma posicion a coordenadas pantalla
float ty(float y) { // transformo y en puntos de la pantalla
  int desfase = (alto/20); // 10% para dibujarla algo más abajo
  return desfase+(alto/2)*(y/(py/2)+1);
}
float tx(float x) { // transformo x en puntos de la pantalla
  return (ancho/2)*(x/(px/2)+1);
}

// Radio de la órbita en función del ángulo
float r (float theta, int i) {
  return d[i]/(1+ex[i]*cos(theta)) ;
}

// Coordenadas x e y de la Tierra
float xt (float theta, int i) {
  return -r(theta,i)*cos(theta); 
}

float yt (float theta, int i) {
  return -r(theta,i)*sin(theta); 
}

// Coordenadas x e y del Sol
float xs (float theta) {
  int planetaReferencia =0;
  return m[planetaReferencia]*r(theta,planetaReferencia)*cos(theta)/Ms; 
}

float ys (float theta) {
  int planetaReferencia =0;
  return m[planetaReferencia]*r(theta,planetaReferencia)*sin(theta)/Ms; 
}

float ang(float ts, int i) {
  // ts en días y debe estar en segundos
  return 2*PI*ts*(24*3600)/T[i];
}

/* 
// Función de dibujo de trazo
void dibujarTrazo() {
     for (int i=2;i<(n-1);i++) {
      fill(255);
      ellipse(tx(puntos[0][i]),ty(puntos[1][i]),4,4);
    } 
} */
