import { codify, parameterize } from './code';

describe('codify', () => {
  it('Returns variable name and safe name', () => {
    const rules = ``;
    const { variables } = codify(rules);

    expect(variables.length).toBe(1);
    expect(variables[0].name).toBe('foo bar');
    expect(variables[0].safeName).toBe('foo_bar');
  });
});

describe('parameterize', () => {
  it('Returns number from math block', () => {
    const rules = ``;
    const { code, variables } = codify(rules);
    const params = parameterize(code, variables);

    expect(params.length).toBe(1);
    expect(params[0].name).toBe('number');
    expect(params[0].value).toBe(100);
  });
});
