
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
float x0 = -147098290e3; // m
float y0 = 0;
float vx0 = 0;
float vy0 = 30750; // m/s

// Tamaño de la pantalla en metros
float px = 1.2*2*abs(x0); // 2 veces el perihelio más 20%
float py = 2*abs(y0); // 2 veces el perihelio

void setup() {
  // Dibujo de la pantalla
  size(1000,800);
  background(0);
  // tamaño en metros de la pantalla
  pX= 1.2*2*abs(x0);  
  // Dibujo el sol en el centro  
  ellipse(tx(xs),ty(ys),25,25);
  fill(255);
}

void draw() {
  
}

// Funciones 
float tx(float x) { // transformo x en puntos de la pantalla
  return x/(px/2)+500;
}

float ty(float y) { // transformo y en puntos de la pantalla
  return y/(py/2)+400;
}
