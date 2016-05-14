import RgbQuant from 'rgbquant'
import config from '../config'
import palette from '../palette.json'

const avatar = config.avatar
const CANVAS_WIDTH = avatar.width * avatar.frames
const CANVAS_HEIGHT = avatar.height

const QUANT_OPTS = {
  palette: palette,
  colors: palette.length,
  reIndex: true,
  dithKern: 'FloydSteinberg',
  dithDelta: 0.05,
  useCache: false, // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
  // boxSize: [64, 64],        // subregion dims (if method = 2)
  // boxPxls: 2,              // min-population threshold (if method = 2)
  // initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
  // minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
  // dithKern: null,          // dithering kernel name, see available kernels in docs below
  // dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
  // dithSerp: false,         // enable serpentine pattern dithering
  // colorDist: 'euclidean',  // method used to determine color distance, can also be 'manhattan'
}

const Q = new RgbQuant(QUANT_OPTS)

function putPixels (subpxArr, width, height, id) {
  var can = document.createElement('canvas')
  id && can.setAttribute('id', id)
  can.width = width
  can.height = height
  var ctx = can.getContext('2d')
  var imgd = ctx.createImageData(can.width,can.height)
  imgd.data.set(subpxArr)
  ctx.putImageData(imgd,0,0)
  document.body.appendChild(can)
}

function quantize (imageData) {
  const {width, height} = imageData
  const data = Q.reduce(imageData)
  putPixels(data, width, height)
}

export default function processCapture (frame) {
  return quantize(frame)
}

function composeFrames (frames) {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')

  const quantized = frames.map(quantize)

  /*for (let i = quantized.length - 1 i >= 0 i--) {
    const frame = quantized[i]
    const dx = i * avatar.width
  }*/

}
