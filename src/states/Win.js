const FONT_STYLE = {
  font: '20px PressStart2P',
  fill: '#fff',
}

export default class Win extends Phaser.State {
  init ({win}) {
    this.win = win || false
  }

  preload () {

  }

  create () {
    const {game} = this

    let textStr = 'THE WINNER IS YOU!'

    const finalText = this.add.text(game.world.centerX, game.world.centerY, textStr, FONT_STYLE)
    finalText.anchor.set(0.5)

    game.input.keyboard.onDownCallback = () => {
      window.location.reload(false)
    }
  }

  update () {

  }
}

