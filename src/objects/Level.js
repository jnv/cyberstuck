import style from '../style'
import config from '../config'

export default class Level extends Phaser.Group {
  static preload (game, levelNumber = 1) {
    game.load.image('bg_level', `assets/levels/${levelNumber}.png`)
    game.load.image('bg_frame', 'assets/frame.png')
  }

  constructor (game, parent, levelNumber = 1) {
    super(game)
    this.create(0, 0, 'bg_base')
    this.create(0, 0, 'bg_level')
    this.frame = this.addFrame(game)
    parent.add.existing(this)
  }

  addFrame (game) {
    const img = game.cache.getImage('bg_frame')
    const height = img.height
    const y = game.height - height
    return this.create(0, y, 'bg_frame')
  }
}
