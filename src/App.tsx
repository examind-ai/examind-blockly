/* eslint-disable no-useless-concat */
import React, { useRef, useState, useEffect } from 'react';
import { toolbox } from './toolbox/toolbox';
import './App.css';

import Blockly from 'blockly';

const Component = () => {
  const blocklyRef = useRef<HTMLDivElement>(null!);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg>();

  // Text to list blockly block field input
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'text_to_list',
      message0: 'Text To List %1',
      args0: [
        {
          // type: 'input_value',
          type: 'field_multilinetext',
          name: 'TEXTVALUE',
          text: 'Enter Text',
          // check: 'String',
        },
      ],
      output: 'Array',
      colour: 120,
      tooltip: '',
      helpUrl: '',
    },
  ]);

  (Blockly as any).JavaScript['text_to_list'] = function (
    block: any,
  ) {
    // Using input value
    // var textValue = (Blockly as any).JavaScript.valueToCode(
    //   block,
    //   'TEXTVALUE',
    //   (Blockly as any).JavaScript.ORDER_NONE,
    // );
    // Using field value
    var fieldValue = block.getFieldValue('TEXTVALUE');
    // TODO: Assemble JavaScript into code variable.
    var code = fieldValue + ".split('\\n')";
    return code;
  };

  // Text to list blockly block field input
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'text_to_list',
      message0: 'Text To List %1',
      args0: [
        {
          type: 'field_multilinetext',
          name: 'TEXTVALUE',
          text: 'Enter Text',
        },
      ],
      output: 'Array',
      colour: 120,
      tooltip: '',
      helpUrl: '',
    },
    // Using input value instead of text field
    {
      type: 'text_to_list_version_two',
      message0: 'Text To List Input %1',
      args0: [
        {
          type: 'input_value',
          name: 'TEXTVALUETWO',
          check: 'String',
        },
      ],
      output: 'Array',
      colour: 120,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'multiline_test',
      message0: 'Multiline Text %1',
      args0: [
        {
          type: 'field_multilinetext',
          name: 'MULTILINE',
          text: 'default',
        },
      ],
      output: 'String',
      colour: 330,
      tooltip: '',
      helpUrl: '',
    },
  ]);

  // Multiline input
  (Blockly as any).JavaScript['multiline_test'] = function (
    block: any,
  ) {
    var code = (Blockly as any).JavaScript.multiline_quote_(
      block.getFieldValue('MULTILINE'),
    );
    // TODO: Assemble JavaScript into code variable.
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, (Blockly as any).JavaScript.ORDER_NONE];
  };

  // Field input
  (Blockly as any).JavaScript['text_to_list'] = function (
    block: any,
  ) {
    var fieldValue = block.getFieldValue('TEXTVALUE') as
      | string
      | null
      | undefined;
    // TODO: Assemble JavaScript into code variable.
    let splitString = fieldValue?.split('\n') ?? [];
    let final = splitString.map(s => `'${s}'`).join(', ');
    var code = '[' + final + ']';
    return [code, (Blockly as any).JavaScript.ORDER_ATOMIC];
  };

  // Block input
  (Blockly as any).JavaScript['text_to_list_version_two'] = function (
    block: any,
  ) {
    var textValue = (Blockly as any).JavaScript.valueToCode(
      block,
      'TEXTVALUETWO',
      (Blockly as any).JavaScript.ORDER_NONE,
    );
    // TODO: Assemble JavaScript into code variable.
    var code = '(' + textValue + ')' + ".split('\\n')";
    return [code, (Blockly as any).JavaScript.ORDER_ATOMIC];
  };

  useEffect(() => {
    let ws = Blockly.inject(blocklyRef.current, {
      toolbox: toolbox as any,
    });

    if (localStorage.getItem('workspace_data') != null) {
      let domText = localStorage.getItem('workspace_data') as any;
      let dom = Blockly.Xml.textToDom(domText as any);
      Blockly.Xml.domToWorkspace(dom, ws);
    }

    // Save State
    function saveState() {
      let dom = Blockly.Xml.workspaceToDom(ws);
      let domText = Blockly.Xml.domToText(dom);
      localStorage.setItem('workspace_data', domText);
    }

    // output JS to console.
    function outputJS() {
      let cd = (Blockly as any).JavaScript.workspaceToCode(ws);
      console.log(cd);
    }

    setWorkspace(ws);
    ws.addChangeListener(saveState);
    ws.addChangeListener(outputJS);

    return () => {
      ws.dispose();
    };
  }, [blocklyRef, setWorkspace]);

  return (
    <div
      style={{ width: '100%', height: '480px' }}
      ref={blocklyRef}
    />
  );
};

export default Component;
