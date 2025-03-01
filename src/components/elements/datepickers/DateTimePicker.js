import React, {useState} from "react";
import Tabs, {TabCase} from "../tabs/Tabs";
import "./DateTimePicker.css";
import Popover from "@material-ui/core/Popover";
import {makeStyles} from "@material-ui/core";
import Button from "../forms/Button";
import CalendarPicker from "./CalendarPicker";
import RelativePicker from "./RelativePicker";
import {IoCalendarOutline} from "@react-icons/all-files/io5/IoCalendarOutline";
import NowDateTime from "./NowDateTime";

export default function DataTimePicker({type, datetime, onDatetimeSelect}) {

    const activeTab = (datetime) => {
        if(datetime?.delta === null && datetime.absolute === null) {
            return 2;
        }

        if(datetime?.delta?.value && datetime.delta.value != null) {
            return 1;
        }

        return 0;
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const [tab, setTab] = useState(activeTab(datetime));

    const onDateTimeSet = (datetime) => {
        onDatetimeSelect(datetime);
    }

    const handleDisplay = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'datetime-popover' : undefined;

    const useStyles = makeStyles((theme) => ({
        root: {
            marginTop: 5,
            transform: "none",
            transition: "none"
        },
    }));

    const classes = useStyles();

    const datetimeString = (datetime) => {
        if (datetime == null || (datetime?.absolute === null && datetime?.delta === null)) {
            return 'now';
        }

        if (datetime?.delta?.value) {
            return datetime.delta.type + " " + datetime.delta.value + " " + datetime.delta.entity
        }

        if (datetime?.absolute) {
            return datetime.absolute.year + "/" + datetime.absolute.month + "/" + datetime.absolute.date + " @ " +
                datetime.absolute.hour + ":" + datetime.absolute.minute + ":" + datetime.absolute.second + datetime.absolute.meridiem;
        }

        return 'Error'
    }

    return <div>
        <Button
            icon={<IoCalendarOutline size={24} style={{marginRight: 5}}/>}
            style={{width: 240, marginLeft: 5, padding: "6px 15px"}}
            label={datetimeString(datetime)}
            onClick={handleDisplay}
        />
        <Popover
            id={id}
            className={classes.root}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <div className="DateTimePicker">
                <Tabs tabs={["Date & time", "Relative", "Now"]} defaultTab={tab} onTabSelect={setTab}>
                    <TabCase id={0}>
                        <CalendarPicker onDateSelect={onDateTimeSet} datetime={datetime}/>
                    </TabCase>
                    <TabCase id={1}>
                        <RelativePicker type={type} onDateSelect={onDateTimeSet} datetime={datetime}/>
                    </TabCase>
                    <TabCase id={2}>
                        <NowDateTime onDateSelect={onDateTimeSet} />
                    </TabCase>
                </Tabs>
            </div>
        </Popover>
    </div>


}