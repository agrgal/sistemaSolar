  
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
int numPlanetas = perihelio.length;

float[] Energy = new float[numPlanetas]; // Energía de la órbita (J) - double 64 bits
float[] c = new float[numPlanetas]; // parámetro c de la elipse
float[] b =new float[numPlanetas]; // semieje menor
float[] d = new float[numPlanetas];
float[] L =new float[numPlanetas]; //momento angular

// Datos necesarios para la órbita
float[] a =new float[numPlanetas];// semieje 
float[] ex = new float[numPlanetas]; // excentricidad de la órbita
float[] inc = {0.002,3.3947,7.0059,1.8509}; // inclinaciones de las órbitas (3)
float[] n1 = new float[numPlanetas]; // movimiento medio que es mu = n2 a3, siendo mu=G(m1+m2)
float[] omega = {348.73936,76.678,48.331,49.562}; // longitud del nodo ascendente (4)
float[] wm = {102.972,131.8639,77.4554, 336.059} ; // longitud del perihelio wm= Omega + w
float[] w = new float[numPlanetas]; // argumento del perihelio. 
float[] lambda0 = {354.9,67.1413,209.6643,11.8733} ; // longitud media tiempo t0 (15/1/1985)
String tinicial = "15/01/1985";
String tcalculo = "08/02/2007";
// Anomalia media M[i];
float[] M = new float[numPlanetas];
// Anomalia excentrica M[i];
float[] E = new float[numPlanetas];

// float pasoTheta = 0.01; // en radianes

// Tamaño de la pantalla en metros
float px = 1.1*2*abs(max(afelio)); // 2 veces el perihelio más 20%. Mínimo porque son valores negativos
float py = px; // 2 veces el afelio
int ancho = 1000;
int alto = 1000;

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
String[] simbolo = {"\u2641","\u2640","\u263f","\u2642"};
int[] planetSize= new int[numPlanetas];

// Trazo de la trayectoria
// float[][][] puntos = new float[2][numPlanetas][(int) (max(T)/dia)+1];
int desfase = (alto/40); // dibujar algo más bajo
float centroElipse = 0;
float[] factor = {1.1,1.1,1.2,1.1}; // para los textos con información
int[] colores = {#4467A3,#67A344,#A34467,#BDBB0D}; // colores órbitas

// contadores y control
int i,j,n = 0;
boolean trazo = true;
boolean trazoV = true;

// *******************
// SETUP
// *******************
void setup() {
  // Dibujo de la pantalla
  size(1000,1000);
  background(0);
  
  println(numPlanetas);
  // println(afelio[0],afelio[1],perihelio[0],perihelio[1]);  
  
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
        textAlign(LEFT);
        fill(255);        
        
        // Dibujo por cada planeta
        for(j=0;j<=numPlanetas-1;j++) {
          
          // calculo de la anomalia media
          M[j]= (n1[j]*(numeroDias(tinicial,tcalculo)+ts)+lambda0[j]-wm[j])%360; //se calcula en grados. n1[j] está en grados por día.
          E[j] = aEx(M[j],ex[j]); // Cálculo de la anomalía excéntrica
          fill(255);
          textAlign(LEFT);
          // text(nombre[j]+">> a="+nf(a[j]/ua,0,0)+"UA // e="+nf(ex[j],0,6)+"// n="+nf(n1[j],0,3)+"º/dia // M="+nf(M[j],0,2)+"º // E="+nf(E[j],0,2)+"º// r(UA),vang(rad)="+nf(r(a[j],ex[j],E[j])/ua,0,2)+"/"+nf(vang(ex[j],E[j]),0,2)+
          //     " -- [x,y,z](UA)="+nf(xx(j)/ua,0,2)+"/"+nf(yy(j)/ua,0,2)+"/"+nf(zz(j)/ua,0,2)+"// v="+nf(v(r(a[j],ex[j],E[j]),j),0,2)+"km/s",10,25+15*j);         
          
          // Velocidades en afelio y perihelio
          // Se utilizan después en el dibujo de velocidades e información
          float vmin = (exp(L[j]-log(m[j])-log(afelio[j])))/1000; // vmin en el afelio
          float vmax = (exp(L[j]-log(m[j])-log(-perihelio[j])))/1000; // vmax en el perihelio

         //********************
         // Dibujando la órbita
         //********************
         if (trazo==true) { 
            stroke(colores[j]);
            strokeWeight(1);
            noFill();
            ellipseMode(RADIUS);            
            push();
            centroElipse=ancho/2;
            translate(tx(-c[j]*cos(radians(wm[j]))),ty(-c[j]*sin(radians(wm[j])))); // me traslado al centro
            rotate(radians(wm[j])); // giro el mismo ángulo Omega + w, wm, la longitude del perihelio
               // suma del argumento del perihelio (w) y Omega, longitud del nodo ascendente. Aproximación inclinación pequeña.
            ellipse(0,0,tx(a[j])-centroElipse,ty(b[j])-alto/2-desfase); // órbita, de semieje mayor a y semieje menor b.
            pop();
            textAlign(CENTER);
            fill(colores[j]);
            text("P["+nf(perihelio[j]/ua,0,2)+"UA]",tx(factor[j]*perihelio[j]*cos(radians(wm[j])+PI)),ty(factor[j]*perihelio[j]*sin(radians(wm[j])+PI))); // Perihelio
            text("A["+nf(afelio[j]/ua,0,2)+"UA]",tx(factor[j]*afelio[j]*cos(radians(wm[j])+PI)),ty(factor[j]*afelio[j]*sin(radians(wm[j])+PI))); // Afelio
            line(tx(afelio[j]*cos(radians(wm[j])+PI)),ty(afelio[j]*sin(radians(wm[j])+PI)),tx(perihelio[j]*cos(radians(wm[j])+PI)),ty(perihelio[j]*sin(radians(wm[j])+PI)));
            ellipse(tx(perihelio[j]*cos(radians(wm[j])+PI)),ty(perihelio[j]*sin(radians(wm[j])+PI)),4,4);
            // fill(255);
            // ellipse(tx(-c[j]*cos(radians(wm[j]))),ty(-c[j]*sin(radians(wm[j]))),4,4); // el centro de cada elipse
            // ellipse(tx(perihelio[j]*cos(radians(wm[j])+PI)),ty(perihelio[j]*sin(radians(wm[j])+PI)),4,4); // punto en el perihelio, órbita más cercana
            noFill();
          } // fin de trazo 
          
         //***********************
         // Dibujando la velocidad
         //***********************
          if (trazoV==true) {            
            stroke(colores[j]); // color
            float vv = v(r(a[j],ex[j],E[j]),j); // fórmula de la velocidad. A partir de momento angular.
            float urx = tx(xx(j))-centroElipse;
            float ury = ty(yy(j))-(alto/2)-desfase;
            // angulo aparente es el ángulo que recorre la elipse en proyección
            // lo calculo de estar forma porque me parece más sencilla.
            // la otra forma es calculando la velocidad en coordenadas eclípticas enn xx, yy, zz
            float angulo = atan(ury/urx);
            if (urx<0) {angulo=angulo+PI; }
            if (urx>0 & ury<0) {angulo=angulo+2*PI;} // varía desde 0 a 2PI
            // velocidad en cada punto
            float vx = vv*cos(angulo+(PI/2));
            float vy = vv*sin(angulo+(PI/2)); // ángulo que gira
            // factor variable para ver bien el vector velocidad
            float ff = (vv-vmin)/(vmax-vmin); // permite variar más el tamaño de la flecha de velocidad
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
            fill(255);
            text("Datos del planeta "+nombre[j].toUpperCase()+" (" +simbolo[j]+")",10,25);
            text("POSICION: a="+nf(a[j]/ua,0,0)+"UA // e="+nf(ex[j],0,6)+"// n="+nf(n1[j],0,3)+"º/dia // M="+nf(M[j],0,2)+"º // E="+nf(E[j],0,2)+"º// r(UA),vang(rad)="+nf(r(a[j],ex[j],E[j])/ua,0,2)+"/"+nf(vang(ex[j],E[j]),0,2)+
                 " -- [x,y,z](UA)="+nf(xx(j)/ua,0,2)+"/"+nf(yy(j)/ua,0,2)+"/"+nf(zz(j)/ua,0,2),10,40);  
            text("VELOCIDADES: vmin|Afelio="+nf(vmin,0,2)+"km/s // vmax|Perihelio="+nf(vmax,0,2)+" km/s // v="+nf(v(r(a[j],ex[j],E[j]),j),0,2)+"km/s",10,55);
            text("P.ORBITALES: long. nodo asc="+omega[j]+"º // arg. perihelio w="+w[j]+"º // long. perihelio wm="+wm[j]+"º // i="+inc[j]+"º // long. media 15-1-1985 lo="+lambda0[j]+"º",10,70);
            text("P.FISICOS: E="+(-1*exp(Energy[j]))+" J // L\u2243"+exp(L[j]-log(1e6))+" MKg m2/s2 ",10,85);
            text("Dia referencia "+tinicial+": "+gregJuliano(tinicial)+" - Dia empieza: "+tcalculo+": "+gregJuliano(tcalculo)
              +" - Diferencia: "+numeroDias(tinicial,tcalculo)+" dias - Tiempo: "+ts+" dias - Avance: "+nfp(gaps,0,0),10,100);
          } else if ((n==0 || n>=5) && j==1) {
            textAlign(LEFT);
            fill(255);
            text("INSTRUCCIONES",10,25);
            text("Cursor arriba/abajo aumenta/disminuye velocidad || Espacio: órbitas ON/OFF || Tecla v: velocidades ON/OFF ",10,40);
            text("Números 1 al 4: información de planetas Tierra, Venus, Mercurio y Marte || otro número: instrucciones",10,55);
            text("Órbita: dibujo de la elipse, eje mayor, perihelio y afelio. Velocidad: representada en el sentido del movimiento, en km/s",10,70); 
            text("Con los cursores se puede avanzar o retroceder hasta de 20 en 20 días; parámetro 'Avance'",10,85);
            text("Dia referencia "+tinicial+": "+gregJuliano(tinicial)+" - Dia empieza: "+tcalculo+": "+gregJuliano(tcalculo)
              +" - Diferencia: "+numeroDias(tinicial,tcalculo)+" dias - Tiempo: "+ts+" dias - Avance: "+nfp(gaps,0,0),10,100);
          }
          
         //***********************
         // Trayectoria planetas
         //***********************
          image(planeta[j],tx(xx(j)),ty(yy(j))); // movimiento del planeta
          // El sol estará dibujado en la posición de uno de los focos respecto de la tierra, pero ocupa el centro de la pantalla
          image(sol,tx(0),ty(0)); // En la posición (0,0); en el centro. Lo dibujo al final para que quede por encima
         
          
        } // fin del for por cada planeta 
        
        // paso del tiempo (días) AVANCE
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


// Cálculo de la velocidad
float v (float r, int i) {
  // L = mr x v --> en modulo v = L/mr ; L es constante
  // conozco el logaritmo del momento angular L[i] 
  float velocidad = L[i]-log(m[i])-log(r);
  return exp(velocidad)/1000; // km por segundo
}


// *******************************
// Funciones calculos astronómicos
// *******************************
float aEx(float mm, float exc) { // calculo anomalía excéntrica método Newton-Rapshon
  // mejor la fórmula en radianes, 
  // Y paso después datos a grados, para que coincida con la tabla
  int iteracciones=0;
  float aE=0;
  float aEant=mm*PI/180;
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
float r (float a, float exc, float aE) {
  // a en m, aE en grados
   return a*(1-exc*cos(aE*PI/180));
}

float vang (float exc, float aE) {
  // aE en grados
  float aErad = aE*PI/180;
  return 2*atan( sqrt((1+exc)/(1-exc)) * tan(0.5*aErad) ); // radianes
}

// *********************************
// Posiciones eclíptica xx,yy,zz
// *********************************
float xx(int orden) {
  float aa=omega[orden]*PI/180; // convertido a radianes
  float bb=w[orden]*(PI/180)+vang(ex[orden],E[orden]); // vang ya está en radianes
  return r(a[orden],ex[orden],E[orden])*(cos(aa)*cos(bb)-sin(aa)*sin(bb)*cos(inc[orden]*PI/180));
}

float yy(int orden) {
  float aa=omega[orden]*PI/180; // convertido a radianes
  float bb=w[orden]*(PI/180)+vang(ex[orden],E[orden]); // vang ya está en radianes
  return r(a[orden],ex[orden],E[orden])*(sin(aa)*cos(bb)+cos(aa)*sin(bb)*cos(inc[orden]*PI/180));
}

float zz(int orden) {
  float aa=omega[orden]*PI/180; // convertido a radianes
  float bb=w[orden]*(PI/180)+vang(ex[orden],E[orden]); // vang ya está en radianes
  return r(a[orden],ex[orden],E[orden])*(sin(bb)*sin(inc[orden]*PI/180));
}

// ********************
// Funciones de control
// ********************
void keyPressed() {  
  if (key==32){ // Espacio
    trazo = trazo ^ true;  
  }    
  if (key=='v' || key=='V') { // velocidad
     trazoV = trazoV ^ true; 
  }
  if (key == CODED && keyCode == UP) {
    gaps+=1;
    if (gaps>20) {gaps=20;}
  }  
  if (key == CODED && keyCode == DOWN) {
    gaps+=-1;
    if (gaps<-20) {gaps=-20;}
  }    
  
  if (key>=48 && key<=57) {
     n=key-48; // elijo los números 0,1,2,3,4,5
  }
}

// ********************
// Funciones temporales
// ********************

float numeroDias(String antes,String ahora) {
  // tiene que estar en el formato ddmmyyyy
  // fechas a partir del 15 de enero de 1985
  return gregJuliano(ahora)-gregJuliano(antes);  
}

float gregJuliano(String fecha) {
  // formula aplicada de Lito, de la Asociación Astronómica Magallanes
  // https://agrupacionastronomicamagallanes.wordpress.com/experimento-de-eratostenes/conversion-de-fecha-a-dia-juliano/
  String[] f1 = split(fecha,"/");
  int d = int(f1[0]);
  int m = int(f1[1]);
  int y = int(f1[2]); 
  // Si m<=2 le sumo 12 y resto 1 al año, y si no lo dejo igual
  if (m<=2) {m=m+12; y=y-1;}
  // Cálculo de magnitudes auxiliares
  int a=int(y/100);
  int b=2-a+int(a/4); 
  // Una vez obtenida, obtengo la fórmula
  // INT(365,25(Y+4716) )+INT(30,6001(M+1) )+D+B-1524,5
  return int(365.25*(y+4716))+int(30.6001*(m+1))+d+b-1524.5;
}
