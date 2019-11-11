import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import purple from '@material-ui/core/colors/purple';
import brown from '@material-ui/core/colors/brown';
import grey from '@material-ui/core/colors/grey';
import amber from '@material-ui/core/colors/amber';
import common from '@material-ui/core/colors/common';

export class ColorData {
  /**
   * @param {string} id
   * @param {string} name
   * @param {string} value
   * @param {string} dark
   * @param {string} light
   */
  constructor(id, name, value, dark, light) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.dark = dark;
    this.light = light;
  }
}

const RepresentiveColors = {};

RepresentiveColors.all = [
  RepresentiveColors.Red = new ColorData('red', 'Red', red[800], red[500], red[200]),
  RepresentiveColors.Pink = new ColorData('pink', 'Pink', pink[300], pink[500], pink[200]),
  RepresentiveColors.Orange = new ColorData('orange', 'Orange', orange[500], orange[500], orange[200]),
  RepresentiveColors.Yellow = new ColorData('yellow', 'Yellow', yellow[500], yellow[500], yellow[200]),
  RepresentiveColors.Green = new ColorData('green', 'Green', green[500], green[500], green[200]),
  RepresentiveColors.Blue = new ColorData('blue', 'Blue', blue[500], blue[500], blue[200]),
  RepresentiveColors.Purple = new ColorData('purple', 'Purple', purple[500], purple[500], purple[200]),
  RepresentiveColors.Brown = new ColorData('brown', 'Brown', brown[500], brown[500], brown[200]),
  RepresentiveColors.Black = new ColorData('black', 'Black', common.black, grey[800], grey[700]),
  RepresentiveColors.Grey = new ColorData('grey', 'Grey', grey[700], grey[600], grey[500]),
  RepresentiveColors.White = new ColorData('white', 'White', common.white, grey[200], grey[100]),
  RepresentiveColors.Gold = new ColorData('gold', 'Gold', amber[300], amber[500], amber[200]),
  RepresentiveColors.Silver = new ColorData('silver', 'Silver', grey[400], grey[400], grey[300]),
];

const map = {};
RepresentiveColors.all.forEach((c) => {
  map[c.id] = c;
});
RepresentiveColors.findById = (id) => map[id];

export default RepresentiveColors;
