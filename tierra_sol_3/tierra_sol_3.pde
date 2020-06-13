  
import ddf.minim.*;
Minim minim;
AudioSample beep1;

// Datos
float Mt=5.97e24;
float Ms=1.98e30;
float G = 6.674e-11;
float T = 365.25*24*3600; // seg

// coordenadas de la Tierra
float x1=0;
float y1=0;
float perihelio = -1.47098290e11; // m --> perihelio
float afelio = 152.1e9; // m --> para comprobar, el afelio
float vx10 = 0;
float vy10 = 30750; // m/s, en el perihelio.

// coordenada del sol
float x2 = 0;
float y2 = 0;

// coordenadas y datos de la órbita 
float a = 0;// semieje 
float E = 0; // Energía de la órbita (J) - double 64 bits
float c =0; // parámetro c de la elipse
float b =0; // semieje menor
float ex = 0; // excentricidad de la órbita
float d = 0;
float L = 0; //momento angular
float Theta = 0; // ángulo a recorrer
float pasoTheta = 0.01; // en radianes

// Tamaño de la pantalla en metros
float px = 1.2*2*abs(perihelio); // 2 veces el perihelio más 20%
float py = px; // 2 veces el perihelio

// tiempo de ejecución en pantalla
long tiempo = 0;
float gap = 200;

// tiempo sideral
float gaps = 500; // salto en segundos (500 buena precision)

// Array de puntos
float puntos[][] = new float[2][1000];
int n=1;

// Imagen 
PImage tierra;
PImage sol;

// textos 
String textoAfelio="";
String tiempo_anno="";

// *******************
// SETUP
// *******************
void setup() {
  // Dibujo de la pantalla
  size(1000,800);
  background(0);
  
  // Cálculos de la órbita
  a = (afelio-perihelio)/2;
  E = log(G)+log(Ms)+log(Mt)-log(2)-log(a);
  c = (afelio-a);
  b = sqrt(sq(a)-sq(c)); 
  ex = c/a;
  L = log(2)+log(PI)+log(a)+log(b)+log(Mt/1e3)-log(T);
  d= a*(1-sq(ex)); 
  
  frameRate(1000); // velocidad de la animación 1000/2000 con 500 en gaps
  tierra = loadImage("data/tierra.png");
  tierra.resize(25,0); // 20 de ancho y proporcional de alto
  sol = loadImage("data/sun.png");
  sol.resize(50,0); // 20 de ancho y proporcional de alto
  
  // para tocar un beep
  minim = new Minim(this);
  beep1 = minim.loadSample("data/beep-04.mp3");  

}
// *******************
// DRAW
// *******************
void draw() {
  
  // Cálculos de la órbita
  text("Semieje mayor (a): " + str(a)+" m - Energía de la órbita: -" + exp(E) +" J // Momento angular orbital: " + exp(L) +" Ton * m2/s // d: " + str(d)+" m",10,20 );
  text("Semieje menor (b): " + str(b)+" m // c: " + str(c)+" m // Excentricidad: "+ str(ex),10,35);
    
  if (millis()>(tiempo+gap)) { // permite controlar el tiempo 
        background(0);
        imageMode(CENTER);
        image(sol,tx(xs(Theta)),ty(ys(Theta)));
        image(tierra,tx(xt(Theta)),ty(yt(Theta)));
        if (n<=1000) {
          puntos[0][n]=xt(Theta); // almaceno en el array
          puntos[1][n]=yt(Theta); // almaceno en el array
        }
        dibujarTrazo();  
        n +=1;
        text("radio de la órbita para el ángulo "+str(Theta)+ ": "+r(r(Theta))+" m",10,50);
        text("Coordenadas Tierra: "+xt(Theta)+ " / "+yt(Theta)+" m // Coordenadas Sol: "+xs(Theta)+ " / "+ys(Theta)+" m",10,65);
        text("Tiempo en días: "+ts(Theta)/(24*3600),10,80);
        Theta+=pasoTheta;
        if (Theta>2*PI) {Theta=Theta-2*PI;}
        tiempo=millis(); // permite controlar el tiempo
   }  

}

// *******************
// Funciones
// *******************
// Funciones transforma posicion a coordenadas pantalla
float ty(float y) { // transformo y en puntos de la pantalla
  int desfase = 40; // para dibujarla algo más abajo
  return desfase+400*(y/(py/2)+1);
}
float tx(float x) { // transformo x en puntos de la pantalla
  return 500*(x/(px/2)+1);
}

// Radio de la órbita en función del ángulo
float r (float theta) {
  return d/(1+ex*cos(theta)) ;
}

// Coordenadas x e y de la Tierra
float xt (float theta) {
  return -r(theta)*cos(theta); 
}

float yt (float theta) {
  return -r(theta)*sin(theta); 
}

// Coordenadas x e y del Sol
float xs (float theta) {
  return Mt*r(theta)*cos(theta)/Ms; 
}

float ys (float theta) {
  return Mt*r(theta)*sin(theta)/Ms; 
}

float ts (float theta) {
  return T*theta/(2*PI);
}

// Función de dibujo de trazo
void dibujarTrazo() {
     for (int i=2;i<(n-1);i++) {
      fill(255);
      ellipse(tx(puntos[0][i]),ty(puntos[1][i]),4,4);
    } 
}
