# DGSIN-2021-20

### Recurso base

```console
.../api/v1/alcohol-tobacco-exps
```

### Ejemplo de un recurso concreto

```json
{"autonomous_community": "Andalucia","year": 2019,"avg_expenditure_household": 549.31,"avg_expenditure_person": 211.54,"porcentual_distribution": 2}
```

* * *

## METODOS

### Obtener todos los recursos

#### Petición

```console
GET .../api/v1/alcohol-tobacco-exps
```

#### Respuesta

```json
[{"autonomous_community":"Andalucia","year":2019,"avg_expenditure_household":549.31,"avg_expenditure_person":211.54,"porcentual_distribution":2},
{"autonomous_community":"Andalucia","year":2018,"avg_expenditure_household":543.32,"avg_expenditure_person":209.44,"porcentual_distribution":1.94},
{"autonomous_community":"Andalucia","year":2017,"avg_expenditure_household":593.36,"avg_expenditure_person":228.11,"porcentual_distribution":2.16},
{"autonomous_community":"Andalucia","year":2016,"avg_expenditure_household":597.6,"avg_expenditure_person":229.21,"porcentual_distribution":2.31},
...]
```

* * *

### Obtener todos los recursos de Andalucia

#### Petición

```console
GET .../api/v1/alcohol-tobacco-exps/Andalucia
```

#### Respuesta

```json
[{"autonomous_community":"Andalucia","year":2019,"avg_expenditure_household":549.31,"avg_expenditure_person":211.54,"porcentual_distribution":2},
{"autonomous_community":"Andalucia","year":2018,"avg_expenditure_household":543.32,"avg_expenditure_person":209.44,"porcentual_distribution":1.94},
{"autonomous_community":"Andalucia","year":2017,"avg_expenditure_household":593.36,"avg_expenditure_person":228.11,"porcentual_distribution":2.16},
{"autonomous_community":"Andalucia","year":2016,"avg_expenditure_household":597.6,"avg_expenditure_person":229.21,"porcentual_distribution":2.31},
... ]
```

* * *

### Obtener un recurso concreto

#### Petición

```console
GET .../api/v1/alcohol-tobacco-exps/Andalucia/2019
```

#### Respuesta

```json
{"autonomous_community":"Andalucia","year":2019,"avg_expenditure_household":549.31,"avg_expenditure_person":211.54,"porcentual_distribution":2}
```

* * *

### Crear un nuevo recurso

#### Petición

```console
POST .../api/v1/alcohol-tobacco-exps
```

```json
{"autonomous_community": "Andalucia","year": 2022,"avg_expenditure_household": 49.31,"avg_expenditure_person": 21.54,"porcentual_distribution": 4}
```

#### Respuesta

```console
201 CREATED
```

* * *

### Modificar un recurso concreto

#### Petición

```console
PUT .../api/v1/alcohol-tobacco-exps/Andalucia/2019
```
```json
{"autonomous_community": "Andalucia","year": 2019,"avg_expenditure_household": 0,"avg_expenditure_person": 0,"porcentual_distribution": 0}
```

#### Respuesta

```json
{"autonomous_community": "Andalucia","year": 2019,"avg_expenditure_household": 0,"avg_expenditure_person": 0,"porcentual_distribution": 0}
```

* * *

### Modificar un recurso aportando un recurso incorrecto (sin *avg_expenditure_household*)

#### Petición

```console
PUT .../api/v1/alcohol-tobacco-exps/Andalucia/2019
```
```json
{"autonomous_community": "Andalucia","year": 2050,"avg_expenditure_person": 1,"porcentual_distribution": 1}
```

#### Respuesta

```console
422 Unprocessable Entity
```

* * *

### Eliminar todos los recursos

#### Petición

```console
DELETE .../api/v1/alcohol-tobacco-exps
```

#### Respuesta

```console
204 No Content
```

* * *

### Eliminar un recurso concreto

#### Petición

```console
DELETE .../api/v1/alcohol-tobacco-exps/Andalucia/2019
```

#### Respuesta

```console
204 No Content
```
