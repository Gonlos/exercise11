# Ejercicio 9

## 1. Introduccion

Hasta hora hemos hablado puramente de cuestiones de codigo. Hemos de tener en cuenta que ese codigo, eventualmente, ha de ser ejecutado de alguna manera controlable y predecible.
En este ejercicio practicaremos estrategias de despliegue a producción y nos protegeremos contra fallos críticos que puedan dejar nuestro sistema inutilizable.

### 2. Arquitectura del ejercicio

Proveemos de una topología con un balanceador de carga (puerto 48151), conectado a un Service Discovery (Consul). Gracias al Service Discovery, añadir o quitar réplicas registrará automáticamente los cambios en el balanceador de carga, permitiendo mucha mayor elasticidad y reacción a cambios.
Puedes utilizar docker service para controlar el número de réplicas.

Como observación importante, en la configuración de haproxy de la que se os provee, se configuran servicios con nombres `service-v1` y `service-v2`; por consistencia con esta particularidad de la configuración, tenéis que definir variables de entorno al lanzar los contenedores de vuestros servicios: `SERVICE_NAME`, con valor `service-v1` para el conjunto de ré
plicas estables y `service-v2` en los canarios.

### 3. Cómo realizar un despliegue

Supongamos que tenemos una arquitectura similar a la que se desarrollo hasta el ejercicio 8 (e incluida en el ejemplo). Un backend distribuido en varios microservicios, cada uno de los cuales se ejecuta redundantemente para reducir [SPOFs](https://en.wikipedia.org/wiki/Single_point_of_failure).

Idealmente, cuando aumentamos la version de un servicio, este cambio se llevara a la realidad y nuestra feature estara completa. En la realidad, existen una infinidad de escenarios que podrian hacer que la nueva version del servicio falle estrepitosamente.
Se hace necesario tener mecanismos de prevencion de desastres.
Para prevenir desastres, el concepto, en general, es muy sencillo: consiste en que solamente una parte reducida de los clientes "disfruten" de la nueva feature, de forma que los danyos colaterales solo puedan afectar a esta parte reducida de clientes y no a todos los demas.
Esto se puede realizar enrutando el trafico de forma aleatoria y arbitraria (p.ej, solo el 0.01% de los clientes son dirigidos al nuevo software, manteniendo a todos los demas fuera de la prueba), mecanismo en el que principalmente consisten las metodologias blue/green y canary.
Tambien es posible marcar al conjunto de clientes (p.ej. con headers de HTTP), de forma que solo estos disfruten de la nueva feature.

#### 3.1. Canary deployments

- Despliega la arquitectura descrita con tu propia version de message y credit, y aumenta el número de réplicas de cada uno de los servicios a 4. Comprueba que el trafico se esta enrutando a todas las replicas correctamente.

- Añade tu feature! Puedes, simplemente, anadir un endpoint de prueba (p.ej, endpoint `/version`, que dé información sobre la version que está sirviendo la petición)

- Despliega el servicio en fases y comprueba que para el total de peticiones, solo un bajo número de ellas contienen la funcionalidad. Para ello, utiliza:

```
docker service create \
    --name NOMBRE_SERVICIO \
    --replicas=1 \
    NOMBRE_IMAGEN
```

- Prueba el nuevo endpoint, basta con `ab 1000 -n 5 localhost:48151/NUEVO_ENDPOINT_AQUI`. Si todo ha ido correctamente, solo 100 peticiones deberian de haber sido respondidas correctamente.

- Una vez estemos seguros de que todo ha ido correctamente, simplemente es necesario reducir el número de réplicas del antiguo servicio y aumentar el número de réplicas del nuevo servicio. Para ello, puedes utilizar `docker service scale`

#### 3.2. Targetted oriented deployments

También puede sernos conveniente la posibilidad de añadir un header a las peticiones que queremos enrutar explícitamente a las nuevas réplicas.

- Aplica la configuracion de HAProxy para headers y reinicia el contenedor (puedes utilizar docker-compose) para cargar la nueva configuración
