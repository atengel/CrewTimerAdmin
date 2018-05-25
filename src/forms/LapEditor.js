import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import { Checkbox } from 'material-ui';
import Util from './../Util';
import * as Names from '../Names';
import CellEditor from './CellEditor';
import TimeUtil from '../util/TimeUtil';
const uuidv1 = require('uuid/v1');

const styles = {
  tableSuperHeader: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    fontSize: '1.2em',
    fontWeight: 'bold',
    height: '40px',
    color: 'black',
    paddingLeft: '0.5em',
    backgroundColor: '#e0e0e0',
    xborderRadius: '1em 0em 0em 0em',
    textAlign: 'left'
  },
  tableSuperHeaderRight: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    fontSize: '1em',
    fontWeight: 'bold',
    height: '40px',
    color: 'black',
    paddingLeft: '0.5em',
    backgroundColor: '#e0e0e0',
    xborderRadius: '0em 1em 0em 0em',
    textAlign: 'right'
  },
  tableHeader: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    fontSize: '1em',
    fontWeight: 'bold',
    //height: "30px",
    color: 'black',
    paddingLeft: '0.5em',
    paddingRight: '0.5em'
  },
  tableRow: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    fontSize: '1em',
    fontWeight: 'normal',
    height: '30px',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    paddingTop: '2px',
    paddingBottom: '2px',
    color: 'black'
  },
  headerRow: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    fontSize: '1em',
    fontWeight: 'bold',
    height: '30px',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    paddingTop: '2px',
    paddingBottom: '2px',
    color: 'black'
  }
};

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export default class LapEditor extends React.Component {
  constructor(props) {
    super(props);
    const eventId = this.props.defaultValue.Flight + '-' + this.props.defaultValue.EventNum;
    const entryId = eventId + '-' + this.props.defaultValue.Bow;
    const bow = this.props.defaultValue.Bow;
    this.state = {
      bow: bow,
      eventId: eventId,
      entryId: entryId,
      modified: {},
      editable: false,
      lapItems: {},
      showUnassigned: false
    };
    this.tempItems = {};
    this.validate = new RegExp(this.props.regex ? this.props.regex : '.*');
    if (this.props.regatta) {
      this.waypoints = ['S'];
      let timingPoints = Util.getTimingWaypoints(this.props.regattaConfig);
      timingPoints = timingPoints.map((gate) => 'G_' + gate);
      this.waypoints = this.waypoints.concat(timingPoints);
      this.waypoints.push('F');
      this.waypoints.push('Pen');
      this.waypoints.push('R');

      if (this.dataRef) this.dataRef.off();
      this.dataRef = Util.getLapData(this.props.regatta, eventId, this.rxFirebaseData);
      if (this.dataRef2) this.dataRef2.off();
      this.dataRef2 = Util.getLapData(this.props.regatta, '1-?', this.rxFirebaseData);
    }
    this.handleClose = this.handleClose.bind(this);
  }

  rxFirebaseData = (lapItem) => {
    if (!this.dataRef) return; // unloaded
    //if (lapItem.EventNum !== this.props.defaultValue.EventNum) return;
    if (lapItem.Bow !== '*' && lapItem.Bow !== this.state.bow && lapItem.Bow !=='?') return;

    const gate = (lapItem.Gate === "*") ? "S" : lapItem.Gate;
    const timestamp = {};
    timestamp[gate + '_time'] = lapItem.Time;
    const item = {};
    const uuid = lapItem[Names.N_UUID];
    item[uuid] = lapItem;
    this.setState({
      lapItems: Object.assign({}, this.state.lapItems, item)
    });
  }
  emptyEvent = (gate) => {
    let event = {}
    const uuid = uuidv1();
    event[Names.N_UUID] = uuid;
    event[Names.N_REGATTA] = this.props.regatta;
    event[Names.N_GATE] = gate;
    event[Names.N_FLIGHT] = this.props.defaultValue.Flight;
    event[Names.N_EVENTNUM] = this.props.defaultValue.EventNum;
    event[Names.N_BOW] = this.props.defaultValue.Bow;
    event[Names.N_CREW] = this.props.defaultValue.Crew;
    if (gate === 'R') {
      event[Names.N_PENALTY_CODES] = Names.N_OFFICIAL;
      event[Names.N_STATE] = Names.STATE_DELETED;
    }
    event[Names.N_EVENT_ID] = this.state.eventId;
    event[Names.N_ENTRY_ID] = this.state.entryId;

    if (gate === 'Pen' || gate === 'R') {
      let d = new Date();
      let milli = d.getHours() * 3600 * 1000;
      milli += d.getMinutes() * 60 * 1000;
      milli += d.getSeconds() * 1000;
      milli += d.getMilliseconds();
      event[Names.N_TIME] = TimeUtil.milliToString(milli);
    }
    this.tempItems[uuid] = event;
    return event;
  }

  handleOpen = () => {
  };

  handleClose = () => {
    const displayItems = Object.assign({}, this.tempItems, this.state.lapItems);
    for (var uuid in this.state.modified) {
      const lap = displayItems[uuid];
      Util.storeLap(this.props.regatta, lap);
    }
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  };
  handleCancel = () => {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  };

  addPenaltyRow = () => {
    const newItem = this.emptyEvent('Pen');
    const uuid = newItem[Names.N_UUID];
    this.setState({ lapItems: Object.assign({}, this.state.lapItems, { [uuid]: newItem }) });
  };

  onTimeChange = (name, value) => {
    //const ok = this.validate.test(event.target.value);
    console.log("event", name, value);
    const newItems = Object.assign({}, this.tempItems, this.state.lapItems);
    const modItems = Object.assign(this.state.modified);
    newItems[name][Names.N_TIME] = value;
    modItems[name] = true;
    //delete newItems[name];
    this.setState({
      lapItems: newItems,
      modified: modItems
    });
  }

  onElapsedChange = (name, value) => {
    const newItems = Object.assign({}, this.tempItems, this.state.lapItems);
    const modItems = Object.assign(this.state.modified);

    if (newItems[name][Names.N_GATE] === 'Pen') {
      newItems[name][Names.N_PENALTY_TIME] = value;
    }
    else {
      const newTime = TimeUtil.timeAdd(this.startTime, value);
      newItems[name][Names.N_TIME] = newTime;
    }
    modItems[name] = true;
    this.setState({
      lapItems: newItems,
      modified: modItems
    });
  }

  onCodeChange = (name, value) => {
    const newItems = Object.assign({}, this.tempItems, this.state.lapItems);
    const modItems = Object.assign(this.state.modified);

    newItems[name][Names.N_PENALTY_CODES] = value;
    modItems[name] = true;
    this.setState({
      lapItems: newItems,
      modified: modItems
    });
  }

  onBowChange = (name, value) => {
    const newItems = Object.assign({}, this.tempItems, this.state.lapItems);
    const modItems = Object.assign(this.state.modified);
    const event = newItems[name];
    event[Names.N_BOW] = value;

    // prior bow might be '?', update fields
    event[Names.N_EVENTNUM] = this.props.defaultValue.EventNum;
    event[Names.N_EVENT_ID] = this.state.eventId;
    event[Names.N_ENTRY_ID] = this.state.eventId+"-"+value;

    modItems[name] = true;
    this.setState({
      lapItems: newItems,
      modified: modItems
    });
  }

  onDeletedChange = (event, value) => {
    const newItems = Object.assign({}, this.tempItems, this.state.lapItems);
    const modItems = Object.assign(this.state.modified);
    const name = event.target.name;
    newItems[name][Names.N_STATE] = value ? Names.STATE_DELETED : 'OK';
    modItems[name] = true;
    this.setState({
      lapItems: newItems,
      modified: modItems
    });
  }

  onUnassignedChange = (event, value) => {
    this.setState({
      showUnassigned: value
    });
  }
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={false}
        onClick={this.handleCancel}
      />,
      <FlatButton
        label="Apply"
        disabled={this.state.errorText ? true : false}
        primary={true}
        keyboardFocused={false}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Add Penalty Row"
        disabled={false}
        primary={true}
        keyboardFocused={false}
        onClick={this.addPenaltyRow}
      />,
    ];

    this.tempItems = {};
    var displayLaps = Object.assign({}, this.state.lapItems);

    // Inject dummy waypoint entries to show in list if none present.
    var missingWaypoints = {};
    this.waypoints.forEach(function (element) {
      missingWaypoints[element] = true;
    });
    missingWaypoints['R'] = false;
    missingWaypoints['Pen'] = false;
    Object.values(displayLaps).forEach(function (entry) {
      const gate = entry.Gate === '*' ? 'S' : entry.Gate;
      if (entry[Names.N_BOW] === '?') return;
      missingWaypoints[gate] = false;
    });

    // Add in 'missing' waypoints
    for (var key in missingWaypoints) {
      if (missingWaypoints[key]) {
        const newItem = this.emptyEvent(key);
        displayLaps[newItem[Names.N_UUID]] = newItem;
      }
    }

    // Sort by gate followed by time
    const lapdata = Object.values(displayLaps).sort(function (a, b) {
      const agate = this.waypoints.indexOf(a.Gate);
      const bgate = this.waypoints.indexOf(b.Gate);
      if (agate < bgate) return -1;
      if (agate > bgate) return 1;
      if (a.Time < b.Time) return -1;
      else if (a.Time === b.Time) return 0;
      return 1;
    }.bind(this));


    var startTime = null;
    Object.values(this.state.lapItems).forEach(function (row) {
      const deleted = Names.STATE_DELETED === row[Names.N_STATE];
      if (deleted) return;
      var gate = row[Names.N_GATE];
      if (gate === 'S' || gate === '*') {
        if (row[Names.N_BOW] === '?') return;
        startTime = row[Names.N_TIME];
      }
    });
    this.startTime = startTime;

    const header = "Event: " + this.props.defaultValue.EventNum + " " + this.props.defaultValue[Names.N_EVENT_NAME] + ", Bow " + this.state.bow;
    return (
      <div style={{ backgroundColor: 'green', padding: 4, margin: 20, marginTop: 5, marginBottom: 5 }}>
        <div style={{ backgroundColor: '#ffffff' }}>
          <div style={{ width: '100%', display: 'inline' }}>
            <div style={{
              fontWeight: 'bold',
              fontSize: '1.2em',
              padding: 5,
              textAlign: 'center',
              display: 'table-cell',
              verticalAlign: 'middle'
            }}>{header}</div>
            <div style={{ float: 'right', display: 'inline' }}>{actions[0]}{actions[1]}</div>
          </div>

          <Divider style={{ marginTop: 8 }}/>
          <div style={{ marginLeft: 30, marginRight:30, marginTop: 10, marginBottom: 10, border: 2 }}>
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow style={styles.headerRow}>
                  <TableHeaderColumn style={styles.tableSuperHeader}>Waypoint</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tableSuperHeader}>Bow</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tableSuperHeader}>Timestamp</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tableSuperHeader}>Delta Time</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tableSuperHeader}>Code</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tableSuperHeader}>Ignore</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody stripedRows={true} displayRowCheckbox={false}>
                {lapdata.map((row) => {
                  const deleted = Names.STATE_DELETED === row[Names.N_STATE];
                  let gate = row[Names.N_GATE];
                  const bow = row[Names.N_BOW];
                  if (!this.state.showUnassigned && bow === '?') return null;

                  const editBow = 'R' !== gate;
                  const editRef = 'R' === gate;
                  const editPen = 'Pen' === gate;

                  let code = '';
                  const uuid = row[Names.N_UUID];
                  const editElapsed = !(gate === 'S' || gate === '*' || editRef);
                  let elapsed = !editElapsed ? '' : TimeUtil.timeDiff(startTime, row[Names.N_TIME]);
                  if (editPen) {
                    elapsed = row[Names.N_PENALTY_TIME] ? row[Names.N_PENALTY_TIME] : '';
                    code = row[Names.N_PENALTY_CODES];
                  }
                  if (editRef) {
                    code = row[Names.N_PENALTY_CODES];
                  }
                  const editTime = !editPen && !editRef;
                  elapsed = elapsed.replace(/^(00:)*/, '');
                  if (bow === '?') elapsed = '';
                  gate = gate.replace(/^G_/, '').replace(/^S$/, 'Start').replace(/^F$/, 'Finish').replace(/^Pen$/, 'Penalty');
                  //const editTime = this.waypoints.indexOf(gate) >= 0;
                  return <TableRow key={uuid} style={styles.tableRow} selectable={false} displayBorder={false}>
                    <TableRowColumn style={styles.tableRow}>
                      {gate}
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableRow}>
                      <CellEditor name={uuid} editable={!deleted && editBow} defaultValue={bow}
                        prompt='Enter new Bow Number (* for Sprint Start)'
                        regex='^[0-9A-Za-z]+$|^\*$|^\?$'
                        onChange={this.onBowChange} />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableRow}>
                      <CellEditor name={uuid} editable={!deleted && editTime} defaultValue={row[Names.N_TIME]}
                        prompt='Enter timestamp HH:MM:SS.SSS'
                        regex='^[0-9][0-9]:[0-9][0-9]:[0-9][0-9][.][0-9][0-9][0-9]$'
                        onChange={this.onTimeChange} />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableRow}>
                      <CellEditor name={uuid} editable={!deleted && editElapsed} defaultValue={elapsed}
                        prompt='Enter delta time MM:SS.SSS'
                        regex='^([0-9]??[0-9]:)??([0-9]??([0-9]:)??[0-9])??[0-9]([.][0-9]??[0-9]??[0-9]??)??$'
                        onChange={this.onElapsedChange} />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableRow}>
                      <CellEditor name={uuid} editable={!deleted && editPen} defaultValue={code}
                        prompt='Enter new Code'
                        regex='^.+$'
                        onChange={this.onCodeChange} />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableRow}>
                      <Checkbox name={uuid} onCheck={this.onDeletedChange} defaultChecked={deleted} />
                    </TableRowColumn>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </div>
          <Divider />
          <div style={{ width: '100%', display: 'inline' }}>
            <div style={{ display: 'inline' }}>{actions[2]}</div>
            <Checkbox style={{float: "left", width: '25%', marginTop:6}} name="showUnassigned" 
                 label="Show unassigned timestamps" onCheck={this.onUnassignedChange} defaultChecked={false} />
            <div style={{ float: 'right', display: 'inline' }}>{actions[0]}{actions[1]}</div>
          </div>
        </div>
      </div>
    );

  }

  componentWillUnmount() {
    if (this.dataRef) {
      this.dataRef.off();
      this.dataRef = null;
    }
    if (this.dataRef2) {
      this.dataRef2.off();
      this.dataRef2 = null;
    }
  }
};

