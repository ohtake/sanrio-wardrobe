import React from 'react';
import PropTypes from 'prop-types';
import toPairs from 'lodash/toPairs';
import RouterLink from 'react-router-dom/Link';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Colors from './colors';
import DataFile from './data_file';

class Statistics extends React.Component {
  constructor() {
    super();
    this.state = { statistics: null, message: 'Loading statistics...' };
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
      this.setState({ message: err.toString() });
    });
  }

  renderAvatarCell(df, gaEventName) {
    const { classes } = this.props;
    return (
      <TableCell>
        <Button component={RouterLink} to={`/chara/${df.name}`} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action={gaEventName} data-ga-event-label={df.name} className={classes.charaButton}>
          {df.picUrl ? <Avatar src={df.picUrl} className={classes.avatar} /> : (
            <Avatar className={classes.avatar}>
              {df.seriesSymbol}
            </Avatar>
          )}
          {df.name}
        </Button>
      </TableCell>);
  }

  renderCount() {
    const { statistics } = this.state;
    const totalCount = DataFile.all.map(df => statistics.count[df.name]).reduce((acc, current) => acc + current);
    return (
      <React.Fragment>
        <h2>
          Count (total=
          {totalCount}
          )
        </h2>
        <Paper>
          <Table selectable={false}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Character
                </TableCell>
                <TableCell>
                  Series
                </TableCell>
                <TableCell>
                  Name (ja)
                </TableCell>
                <TableCell>
                  Name (en)
                </TableCell>
                <TableCell>
                  Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DataFile.all.map(df => (
                <TableRow hover>
                  {this.renderAvatarCell(df, 'statCount')}
                  <TableCell>
                    {df.seriesSymbol}
                  </TableCell>
                  <TableCell>
                    {df.nameJa}
                  </TableCell>
                  <TableCell>
                    {df.nameEn}
                  </TableCell>
                  <TableCell numeric>
                    {statistics.count[df.name]}
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>);
  }

  renderColor() {
    const { statistics } = this.state;
    return (
      <React.Fragment>
        <h2>
          Color (requires wide screen to display correctly)
        </h2>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Character
                </TableCell>
                {Colors.all.map(c => (
                  <TableCell>
                    {c.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DataFile.all.map(df => (
                <TableRow hover>
                  {this.renderAvatarCell(df, 'statColor')}
                  {Colors.all.map(c => (
                    <TableCell numeric>
                      {statistics.color[df.name][c.id]}
                    </TableCell>
                  ))}
                </TableRow>))}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>);
  }

  renderAuthor() {
    const { statistics } = this.state;
    const sortedAuthor = toPairs(statistics.author).sort((x, y) => {
      const countDiff = y[1] - x[1];
      if (countDiff !== 0) return countDiff;
      return x[0].localeCompare(y[0]);
    });
    return (
      <React.Fragment>
        <h2>
          Author (
          {sortedAuthor.length}
          {' '}
          authors)
        </h2>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAuthor.map(a => (
                <TableRow hover>
                  <TableCell>
                    {a[0]}
                  </TableCell>
                  <TableCell numeric>
                    {a[1]}
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>);
  }

  render() {
    const { statistics, message } = this.state;
    if (!statistics) {
      return (
        <div>
          {message}
        </div>
      );
    }
    return (
      <React.Fragment>
        {this.renderCount()}
        {this.renderColor()}
        {this.renderAuthor()}
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
})(Statistics);
