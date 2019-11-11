import React from 'react';
import PropTypes from 'prop-types';
import RouterLink from 'react-router-dom/Link';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import EditorShowChart from '@material-ui/icons/ShowChart';
import { withStyles } from '@material-ui/core/styles';

import curry from 'lodash/curry';

import JustifiedLayoutFull from './JustifiedLayoutFull';
import DataFile from './data_file';

class Home extends React.Component {
  constructor() {
    super();
    this.renderTileFeatured = curry(this.renderTile)('featured').bind(this);
    this.renderTileAll = curry(this.renderTile)('all').bind(this);
  }

  componentDidMount() {
    const { setTitle } = this.context;
    setTitle();
  }

  renderTile(gaEventAction, c) {
    const { classes } = this.props;
    const image = c.picUrl ? <img src={c.picUrl} alt="*" className={classes.tileImage} /> : (
      <Avatar className={classes.tileImage}>
        {c.seriesSymbol}
      </Avatar>
    );
    return (
      <RouterLink key={c.name} to={`/chara/${c.name}`} data-ga-on="click" data-ga-event-category="chara" data-ga-event-action={gaEventAction} data-ga-event-label={c.name}>
        {image}
        <div className={classes.symbol}>{c.seriesSymbol}</div>
        <div className={classes.titleOuter}>
          <div className={classes.titleInner}>{c.nameJa}</div>
          <div className={classes.titleInner}>{c.nameEn}</div>
        </div>
      </RouterLink>
    );
  }

  renderGallery(dataFiles, tileRenderer) {
    const { thumbnailSize } = this.context;
    return <JustifiedLayoutFull targetRowHeight={thumbnailSize} childObjects={dataFiles} mapperToElement={tileRenderer} />;
  }

  render() {
    const { classes } = this.props;
    const featured = [
      DataFile.ktKitty,
      DataFile.mmMelody,
      DataFile.tsKikiLala,
      DataFile.xoBadtzmaru,
      DataFile.cnCinnamon,
      DataFile.pnPurin,
    ];
    return (
      <React.Fragment>
        <div className={classes.forkMeContainer}>
          <a href="https://github.com/ohtake/sanrio-wardrobe">
            <img
              alt="Fork me on GitHub"
              src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
              data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            />
          </a>
        </div>
        <p>Unofficial listings of Sanrio character costumes</p>
        <Button component={RouterLink} to="/statistics" data-ga-on="click" data-ga-event-category="navigation" data-ga-event-action="homeTile" data-ga-event-label="statistics">
          <EditorShowChart />
          Statistics
        </Button>
        <h2>Featured characters</h2>
        {this.renderGallery(featured, this.renderTileFeatured)}
        <h2>All characters</h2>
        {this.renderGallery(DataFile.all, this.renderTileAll)}
        <h2>License</h2>
        <ul>
          <li>
            Sanrio characters are registered trademarks of
            {' '}
            <a href="https://www.sanrio.co.jp/">Sanrio Co., Ltd.</a>
          </li>
          <li>
            Each photo was taken by respective author
          </li>
          <li>
            This software is provided under
            {' '}
            <a href="https://opensource.org/licenses/MIT">MIT License</a>
          </li>
          <li>
            <a href="assets/licenses.txt">Attribution notices for third party software</a>
          </li>
        </ul>
        <h2>Documents and reports</h2>
        <ul>
          <li>
            <a href="assets/esdoc/index.html">ESDoc</a>
          </li>
          <li>
            <a href="coverage/lcov-report/index.html">LCOV code coverage</a>
          </li>
          <li>
            <a href="assets/sme.html">Source map explorer</a>
          </li>
        </ul>
      </React.Fragment>
    );
  }
}
Home.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
};
Home.contextTypes = {
  setTitle: PropTypes.func,
  thumbnailSize: PropTypes.number,
};

export default withStyles((theme) => ({
  symbol: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '0.2em',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
  },
  titleOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
  },
  titleInner: {
    margin: '0.2em',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  forkMeContainer: {
    float: 'right',
    position: 'relative',
    top: -theme.spacing.unit,
    right: -theme.spacing.unit,
  },
}))(Home);
