import { codify, parameterize } from './code';

describe('codify', () => {
  it('Returns variable name and safe name', () => {
    const rules = `<xml xmlns="https://developers.google.com/blockly/xml">
          <variables>
              <variable id="variable1">foo bar</variable>
          </variables>
          <block type="variables_set" id="block-1" x="100" y="120">
              <field name="VAR" id="variable1">foo bar</field>
              <value name="VALUE">
                  <block type="math_number" id="block2">
                      <field name="NUM">100</field>
                  </block>
              </value>
          </block>
      </xml>`;
    const { variables } = codify(rules);

    expect(variables.length).toBe(1);
    expect(variables[0].name).toBe('foo bar');
    expect(variables[0].safeName).toBe('foo_bar');
  });
});

describe('parameterize', () => {
  it('Returns number from math block', () => {
    const rules = `<xml xmlns="https://developers.google.com/blockly/xml">
        <variables>
            <variable id="variable1">number</variable>
        </variables>
        <block type="variables_set" id="block-1" x="100" y="120">
            <field name="VAR" id="variable1">number</field>
            <value name="VALUE">
                <block type="math_number" id="block2">
                    <field name="NUM">100</field>
                </block>
            </value>
        </block>
    </xml>`;
    const { code, variables } = codify(rules);
    const params = parameterize(code, variables);

    expect(params.length).toBe(1);
    expect(params[0].name).toBe('number');
    expect(params[0].value).toBe(100);
  });
});
