const colors = {
  red: '#f00',
  white: '#fff',
}
const font = {
  font: '22px PressStart2P',
  fill: '#fff',
}

const fontTitle = {
  ...font,
  fill: colors.red,
}

const style = {
  colors,
  font,
  fontTitle,
  canvasBorder: 20,
  canvasWidth: 480 - 20, // game width
}

export default Object.freeze(style)
