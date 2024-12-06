Este proyecto simula un concurso de fotografía para así estar relacionado con Cloudinary. 

La API está disponible en: http://localhost:3000/api/v1

COLECCIONES:

/users
/categories
/pictures


USUARIOS

Habrá dos tipos de usuarios: el juez o jueces y los participantes. Los jueces tendrán las facultades de administradores y los participantes serán usuarios con las funciones básicas.

Mostrar todos los usuarios: permite ver a todos los participantes (excluyendo sus contraseñas) y al juez o jueces del concurso.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|GET ALL USERS| GET|/users|no|---|--

Mostrar un usuario: permite buscar un usuario en concreto por su nombre. Si no se está logado o quien realiza la búsqueda no es el propio usuario, no se mostrará la contraseña, solo la información básica. Si es el propio usuario logado, éste podrá ver su propia contraseña (encriptada).

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|GET  USER| GET|/users/:nombre|no/yes|---|--

Registro usuario nuevo: permite que los concursantes se registren, es necesarios para poder participar. No puede haber duplicidad en los nombres de los participantes. El rol por defecto será el de participante.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|REGISTER| POST|/users/register|no|{name,password}|json

Login de usuario: permite logarse en la aplicación al introducir el nombre y contraseña correctos. Al logarse devuelve el token propio del usuario.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|LOGIN| POST|/users/login|no|{name,password}|json

Modificar usuario: la búsqueda se realiza por el nombre de usuario. Se debe estar logado y ser el propio el usuario. Para un participante, el único cambio permitido será la contraseña, no se podrá cambiar el nombre de usuario ni el rol. El juez podrá realizar cualquier cambio así como nombrar otros jueces.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|MODIFY USER| PUT|/users/:nombre|yes|{name,password,role}|json

Borrar usuario: la búsqueda se realiza por el nombre de usuario.Se debe estar logado y ser el propio usuario quien tendrá permitido borrar su propio perfil. Un usuario no podrá borrar a otro usuario, el juez podrá borrar a cualquier usuario. Al borrar un usuario se borrará su perfil, las fotos subidas a Cloudinary, las fotografías de la propia colección y las fotografías relacionadas en cualquier categoría.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|DELETE USER| DELETE|/users/:nombre|yes|--|--


CATEGORÍAS

Habrá tres categorías para participar, los concursantes decidirán en qué categoría participan subiendo las fotografías a la categoría elegida.

Todas las categorías: si no se está logado, se podrán ver las fotografías ya verificadas. Los participantes logados podrán ver , en las categorías, las fotografías verificadas de otros participantes y sus propias fotografías tanto si están verificadas como si no lo están. El juez tendrá acceso a todas las categorías y a todas sus fotografías asociadas.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|GET  CATEGORIES| GET|/categories/|no/yes|---|--

Buscar una sola categoría: funciona igual que el anterior, pero se debe indicar la categoría a mostrar.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|GET  CATEGORIES| GET|/categories/:categoria|no/yes|---|--

Crear categorías: solo para el juez si considera que debe crearse alguna categoría adicional.
|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|POST CATEGORY| POST|/categories|yes|{categoria,primer_premio,segundo_premio}|.json

Borrar categoría: solo para jueces. Borra la categoría seleccionada, las fotos de la colección y las fotos asociadas a los usuarios. También elimina la subcarpeta de Cloudinary.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|DELETE CATEGORY| DELETE|/category/:categoria|yes|--|--

FOTOGRAFÍAS

Subir una nueva fotografía: permite publicar una fotografía solo para usuarios logados. Se ha establecido un límite de dos fotografías como máximo por paticipante, ambas fotografías podrán subirse a una única categoría.  Se debe indicar la categoría en la que se quiere participar con la fotografía y elegir el título. La fotografía quedará pendiente de verificación por el juez. La dirección de cloudinary se guardará en el registro de usuario y el título en la propia categoría.En Cloudinary la subcarpeta equivaldrá a la categoría.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|POST PICTURE| POST|/concurso/:categoria|yes|{subcarpeta,titulo,imagen}|multipart-form data

Todas las fotografías: muestra todas las fotografías subidas. Si no se está logado o no se es el autor de las fotografías, solo mostrará las verificadas por el juez. Si es el propio autor de las fotografías, verá todas las verificadas de otros participantes y las suyas propias estén o no verificadas. El juez podrá ver todas las fotografías.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|GET  PICTURES| GET|/pictures|no/yes|---|--

Fotos por autor: se busca por nombre de autor y muestra las fotografías solo de ese participante. Si no se está logado o no se es el autor de las fotografías, solo mostrará las verificadas por el juez. Si es el propio autor de las fotografías, verá todas las verificadas y las suyas propias estén o no verificadas. El juez podrá ver todas las fotografías.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|GET  PICTURES BY AUTHOR| GET|/pictures/:nombre|no/yes|---|--

Verificar fotografía: solo para el juez del concurso. Permite modificar el perfil de la fotografía para pasarlo a verificado.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|MODIFY PICTURE| PUT|/users/:titulo|yes|{verificado}|json

Borrar fotografía: se pasa el id para evitar que se borre otra fotografía que pueda tener el mismo título. Si no se está logado no se permite hacer nada. Si es juez puede borrar cualquier fotografía. Si es concursante solo podrá borrar sus propias fotografías.La fotografía será borrada de la colección, de Cloudinary, se la categoría asociada y del perfil del participante.

|NOMBRE| MÉTODO|ENDPOINT|LOGIN|BODY|CONTENT-TYPE|
|-------|-------|--------|---|-----|----------
|DELETE PICTURE| DELETE|/pictures/:id|yes|--|--
