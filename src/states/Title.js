import PressButtonText from '../objects/PressButtonText'
import style from '../style'

export default class Title extends Phaser.State {
  init () {
  }

  preload () {
    this.load.image('logo', 'assets/logo.png')
  }

  create () {
    const {game} = this
    this.add.sprite(0, 0, 'bg_base')

    const logo = this.add.sprite(game.world.centerX, game.world.centerY - 40, 'logo')
    logo.anchor.set(0.5)

    const subtitle = this.add.text(game.world.centerX, game.world.centerY + 100, 'LOST IN THE NEW MEDIA', style.font)
    subtitle.anchor.set(0.5, 0)

    const pressButton = new PressButtonText(game, this, 'start')
    pressButton.onButtonPress.add(() => {
      this.state.start('Intro')
    })
    this.pressButton = pressButton
  }

}

