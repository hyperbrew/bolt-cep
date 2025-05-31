export const fixAssetPathJS = (code: string) => {
  code = code.replace(/\=\"\.\/assets/g, `="../assets`);
  code = code.replace(/\=\"\/assets/g, `="../assets`);
  code = code.replace(/\(\"\.\/assets/g, `("../assets`);
  code = code.replace(/\(\"\/assets/g, `("../assets`);
  return code;
};

export const fixAssetPathCSS = (code: string) => {
  code = code.replace(/\(\.\/assets/g, `(../assets`);
  code = code.replace(/\(\/assets/g, `(./`);
  return code;
};

export const fixAssetPathHTML = (code: string) => {
  code = code.replace(/\=\"\/assets/g, `="../assets`);
  return code;
};

export const removeModuleTags = (code: string) => {
  code = code.replace(/\<link rel=\"modulepreload\" (.*)\>/g, "");
  code = code.replace(/\<script type=\"module\" (.*)\>/g, "");
  return code;
};
