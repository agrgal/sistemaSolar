
#Sistema Solar - planetas interiores

En este pequeño estudio (https://github.com/agrgal/sistemaSolar) dejo documentación sobre el problema de los dos cuerpos, tanto del punto de vista matemático, de la astronomía, como con un significado más físico, dando significado a magnitudes como la energía de la órbita o la conservación del movimiento angular.

Los programas están escritos en Processing. Los más elaborados son SIS_SOL_1 (Java),  y SIS_SOL_3(p5.js) , en los que se resuelve el problema completamente a partir de los parámetros orbitales: semieje mayor de la elipse (a), excentricidad (e), inclinación de la órbita (i), longitud del nodo ascendente (Omega), argumento del perihelio (w) y época de paso por el perihelio (Tau), aunque en este último se utilizan datos equivalentes, como la longitud media en una fecha determinada (15/1/1985), o, el uso como dato de la longitud del perihelio, wm, la suma de Omega y w (para i pequeñas).

El programa calcula además el resto de parámetros físicos, como la energía de la órbita y el momento angular, muestra el dibujo de la órbita y la posición de los puntos más cercanos y lejanos al sol, perihelios y afelios. Para mostrar u ocultar las órbitas pulsar espacio.

El programa de inicio avanza día a día a partir de una fecha aleatoria 8-feb-2007 (SIS_SOL_3 pide la fecha de inicio), aunque se puede variar con las teclas "+" y "-" (o cursores arriba y abajo) la cantidad de días que avanza en cada cálculo. También se puede hacer correr hacia atrás.

Representa además (pulsando "v") las velocidades y una representación de ellas en cada planeta y en cada punto de la trayectoria.

Pulsando los números del 1 al 4 puede verse la información calculada por cada planeta: anomalía media (M), anomalía excéntrica (E) , distancia al sol (r), anomalía verdadera (vang) y coordenadas respecto a la eclíptica [xx,yy,zz]. Pulsando otro número, se muestran instrucciones. Usa CTRL+ y CTRL- si necesitas ajustar la simulación a la pantalla.

El paso del tiempo a dias julianos se realiza bajo las fórmulas encontradas en la web https://agrupacionastronomicamagallanes.wordpress.com/experimento-de-eratostenes/conversion-de-fecha-a-dia-juliano/
Posibles mejoras

Pensando en otras mejoras, podríamos hacer un programa en el que calculemos la posición de los astros respecto de un observador terrestre o un programa que simule un viaje entre la Tierra y Marte.

Documentación: https://github.com/agrgal/sistemaSolar/tree/master/problema_dos_cuerpos

