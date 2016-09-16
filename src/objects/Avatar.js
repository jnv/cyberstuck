import {spriteKey} from '../lib/avatar'

const FRAME_RATE = 4
export default class Avatar extends Phaser.Sprite {

  constructor (parent, x, y, id, autoPlay = true) {
    super(parent.game, x, y, spriteKey(id))

    this.animations.add('default', null, FRAME_RATE)
    if (autoPlay) {
      this.animate()
    }

    parent.add.existing(this)
  }

  animate (repeat = true, frameRate) {
    this.animations.play('default', frameRate, repeat)
  }
}
