import PressButtonText from '../objects/PressButtonText'
import style from '../style'

const SUBTITLE_STYLE = {
  ...style.font,
  fontSize: '16px',
}

export default class Title extends Phaser.State {
  init () {
    global.IDLE_DETECT.disable()
  }

  preload () {
    this.load.image('logo', 'assets/logo.png')
    this.load.image('bg_title', 'assets/bg_title.png')
  }

  create () {
    const {game} = this
    // this.add.sprite(0, 0, 'bg_base')
    this.add.sprite(0, 0, 'bg_title')

    this.add.sprite(0, 0, 'logo')

    const subtitle = this.add.text(game.world.centerX - 10, 400, 'LOST IN THE NEW MEDIA', SUBTITLE_STYLE)
    subtitle.anchor.set(0.5, 0)

    const pressButton = new PressButtonText(game, this, 'start')
    pressButton.onButtonPress.add(() => {
      this.state.start('Intro')
    })
    this.pressButton = pressButton

    game.input.keyboard.addCallbacks(this, undefined, undefined, this.onKeyPress)
  }

  onKeyPress (char, event) {
    switch (char) {
      // XXX: debugging
      case 'g':
        this.state.start('MainGame')
        break
      case 'c':
        this.state.start('Camera')
        break
    }
  }

  shutdown () {
    global.IDLE_DETECT.enable()
  }

}

