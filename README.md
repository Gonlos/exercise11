# Ejercicio 11

## Introducción

Ya tenemos nuestra aplicación prácticamente terminada. Es el momento de considerar cómo vamos a monitorizar, detectar y reaccionar ante problemas en producción.

En este ejercicio exploraremos la observabilidad de nuestro sistema. Mejoraremos el formato de nuestros logs, reportaremos métricas a un panel de analíticas y analizaremos el comportamiento entre servicios mediante el uso de trazas distribuidas.

### 1 - Estandarizando el formato de los logs

Reportar información es un buen comienzo, sin embargo no es suficiente. Los logs han de poder ser clasificados y analizados en un futuro de una manera eficiente. El formato de los logs ha de estandarizarse para almacenarlos, indexarlos y buscar en ellos de manera más eficiente.

- Estandarizar el formato de logs mediante el uso de una librería especializada de logs.
- Asegúrate que errores no recuperables se presenten con el nivel de _error_.
- Asegúrate que errores recuperables se presenten como el nivel de _warning_ .
- Asegúrate que información para _debugear_ se presente con nivel de _debug_.
- Asegúrate no queda ninguna error sin logarse en la aplicación.

### 2 - Monitorizando métricas

Para conocer cómo se comporta nuestro sistema en producción, hemos de poder exponer métricas internas de cada servicio, al igual que montar paneles de análisis que nos presenten datos de una manera amigable.

Vamos a introducir un servicio de estadísticas en nuestra topología, expondremos nuestras métricas y crearemos paneles desde los cuales poder monitorizar e investigar el comportamiento de nuestro sistema en tiempo real.

- Instalar una imagen de [Grafana](https://grafana.com/) con plugin de [Prometheus](https://prometheus.io/).
- Instrumentar aplicación con _endpoint_ de métricas para Prometheus.
- Exponer las siguientes métricas mediante Prometheus y configurar sus paneles correspondientes en Grafana.
  - Ratio de peticiones
  - Ratio de errores
  - Tiempo de respuesta
  - Latencia de principio a fin en elementos en la cola
  - Latencia en publicar en la cola
  - Ratio de publicación de mensajes en la cola
  - Ratio de errores en publicación en la cola

### 3 - Seguimiento de peticiones

Las métricas por servicio son muy útiles pero desafortunadamente ofrecen una visión parcial del sistema en su conjunto.

Para poder analizar cuellos de botella en el sistema a nivel global, tendremos que cambiar la forma mediante la cual interactuamos con otros servicios. Tendremos que añadir información extra a las peticiones para poder seguirlas en nuestro sistema.

- Introducir Jaeger (_Open Tracing_) en la topología de tu sistema.
- Instrumentar la aplicación con Jaeger. Extraer y pasar el identificador de traza a los servicios con los que tu aplicación se comunica y pasar la información oportuna al agente de Jaeger.

### 4 - Alertando problemas

Los paneles de información creados en puntos anteriores nos permiten monitorizar nuestro sistema, pero desgraciadamente requieren de interacción activa por nuestra parte. Tenemos que ir a los paneles de información para conocer el estado de nuestro sistema.

Podemos lanzar alertas que nos avisen de situaciones que requieran atención urgente.

- Crear una alerta sobre una métrica a elegir en Grafana e informar a un canal de Slack a tu elección. Puedes informarte a ti mismo.
