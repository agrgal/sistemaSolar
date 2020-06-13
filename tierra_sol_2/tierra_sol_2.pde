
// Datos
float Mt=5.97e24;
float Ms=1.98e30;
float G = 6.674e-11;

// coordenada del sol
float xs = 0;
float ys = 0;

// coordenadas de la Tierra
float x=0;
float y=0;
float x0 = -1.47098290e11; // m --> perihelio
float perihelio = x0;
float afelio = 152.1e9; // m --> para comprobar, el afelio
float y0 = 0;
float vx0 = 0;
float vy0 = 30750; // m/s

// Tamaño de la pantalla en metros
float px = 1.2*2*abs(x0); // 2 veces el perihelio más 20%
float py = 1.2*2*abs(x0); // 2 veces el perihelio

// tiempo
long tiempo = 0;
float gap = 200;

// tiempo sideral
float gaps = 1800; // salto en segundos
float ts = 0; // contador del tiempo en segundos.

// Array de puntos
float puntos[][] = new float[2][1000];
int n=1;

// Imagen 
PImage tierra;
PImage sol;

// *******************
// SETUP
// *******************
void setup() {
  // Dibujo de la pantalla
  size(1000,800);
  background(0);
  // image(mascara,0,0);
  // noLoop();
  fill(255); // dibujo el sol en el centro.
  ellipse(tx(xs),ty(ys),25,25);  
  frameRate(1000); // velocidad de la animación
  tierra = loadImage("data/tierra.png");
  tierra.resize(20,0); // 20 de ancho y proporcional de alto
  sol = loadImage("data/sun.png");
  sol.resize(40,0); // 20 de ancho y proporcional de alto
  // Dibujo la tierra en el perihelio
  x = x0; y= y0;
  puntos[0][0]=x0;
  puntos[1][0]=y0;
}
// *******************
// DRAW
// *******************
void draw() {
  // tengo que hacerlo adaptativamente
   if (millis()>(tiempo+gap)) { // permite controlar el tiempo      
      n+=1; // añado 1 al contador
      if (n<=1000) {
        puntos[0][n]=x; // almaceno en el array
        puntos[1][n]=y; // almaceno en el array
      }
      // background(0);
      imageMode(CENTER);
      image(sol,tx(xs),ty(ys));
      image(tierra,tx(x),ty(y));
      println(x,y,ax(),ay(),vx(),vy(),rx(),ry(),n); 
      tiempo=millis(); // permite controlar el tiempo
   }
    x0= x; y0 = y; // posición inicial del próximo
    vx0=vx(); vy0=vy(); // velocidad inicial para el próximo
    ts+=gaps;      
    x = rx(); y=ry(); // por fin el próximo punto
}

// *******************
// Funciones
// *******************
// Funciones transforma posicion a coordenadas pantalla
float ty(float y) { // transformo y en puntos de la pantalla
  return 400*(y/(py/2)+1);
}
float tx(float x) { // transformo x en puntos de la pantalla
  return 500*(x/(px/2)+1);
}

// distancia r
float r() {
  return sqrt(sq(x-xs)+sq(y-ys));
}

// Funciones calculo de la aceleración
float ax() {
  return -G*Ms*(x-xs)/(pow(r(),3)); // de -G*Ms* (vector r)/r^3
}
float ay() {
  return -G*Ms*(y-ys)/(pow(r(),3)); // de -G*Ms* (vector r)/r^3
}

// funciones de cálculo de la velocidad
float vx() {
  return ax()*gaps+vx0;
}
float vy() {
  return ay()*gaps+vy0;
}

// funciones de cálculo de la posición
float rx() {
  return vx()*gaps+x0; 
}

float ry() {
  return vy()*gaps+y0; 
}
