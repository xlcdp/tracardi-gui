import React, {Suspense, useEffect} from "react";
import "../lists/cards/SourceCard.css";
import "./SourceDetails.css";
import "./Details.css";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import FormHeader from "../misc/FormHeader";
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import FormDescription from "../misc/FormDescription";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import {request} from "../../../remote_api/uql_api_endpoint";
import SourceAddForm from "../forms/SourceAddForm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";

const TrackerUseScript = React.lazy(() => import('../tracker/TrackerUseScript'));
const TrackerScript = React.lazy(() => import('../tracker/TrackerScript'));


export default function SourceDetails({id, onDeleteComplete}) {

    const confirm = useConfirm();
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [editData, setEditData] = React.useState(null);

    useEffect(() => {
        setLoading(true);
        request(
            {
                url: '/source/' + id,
                method: "GET"
            },
            setLoading,
            () => {
            },
            (response) => {
                if (response) {
                    setData(response.data)
                }
            }
        )
    }, [id])

    const onEdit= () => {
        const editData = JSON.parse(JSON.stringify(data));
        editData.type = {name: editData.type, id: editData.type}
        setEditData(editData)
    }

    const onDelete = () => {
        confirm({
            title: "Do you want to delete this source?",
            description: "This action can not be undone."
        }).then(() => {
            request(
                {
                    url: '/source/' + data.id,
                    method: "DELETE"
                },
                () => {
                }, () => {
                }, (reponse) => {
                    if (onDeleteComplete) {
                        onDeleteComplete(reponse)
                    }
                }
            )
        }).catch(() => {
        })
    }

    const Details = () => <>
        <FormHeader>Source</FormHeader>
        <ElevatedBox>
            <FormSubHeader>Data</FormSubHeader>
            <Properties properties={data}/>
            <Rows style={{marginTop: 20}}>
                <Button onClick={onEdit}
                        icon={<VscEdit size={20}/>}
                        label="Edit"
                        disabled={typeof data === "undefined"}/>
                <Button onClick={onDelete}
                        icon={<VscTrash size={20}/>}
                        label="Delete"
                        disabled={typeof data === "undefined"}/>
            </Rows>
        </ElevatedBox>

        {data.type === "web-page" && <React.Fragment><FormHeader>Integration</FormHeader><ElevatedBox>
            <FormSubHeader>Javascript code</FormSubHeader>
            <FormDescription>Please paste this code into your web page</FormDescription>
            <Suspense fallback={<CenteredCircularProgress/>}><TrackerScript sourceId={data.id}/></Suspense>
        </ElevatedBox>
            <FormHeader>Javascript event sending</FormHeader>
            <ElevatedBox>
                <FormSubHeader>Javascript example</FormSubHeader>
                <FormDescription>Than send event with the folowing code.</FormDescription>
                <Suspense fallback={<CenteredCircularProgress/>}><TrackerUseScript/></Suspense>
            </ElevatedBox>
        </React.Fragment>}

    </>

    return <div className="Box10">
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}

        <FormDrawer
            width={800}
            label="Edit Source"
            onClose={()=>{setEditData(null)}}
            open={editData !== null}>
            <SourceAddForm init={editData} onClose={()=>{setEditData(null)}}/>
        </FormDrawer>
    </div>

}