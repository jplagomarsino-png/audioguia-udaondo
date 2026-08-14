export interface GalleryImage {
  url: string;
  caption: string;
}

export interface TourStop {
  id: string;
  type: 'sala' | 'objeto';
  title: string;
  subtitle: string;
  audio: string;
  text: string;
  image: string;
  section: 'arquitectura' | 'interior' | 'vitrales';
  locucion?: string;
  gallery?: GalleryImage[];
}

export interface TourCategory {
  id: string;
  title: string;
  desc: string;
  stops: TourStop[];
}

export const ALL_TOUR_STOPS: TourStop[] = [
  {
    id: 'bienvenida',
    type: 'sala',
    title: 'Bienvenida y el Milagro de Salvaire',
    subtitle: 'La historia de la promesa y el poncho del cacique que inició la gran obra.',
    audio: 'bienvenida.mp3',
    section: 'arquitectura',
    image: '/bienvenida.jpg',
    text: 'La historia de la promesa y el poncho del cacique que inició la gran obra.',
    locucion: 'Hola, ¿qué tal? Soy tu guía en esta visita a la Basílica Nuestra Señora de Luján. Nuestro punto de encuentro para comenzar es justo al frente de la Basílica, donde todo el mundo aprovecha para sacarse la foto de recuerdo. Mientras vamos hasta ahí, te cuento que esta obra se la debemos a un sacerdote francés, el Padre Jorge María Salvaire. Terminando el 1800 la vida de este padre estaba en manos de unos indios, y encomendó entonces su alma a la Virgen. Si se salvaba, iba a escribir su historia y a construirle un templo monumental. En ese momento, llegó un cacique que lo conocía, y efectivamente, lo salvó. ¿Conocías la historia? Hizo lo que dijo: escribió su historia y pocos años después se comenzaba la construcción de esta gran casa, que se terminaría recién en 1935, 50 años después. Te cuento que este recorrido no incluirá ni la cripta ni el recorrido de las alturas, que tienen ambos visitas guiadas propias maravillosas. ¿Ya estamos frente a la Basílica? Entonces pasemos a nuestra primer parada vamos a ver que se trata este estilo que busca el cielo.',
    gallery: [
      { url: '/bienvenida.jpg', caption: 'La historia de la promesa y el poncho del cacique que inició la gran obra.' }
    ]
  },
  {
    id: 'neogotico',
    type: 'sala',
    title: 'El Neogótico: Un Estilo que Mira al Cielo',
    subtitle: 'Los secretos de la verticalidad, la liviandad y la luz espiritual de la piedra.',
    audio: 'neogotico.mp3',
    section: 'arquitectura',
    image: '/neogotico.jpg',
    text: 'Los secretos de la verticalidad, la liviandad y la luz espiritual de la piedra.',
    locucion: 'Acá estamos, justo frente a la Basílica. Momento de sacar una foto. Lo primero que impacta es que todo parece irse para arriba. Subir y subir. Ir más alto. Entrar en el cielo. A esta forma se le llamó gótico. Tiene tres secretos: la verticalidad, porque todas las líneas son como brazos que quieren tocar el cielo; la liviandad, que nos hace sentir que el edificio flota a pesar de ser de piedra; y la luminosidad, pues, como las columnas externas aguantan todo el peso, se pueden abrir o ampliar las paredes y poner ventanas gigantes. Es una arquitectura pensada para que la luz sea la protagonista. El gótico es un estilo espiritual.',
    gallery: [
      { url: '/neogotico.jpg', caption: 'Los secretos de la verticalidad, la liviandad y la luz espiritual de la piedra.' }
    ]
  },
  {
    id: 'portadas',
    type: 'sala',
    title: 'Las Tres Portadas y el Abrazo a las Naciones',
    subtitle: 'Significado de las entradas dedicadas a Argentina, Uruguay y Paraguay.',
    audio: 'portadas.mp3',
    section: 'arquitectura',
    image: '/portadas.jpg',
    text: 'Significado de las entradas dedicadas a Argentina, Uruguay y Paraguay.',
    locucion: 'Si bajamos la vista a las puertas, se nota que la fachada está dividida en tres, lo que anuncia tres naves en el interior. Son las tres entradas principales con arcos apuntados, es decir, con esa forma de punta de flecha. Cada puerta representa a una nación que, en aquel entonces, ya tenía a la Virgen de Luján como su protectora. A la derecha está la de la República del Uruguay, en el centro la de Argentina y a la izquierda la del Paraguay. Este orden se mantiene en el interior con cada nave. La puerta argentina es la más ancha y está hecha de madera de roble revestida en cobre. Si miramos el tímpano —ese espacio arriba de la puerta—, hay un relieve de la Virgen rodeado de una decoración espesa de hojas de vid y parras, que las vamos a ver en muchos lugares de la Basílica. Las curvas o columnas que enmarcan cada entrada se llaman arquivoltas y acentúan esa sensación de profundidad.',
    gallery: [
      { url: '/portadas.jpg', caption: 'Significado de las entradas dedicadas a Argentina, Uruguay y Paraguay.' }
    ]
  },
  {
    id: 'roseton',
    type: 'sala',
    title: 'Pináculos y el Gran Rosetón de Luz',
    subtitle: 'La decoración de la vid y el sello de cristal francés de diez metros.',
    audio: 'roseton.mp3',
    section: 'arquitectura',
    image: '/roseton.jpg',
    text: 'La decoración de la vid y el sello de cristal francés de diez metros.',
    locucion: 'Encima de estas entradas, coronando los arcos, aparecen los pináculos. Son esas terminaciones en punta, como agujas pequeñas, que sirven para reforzar esa idea de verticalidad. Lo interesante es que estos pináculos no están ahí solo de adorno; son el remate visual de las estructuras que realmente sostienen el edificio. Tienen una relación directa con las columnas que veremos luego. Si observamos bien sus detalles, notaremos que repiten la misma decoración de motivos naturales y actúan como las piezas que terminan de estirar la fachada hacia el cielo antes de encontrarnos, más arriba, con el gran rosetón central. El gran rosetón central es una obra imponente de 10 metros de diámetro que llegó desde Francia, y está compuesto por vitrales radiados que tamizan la luz antes de que entre al templo. Es importante notar que toda la arquitectura de la Basílica no busca solo la altura, sino que en esos espacios que abre deja lugar a expresiones consagradas que son fundamentales para el sentido del santuario. Como la imagen de la Virgen en la entrada, el rosetón aparece ahí arriba, antes de que empiecen los techos, como un sello final de luz.',
    gallery: [
      { url: '/roseton.jpg', caption: 'La decoración de la vid y el sello de cristal francés de diez metros.' }
    ]
  },
  {
    id: 'apostoles',
    type: 'sala',
    title: 'Mensajeros de Piedra: Apóstoles y Evangelistas',
    subtitle: 'Los santos gigantes de la fachada que parecen caminar junto al visitante.',
    audio: 'apostoles.mp3',
    section: 'arquitectura',
    image: '/apostoles.jpg',
    text: 'Los santos gigantes de la fachada que parecen caminar junto al visitante.',
    locucion: 'Sigamos elevando la mirada porque lo que tenemos arriba es impresionante. Nos esperan 16 estatuas de piedra, cada una de unos seis metros de alto, que representan a los Apóstoles y a los Evangelistas. Hay un detalle muy tierno en estas esculturas que no se ve a simple vista: si se fijan bien en los pies de las figuras, van a notar que sobresalen un poquito del pedestal. Dicen que se esculpieron así a propósito, para que sintamos que los santos no están ahí quietos, sino que caminan con nosotros y nos acompañan mientras entramos al templo. San Pedro tiene las llaves en la mano. ¿lo pueden ver? Él está ahí, custodiando la entrada. En total son doce apóstoles distribuidos en la fachada, y luego veremos a los evangelistas, antes de entrar.',
    gallery: [
      { url: '/apostoles.jpg', caption: 'Los santos gigantes de la fachada que parecen caminar junto al visitante.' }
    ]
  },
  {
    id: 'gargolas',
    type: 'sala',
    title: 'Gárgolas y Demonios en las Cornisas',
    subtitle: 'El misterio de los ángeles caídos que vigilan el templo desde afuera.',
    audio: 'gargolas.mp3',
    section: 'arquitectura',
    image: '/gargolas.jpg',
    text: 'El misterio de los ángeles caídos que vigilan el templo desde afuera.',
    locucion: 'Ahora, prepárense para algo un poco más misterioso. Si estiran el cuello y miran bien arriba, hacia las cornisas y los salientes más altos, van a descubrir a los "vecinos" más extraños de la Basílica: las gárgolas y esos llamativos demonios que parecen espiarnos desde las alturas. No son todos iguales; hay grifones y figuras grotescas, y un detalle que los hace realmente intrigantes es que muchos tienen alas. Según la historia, estas criaturas representan a los ángeles que fueron expulsados del Paraíso y que, al caer, quedaron atrapados en la piedra, condenados a la intemperie por toda la eternidad. Pero lo que realmente intriga es su gesto. Si los observan con detenimiento, van a notar que tienen una "actitud pensante". ¿Y qué es lo que quieren? La tradición dice que están ahí, con el mentón apoyado en las garras, buscando una forma de entrar. Se quedan ahí, congelados en ese pensamiento eterno, tratando de descifrar cómo vulnerar el templo. Mientras no lo logran, terminan convirtiéndose en guardianes involuntarios. En la casa de la Virgen ellos no tienen lugar y deben quedarse por siempre afuera.',
    gallery: [
      { url: '/gargolas.jpg', caption: 'El misterio de los ángeles caídos que vigilan el templo desde afuera.' }
    ]
  },
  {
    id: 'torres',
    type: 'sala',
    title: 'Torres, Campanas de Guerra y Relojes Santafesinos',
    subtitle: 'Secretos a 106 metros de altura y el carillón fundido con cañones de Milán.',
    audio: 'torres.mp3',
    section: 'arquitectura',
    image: '/torres.jpg',
    text: 'Secretos a 106 metros de altura y el carillón fundido con cañones de Milán.',
    locucion: 'Ahora sí, preparemos el cuello porque vamos a elevar la mirada bien arriba, hacia las torres simétricas de 106 metros de altura. Unas montañas impresionantes que parecen querer pinchar las nubes. Pero fíjense bien: allá atrás, justo sobre el centro de la Basílica, aparece una torrecita más pequeña, como un alfiler de bronce que mide 6 metros. Esa aguja no está ahí por capricho; es la que nos indica desde afuera el lugar exacto donde se encuentra el altar mayor y la Virgen. En la torre de la izquierda se esconde el tesoro musical: un carillón de 15 campanas de bronce fundidas con cañones de la Segunda Guerra Mundial. Pensar que ese metal usado para la guerra hoy es un llamado a la paz. ¿No es increíble? La campana más grande pesa 3.400 kilos. Estén atentos, porque suenan cada media hora. Y más arriba, coronando todo, las cruces de hierro que parecen tocar el cielo.',
    gallery: [
      { url: '/torres.jpg', caption: 'Secretos a 106 metros de altura y el carillón fundido con cañones de Milán.' }
    ]
  },
  {
    id: 'arbotantes',
    type: 'sala',
    title: 'Arbotantes y la Piedra de Entre Ríos',
    subtitle: 'La ingeniería que sostiene el techo y el origen de la porosa piedra rosada.',
    audio: 'arbotantes.mp3',
    section: 'arquitectura',
    image: '/arbotantes.jpg',
    text: 'La ingeniería que sostiene el techo y el origen de la porosa piedra rosada.',
    locucion: 'Entremos a este templo. Llegó el momento de moverse. Entramos por el lateral izquierdo, Te espero ahí, apenas cruzando la reja, en el patio delantero, que es nuestra próxima parada. Apenas entramos está la tienda de la Basílica, donde llevarse genuinos objetos recordatorios. La estatua que mira afuera, guardián eterno, es el padre Salvaire, el fundador de este templo. Unos pasos más adelante, antes de las escaleras, podemos ver el perfil de la iglesia. En el pasillo que muestra toda su profundidad y las estructuras que la sostienen. La estructura real del edificio. Bien arriba se puede observar como caen desde el techo los arbotantes, esos arcos externos que parecen sostener las paredes desde los costados. ¿los ven? Están todos adornados con pequeñas volutas. Gracias a ellos, el peso del techo no aplasta el edificio y permite que adentro todo sea más espacioso. Los arbotantes descargan su peso a la vez sobre las inmensas columnas laterales. Esta estructura permite grandes frentes expuestos, que serán cubiertos con los maravillosos vitrales.',
    gallery: [
      { url: '/arbotantes.jpg', caption: 'La ingeniería que sostiene el techo y el origen de la porosa piedra rosada.' }
    ]
  },
  {
    id: 'memorial',
    type: 'sala',
    title: 'El Memorial de la Cruz Caída',
    subtitle: 'Recuerdo del impacto del año 2000 que marcó el inicio de la restauración.',
    audio: 'memorial.mp3',
    section: 'arquitectura',
    image: '/memorial.jpg',
    text: 'Recuerdo del impacto del año 2000 que marcó el inicio de la restauración.',
    locucion: 'Antes de entrar, deténganse un momento frente a este memorial. Es la antigua cruz que coronaba la torre este. El 13 de junio de 2000, durante una tormenta muy fuerte, esta mole de 1.100 kilos de hierro se desprendió y cayó desde 106 metros de altura. Fue un milagro que no lastimara a nadie, porque cayó en un lugar donde siempre hay gente. Ese ruido no fue solo el golpe; fue el aviso que necesitábamos para darnos cuenta de que la Basílica estaba sufriendo el paso del tiempo y la erosión. Gracias a esa caída se empezó la restauración minuciosa que hoy permite que el templo brille de nuevo. Es un recordatorio de que, a veces, las cosas tienen que caer para poder reconstruirse con más fuerza.',
    gallery: [
      { url: '/memorial.jpg', caption: 'Recuerdo del impacto del año 2000 que marcó el inicio de la restauración.' }
    ]
  },
  {
    id: 'nartex',
    type: 'sala',
    title: 'El Nártex y el Umbral del Silencio',
    subtitle: 'Transición entre el mármol de Carrara y el roble de Eslavonia del ingreso.',
    audio: 'nartex.mp3',
    section: 'arquitectura',
    image: '/ingreso.jpg',
    text: 'Transición entre el mármol de Carrara y el roble de Eslavonia del ingreso.',
    locucion: 'Si prestamos atención, el clima cambia totalmente apenas cruzamos la puerta. El ruido de la plaza parece quedar a kilómetros y el silencio nos empieza a envolver de a poco. Estamos en el nártex, que es como el hall de entrada del templo. Si miramos al suelo, estamos pisando escalones de mármol de Carrara, traído especialmente de Italia para darle este marco de elegancia. Las puertas interiores son de roble de Eslavonia y, si se fijan en los detalles, repiten esa decoración de parras de uva y hojas de vid que ya vimos afuera. Es el lugar justo para dejar las preocupaciones del mundo atrás y prepararnos para lo que viene. Este espacio es una invitación a respirar hondo antes de empezar el verdadero camino espiritual.',
    gallery: [
      { url: '/ingreso.jpg', caption: 'Transición entre el mármol de Carrara y el roble de Eslavonia del ingreso.' }
    ]
  },
  {
    id: 'navecentral',
    type: 'sala',
    title: 'La Nave Central: Un Bosque de Piedra',
    subtitle: 'La inmensidad de la planta en cruz latina y el camino espiritual al altar.',
    audio: 'navecentral.mp3',
    section: 'interior',
    image: '/navecentral.jpg',
    text: 'La inmensidad de la planta en cruz latina y el camino espiritual al altar.',
    locucion: 'Si miramos hacia adelante, el espacio impresiona por su escala y es difícil no quedarse un segundo sin palabras. Son 100 metros de largo hasta el fondo, una distancia que representa nuestro "largo caminar" para llegar al altar. Si pudiéramos ver este edificio desde el cielo, notaríamos que toda la planta tiene forma de cruz latina, dibujando la crucifixión de Jesús directamente sobre el suelo de Luján. Las columnas que dividen las naves se llaman pilares compuestos y son como los músculos que sostienen todo este peso. Si seguimos sus líneas hacia arriba, vemos que se ramifican en el techo formando bóvedas de crucería que parecen un bosque de piedra protegiéndonos. Es una arquitectura pensada para que nos sintamos pequeñitos ante la grandeza de Dios, pero a la vez muy cuidados.',
    gallery: [
      { url: '/navecentral.jpg', caption: 'La inmensidad de la planta en cruz latina y el camino espiritual al altar.' }
    ]
  },
  {
    id: 'tablapobres',
    type: 'sala',
    title: 'La Tabla de los Pobres: El Arte del Vitral',
    subtitle: 'Cómo leer las historias sagradas a través del cristal, el color y el plomo.',
    audio: 'tablapobres.mp3',
    section: 'vitrales',
    image: '/vitrales.jpg',
    text: 'Cómo leer las historias sagradas a través del cristal, el color y el plomo.',
    locucion: 'Estamos acá parados, justo en la entrada central, y es el único lugar donde tenemos los vitrales bien cerca, casi al alcance de la mano. Antes les decían "la tabla de los pobres" porque, en una época donde mucha gente no sabía leer ni escribir, las historias de la fe se aprendían mirando estos dibujos. Son como un libro de cristal que se lee de arriba hacia abajo. Los colores que ven, el rojo, el verde, el dorado y el azul, son clásicos de la firma Dagrand de Burdeos, en Francia. Pucha, pensar que el diseño original lo hizo el propio padre Salvaire, que dibujó cada escena antes de mandarlas a fabricar a Europa. Es un trabajo minucioso donde el artista hace el mapa y el artesano va uniendo cada pedacito de vidrio con flejes de plomo.',
    gallery: [
      { url: '/vitrales.jpg', caption: 'Cómo leer las historias sagradas a través del cristal, el color y el plomo.' }
    ]
  },
  {
    id: 'bautismo',
    type: 'sala',
    title: 'El Bautismo y el Círculo de la Vida',
    subtitle: 'El vitral del río Jordán bajo el simbolismo eterno del Alfa y el Omega.',
    audio: 'bautismo.mp3',
    section: 'vitrales',
    image: '/bautismo.jpg',
    text: 'El vitral del río Jordán bajo el simbolismo eterno del Alfa y el Omega.',
    locucion: 'En este primer vitral a nuestra derecha vemos una escena que todos conocemos: el bautismo de Jesús en el río Jordán. Si nos fijamos en el circulito de cristal que está bien arriba, vamos a ver representada a la Santísima Trinidad rodeada por las letras Alfa y Omega. Es un símbolo hermoso que nos recuerda que Cristo es el principio y el fin de todas las cosas. Justo abajo está el bautisterio de roble, que hace juego con el vitral. Hoy los bautismos se suelen hacer en el patio de la basílica porque son muy masivos, pero este rincón mantiene el significado de nuestro primer paso en la fe. Es como si el agua y la luz se pusieran de acuerdo para darnos la bienvenida a la comunidad.',
    gallery: [
      { url: '/bautismo.jpg', caption: 'El vitral del río Jordán bajo el simbolismo eterno del Alfa y el Omega.' }
    ]
  },
  {
    id: 'reyes',
    type: 'sala',
    title: 'Reyes, Emperadores y el Pesebre de Roma',
    subtitle: 'Historias de Constantino, Carlos Magno y el nacimiento premiado en Italia.',
    audio: 'reyes.mp3',
    section: 'vitrales',
    image: '/reyes.jpg',
    text: 'Historias de Constantino, Carlos Magno y el nacimiento premiado en Italia.',
    locucion: 'Si seguimos elevando la vista, aparecen el emperador Constantino con su cruz luminosa y Carlos Magno con la corona. El diseño que eligió Salvaire es muy práctico: arriba tenemos al personaje bien grande y abajo el dibujo nos cuenta un poquito de su historia. Pero miren ahora este mueble de madera que tenemos abajo: es el Pesebre de Nazaret. Este nacimiento es famoso porque participó en un concurso en Roma y sacó el tercer premio, nada menos. Cuando lo donaron a la basílica, tuvieron que hacer una adaptación porque era tan grande que no entraba completo. Fíjense en los detalles de las casitas y las ovejitas, es una maravilla cómo lograron recrear ese ambiente tan especial.',
    gallery: [
      { url: '/reyes.jpg', caption: 'Historias de Constantino, Carlos Magno y el nacimiento premiado en Italia.' }
    ]
  },
  {
    id: 'predicadores',
    type: 'sala',
    title: 'Predicadores en América y Pies Rojos',
    subtitle: 'La misión de San Francisco Solano y el detalle de los niños indígenas.',
    audio: 'predicadores.mp3',
    section: 'vitrales',
    image: '/predicadores.jpg',
    text: 'La misión de San Francisco Solano y el detalle de los niños indígenas.',
    locucion: 'Aquí la historia se pone más cerca nuestro, con San Toribio y San Francisco Solano predicando en tierras americanas. Si observamos con cuidado al niño de la derecha en el vitral de Francisco, hay un detalle que siempre me hace sonreír. ¡Tiene los pies rojos! Nosotros por acá no tenemos pies rojos, pero se ve que el artesano en Francia, que nunca había visto un indio de cerca, se los imaginó así. Esas son las cosas lindas de los vitrales: mezclan la fe con la imaginación de quien los fabrica a miles de kilómetros. Es un recordatorio de cómo la palabra de Dios, que para el gótico es luz, se fue adaptando a cada cultura.',
    gallery: [
      { url: '/predicadores.jpg', caption: 'La misión de San Francisco Solano y el detalle de los niños indígenas.' }
    ]
  },
  {
    id: 'pascual',
    type: 'sala',
    title: 'San Pascual Bailón y los Mártires Decapitados',
    subtitle: 'El santo que adoraba bailando y el sacrificio final de Bernabé y Matías.',
    audio: 'pascual.mp3',
    section: 'vitrales',
    image: '/martires.jpg',
    text: 'El santo que adoraba bailando y el sacrificio final de Bernabé y Matías.',
    locucion: 'San Pascual Bailón es un personaje que me encanta porque adoraba al Santísimo de una manera muy particular: lo hacía bailando. De ahí viene su nombre y ese gesto de alegría que se ve en el cristal, porque para él la fe era una fiesta. Pero al lado, la cosa se pone un poco más seria y dramática con San Bernabé y San Matías. El vitral no nos oculta nada y muestra el momento de su entrega final, cuando les cortan la cabeza por no renunciar a lo que creían. Es un contraste fuerte entre la alegría del baile y la dureza del martirio, dos formas muy distintas de dar la vida por una idea. No me pregunten mucho más de esta parte porque la imagen ya nos dice todo lo que necesitamos saber.',
    gallery: [
      { url: '/martires.jpg', caption: 'El santo que adoraba bailando y el sacrificio final de Bernabé y Matías.' }
    ]
  },
  {
    id: 'sanantonio',
    type: 'sala',
    title: 'Altar de San Antonio: El Regalo Irlandés',
    subtitle: 'Mármol puro donado por Margarita Morgan y el secreto sagrado del Ara.',
    audio: 'sanantonio.mp3',
    section: 'interior',
    image: '/sanantonio.jpg',
    text: 'Mármol puro donado por Margarita Morgan y el secreto sagrado del Ara.',
    locucion: 'Este es el primero de los 15 altares laterales que tiene la basílica y es imponente porque es todo de mármol de Carrara. Lo donó Margarita Morgan, una irlandesa que fue una gran benefactora y que quiso dejar su huella en este templo. Si nos fijamos en la mesa del altar, hay un pequeño recuadro que se llama Ara. Adentro de ese espacio se guarda una reliquia diminuta de un mártir o un santo, que es lo que "habilita" el altar para poder dar misa. Sin esa reliquia, la consagración no se podría hacer; es como el motor espiritual de toda la estructura de mármol. Es un detalle técnico, pero que le da todo el sentido sagrado a lo que estamos viendo.',
    gallery: [
      { url: '/sanantonio.jpg', caption: 'Mármol puro donado por Margarita Morgan y el secreto sagrado del Ara.' }
    ]
  },
  {
    id: 'sanroque',
    type: 'sala',
    title: 'San Roque y el Pan del Desierto',
    subtitle: 'La lealtad del perro que salvó al santo enfermo en su soledad.',
    audio: 'sanroque.mp3',
    section: 'interior',
    image: '/sanroque.jpg',
    text: 'La lealtad del perro que salvó al santo enfermo en su soledad.',
    locucion: 'Para terminar este primer tramo de la caminata, busquemos la imagen de San Roque. Siempre lo vamos a reconocer porque tiene un perro al lado, y esa es una historia de lealtad que me conmueve. La tradición cuenta que cuando Roque estaba enfermo y abandonado en el desierto, nadie se le acercaba por miedo al contagio. Pero este perro le robaba un pedazo de pan a su dueño todos los días para llevárselo y que no muriera de hambre. Gracias a ese animalito, el santo pudo sobrevivir a la soledad y a la enfermedad. Por eso el perro aparece siempre con el pan en la boca, recordándonos que a veces la ayuda viene de donde menos la esperamos.',
    gallery: [
      { url: '/sanroque.jpg', caption: 'La lealtad del perro que salvó al santo enfermo en su soledad.' }
    ]
  },
  {
    id: 'confesionarios',
    type: 'sala',
    title: 'Los Confesionarios: El Encuentro del Perdón',
    subtitle: 'Piezas de madera tallada donde el perdón sale al encuentro en la nave derecha.',
    audio: 'confesionarios.mp3',
    section: 'interior',
    image: '/confesionarios.jpg',
    text: 'Piezas de madera tallada donde el perdón sale al encuentro en la nave derecha.',
    locucion: 'Caminando por esta nave derecha, si prestan atención a los laterales, aparecen los confesionarios. Son piezas de madera tallada que guardan muchísimos secretos y pedidos de perdón. Es lindo imaginar que la misericordia emana desde el centro mismo del templo, ahí donde está el altar y la Virgen, y se derrama hacia estos costados para recibir a los que necesitan un alivio. A veces uno piensa que estarían en lugares más escondidos, pero no; estos nos salen al encuentro acá, recordándonos que el perdón está siempre a mano. Es una invitación a seguir el camino con el alma un poquito más liviana.',
    gallery: [
      { url: '/confesionarios.jpg', caption: 'Piezas de madera tallada donde el perdón sale al encuentro en la nave derecha.' }
    ]
  },

  {
    id: 'lamparauruguay',
    type: 'sala',
    title: 'La Lámpara Votiva y los Escudos del Uruguay',
    subtitle: 'Joyas de plata y cristales que hermanan a las tres naciones del Plata.',
    audio: 'lamparauruguay.mp3',
    section: 'interior',
    image: '/lamparauruguay.jpg',
    text: 'Joyas de plata y cristales que hermanan a las tres naciones del Plata.',
    locucion: 'Si seguimos caminando por esta nave, nos vamos a encontrar con una lámpara de plata que cuelga y que es realmente imponente. Es la lámpara votiva de Uruguay, un regalo que hizo el pueblo uruguayo como muestra de su hermandad y devoción a la Virgen. Si nos fijamos bien en los vitrales de esta zona, vamos a ver representados los escudos de Argentina, Uruguay y Paraguay, las tres naciones que Luján protege bajo su manto. Es un rincón que nos recuerda que esta fe no tiene fronteras y que todos somos parte de la misma familia rioplatense. Es lindo pensar que esa luz representa el pedido de todo un país que cruza el charco para estar presente acá. Ahora les propongo avanzar hacia un vitral con mucha historia: la Medalla Milagrosa.',
    gallery: [
      { url: '/lamparauruguay.jpg', caption: 'Joyas de plata y cristales que hermanan a las tres naciones del Plata.' }
    ]
  },
  {
    id: 'medalla',
    type: 'sala',
    title: 'La Medalla Milagrosa y las Almas del Purgatorio',
    subtitle: 'El auxilio de la Virgen a Catalina Labouré y la conversión de Ratisbona.',
    audio: 'medalla.mp3',
    section: 'interior',
    image: '/medalla.jpg',
    text: 'El auxilio de la Virgen a Catalina Labouré y la conversión de Ratisbona.',
    locucion: 'Este vitral es uno de los más cargados de significado porque nos cuenta varias cosas a la vez. En una parte vemos a la Virgen auxiliando a las almas del purgatorio, que es una imagen muy fuerte de consuelo y esperanza para los que ya no están. También aparece el momento en que se le aparece a Catalina Labouré para pedirle que acuñe la famosa Medalla Milagrosa, esa que tantos llevamos colgada como protección. Incluso hay un lugarcito para la conversión de Ratisbona, ese hombre que cambió su vida de un momento para el otro tras una visión. Es como si el cristal nos dijera que la transformación es posible y que los milagros están ahí, esperando a que los veamos con el corazón. Caminemos unos pasos más hacia el lugar donde descansan los que soñaron estas paredes.',
    gallery: [
      { url: '/medalla.jpg', caption: 'El auxilio de la Virgen a Catalina Labouré y la conversión de Ratisbona.' }
    ]
  },
  {
    id: 'sepulcros',
    type: 'sala',
    title: 'El Sepulcro de los Fundadores',
    subtitle: 'Lugar de descanso del Padre Salvaire y sus incansables continuadores.',
    audio: 'sepulcros.mp3',
    section: 'interior',
    image: '/sepulcros.jpg',
    text: 'Lugar de descanso del Padre Salvaire y sus incansables continuadores.',
    locucion: 'Llegamos a un rincón de mucha paz, que es el sepulcro de los fundadores de la Basílica. Acá descansan los restos del padre Salvaire y de los que siguieron su "locura" de piedra, como Monseñor Dabani y el padre George. Salvaire murió en 1899, sin ver la obra terminada, pero sus sucesores se encargaron de que cada ladrillo se pusiera en su lugar siguiendo su visión. Es emocionante estar frente a los hombres que dedicaron su vida entera a construirle este cofre monumental a la Virgen. Sin su terquedad y su fe inquebrantable, hoy no estaríamos pisando este mármol ni viendo esta luz tamizada por los cristales. Si les parece, vamos ahora hacia el centro mismo del edificio, donde la planta se ensancha.',
    gallery: [
      { url: '/sepulcros.jpg', caption: 'Lugar de descanso del Padre Salvaire y sus incansables continuadores.' }
    ]
  },
  {
    id: 'crucero',
    type: 'sala',
    title: 'El Crucero: Los Brazos de la Basílica',
    subtitle: 'El ensanche del templo que representa simbólicamente el pecho de Cristo.',
    audio: 'crucero.mp3',
    section: 'interior',
    image: '/crucero.jpg',
    text: 'El ensanche del templo que representa simbólicamente el pecho de Cristo.',
    locucion: 'Estamos parados en el crucero, que vendría a ser como el pecho de la Basílica si miramos el dibujo del suelo. Si recordamos que el plano del templo tiene forma de cruz latina, acá es donde los dos brazos se cruzan y el espacio se abre hasta alcanzar los 70 metros de ancho. La sensación de amplitud en este punto es increíble y nos permite ver la magnitud real de lo que se construyó hace más de cien años. Es el corazón geográfico del santuario, el punto de encuentro natural de todos los que venimos caminando desde distintas naves. Se siente como un respiro profundo en medio del recorrido, un lugar ideal para dimensionar la grandeza de este estilo neogótico. Unos pasos más allá, nos espera el altar de la caridad y la primera santa americana.',
    gallery: [
      { url: '/crucero.jpg', caption: 'El ensanche del templo que representa simbólicamente el pecho de Cristo.' }
    ]
  },
  {
    id: 'sanvicente',
    type: 'sala',
    title: 'San Vicente de Paul y Santa Rosa de Lima',
    subtitle: 'La caridad vicentina y la base de mármol con mosaicos venecianos.',
    audio: 'sanvicente.mp3',
    section: 'interior',
    image: '/sanvicente.jpg',
    text: 'La caridad vicentina y la base de mármol con mosaicos venecianos.',
    locucion: 'Este altar es otra joya que le debemos a la generosidad de la familia Morgan, que tanto ayudó en la construcción. Está dedicado a San Vicente de Paul, ese gran ejemplo de caridad y entrega, y también a Santa Rosa de Lima, que fue la primera santa de nuestro continente. Si nos acercamos un poquito a la base, vamos a notar unos mosaicos venecianos preciosos que le dan un toque de color y brillo diferente al mármol de Carrara. Es un altar que nos habla del servicio a los demás y de cómo la fe echó raíces profundas y hermosas en estas tierras americanas. Pucha, qué detalle el de esos mosaicos, se nota que no escatimaron en nada para que todo fuera perfecto. Ahora miremos hacia arriba para ver unos vitrales que vienen con sello de autor.',
    gallery: [
      { url: '/sanvicente.jpg', caption: 'La caridad vicentina y la base de mármol con mosaicos venecianos.' }
    ]
  },
  {
    id: 'papas',
    type: 'sala',
    title: 'Papas de Burdeos y Votos de Silencio',
    subtitle: 'Vitrales firmados por la Casa Dagrand y la historia de silencio de San Bruno.',
    audio: 'papas.mp3',
    section: 'vitrales',
    image: '/papas.jpg',
    text: 'Vitrales firmados por la Casa Dagrand y la historia de silencio de San Bruno.',
    locucion: 'Si levantamos la mirada, vamos a notar que estos vitrales son un poco más rectos, no tan puntiagudos como los que veníamos viendo en el resto de la nave. Son piezas originales de la famosa casa Dagrand de Burdeos y nos cuentan la historia de San Bruno y sus votos de silencio. En una de las escenas se ve al Papa aprobando la orden religiosa que fundó Bruno, un momento clave para la historia de la Iglesia. Me gusta pensar que en medio de tanto ruido que a veces traemos de afuera, San Bruno nos invita a buscar un ratito de silencio para escucharnos por dentro. Es un arte que viene de lejos pero que nos habla de algo muy actual: la necesidad de parar un poco. Vamos ahora a rodear el altar por el pasillo de atrás, lo que llamamos el deambulatorio.',
    gallery: [
      { url: '/papas.jpg', caption: 'Vitrales firmados por la Casa Dagrand y la historia de silencio de San Bruno.' }
    ]
  },
  {
    id: 'deambulatorio',
    type: 'sala',
    title: 'El Deambulatorio y la Mártir de los Dientes',
    subtitle: 'El pasillo circular y el duro testimonio de fe de Santa Apolonia.',
    audio: 'deambulatorio.mp3',
    section: 'interior',
    image: '/chirola.jpg',
    text: 'El pasillo circular y el duro testimonio de fe de Santa Apolonia.',
    locucion: 'Estamos entrando en la "chirola", que es el nombre cariñoso que le damos al deambulatorio o pasillo circular que rodea el altar mayor. Este camino nos permite caminar por detrás del recinto de la Virgen y ver la estructura desde otros ángulos mientras avanzamos en silencio. Si nos fijamos en los vitrales de este pasillo, hay uno dedicado a Santa Apolonia, a quien se la reconoce fácilmente porque sostiene una tenaza. La historia cuenta que le arrancaron los dientes durante su martirio, por eso hoy es la santa a la que se le pide por los dolores de muelas. Es un testimonio de fe muy crudo, pero que nos muestra la fuerza que tenían estos santos para no renunciar a lo que creían. Mientras seguimos caminando, fíjense bien en las piedras de las paredes, porque guardan un secreto muy especial.',
    gallery: [
      { url: '/chirola.jpg', caption: 'El pasillo circular y el duro testimonio de fe de Santa Apolonia.' }
    ]
  },
  {
    id: 'piedras',
    type: 'sala',
    title: 'Las Piedras Escritas y las Intenciones Ocultas',
    subtitle: 'Muros que guardan en su interior los mensajes y promesas de los fieles.',
    audio: 'piedras.mp3',
    section: 'interior',
    image: '/piedras.jpg',
    text: 'Muros que guardan en su interior los mensajes y promesas de los fieles.',
    locucion: 'Estas paredes que nos rodean no son solo piedra y cemento, tienen un alma propia que late en cada bloque. Se las conoce como las "piedras escritas" porque son bloques huecos que se vendieron para juntar los fondos necesarios para terminar esta obra inmensa. Adentro de cada una, la gente dejaba frasquitos de vidrio con sus intenciones, sus promesas o simplemente los nombres de sus seres queridos. Es impresionante pensar que estamos rodeados por miles de oraciones secretas que están ahí, metidas en la estructura misma de la Basílica. Todo este edificio está sostenido, literalmente, por la fe y los pedidos de miles de fieles que pusieron su granito de arena hace décadas. Sigamos un poco más hasta el altar de San José, donde nos espera una historia de protección.',
    gallery: [
      { url: '/piedras.jpg', caption: 'Muros que guardan en su interior los mensajes y promesas de los fieles.' }
    ]
  },
  {
    id: 'camarinsacristia',
    type: 'sala',
    title: 'El Camarín y el Latir de la Sacristía',
    subtitle: 'El cofre que el Padre Salvaire soñó: la sacristía y la imagen original de 1630.',
    audio: 'camarin_sacristia.mp3',
    section: 'interior',
    image: '/camarin_sacristia.jpg',
    text: 'El cofre que el Padre Salvaire soñó: la sacristía y la imagen original de 1630.',
    locucion: 'Estamos justo detrás del altar mayor, en el centro del deambulatorio. Antes de subir, pasamos frente a la Sacristía Principal. Es un lugar de mucha actividad silenciosa donde los sacerdotes y obispos se preparan para la misa; allí late el día a día de quienes dedican su vida a la fe por María. Ahora, si subimos por la escalera de mármol de Carrara, llegamos al Camarín. Este es el verdadero cofre que el Padre Salvaire soñó para su Perla del Plata. Aquí, en este recinto de madera de cedro y adornos dorados, reside la imagen original de terracota de 1630. Es esa talla pequeñita que decidió quedarse a vivir con nosotros hace casi cuatro siglos. Estar acá arriba, tan cerca de Ella, nos permite un momento de intimidad y silencio que es el corazón mismo de toda esta visita.',
    gallery: [
      { url: '/camarin_sacristia.jpg', caption: 'El cofre que el Padre Salvaire soñó: la sacristía y la imagen original de 1630.' }
    ]
  },

  {
    id: 'sanjose',
    type: 'sala',
    title: 'San José y el Monstruo del Mar',
    subtitle: 'La protección del Arcángel Rafael durante el viaje del joven Tobías.',
    audio: 'sanjose.mp3',
    section: 'interior',
    image: '/sanjose.jpg',
    text: 'La protección del Arcángel Rafael durante el viaje del joven Tobías.',
    locucion: 'Llegamos al altar de San José, que fue terminado allá por 1905 con un estilo un poco más sencillo que los anteriores. El vitral de acá nos cuenta una historia que parece sacada de un libro de aventuras: el arcángel Rafael protegiendo al joven Tobías del ataque de un monstruo marino. Es una imagen muy dinámica que nos recuerda que siempre tenemos una protección superior cuando enfrentamos nuestros miedos o las dificultades del viaje. San José, como custodio de la Sagrada Familia, acompaña este mensaje de cuidado y guía en nuestro propio caminar diario. Me encanta cómo los colores del mar se mezclan con la luz que entra, le dan un aire muy especial a este rincón.',
    gallery: [
      { url: '/sanjose.jpg', caption: 'La protección del Arcángel Rafael durante el viaje del joven Tobías.' }
    ]
  },
  {
    id: 'sanluis',
    type: 'sala',
    title: 'San Luis Gonzaga: El Altar de Latón',
    subtitle: 'Un rincón de estilo colonial que narra la vida del joven santo jesuita.',
    audio: 'sanluis.mp3',
    section: 'interior',
    image: '/sanluis.jpg',
    text: 'Un rincón de estilo colonial que narra la vida del joven santo jesuita.',
    locucion: 'Si observamos este rincón, vamos a notar que el estilo cambia de repente y nos traslada a algo más colonial. Es el altar de San Luis Gonzaga y lo que lo hace tan especial es que no es de mármol como los demás, sino que está hecho de latón. Este material le da un brillo y una textura diferente, contándonos la historia de este joven jesuita que dio su vida cuidando a los enfermos en medio de una peste en Roma. Es un recordatorio de que la fe también se construye con materiales sencillos y que la entrega no conoce de edades. Me pregunto cuántas historias de jóvenes con ese mismo fuego habrán pasado por este altar buscando inspiración en su valentía. Es un rincón que parece pedirnos que miremos la vida con la misma generosidad con la que Luis miró a los que sufrían.',
    gallery: [
      { url: '/sanluis.jpg', caption: 'Un rincón de estilo colonial que narra la vida del joven santo jesuita.' }
    ]
  },
  {
    id: 'angel',
    type: 'sala',
    title: 'El Ángel Orante de la Percepción',
    subtitle: 'El arcángel de tres alas que ayuda a agudizar los sentidos espirituales.',
    audio: 'angel.mp3',
    section: 'vitrales',
    image: '/angel.jpg',
    text: 'El arcángel de tres alas que ayuda a agudizar los sentidos espirituales.',
    locucion: 'Si nos detenemos frente a esta imagen, es probable que notemos algo extraño en sus alas. Este arcángel tiene tres, aunque la tercera parece más bien una capita que lo envuelve. En la tradición del santuario, se lo conoce como el ángel de la percepción y hay mucha gente que se acerca a tocar esa tercera ala con la esperanza de agudizar sus sentidos espirituales o encontrar claridad en momentos de duda. Es una imagen que nos invita a pensar que hay realidades que no se ven a simple vista y que hace falta una sensibilidad especial para captar lo sagrado en lo cotidiano. Pucha, qué cosa linda pensar que tenemos un aliado para ver más allá de lo que muestran los ojos y entender lo que el corazón ya sabe.',
    gallery: [
      { url: '/angel.jpg', caption: 'El arcángel de tres alas que ayuda a agudizar los sentidos espirituales.' }
    ]
  },
  {
    id: 'santaines',
    type: 'sala',
    title: 'La Pasión de Santa Inés en Cristal',
    subtitle: 'Relato visual de la hoguera y el milagro que protegió su pudor.',
    audio: 'santaines.mp3',
    section: 'vitrales',
    image: '/santaines.jpg',
    text: 'Relato visual de la hoguera y el milagro que protegió su pudor.',
    locucion: 'Este vitral es como una película de cristal que se lee de arriba hacia abajo y nos narra la vida de Inés, una joven que se mantuvo firme frente a los poderosos de su época. Hay un momento increíble en la historia donde la condenan a la hoguera, pero las llamas no la tocan y, en cambio, queman a sus perseguidores. También se cuenta que cuando quisieron humillarla quitándole la ropa, su cabello creció de golpe para proteger su pudor, un milagro de modestia que todavía nos conmueve. Es un relato visual de cómo la integridad de una persona puede ser más fuerte que cualquier castigo físico. La luz que pasa por estos vidrios parece traer de vuelta esa fuerza que tuvo ella para defender su verdad hasta el final.',
    gallery: [
      { url: '/santaines.jpg', caption: 'Relato visual de la hoguera y el milagro que protegió su pudor.' }
    ]
  },
  {
    id: 'sanexpedito',
    type: 'sala',
    title: 'San Expedito y el Cuervo del "Hoy"',
    subtitle: 'El mensaje de no postergar la conversión frente al grito de "mañana".',
    audio: 'sanexpedito.mp3',
    section: 'interior',
    image: '/sanexpedito.jpg',
    text: 'El mensaje de no postergar la conversión frente al grito de "mañana".',
    locucion: 'Aquí lo vemos a San Expedito, con su armadura de soldado romano y una actitud que no deja lugar a dudas. Lo más interesante es lo que pasa a sus pies, donde está pisando a un cuervo que grita la palabra "Cras", que en latín significa mañana. Expedito, con una cruz en la mano, responde con la palabra "Hodie", que significa hoy. Es un mensaje muy profundo sobre la importancia de la decisión inmediata y de no postergar las cosas importantes de la vida, especialmente la fe y la bondad. A veces pasamos la vida diciendo que mañana vamos a ser mejores o que mañana vamos a ocuparnos de lo espiritual, pero este santo nos recuerda que el único momento que tenemos es el ahora.',
    gallery: [
      { url: '/sanexpedito.jpg', caption: 'El mensaje de no postergar la conversión frente al grito de "mañana".' }
    ]
  },
  {
    id: 'sanpatricio',
    type: 'sala',
    title: 'San Patricio: De Pastor a Guerrero',
    subtitle: 'La vida del patrono de Irlanda leída paso a paso de abajo hacia arriba.',
    audio: 'sanpatricio.mp3',
    section: 'vitrales',
    image: '/sanpatricio.jpg',
    text: 'La vida del patrono de Irlanda leída paso a paso de abajo hacia arriba.',
    locucion: 'Este altar es otra muestra del cariño que la comunidad irlandesa le tiene a esta Basílica y se lee de abajo hacia arriba para seguir el crecimiento de Patricio. Primero lo vemos como un humilde pastor que fue llevado como esclavo, pero que después de escapar volvió a su tierra para predicar con una fuerza de guerrero espiritual. La historia de Irlanda está grabada en estos cristales, mostrando cómo él usaba el trébol para explicar algo tan difícil como la Trinidad. Es lindo ver cómo la vida de una persona puede dar un giro tan grande cuando encuentra su propósito en la vida. Es un rincón que nos habla de la superación y de cómo el pasado difícil puede transformarse en una herramienta para ayudar a otros.',
    gallery: [
      { url: '/sanpatricio.jpg', caption: 'La vida del patrono de Irlanda leída paso a paso de abajo hacia arriba.' }
    ]
  },
  {
    id: 'sagradocorazon',
    type: 'sala',
    title: 'El Sagrado Corazón y el Entierro de Jesús',
    subtitle: 'Apariciones místicas y el bajo relieve del sepulcro de Cristo.',
    audio: 'sagradocorazon.mp3',
    section: 'interior',
    image: '/sagradocorazon.jpg',
    text: 'Apariciones místicas y el bajo relieve del sepulcro de Cristo.',
    locucion: 'Estamos ante una de las devociones más extendidas, que es la del Corazón de Jesús, representado acá con toda su carga de misericordia. El vitral nos muestra las apariciones místicas a Santa Margarita María Alacoque, donde se revela ese amor que no tiene límites por la humanidad. Pero si bajamos la vista hacia la mesa del altar, vamos a ver un bajo relieve muy detallado que representa el entierro de Cristo. Es un contraste fuerte entre el corazón vivo y sufriente por amor, y el cuerpo que es depositado en el sepulcro antes de la resurrección. Esta parada nos invita a reflexionar sobre la entrega total y sobre cómo, incluso en los momentos de mayor oscuridad, el amor sigue siendo la fuerza que sostiene todo.',
    gallery: [
      { url: '/sagradocorazon.jpg', caption: 'Apariciones místicas y el bajo relieve del sepulcro de Cristo.' }
    ]
  },
  {
    id: 'burro',
    type: 'sala',
    title: 'San Antonio y el Burro Arrodillado',
    subtitle: 'La prueba de fe ante la Eucaristía que asombró a los incrédulos.',
    audio: 'burro.mp3',
    section: 'interior',
    image: '/burro.jpg',
    text: 'La prueba de fe ante la Eucaristía que asombró a los incrédulos.',
    locucion: 'Este es un vitral que siempre saca una sonrisa por lo inusual de la escena que cuenta. Se dice que San Antonio quería demostrarle la verdad de la Eucaristía a alguien que no creía, y para hacerlo, dejó a un burro sin comer durante varios días. Cuando le pusieron comida adelante y al mismo tiempo Antonio le mostró la hostia consagrada, el animal prefirió arrodillarse ante Jesús que ir a comer. Es una forma muy sencilla y pedagógica de decir que hasta la creación entera reconoce lo sagrado, a veces mucho mejor que nosotros mismos. La imagen del burro inclinado es un recordatorio de la humildad que hace falta para aceptar las cosas que no podemos explicar solo con la cabeza.',
    gallery: [
      { url: '/burro.jpg', caption: 'La prueba de fe ante la Eucaristía que asombró a los incrédulos.' }
    ]
  },
  {
    id: 'martin',
    type: 'sala',
    title: 'San Esteban y el Soldado de la Capa',
    subtitle: 'El martirio de las piedras y el encuentro de San Martín con el mendigo.',
    audio: 'martin.mp3',
    section: 'interior',
    image: '/martin.jpg',
    text: 'El martirio de las piedras y el encuentro de San Martín con el mendigo.',
    locucion: 'En esta zona vemos el contraste entre el primer mártir de la Iglesia, San Esteban, que murió bajo una lluvia de piedras por defender su fe, y la ternura de San Martín de Tours. Martín era un soldado romano que, al ver a un mendigo muerto de frío, no dudó en cortar su capa a la mitad para compartirla con él. Lo más emocionante de esa historia es que después se dio cuenta de que ese mendigo era el mismísimo Jesús. Son dos formas de martirio: uno de sangre y otro de caridad diaria, de esos que nos tocan a nosotros cuando salimos a la calle. Me pregunto cuántas veces habremos pasado al lado de una oportunidad así sin darnos cuenta de quién estaba realmente ahí.',
    gallery: [
      { url: '/martin.jpg', caption: 'El martirio de las piedras y el encuentro de San Martín con el mendigo.' }
    ]
  },
  {
    id: 'organo',
    type: 'sala',
    title: 'El Órgano Cavaillé-Coll: Una Joya Musical',
    subtitle: 'Doce toneladas de tubos franceses que llenan de música el bosque de piedra.',
    audio: 'organo.mp3',
    section: 'interior',
    image: '/organo.jpg',
    text: 'Doce toneladas de tubos franceses que llenan de música el bosque de piedra.',
    locucion: 'Si miramos hacia atrás, por encima de la entrada, vamos a ver esa mole de tubos que parece un edificio dentro de otro. Es el órgano Cavaillé-Coll, una pieza francesa que pesa 12 toneladas y tiene casi 5.000 tubos de diferentes materiales. Es uno de los más importantes del país y su sonido tiene una potencia que logra llenar cada rincón de este bosque de piedra con una música que parece venir de otro mundo. Fue diseñado especialmente para este volumen de aire tan gigante, así que cuando suena, la Basílica entera vibra. Es el cierre perfecto para los sentidos, una obra de ingeniería y arte que nos recuerda que la belleza también entra por los oídos y nos eleva el espíritu.',
    gallery: [
      { url: '/organo.jpg', caption: 'Doce toneladas de tubos franceses que llenan de música el bosque de piedra.' }
    ]
  },
  {
    id: 'salida',
    type: 'sala',
    title: 'Despedida frente al Gran Capellán',
    subtitle: 'Salida del templo pasando por la estatua del hombre que soñó este cofre.',
    audio: 'salida.mp3',
    section: 'arquitectura',
    image: '/salida.jpg',
    text: 'Salida del templo pasando por la estatua del hombre que soñó este cofre.',
    locucion: 'Estamos terminando nuestro recorrido y pasamos frente a la estatua del padre Jorge María Salvaire, el hombre que hizo posible todo esto. Me gusta pensar en él como el gran arquitecto de la fe en Luján, alguien que no se dejó vencer por las dificultades y que dedicó su vida a que la Virgen tuviera este cofre monumental. Salimos del templo habiendo recorrido historias de mártires, de reyes, de milagros y de gente común que puso su granito de arena. Al cruzar la puerta de nuevo hacia la plaza, nos llevamos un poco de esta paz y de esta luz que tamizaron los vitrales franceses. Ojalá que la visita les haya servido para mirar estas piedras con otros ojos y para sentir que, de alguna manera, ahora también forman parte de esta historia.',
    gallery: [
      { url: '/salida.jpg', caption: 'Salida del templo pasando por la estatua del hombre que soñó este cofre.' }
    ]
  },
];

export const BASILICA_TOUR_DATA: TourCategory[] = [
  {
    id: 'recorrido',
    title: 'Recorrido Recomendado',
    desc: 'El trayecto secuencial recomendado de 37 paradas de la guía.',
    stops: ALL_TOUR_STOPS
  },
  {
    id: 'arquitectura',
    title: 'Arquitectura',
    desc: 'Exterior, fachada, columnas, nártex, torres y estructura del templo.',
    stops: ALL_TOUR_STOPS.filter(stop => stop.section === 'arquitectura')
  },
  {
    id: 'interior',
    title: 'Interior',
    desc: 'Nave central, crucero, altar mayor, camarín, capillas y altares.',
    stops: ALL_TOUR_STOPS.filter(stop => stop.section === 'interior')
  },
  {
    id: 'vitrales',
    title: 'Los Vitrales',
    desc: 'La teología de la luz a través de una deslumbrante colección de vitrales franceses.',
    stops: ALL_TOUR_STOPS.filter(stop => stop.section === 'vitrales')
  }
];