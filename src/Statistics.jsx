import React from 'react';
import PropTypes from 'prop-types';
import toPairs from 'lodash/toPairs';
import Link from 'react-router-dom/Link';

import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Colors from './colors';
import DataFile from './data_file';

export default class Statistics extends React.Component {
  constructor() {
    super();
    this.state = { statistics: null, message: 'Loading statistics...' };
  }
  componentDidMount() {
    this.context.setTitle();
    window.fetch('assets/statistics.json').then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    }).then((stat) => {
      this.setState({ statistics: stat });
    }).catch((err) => {
      this.setState({ message: err.toString() });
    });
  }
  render() {
    if (!this.state.statistics) {
      return <div>{this.state.message}</div>;
    }
    const rowStyle = {
      height: '38px',
    };
    const cellStyle = {
      height: '38px',
      paddingLeft: '4px',
      paddingRight: '4px',
    };
    const buttonLabelStyle = {
      textTransform: 'none',
    };
    const totalCount = DataFile.all.map(df => this.state.statistics.count[df.name]).reduce((acc, current) => acc + current);
    const sortedAuthor = toPairs(this.state.statistics.author).sort((x, y) => {
      const countDiff = y[1] - x[1];
      if (countDiff !== 0) return countDiff;
      return x[0].localeCompare(y[0]);
    });
    return (
      <div>
        <h2>Count (total={totalCount})</h2>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow style={rowStyle}>
              <TableHeaderColumn style={cellStyle}>Character</TableHeaderColumn>
              <TableHeaderColumn style={cellStyle}>Series</TableHeaderColumn>
              <TableHeaderColumn style={cellStyle}>Name (ja)</TableHeaderColumn>
              <TableHeaderColumn style={cellStyle}>Name (en)</TableHeaderColumn>
              <TableHeaderColumn style={cellStyle}>Count</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows>
            {DataFile.all.map(df => (<TableRow style={rowStyle}>
              <TableRowColumn style={cellStyle}>
                <Link to={`/chara/${df.name}`} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="statCount" data-ga-event-label={df.name}>
                  <FlatButton label={df.name} icon={<Avatar src={df.picUrl} size={30} />} labelStyle={buttonLabelStyle} />
                </Link>
              </TableRowColumn>
              <TableRowColumn style={cellStyle}>{df.seriesSymbol}</TableRowColumn>
              <TableRowColumn style={cellStyle}>{df.nameJa}</TableRowColumn>
              <TableRowColumn style={cellStyle}>{df.nameEn}</TableRowColumn>
              <TableRowColumn style={cellStyle}>{this.state.statistics.count[df.name]}</TableRowColumn>
            </TableRow>))}
          </TableBody>
        </Table>
        <h2>Color (requires wide screen to display correctly)</h2>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow style={rowStyle}>
              <TableHeaderColumn style={cellStyle}>Character</TableHeaderColumn>
              {Colors.all.map(c => <TableHeaderColumn style={cellStyle}>{c.name}</TableHeaderColumn>)}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows>
            {DataFile.all.map(df => (<TableRow style={rowStyle}>
              <TableRowColumn style={cellStyle}>
                <Link to={`/chara/${df.name}`} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action="statColor" data-ga-event-label={df.name}>
                  <FlatButton label={df.name} icon={<Avatar src={df.picUrl} size={30} />} labelStyle={buttonLabelStyle} />
                </Link>
              </TableRowColumn>
              {Colors.all.map(c => <TableRowColumn style={cellStyle}>{this.state.statistics.color[df.name][c.id]}</TableRowColumn>)}
            </TableRow>))}
          </TableBody>
        </Table>
        <h2>Author ({sortedAuthor.length} authors)</h2>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow style={rowStyle}>
              <TableHeaderColumn style={cellStyle}>Name</TableHeaderColumn>
              <TableHeaderColumn style={cellStyle}>Count</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows>
            {sortedAuthor.map(a => (<TableRow style={rowStyle}>
              <TableRowColumn style={cellStyle}>{a[0]}</TableRowColumn>
              <TableRowColumn style={cellStyle}>{a[1]}</TableRowColumn>
            </TableRow>))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
Statistics.contextTypes = {
  setTitle: PropTypes.func,
};
