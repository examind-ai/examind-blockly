import Blockly from 'blockly';
import BlocklyJS from 'blockly/javascript';

export type Variable = {
  name: string;
  safeName: string;
};

export type Param = Variable & {
  value: any;
};

export const codify = (xmlString: string | null | undefined) => {
  if (!xmlString)
    return { code: '(function(){return {};})()', variables: [] }; // eval(code) with this code will return empty object;

  BlocklyJS.addReservedWords('context,params');
  BlocklyJS.INFINITE_LOOP_TRAP =
    'if(--context.loopTrap <= 0) throw "INFINITE LOOP";\n';
  const xml = Blockly.Xml.textToDom(xmlString);
  const workspace = new Blockly.Workspace();
  Blockly.Xml.domToWorkspace(xml, workspace);

  // workspaceToCode initializes the generator and populates BlocklyJS.nameDB_, otherwise, we need to: BlocklyJS.init(workspace): https://github.com/google/blockly/issues/4060#issuecomment-662602322
  const code = BlocklyJS.workspaceToCode(workspace) as string;

  // Blockly replaces user specified variable names with JavaScript safe ones when generating code.
  // We'll create a mapping of those here so that we can substitute param names with safe ones as well.
  // Technique borrowed from: https://groups.google.com/g/blockly/c/M9gudb8hWlI/m/CMYtNMuVBAAJ

  BlocklyJS.nameDB_.setVariableMap(workspace.getVariableMap());
  const variables = workspace
    .getAllVariables()
    .map<Variable>(variable => ({
      name: variable.name,
      safeName: BlocklyJS.nameDB_.getName(
        variable.getId(),
        Blockly.VARIABLE_CATEGORY_NAME,
      ),
    }));

  workspace.dispose();
  return { code, variables };
};

export const parameterize = (code: string, variables: Variable[]) => {
  const execute = `
    var context = this;
    function generateVariables() {
      ${code}
      var params = {};
      ${variables.reduce(
        (assign, variable) =>
          assign +
          `if ('undefined' !== typeof ${variable.safeName}) params['${variable.safeName}'] = ${variable.safeName};`,
        '',
      )}
      return params;
    }
    generateVariables();
  `;

  const context = {
    loopTrap: 1000,
  };

  const decorateNames = (params: any) =>
    Object.keys(params).reduce((decorated, key) => {
      const variable = variables.find(v => v.safeName === key);
      if (!variable) return decorated;
      return decorated.concat({
        name: variable.name,
        safeName: variable.safeName,
        value: params[key],
      });
    }, [] as Param[]);

  try {
    const params = function (str: string) {
      // eslint-disable-next-line
      return eval(str);
    }.call(context, execute); // .call sets 'this' in eval

    return decorateNames(params);
  } catch (e) {
    console.log('error', e);
    return [];
  }
};
