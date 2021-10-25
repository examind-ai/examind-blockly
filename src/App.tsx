import React, { useRef, useState, useEffect } from 'react';
import { toolbox } from './toolbox/toolbox';
import './App.css';

import Blockly from 'blockly';

const Component = () => {
  const blocklyRef = useRef<HTMLDivElement>(null!);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg>();

  // Text to list blockly block input parameter
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'text_to_list',
      message0: 'Text To List %1',
      args0: [
        {
          type: 'input_value',
          name: 'TEXTVALUE',
          text: 'Enter Text',
          check: 'String',
        },
      ],
      output: 'Array',
      colour: 120,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'multiline_text',
      message0: 'Multiline Text %1',
      args0: [
        {
          type: 'field_multilinetext',
          name: 'MULTILINETEXT',
          text: '',
        },
      ],
      output: 'String',
      colour: 330,
      tooltip: '',
      helpUrl: '',
    },
  ]);

  (Blockly as any).JavaScript['text_to_list'] = function (
    block: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var text_textvalue = (Blockly as any).JavaScript.valueToCode(
      block,
      'TEXTVALUE',
      (Blockly as any).JavaScript.ORDER_NONE,
    );
    // TODO: Assemble JavaScript into code variable.
    var testcode = text_textvalue + ".split('\\n')";
    var code = 'console.log(' + testcode + ')';
    return code;
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
