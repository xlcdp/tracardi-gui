import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow";
import React from "react";

export default function JsonEditor({onChange, value, height}) {

    return <AceEditor
        mode="json"
        theme="tomorrow"
        fontSize={14}
        // onLoad={(d)=>console.log(d)}
        onChange={onChange}
        name="payload_editor"
        value={value}
        editorProps={{$blockScrolling: true}}
        width="100%"
        height={height ? height : "260px"}
    />
}