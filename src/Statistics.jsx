import React from 'react';
import PropTypes from 'prop-types';
import toPairs from 'lodash/toPairs';
import RouterLink from 'react-router-dom/Link';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import clone from 'lodash/clone';

import Colors from './colors';
import DataFile from './data_file';

function sum(arr) {
  return arr.reduce((acc, current) => acc + current);
}

function renderCell(content, propsForCell = {}) {
  const { style } = propsForCell;
  const cellStyle = clone(style) || {};
  cellStyle.padding = 4;
  return (
    <TableCell {...propsForCell} style={cellStyle}>
      {content}
    </TableCell>);
}

class Statistics extends React.Component {
  constructor() {
    super();
    this.state = { statistics: null, error: null, tabIndex: 0 };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentDidMount() {
    const { setTitle } = this.context;
    setTitle();
    window.fetch('assets/statistics.json').then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    }).then((stat) => {
      this.setState({ statistics: stat });
    }).catch((err) => {
      this.setState({ error: err });
    });
  }

  handleTabChange(event, value) {
    this.setState({ tabIndex: value });
  }

  renderAvatarCell(df, gaEventName) {
    const { classes } = this.props;
    return renderCell(
      <Button size="small" component={RouterLink} to={`/chara/${df.name}`} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action={gaEventName} data-ga-event-label={df.name} className={classes.charaButton}>
        {df.picUrl ? <Avatar src={df.picUrl} className={classes.avatar} /> : (
          <Avatar className={classes.avatar}>
            {df.seriesSymbol}
          </Avatar>
        )}
        {df.name}
      </Button>,
    );
  }

  renderCount() {
    const { classes } = this.props;
    const { statistics } = this.state;
    const sortedNameCountPairs = toPairs(statistics.count).sort((x, y) => {
      const countDiff = y[1] - x[1];
      if (countDiff !== 0) return countDiff;
      return x[0].localeCompare(y[0]);
    });
    const totalCount = sum(sortedNameCountPairs.map(p => p[1]));
    return (
      <React.Fragment>
        <p>
          {`${DataFile.all.length} characters, ${totalCount} photos`}
        </p>
        <Paper className={classes.tableWraper}>
          <Table>
            <TableHead>
              <TableRow>
                {renderCell('Character')}
                {renderCell('Count')}
                {renderCell('Series')}
                {renderCell('Name (ja)')}
                {renderCell('Name (en)')}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedNameCountPairs.map((p) => {
                const df = DataFile.findByName(p[0]);
                return (
                  <TableRow hover>
                    {this.renderAvatarCell(df, 'statCount')}
                    {renderCell(statistics.count[df.name], { numeric: true })}
                    {renderCell(df.seriesSymbol)}
                    {renderCell(df.nameJa)}
                    {renderCell(df.nameEn)}
                  </TableRow>);
              })}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>);
  }

  renderColor() {
    const { classes } = this.props;
    const { statistics } = this.state;
    const totalCount = sum(DataFile.all.map(df => sum(Colors.all.map(c => statistics.color[df.name][c.id]))));
    return (
      <React.Fragment>
        <p>
          {`${totalCount} colors`}
        </p>
        <Paper className={classes.tableWraper}>
          <Table>
            <TableHead>
              <TableRow>
                {renderCell('Character')}
                {Colors.all.map(c => renderCell(c.name, { style: { color: 'black', backgroundColor: c.light } }))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DataFile.all.map(df => (
                <TableRow hover>
                  {this.renderAvatarCell(df, 'statColor')}
                  {Colors.all.map(c => renderCell(statistics.color[df.name][c.id], { numeric: true, style: { color: 'black', backgroundColor: c.light } }))}
                </TableRow>))}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>);
  }

  renderAuthor() {
    const { classes } = this.props;
    const { statistics } = this.state;
    const sortedAuthor = toPairs(statistics.author).sort((x, y) => {
      const countDiff = y[1] - x[1];
      if (countDiff !== 0) return countDiff;
      return x[0].localeCompare(y[0]);
    });
    return (
      <React.Fragment>
        <p>
          {`${sortedAuthor.length} authors`}
        </p>
        <Paper className={classes.tableWraper}>
          <Table>
            <TableHead>
              <TableRow>
                {renderCell('Name')}
                {renderCell('Count')}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAuthor.map(a => (
                <TableRow hover>
                  {renderCell(a[0])}
                  {renderCell(a[1], { numeric: true })}
                </TableRow>))}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>);
  }

  render() {
    const { statistics, error, tabIndex } = this.state;
    if (error) throw error;
    return (
      <React.Fragment>
        <Tabs value={tabIndex} indicatorColor="primary" onChange={this.handleTabChange}>
          <Tab label="Count" />
          <Tab label="Colors" />
          <Tab label="Authors" />
        </Tabs>
        {statistics ? (
          (tabIndex === 0 && this.renderCount())
          || (tabIndex === 1 && this.renderColor())
          || (tabIndex === 2 && this.renderAuthor())
        ) : (
          <p>
            <CircularProgress />
            Loading statistics...
          </p>
        )}
      </React.Fragment>
    );
  }
}
Statistics.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
};
Statistics.contextTypes = {
  setTitle: PropTypes.func,
};

export default withStyles({
  avatar: {
    width: 24,
    height: 24,
  },
  charaButton: {
    textTransform: 'none',
  },
  tableWraper: {
    overflowX: 'auto',
  },
})(Statistics);
