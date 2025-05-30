// @directus/format-title

export function formatTitle(title: string, separator?: string | RegExp) {
  if (!separator) separator = new RegExp("/s|-|_| ", "g");
  return decamelize(title).split(separator).map(capitalize).reduce(combine); // .map(handleSpecialWords)
}

function decamelize(string: string) {
  return string
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1_$2")
    .toLowerCase();
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

function combine(acc: string, str: string) {
  return `${acc} ${str}`;
}
