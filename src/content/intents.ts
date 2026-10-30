export interface IntentPage {
  path: string;
  title: string;
  description: string;
  linkLabel: string;
  heading: string;
  intro: string;
  steps: string[];
  example: string;
  note?: string;
}

// One page per thing people search for. Each is the same calculator with its own text, title and
// description; the copy only promises what the app does (equal shares, one total per person).
export const INTENT_PAGES: IntentPage[] = [
  {
    path: "/dividir-gastos-asado",
    title: "Cómo dividir los gastos de un asado entre amigos | ¿Qué te debo?",
    description:
      "Calculá cuánto le toca a cada uno en un asado y quién le tiene que pasar plata a quién. Gratis, sin registrarte, en un minuto.",
    linkLabel: "Dividir los gastos de un asado",
    heading: "Cómo dividir los gastos de un asado entre amigos",
    intro:
      "En un asado siempre hay uno que compró la carne, otro que trajo las bebidas y alguien que no puso nada. Para que nadie quede pagando de más, se suma todo lo gastado y se reparte en partes iguales.",
    steps: [
      "Sumá a cada amigo con el total que puso: la carne, el carbón, el pan, las bebidas.",
      "La calculadora suma todo y divide por la cantidad de personas.",
      "Mirá quién le tiene que pasar plata a quién y copiá el resumen para el grupo.",
    ],
    example:
      "Ejemplo: Mati puso $40.000 de carne, Lu $20.000 de bebidas, y Caro y Juan no pusieron nada. El total es $60.000, o sea $15.000 cada uno. Mati tiene que recibir $25.000 y Lu $5.000, y esos $30.000 los pasan Caro y Juan.",
  },
  {
    path: "/dividir-gastos-viaje",
    title: "Cómo repartir la plata de un viaje con amigos | ¿Qué te debo?",
    description:
      "Repartí los gastos de un viaje entre amigos: alojamiento, nafta, comidas. La calculadora te dice quién le debe cuánto a quién.",
    linkLabel: "Repartir la plata de un viaje",
    heading: "Cómo repartir la plata de un viaje con amigos",
    intro:
      "En un viaje cada uno paga cosas distintas: uno el alojamiento, otro la nafta y los peajes, otro las comidas. Al volver hay que saldar las cuentas sin que nadie termine perdiendo plata.",
    steps: [
      "Sumá a cada persona con el total que gastó en nombre del grupo.",
      "La calculadora reparte el total en partes iguales entre todos.",
      "Seguí las transferencias que te muestra y quedan todos a mano.",
    ],
    example:
      "Ejemplo: cuatro amigos, uno pagó el alojamiento ($120.000), otro la nafta y los peajes ($40.000), otro las comidas ($60.000) y el cuarto nada. El total es $220.000, o sea $55.000 por cabeza. Quien no puso nada le pasa su parte a los que pusieron de más.",
  },
  {
    path: "/dividir-alquiler",
    title: "Cómo dividir el alquiler y los gastos entre compañeros | ¿Qué te debo?",
    description:
      "Dividí el alquiler, las expensas y los servicios entre compañeros de casa. Calculá cuánto le toca a cada uno y quién le debe a quién.",
    linkLabel: "Dividir el alquiler y los gastos de la casa",
    heading: "Cómo dividir el alquiler y los gastos entre compañeros",
    intro:
      "En un departamento compartido los gastos los paga cualquiera: el alquiler, las expensas, los servicios, el súper. Cada tanto conviene hacer la cuenta para saber quién le debe a quién.",
    steps: [
      "Sumá a cada compañero con el total que pagó en el mes.",
      "La calculadora divide todo en partes iguales.",
      "Mirá quién transfiere a quién y listo, cuentas claras hasta el mes que viene.",
    ],
    example:
      "Ejemplo: tres compañeros, uno pagó el alquiler ($300.000), otro las expensas y los servicios ($60.000) y el tercero el súper ($30.000). El total es $390.000, o sea $130.000 cada uno.",
    note: "Ojo: la calculadora reparte en partes iguales. Si cada habitación tiene un precio distinto, esta cuenta no refleja eso.",
  },
];
