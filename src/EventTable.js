/**
 * Created by glenne on 6/10/2017.
 */
import React, { Component } from 'react';
import Util from './Util';
import LapEditor from './forms/LapEditor';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import Popover from 'material-ui/Popover';
import * as Names from './Names';

export const ClickableRow = (props) => {
  // Destructure props to keep the expected MUI TableRow props
  // while having access to the rowData prop
  const {rowData, ...restProps} = props;
  return (
    <TableRow
      {...restProps}
     // onMouseDown={()=> console.log('clicked', props.rowData)}
      >
      {props.children}
    </TableRow>
  )
};
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

const TimeTemplate = '00:00:00.000';
const BowTemplate = '000';
const PlaceTemplate = 'Place';

class EventTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      editActive : null
    };
  }

  handleRequestClose = (newConfig) => {
    this.setState({
      open: false,
    });
  };

  // https://github.com/mui-org/material-ui/issues/2819
  onRowClicked = (rowNum, column, event) => { 
    let { entries } = this.props.data;
    let entry = entries[rowNum];
     this.setState({ 
      open: true,
      anchorEl: event.target.parentElement,
      entryInfo : entry
    });
  }

  onRowClick = (row) => {
    //this.setState({ open: true });
    let { entries } = this.props.data;
    let rowNum = row[0];
    let entry = entries[rowNum];

        // This prevents ghost click.
    //event.preventDefault();

    console.log("row selected=",entry);
    this.setState({ 
      //open: true,
      // anchorEl: event.currentTarget,
      editActive : entry});
  };

  render() {
    var { entries } = this.props.data;
    const finished =
      this.props.data[Names.N_FINISHED] ||
      this.props.data[Names.N_FINISHED] === 'true';
    const official =
      this.props.data[Names.N_OFFICIAL] ||
      this.props.data[Names.N_OFFICIAL] === 'true'; 
    const provisionalTimes = !finished && !official;
    const officialTimes = !provisionalTimes;
    let includeTweet = this.props.location.pathname.indexOf('tweet') > 0 && officialTimes;

    let tableMargin = Math.trunc(this.props.tableWidth * .02);
    if (tableMargin <= 12) tableMargin=0;
    const tableWidth = this.props.tableWidth - tableMargin*2;
    const omitCols = tableWidth < 512 ? 3 : tableWidth < 800 ? 2 : tableWidth < 1024 ? 1 : 0;
    const omitStroke = omitCols >= 1;
    const omitStart = omitCols >= 2;
    const omitRaw = omitCols >= 3;
    const editCols = this.props.edit ? 3 : 0;

    const timeWidth = this.props.dimensions[TimeTemplate].width;
    var widthAvail =
      tableWidth -
      (omitStart ? 0 : timeWidth) -
      (omitRaw ? 0 : timeWidth) -
      2 * timeWidth -
      this.props.dimensions[PlaceTemplate].width -
      this.props.dimensions[BowTemplate].width;
    const strokeWidth = omitStroke ? 0 : Math.trunc(widthAvail*0.3);
    const crewWidth = widthAvail - strokeWidth;
    
    // console.log( 'tableWidth=' + tableWidth + ' widthAvail=' + widthAvail  );
    var rowStyle = {
      Place: Object.assign({}, styles.tableRow, {
        width: this.props.dimensions[PlaceTemplate].width
      }),
      Crew: Object.assign({}, styles.tableRow, {
        width: crewWidth
      }),
      Bow: Object.assign({}, styles.tableRow, {
        width: this.props.dimensions[BowTemplate].width
      }),
      Stroke: Object.assign({}, styles.tableRow, { width: strokeWidth }),
      Start: Object.assign({}, styles.tableRow, {
        width: this.props.dimensions[TimeTemplate].width
      }),
      RawTime: Object.assign({}, styles.tableRow, {
        width: this.props.dimensions[TimeTemplate].width
      }),
      Adjust: Object.assign({}, styles.tableRow, {
        width: this.props.dimensions[TimeTemplate].width
      }),
      Time: Object.assign({}, styles.tableRow, {
        width: this.props.dimensions[TimeTemplate].width
      })
    };

    if (omitStroke) rowStyle.Stroke['display'] = 'none';
    if (omitStart) rowStyle.Start['display'] = 'none';
    if (omitRaw) rowStyle.RawTime['display'] = 'none';
    
    const marginPx = ""+tableMargin+"px";

    // clone rowStyle and add fontWeight bold
    var headerStyle = {};
    Object.keys(rowStyle).forEach(item => {
      headerStyle[item] = Object.assign({}, rowStyle[item], {
        fontWeight: 'bold'
      });
    });

    let waypoints = Util.getResultWaypoints(this.props.regattaData);
    if (omitRaw) waypoints=[];

    let startTime = this.props.data.Start;
    
    return (
      <div style={{ pageBreakInside: this.props.tableNumber===0 ? 'auto' :'avoid', marginLeft: marginPx, marginRight: marginPx }}>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
        <LapEditor editable={true} 
                  regatta={this.props.regatta} 
                  regattaConfig={this.props.regattaData} 
                  defaultValue={this.state.entryInfo}
                  onRequestClose={this.handleRequestClose}/>
        </Popover>
        <Table style={{ tableLayout: 'auto' }} fixedHeader={false}
            onCellClick={this.props.edit ? this.onRowClicked : null}
            onRowSelection={this.props.edit ? this.onRowClick : null}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow style={styles.headerRow}>
              <TableHeaderColumn
                colSpan={waypoints.length+6-omitCols-editCols}
                style={styles.tableSuperHeader}
              >
                Event: {this.props.data.Event} {startTime}
              </TableHeaderColumn>
              {this.props.edit?<TableHeaderColumn
                colSpan={editCols}
                style={styles.tableSuperHeader}
              >
                <div style={{ color : 'red'}}>CLICK ANY ROW TO EDIT</div>
              </TableHeaderColumn>:null}
              <TableHeaderColumn
                colSpan="2"
                style={styles.tableSuperHeaderRight}
              >
                {provisionalTimes && <div>Provisional Times</div>}
                {officialTimes && <div>Official</div>}
              </TableHeaderColumn>
            </TableRow>
            <TableRow style={styles.headerRow}>
              <TableHeaderColumn style={headerStyle.Place}>
                Place
              </TableHeaderColumn>
              <TableHeaderColumn style={headerStyle.Crew}>
                Crew
              </TableHeaderColumn>
              <TableHeaderColumn style={headerStyle.Bow}>Bow</TableHeaderColumn>
              <TableHeaderColumn style={headerStyle.Stroke}>
                Stroke/Cox
              </TableHeaderColumn>
              <TableHeaderColumn style={headerStyle.Start}>
                Start
              </TableHeaderColumn>
              {waypoints.map((waypoint) => {
                return <TableHeaderColumn key={'col_'+waypoint} style={headerStyle.RawTime}>
                  {waypoint}
                </TableHeaderColumn>
              })}
              <TableHeaderColumn style={headerStyle.RawTime}>
                Raw Time
              </TableHeaderColumn>
              <TableHeaderColumn style={headerStyle.Adjust}>
                Adjust
              </TableHeaderColumn>
              <TableHeaderColumn style={headerStyle.Time}>
                Time
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody stripedRows={false} displayRowCheckbox={false}>
            {entries.map(function(row, i) {
              const crew = (omitStroke && row[Names.N_STROKE].length) > 0 ?
                row[Names.N_CREW] + ' (' + row[Names.N_STROKE] + ')'
                : row[Names.N_CREW];
              const key =
                row['Event No'] +
                '-' +
                row[Names.N_FLIGHT] +
                '-' +
                row[Names.N_BOW];
                const bgStyle = Object.assign({ background: i % 2 ? '#f0f0f0' : '#ffffff' }, styles.tableRow);
              return (
                <TableRow key={key} style={bgStyle}>
                  <TableRowColumn style={rowStyle.Place}>
                    {row[Names.N_PLACE]}
                  </TableRowColumn>
                  <TableRowColumn style={rowStyle.Crew}>
                    {crew}
                  </TableRowColumn>
                  <TableRowColumn style={rowStyle.Bow}>
                    {row[Names.N_BOW]}
                  </TableRowColumn>
                  <TableRowColumn style={rowStyle.Stroke}>
                    {row[Names.N_STROKE]}
                  </TableRowColumn>
                  <TableRowColumn style={rowStyle.Start}>
                    {row[Names.N_START_TIME]}
                  </TableRowColumn>
                  {waypoints.map((waypoint) => {
                    return <TableRowColumn key={waypoint} style={rowStyle.RawTime}>
                      {row['G_'+waypoint.trim()+'_time']}
                    </TableRowColumn>
                    })}
                  <TableRowColumn style={rowStyle.RawTime}>
                    {row[Names.N_RAW_TIME]}
                  </TableRowColumn>
                  <TableRowColumn style={rowStyle.Adjust}>
                    {row[Names.N_PENALTY_CODES]}
                  </TableRowColumn>
                  <TableRowColumn style={rowStyle.Time}>
                    {row[Names.N_ADJ_TIME]}
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {includeTweet ? <div>{this.props.data[Names.N_TWEET]}</div> : null}
      </div>
    );
  }
}

export default EventTable;
