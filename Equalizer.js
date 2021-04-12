/**
 * Equalizer module.
 * @author Gustav Forselius
 * @version 1.0
 */

/**
 *Class for EqualizerPedal.
 * @class EqualizerPedal
 */

export class EqualizerPedal {
  constructor (audioContext) {
    this.audioContext = audioContext
    this.eqCurve = this.audioContext.createBiquadFilter()
    this.eqCurve1 = this.audioContext.createBiquadFilter()
    this.eqCurve2 = this.audioContext.createBiquadFilter()
    this.eqCurve3 = this.audioContext.createBiquadFilter()
    this.eqCurve4 = this.audioContext.createBiquadFilter()
    this.eqCurve.type = 'peaking'
    this.eqCurve1.type = 'peaking'
    this.eqCurve2.type = 'peaking'
    this.eqCurve3.type = 'peaking'
    this.eqCurve4.type = 'peaking'
    this.eqCurve.frequency.value = 80
    this.eqCurve1.frequency.value = 140
    this.eqCurve2.frequency.value = 600
    this.eqCurve3.frequency.value = 1600
    this.eqCurve4.frequency.value = 2800
    this.eqCurve1.Q.value = 1
    this.on = false
  }

  /**
   * Sets up eq sliders listeners and functionality
   */
  equalizerSetup () {
    // slider sub
    this.eqSliderFunc('#eqslider', this.eqCurve)

    // slider 1 low
    this.eqSliderFunc('#eqslider1', this.eqCurve1)

    // slider 2 mids
    this.eqSliderFunc('#eqslider2', this.eqCurve2)

    // slider 3 highs
    this.eqSliderFunc('#eqslider3', this.eqCurve3)

    // slider 4 high highs
    this.eqSliderFunc('#eqslider4', this.eqCurve4)

    // Turn eq on
    document.querySelector('#eqon').onclick = event => {
      this.on = true
      this.eqCurve.gain.value = document.querySelector('#eqslider').value
      this.eqCurve1.gain.value = document.querySelector('#eqslider1').value
      this.eqCurve2.gain.value = document.querySelector('#eqslider2').value
      this.eqCurve3.gain.value = document.querySelector('#eqslider3').value
      this.eqCurve4.gain.value = document.querySelector('#eqslider4').value
      document.querySelector('#eqonoff').className = 'circlerevactive'
    }

    // Turn eq off
    document.querySelector('#eqoff').onclick = event => {
      this.on = false
      document.querySelector('#eqonoff').className = 'circlerev'
      this.eqCurve.gain.value = 0
      this.eqCurve1.gain.value = 0
      this.eqCurve2.gain.value = 0
      this.eqCurve3.gain.value = 0
      this.eqCurve4.gain.value = 0
    }
  }

  // Slider listeners
  eqSliderFunc (id, curveId) {
    document.querySelector(id).addEventListener('mousedown', (event) => {
      event.stopPropagation()
    }, false)
    document.querySelector(id).addEventListener('mouseup', (event) => {
      event.stopPropagation()
      if (this.on) {
        curveId.gain.value = document.querySelector(id).value
      }
    }, false)
  }
}
