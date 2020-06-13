  
import ddf.minim.*;
Minim minim;
AudioSample beep1;

// Datos
// Tierra, venus, mercurio,marte
String nombre[] = {"tierra","venus","mercurio","marte"};
float m[]={5.97e24,4.869e24,3.302e23,6.4185e23};
float diam[]={12756,12100,4878,6786};
float Ms=1.98e30;
float G = 6.674e-11;

// coordenadas de los planetas
float ua = 1.49597870700e11;
// Tierra, venus, mercurio,marte
float perihelio[] = {-1.47098290e11,-0.718490*ua,-0.307499*ua,-1.381497*ua}; // m --> perihelio
float afelio[] = {152.1e9,0.728213*ua,0.466697*ua,1.665861*ua}; // m --> el afelio
float dia = 24*3600;
float T[] = {365.25*dia,224.7*dia,115.88*dia,779.96*dia}; // seg

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
float px = 1.1*2*abs(max(afelio)); // 2 veces el perihelio más 20%. Mínimo porque son valores negativos
float py = px; // 2 veces el afelio
int ancho = 1000;
int alto = 800;

// tiempo de ejecución en pantalla
long tiempo = 0;
float gap = 200; // cambiar parámetro para velocidad de la animación.

// tiempo sideral
float ts = 0; // tiempo sideral.
float gaps = 1; // en dias

// Imagen 
PImage[] planeta=new PImage[numPlanetas];
PImage sol;
// Tierra, venus, mercurio,marte
String[] imagen = {"data/tierra.png","data/venus.png","data/mercurio.png","data/marte.png"};
int[] planetSize= new int[numPlanetas];

// Trazo de la trayectoria
// float[][][] puntos = new float[2][numPlanetas][(int) (max(T)/dia)];
int desfase = (alto/20); // dibujar algo más bajo
float centroElipse = 0;

// contadores y control
int i,j,n = 0;
boolean trazo = true;
boolean trazoV = true;

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
     // L[i]=log(2)+log(PI)+log(a[i])+log(b[i])+log(m[i]/1e3)-log(T[i]);
     L[i]=log(2)+log(PI)+log(a[i])+log(b[i])+log(m[i])-log(T[i]);
     d[i]=a[i]*(1-sq(ex[i]));
     // println(a[i],d[i],ex[i]);
     planetSize[i]= int(25*diam[i]/diam[0]);     
  }   
  
  frameRate(30); // velocidad de la animación 1000/2000 con 500 en gaps
  
  for (i=0;i<=numPlanetas-1;i++) {
    planeta[i]=loadImage(imagen[i]);
    planeta[i].resize(planetSize[i],0);
  }
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
    
  if (millis()>(tiempo+gap)) { // permite controlar el tiempo 
        background(0);
        imageMode(CENTER);
        
        // representación del sol
        image(sol,tx(xs(ang(ts,0))),ty(ys(ang(ts,0))));
        
        // Información relativa a la Tierra
        text("Coordenadas Tierra: "+xt(ang(ts,0),0)+ " / "+yt(ang(ts,0),0)+" m // Coordenadas Sol: "+xs(ang(ts,0))+ " / "+ys(ang(ts,0))+" m",10,10);
        text("Tiempo en días: "+ts+ " // Ángulo: "+ ang(ts,0)+" rad.// velocidad Tierra: "+v(ts,0)+ " km/s",10,25);  
        text("UP/DOWN velocidad animación: " + gaps+ " / ESPACIO dibujo trayectoria:"+ trazo + " / 'v' velocidades " + trazoV,10,40);
        
        // Dibujo por cada planeta
        for(j=0;j<=numPlanetas-1;j++) {
        
          /* Método de dibujo de puntos por trayectorias
          if (ts<(max(T)/dia)) {
            puntos[0][j][(int) ts]=tx(xt(ang(ts,j),j));
            puntos[1][j][(int) ts]=ty(yt(ang(ts,j),j));
          } */
         
         if (trazo==true) { 
           /*
           for (n=0;n<ts;n++) {
              fill(255);
              ellipse(puntos[0][j][n%((int) (max(T)/dia))],puntos[1][j][n%((int) (max(T)/dia))],4,4);
            } */
            stroke(80);
            strokeWeight(1);
            noFill();
            ellipseMode(RADIUS);
            centroElipse = (tx(afelio[j])+tx(perihelio[j]))/2;
            ellipse(centroElipse,alto/2+desfase,tx(a[j])-ancho/2,ty(b[j])-(alto/2+desfase));   

          } // fin de trazo
          
          
          // dibujo de la velocidad
          if (trazoV==true) {            
            stroke(30,200,200); // color
            float vmin = (exp(L[j]-log(m[j])-log(afelio[j])))/1000; // vmin en el afelio
            float vmax = (exp(L[j]-log(m[j])-log(-perihelio[j])))/1000; // vmax en el perihelio
            float vx = abs(v(ts,j))*yt(ang(ts,j),j)/abs(r(ang(ts,j),j)); // coordenada x del vector velocidad
            float vy = -abs(v(ts,j))*xt(ang(ts,j),j)/abs(r(ang(ts,j),j)); // coordenada y del vector velocidad
            float factor = (abs(v(ts,j))-vmin)/(vmax-vmin); // permite variar más el tamaño de la flecha de velocidad
            line(tx(xt(ang(ts,j),j)),ty(yt(ang(ts,j),j)),tx(xt(ang(ts,j),j))-(1+2*factor)*vx,ty(yt(ang(ts,j),j))-(1+2*factor)*vy);
            text("V." + nombre[j]+": "+nfc(abs(v(ts,j)),2)+" // vmax: "+nfc(vmax,2)+" // vmin: "+nfc(vmin,2)+" km/s",10,750+(j-1)*15);
            // vector centrado en el punto de la trayectoria perpendicular a esta; -vx -vy es porque el eje y de la pantalla está al revés 
          }
          
          image(planeta[j],tx(xt(ang(ts,j),j)),ty(yt(ang(ts,j),j))); // movimiento del planeta
          
        } // fin del for por cada planeta   
        
        // paso del tiempo (días)
        ts+=gaps;
        tiempo=millis(); // permite controlar el tiempo
   }  // fin del if por cada tiempo...

}

// *******************
// Funciones
// *******************
// Funciones transforma posicion a coordenadas pantalla
float ty(float y) { // transformo y en puntos de la pantalla
   // 10% para dibujarla algo más abajo
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

float v (float ts, int i) {
  // L = mr x v --> en modulo v = L/mr ; L es constante
  // conozco el logaritmo del momento angular L[i] 
  float velocidad = L[i]-log(m[i])-log(r(ang(ts,i),i));
  return exp(velocidad)/1000; // km por segundo
}

// Funciones de control
void keyPressed() {  
  if (key==32){ // Espacio
    trazo = trazo ^ true;  
  }    
  if (key=='v') { // velocidad
     trazoV = trazoV ^ true; 
  }
  if (key == CODED && keyCode == UP) {
    gaps+=1;
    if (gaps>20) {gaps=20;}
  }  
  if (key == CODED && keyCode == DOWN) {
    gaps+=-1;
    if (gaps<1) {gaps=1;}
  }    
}
