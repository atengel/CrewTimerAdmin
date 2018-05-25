/**
 * Created by glenne on 6/10/2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import EventTable from './EventTable';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MeasureText from './MeasureText';
import * as Names from './Names';
import LoadingIndicator from './LoadingIndicator';
import fire from './fire';

// import ResultsCalculator from './ResultsCalculator';

const TimeTemplate = '00:00:00.000';
const BowTemplate = '000';
const PlaceTemplate = 'Place';

// var lapdata = require('./lapdata-xxcyokph.json');
// var rawData = require('./regatta-cvxe.hxcx.json');

const styles = {
  tableRow: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    fontSize: '1em',
    fontWeight: 'normal',
    height: '30px',
    paddingLeft: '0.5em',
    paddingRight: '0.5em'
  }
};

class EventResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diminit: false,
      popupMaxHeight: 600,
      crewFilter: null,
      eventFilter: null,
      dayFilter: "All Days",
      renderPage: false,
      dimensions: {},
      regatta: null,
      regattaData: null
    };

    // bind some methods to this for event handlers
    this._onDayFilterChange = this._onDayFilterChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onEventFilterChange = this._onEventFilterChange.bind(this);
    this._prepareForRender = this._prepareForRender.bind(this);
    this._scrollToEvent = this._scrollToEvent.bind(this);
    // this.firebaseUpdater = new FirebaseResultsUpdater('xxcyokph');
  }

  _prepareForRender() {
    // create alpha sorted list of crew names
    var crews = {};
    let dayList = this.state.regattaData.regattaInfo[Names.N_DAY_LIST];
    if (!dayList) dayList=[];

    // this.rawResults = ResultsCalculator.getResults(rawData).results;

    var rawResults = this.state.regattaData.results;

    if (rawResults == null) {
      this.filteredEventList = null;
      this.filteredDataList = null;
      return;
    }

    //   rawResults = ResultsCalculator.getResults(this.props.regattaData, lapdata['xxcyokph']).getArgMap(Names.N_REGATTA_INFO).getList(Names.N_RESULTS);

    // generate list of crew names
    rawResults.forEach(function (row) {
      if (!row) return;
      row.entries.forEach(function (entry) {
        if (!entry) return;

        // strip trailing ' A', ' B' boat class
        let crew = entry.Crew.replace(/ [A-Za-z]$/, "");
        crews[crew] = true;
      });
    });

    this._crewList = Object.keys(crews).sort();

    // Filter the results list
    var { crewFilter, eventFilter, dayFilter } = this.state;
    if (dayFilter === 'All Days' || dayList.length<=1) dayFilter=null;
    if (!crewFilter && !eventFilter && !dayFilter) {
      // no filters
      this.filteredEventList = this.filteredDataList = rawResults;
    } else {
      var results = [];
      var singleEvent = null;
      rawResults.forEach(function (row, i) {
        if (dayFilter && row.Day !== dayFilter) {
          return;
        }
        if (eventFilter && row.Event === eventFilter) {
          singleEvent = row;
        }
        var entries = [];
        if (crewFilter) {
          const filterByLower = crewFilter.toLowerCase();
          row.entries.forEach(function (entry, i) {
            let crew = entry.Crew.toLowerCase().replace(/ [A-Za-z]$/, "");
            if (crew === filterByLower) {
              entries.push(entry);
            }
          });
          if (entries.length > 0) {
            results.push(row);
          }
        } else {
          results.push(row);
        }
      });
      this.filteredEventList = results;
      this.filteredDataList = singleEvent ? [singleEvent] : results;
    }
  }

  _onDayFilterChange(event, index, value) {
    this.setState({
      dayFilter: value
    });
  }

  _onFilterChange(event, index, value) {
    this.setState({
      crewFilter: value,
      eventFilter: null
    });
  }

  _onEventFilterChange(event, index, value) {
    this.setState({
      eventFilter: value
    });
  }

  _rxFirebaseResults = (snapshot) => {
    const regattaData = snapshot.val();
    if (this.props.onRegattaUpdated) {
      this.props.onRegattaUpdated(regattaData.regattaInfo);
    }
    /* Update React state when results change */
    this.setState({
      regattaData: regattaData,
      regatta: this.regatta
    });
  }

  _scrollToEvent(eventKey) {
    setTimeout(function () {
      const elem = ReactDOM.findDOMNode(this.refs[eventKey]);
      if (elem) {
        if (elem) {
          elem.scrollIntoView(false);
        }
      }
    }.bind(this), 100);

  }

  updateDimensions(dimensions) {
    this.setState({ diminit: true, dimensions: Object.assign({}, this.state.dimensions, dimensions) });
  }

  render() {
    if (!this.state.diminit) {
      return (
        <div>
          <MeasureText
            text={[PlaceTemplate, BowTemplate, TimeTemplate]}
            onMeasure={this.updateDimensions.bind(this)}
            textStyle={styles.tableRow}
          />
        </div>
      );
    }

    if (!this.state.regattaData) {
      return <LoadingIndicator />;
    }

    this._prepareForRender();
    if (!this.filteredDataList) {
      return <div>Regatta has not been configured with a lineup spreadsheet</div>
    }

    // show no rendering unti renderPage==true which means we have a size
    return (
      <div>
        {this._renderPage()}
      </div>
    );
  }

  _renderPage() {
    const tableWidth = window.innerWidth;
    if (this.kioskMode && !this.state.regattaData.regattaInfo.Finished) {
      this._scrollToEvent(this.state.regattaData[Names.N_LAST_UPDATED_EVENT]);
    }
    let tableNumber = 0;  // passed to EventTable for sequencing
    let dayList = this.state.regattaData.regattaInfo[Names.N_DAY_LIST];
    let showDayFilter = dayList && dayList.length>1;
    let pctWidth = showDayFilter ? '29%' : '40%';
    return (
      <div>
        {!this.kioskMode &&
          <div>
            {showDayFilter && <SelectField
              className="noprint"
              width={pctWidth}
              //floatingLabelText="Crew Filter"
              maxHeight={this.state.popupMaxHeight}
              value={this.state.dayFilter}
              onChange={this._onDayFilterChange}
              dropDownMenuProps={{
                autoWidth: true,
                menuStyle: { overflowX: 'hidden' }
              }}
              style={{
                width: pctWidth,
                fontSize: '1em',
                marginLeft: '2%',
                marginRight: '2%'
              }}
            >
             <MenuItem value="All Days" primaryText="All Days" />
              {dayList.map(function (row, i) {
                const key = row;
                return <MenuItem key={key} value={key} primaryText={key} />;
              }, this)}
            </SelectField>}
            <SelectField
              className="noprint"
              width={pctWidth}
              //floatingLabelText="Crew Filter"
              maxHeight={this.state.popupMaxHeight}
              value={this.state.crewFilter}
              onChange={this._onFilterChange}
              dropDownMenuProps={{
                autoWidth: true,
                menuStyle: { overflowX: 'hidden' }
              }}
              style={{
                width: pctWidth,
                fontSize: '1em',
                marginLeft: '2%',
                marginRight: '2%'
              }}
            >
              <MenuItem value={null} primaryText="All Crews" />
              {this._crewList.map(function (row, i) {
                const key = row;
                return <MenuItem key={key} value={key} primaryText={key} />;
              }, this)}
            </SelectField>
            <SelectField
              className="noprint"
              width={pctWidth}
              //floatingLabelText="Event Filter"
              maxHeight={this.state.popupMaxHeight}
              value={this.state.eventFilter}
              onChange={this._onEventFilterChange}
              dropDownMenuProps={{
                autoWidth: true,
                menuStyle: { overflowX: 'hidden' }
              }}
              style={{
                width: pctWidth,
                fontSize: '1em',
                marginLeft: '2%',
                marginRight: '2%',
                textOverflow: 'ellipsis'
              }}
            >
              <MenuItem value={null} primaryText="All Events" />
              {this.filteredEventList.map(function (row, i) {
                const key = row.Event;
                return <MenuItem key={key} value={key} primaryText={key} />;
              }, this)}
            </SelectField>
            <br />
          </div>
        }
        {this.filteredDataList.length === 0 && <div>No Entries match filter</div>}
        {this.filteredDataList.map(function (row, i) {
          const key = row[Names.N_EVENT_KEY];
          //console.log('tableWidth=',tableWidth);
          return (
            <div key={key}
              ref={key}>
              <EventTable
                edit={this.props.edit}
                key={key}
                data={row}
                regatta={this.state.regatta}
                regattaData={this.state.regattaData.regattaInfo}
                width={tableWidth}
                tableWidth={tableWidth}
                dimensions={this.state.dimensions}
                location={this.props.location}
                tableNumber={tableNumber++}
              />
              <div style={{ height: 30 }} />
            </div>
          );
        }, this)}
      </div>
    );
  }

  componentWillMount() {
    let fields = this.props.location.pathname.split('/');
    let regatta = null;
    if (fields.length >= 3) {
      regatta = fields[2];
      this.kioskMode = (fields.length >= 4 && 'kiosk' === fields[3]);
      regatta = regatta.replace('.', '');
      if (regatta === this.regatta) return;
      if (this.resultsRef && regatta !== this.regatta) {
        this.resultsRef.off('value', this._rxFirebaseResults, this);
        this.resultsRef = null;
      }
      if (!this.resultsRef) {
        this.regatta = regatta;
        this.resultsRef = fire.database().ref('results/' + regatta);
        this.resultsRef.on('value', this._rxFirebaseResults, this);
      }
    }
  }

  componentWillUnmount() {
    if (this.resultsRef) {
      this.resultsRef.off('value', this._rxFirebaseResults, this);
      this.resultsRef = null;
      this.regatta = null;
    }
  }
}

export default EventResults;
