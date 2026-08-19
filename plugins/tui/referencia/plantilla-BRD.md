# Plantilla del BRD

Asi se escribe `BRD.md`. Las secciones son fijas y van en este orden.
Se escribe en lenguaje de negocio. Ni una palabra tecnica.

Si una seccion no se pregunto, **no se inventa**: se pone
`Por definir.` y se agrega la duda a "Supuestos por validar".

---

```markdown
# <Nombre corto de la idea>

_Escrito el <fecha> con /tui:entrevista. Actualizado el <fecha>._

## 1. La idea en una frase
Una sola frase. Que hace y para quien. Sin adjetivos.

## 2. Quien la usa y que gana
| Quien | Que hace hoy | Que ganaria |
|---|---|---|
| Vendedor de campo | Anota pedidos en papel y los pasa de noche | Cierra el pedido en el momento |

## 3. Alcance
### Dentro
Lista de lo que el prototipo SI va a mostrar. Una linea cada cosa.

### Fuera
Lista de lo que NO entra, y por que. **Esta lista no puede estar vacia.**
Si el usuario no dijo que dejar fuera, se le pregunta antes de escribir el BRD.

## 4. Flujo principal
Los pasos del camino feliz, numerados. Cada paso dice quien hace que y que ve.

1. El vendedor entra y ve la lista de clientes de su zona.
2. Elige un cliente y ve su historial de pedidos.
3. ...

## 5. Ramas y excepciones
| Cuando pasa esto | El sistema hace |
|---|---|
| El cliente no esta en la lista | Deja crearlo ahi mismo |
| El monto pasa de 50.000 | Marca el pedido como "requiere aprobacion" |

## 6. Datos de ejemplo
Los datos reales y creibles que dio el usuario. Con nombres, montos y fechas
de su negocio. Esto es lo que va a aparecer en el prototipo.

**clientes**
| nombre | zona | limite de credito |
|---|---|---|
| Distribuidora del Centro | Norte | 50.000 |

## 7. Reglas de negocio
Lista numerada. Cada regla en una frase, en indicativo.
1. Un pedido sobre 50.000 no se puede cerrar sin aprobacion del supervisor.

## 8. Como se ve el exito
A quien se le va a mostrar, en que reunion, y que tiene que pasar para que
esa persona diga "si, es esto".

## 9. Supuestos por validar
Todo lo que se decidio sin que el usuario lo confirmara. Cada uno con quien
lo tiene que confirmar.

- [ ] Se asumio que el vendedor trabaja una sola zona. **Confirmar con:** jefe de ventas.

## 10. Look and feel
Solo si se hablo. Estilo, colores, densidad. Si no se hablo, `Por definir.`

## 11. Prototipos que salen de este documento
Un BRD puede dar mas de un prototipo. Se listan aqui.

- `principal` — el flujo completo del vendedor.
```

---

## Reglas para quien redacta

- **No inventes requisitos.** Lo que no se dijo va a la seccion 9.
- Usa las palabras del usuario, no las tuyas. Si dijo "planilla", escribe
  "planilla", no "formulario".
- Frases cortas. Una idea por linea.
- Los montos y nombres de la seccion 6 son sagrados: se copian tal cual los dio.
  De ahi sale `semilla.js`.
- Si la seccion "Fuera" quedaria vacia, avisalo. Es la señal mas clara de que la
  entrevista quedo corta.
