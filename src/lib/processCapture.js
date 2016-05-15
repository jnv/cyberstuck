import RgbQuant from 'rgbquant'
import config from '../config'
import palette from '../palette.json'
import PIXI from 'pixi.js'

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

// 1. resize ImageData
// 2. quantize
// 3. compose

function scaleRatio (original, target) {
  const hRatio = target.width / original.width
  const vRatio = target.height / original.height
  return Math.min(hRatio, vRatio)
}

function centerShift (origDim, targetDim, ratio) {
  return (targetDim - origDim * ratio) / 2
}

function imageDataToCanvas (imageData) {
  const {width, height} = imageData
  const c = PIXI.CanvasPool.create('imageDataToCanvas', width, height)
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.putImageData(imageData, 0, 0)

  return c
}

function pixelsToCanvas (canvas, subpxArr) {
  const ctx = canvas.getContext('2d')
  const imgd = ctx.createImageData(canvas.width, canvas.height)
  imgd.data.set(subpxArr)
  ctx.putImageData(imgd, 0, 0)
}

function quantizeCanvas (canvas) {
  const data = Q.reduce(canvas)
  pixelsToCanvas(canvas, data)
}

export default function composeFrames (frames) {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')

  const {width: aW, height: aH} = avatar

  for (let i = frames.length - 1; i >= 0; i--) {
    const imgd = frames[i]
    const {width, height} = imgd
    const ratio = scaleRatio(imgd, avatar)
    const targetX = (i * aW) + centerShift(width, aW, ratio)
    const targetY = 0 + centerShift(height, aH, ratio)

    const imgC = imageDataToCanvas(imgd)
    ctx.drawImage(imgC, targetX, targetY, width * ratio, height * ratio)
    PIXI.CanvasPool.removeByCanvas(imgC)
    // document.body.appendChild(imgC)
  }

  quantizeCanvas(canvas)

  return canvas
}
