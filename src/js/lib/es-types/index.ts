export type Scripts = {
  [key: string]: (a: any, ...ags: any) => any;
};
export type AppScripts = {
  [key: string]: {
    [key: string]: (a: any, ...ags: any) => any;
  };
};
