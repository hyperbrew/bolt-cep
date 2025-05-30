import { ts, Project, WriterFunction, DefaultClause } from "ts-morph";
import { App, OptionsArray } from "./options";

export function updateObjectProperty(
  sourceFilePath: string,
  objectName: string,
  propertyName: string,
  value: string | WriterFunction
) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(sourceFilePath);

  const object = sourceFile
    .getVariableDeclarationOrThrow(objectName)
    .getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);

  const property = object.getPropertyOrThrow(propertyName);
  const index = object.getProperties().findIndex((p) => p === property);
  property.remove();

  object.insertPropertyAssignment(index, {
    name: propertyName,
    initializer: value,
  });

  sourceFile.formatText({ indentSize: 2 });
  sourceFile.saveSync();
}

export function updateSwitchStatement(
  sourceFilePath: string,
  selectedApps: OptionsArray<App>
) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(sourceFilePath);

  const switchStatement = sourceFile.getStatementByKindOrThrow(
    ts.SyntaxKind.SwitchStatement
  );

  switchStatement.getClauses().forEach((clause) => {
    const text = clause.getText();

    const isSelected = selectedApps.some(({ value, label }) => {
      const smooshed = label.toLocaleLowerCase().replace(/\s/g, "");
      return text.includes(smooshed) || text.includes(value);
    });

    if (!isSelected) {
      clause.remove();
    }
  });

  const hasAnim = selectedApps.find((x) => x.value === "anim");
  if (!hasAnim) {
    const clauses = switchStatement.getClauses();
    const defaultClause = clauses.find((x) => x instanceof DefaultClause);
    defaultClause?.remove();
  }

  const typeAlias = sourceFile.getTypeAliasOrThrow("Scripts");
  const values = selectedApps.map((x) => x.value);

  typeAlias.replaceWithText(
    `export type Scripts = ${values.map((x) => `typeof ${x}`).join(" & ")}`
  );

  sourceFile.organizeImports();
  sourceFile.formatText({ indentSize: 2 });
  sourceFile.saveSync();
}
