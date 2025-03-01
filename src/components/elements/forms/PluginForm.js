import {ObjectInspector} from "react-inspector";
import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import "../../flow/InfoTable.css";
import Switch from "@material-ui/core/Switch";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import ElevatedBox from "../misc/ElevatedBox";
import FormHeader from "../misc/FormHeader";
import {BsXSquare} from "@react-icons/all-files/bs/BsXSquare";
import {BsCheckBox} from "@react-icons/all-files/bs/BsCheckBox";

export default function PluginForm({id}) {

    const [plugin, setPlugin] = useState(null);
    const [enabled, setEnabled] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
            if (id) {
                request({
                        url: "/flow/action/plugin/" + id
                    },
                    () => {
                    },
                    () => {
                    },
                    (response) => {
                        console.log(response)
                        if (response) {
                            setEnabled(response?.data?.settings?.enabled);
                            setHidden(response?.data?.settings?.hidden);
                            setPlugin(response.data);

                        }
                    },
                )
            }
        },
        [id])

    const onEnabled = () => {
        request(
            {
                url: '/flow/action/plugin/'+plugin.id+'/enable/' + ((!hidden) ? 'yes' : 'no')
            },
            () => {},
            () => {},
            (response) => {
                console.log(response)
            }
        )
        setEnabled(!enabled)
    }

    const onHidden = () => {
        request(
            {
                url: '/flow/action/plugin/'+plugin.id+'/hide/' + ((!hidden) ? 'yes' : 'no')
            },
            () => {},
            () => {},
            (response) => {
                console.log(response)
            }
        )
        setHidden(!hidden)
    }

    return <div style={{margin: 10}}>
        <FormHeader>Plugin specification</FormHeader>
        <ElevatedBox>
            <div className="InfoTable">
                <div className="InfoRow">
                    <div>module</div>
                    <div>{plugin?.plugin?.spec?.module}</div>
                </div>
                <div className="InfoRow">
                    <div>Class name</div>
                    <div>{plugin?.plugin?.spec?.className}</div>
                </div>
                <div className="InfoRow">
                    <div>init</div>
                    <div><ObjectInspector data={plugin?.plugin?.spec?.init}/></div>
                </div>
                <div className="InfoRow">
                    <div>input</div>
                    <div>{plugin?.plugin?.spec?.inputs.join(", ")}</div>
                </div>
                <div className="InfoRow">
                    <div>output</div>
                    <div>{plugin?.plugin?.spec?.outputs?.join(", ")}</div>
                </div>
                <div className="InfoRow">
                    <div>start action</div>
                    <div>{plugin?.plugin?.start ? <BsCheckBox size={23}/> : <BsXSquare size={20}/>}</div>
                </div>
                <div className="InfoRow">
                    <div>debug action</div>
                    <div>{plugin?.plugin?.debug ? <BsCheckBox size={23}/> : <BsXSquare size={20}/>}</div>
                </div>
            </div>
        </ElevatedBox>

        <FormHeader>Plugin metadata</FormHeader>
        <ElevatedBox>
            <div className="InfoTable">
                <div className="InfoRow">
                    <div>Name</div>
                    <div>{plugin?.plugin?.metadata?.name}</div>
                </div>
                <div className="InfoRow">
                    <div>Description</div>
                    <div>{plugin?.plugin?.metadata?.desc}</div>
                </div>
                <div className="InfoRow">
                    <div>Groups</div>
                    <div>{plugin?.plugin?.metadata?.group.join(", ")}</div>
                </div>
                <div className="InfoRow">
                    <div>Icon</div>
                    <div><FlowNodeIcons icon={plugin?.plugin?.metadata?.icon} /></div>
                </div>

                <div className="InfoRow">
                    <div>enabled</div>
                    <div>
                        <Switch
                            checked={enabled}
                            onChange={onEnabled}
                            name="enabledPlugin"
                        />
                    </div>
                </div>

                <div className="InfoRow">
                    <div>hidden</div>
                    <div>
                        <Switch
                            checked={hidden}
                            onChange={onHidden}
                            name="enabledPlugin"
                        />
                    </div>
                </div>
            </div>
        </ElevatedBox>
    </div>
}