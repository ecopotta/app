import Markdown from "react-markdown";

const textHelp = `
# Ayuda Rápida

## Encabezados
Para crear títulos o encabezados, usa el símbolo \`#\`. Mientras más \`#\` uses, más pequeño será el encabezado.
### Ejemplos:
\`# Título Principal\`  
\`## Subtítulo\`  
\`### Encabezado más pequeño\`

## Negrita y Cursiva
- **Negrita**: Usa \`**\` o \`__\` alrededor del texto.
- *Cursiva*: Usa \`*\` o \`_\` alrededor del texto.

### Ejemplos:
\`**Este texto está en negrita**\`  
\`*Este texto está en cursiva*\`

## Listas
- Listas desordenadas: Usa \`-\` o \`*\` al principio de cada elemento.
- Listas ordenadas: Usa números seguidos de un punto (\`1.\`, \`2.\`, etc.).

### Ejemplos:
- Lista desordenada:
  - \`- Elemento 1\`
  - \`* Elemento 2\`
- Lista ordenada:
  1. \`1. Primer elemento\`
  2. \`2. Segundo elemento\`
## Nota:
- Si se te complica mucho, puedes descargar chatGPT para que lo haga por ti, solo pidele que te haga una descripcion en formato *Markdown* para tal producto!.
`;

const TextHelp = () => <Markdown>{textHelp}</Markdown>;

export default TextHelp;
