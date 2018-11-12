# Ejercicio 8

## Introducción

Incrementar la capacidad del sistema para permitir una mayor carga de peticiones, al igual que reducir _downtime_ eliminando elementos críticos, es importante a la hora de incrementar la disponibilidad de nuestro sistema.

### 1 - Añadiendo redundancia

Para evitar puntos únicos de fallo en nuestro sistema, configúralo para arrancar múltiples instancias de la aplicación.

- Modifica y configura la topología de tu sistema para arrancar múltiples instancias.
- Asegúrate de que puedas acceder a todas ellas de forma individual.

### 2 - Balancear la carga

Una vez contemos con múltiples instancias para enviar peticiones, necesitaremos de un punto de entrada al sistema que distribuya la carga de forma equitativa entre las múltiples instancias configuradas en el punto anterior.

- Introduce un balanceador de carga como [HAProxy](http://www.haproxy.org/) en tu topología y configúralo para distribuir la carga entre las múltiples instancias creadas en el punto anterior.
- Puede ser útil proveer información de acceso a cada instancia para asegurarnos de que efectivamente se esté distribuyendo la carga equitativamente.

### 3 - ¿Puedo enviar tráfico?

Si alguna de tus instancias empieza a generar problemas o deja de estar disponible, debemos evitar que el balanceador de carga distribuya peticiones hacia ellas para evitar propagar estos problemas al cliente.

- Crea un _endpoint_ `/health` en la aplicación que reporte el status del servicio.
- Configura el balanceador de carga para enviar tráfico a instancias que se encuentren sanas comprobando el _endpoint_ creado en el punto anterior.
- Comprueba que el balanceador de carga no envíe tráfico a instancias que reporten problemas mediante el _endpoint_ del primer punto.
