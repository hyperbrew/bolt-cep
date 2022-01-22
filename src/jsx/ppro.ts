/// <reference path="../../node_modules/types-for-adobe/Premiere/15.0/index.d.ts" />
/// <reference path='../../node_modules/types-for-adobe-extras/Premiere/12.0/qeDom.d.ts' />

export const qeDomFunction = () => {
  if (typeof qe === "undefined") {
    app.enableQE();
  }
  qe.name;
};

export const helloWorld = () => {
  alert("Hello from Premiere Pro.");
};
