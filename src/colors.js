import * as Colors from '@material-ui/core/colors';

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
  RepresentiveColors.Red = new ColorData('red', 'Red', Colors.red['800'], Colors.red['500'], Colors.red['200']),
  RepresentiveColors.Pink = new ColorData('pink', 'Pink', Colors.pink['300'], Colors.pink['500'], Colors.pink['200']),
  RepresentiveColors.Orange = new ColorData('orange', 'Orange', Colors.orange['500'], Colors.orange['500'], Colors.orange['200']),
  RepresentiveColors.Yellow = new ColorData('yellow', 'Yellow', Colors.yellow['500'], Colors.yellow['500'], Colors.yellow['200']),
  RepresentiveColors.Green = new ColorData('green', 'Green', Colors.green['500'], Colors.green['500'], Colors.green['200']),
  RepresentiveColors.Blue = new ColorData('blue', 'Blue', Colors.blue['500'], Colors.blue['500'], Colors.blue['200']),
  RepresentiveColors.Purple = new ColorData('purple', 'Purple', Colors.purple['500'], Colors.purple['500'], Colors.purple['200']),
  RepresentiveColors.Brown = new ColorData('brown', 'Brown', Colors.brown['500'], Colors.brown['500'], Colors.brown['200']),
  RepresentiveColors.Black = new ColorData('black', 'Black', Colors.common.black, Colors.grey['800'], Colors.grey['700']),
  RepresentiveColors.Grey = new ColorData('grey', 'Grey', Colors.grey['700'], Colors.grey['600'], Colors.grey['500']),
  RepresentiveColors.White = new ColorData('white', 'White', Colors.common.white, Colors.grey['200'], Colors.grey['100']),
  RepresentiveColors.Gold = new ColorData('gold', 'Gold', Colors.amber['300'], Colors.amber['500'], Colors.amber['200']),
  RepresentiveColors.Silver = new ColorData('silver', 'Silver', Colors.grey['400'], Colors.grey['400'], Colors.grey['300']),
];

const map = {};
RepresentiveColors.all.forEach((c) => {
  map[c.id] = c;
});
RepresentiveColors.findById = id => map[id];

export default RepresentiveColors;
