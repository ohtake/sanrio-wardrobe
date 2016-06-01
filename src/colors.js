import * as Colors from 'material-ui/styles/colors.js';

export class ColorData {
  constructor(id, name, value, standard, light) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.standard = standard;
    this.light = light;
  }
}

const RepresentiveColors = {};

RepresentiveColors.all = [
  RepresentiveColors.Red = new ColorData('red', 'Red', Colors.red800, Colors.red500, Colors.red200),
  RepresentiveColors.Pink = new ColorData('pink', 'Pink', Colors.pink300, Colors.pink500, Colors.pink200),
  RepresentiveColors.Orange = new ColorData('orange', 'Orange', Colors.orange500, Colors.orange500, Colors.orange200),
  RepresentiveColors.Yellow = new ColorData('yellow', 'Yellow', Colors.yellow500, Colors.yellow500, Colors.yellow200),
  RepresentiveColors.Green = new ColorData('green', 'Green', Colors.green500, Colors.green500, Colors.green200),
  RepresentiveColors.Blue = new ColorData('blue', 'Blue', Colors.blue500, Colors.blue500, Colors.blue200),
  RepresentiveColors.Purple = new ColorData('purple', 'Purple', Colors.purple500, Colors.purple500, Colors.purple200),
  RepresentiveColors.Brown = new ColorData('brown', 'Brown', Colors.brown500, Colors.brown500, Colors.brown200),
  RepresentiveColors.Black = new ColorData('black', 'Black', Colors.black, Colors.grey500, Colors.grey200),
  RepresentiveColors.Grey = new ColorData('grey', 'Grey', Colors.grey700, Colors.grey500, Colors.grey200),
  RepresentiveColors.White = new ColorData('white', 'White', Colors.white, Colors.grey500, Colors.grey200),
  RepresentiveColors.Gold = new ColorData('gold', 'Gold', Colors.amber300, Colors.amber500, Colors.amber200),
  RepresentiveColors.Silver = new ColorData('silver', 'Silver', Colors.grey400, Colors.grey500, Colors.grey200),
];

const map = {};
for (let i = 0; i < RepresentiveColors.all.length; i++) {
  const c = RepresentiveColors.all[i];
  map[c.id] = c;
}
RepresentiveColors.findById = (id) => map[id];

export default RepresentiveColors;