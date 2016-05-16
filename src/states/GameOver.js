const FONT_STYLE = {
  font: '20px PressStart2P',
  fill: '#fff',
}

export default class GameOver extends Phaser.State {
  init ({score}) {
  }

  preload () {

  }

  create () {
    const {game} = this

    let textStr = 'GAME OVER'

    const finalText = this.add.text(game.world.centerX, game.world.centerY, textStr, FONT_STYLE)
    finalText.anchor.set(0.5)

    game.input.keyboard.onDownCallback = () => {
      window.location.reload(false)
    }
  }

  update () {

  }
}

