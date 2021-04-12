
/**
 * Delay module.
 * @author Gustav Forselius
 * @version 1.0
 */

/**
 *Class for DelayPedal.
 * @class DelayPedal
 */
export class DelayPedal {
  constructor (audioContext, delayGain) {
    this.delayTime = 1
    this.audioContext = audioContext
    this.delayGain = delayGain
    this.delayNode = this.audioContext.createDelay(2.1)
    this.delayNode.delayTime.value = this.delayTime
    this.delayMix = this.audioContext.createGain()
    this.delayMix.gain.value = 1
    this.delayNode.connect(this.delayMix)
    this.on = false
  }
  /**
   * Handles click events and connecting/disconnecting preOutputGain
   * @param {object} preOutputGain
   */
  delaySetup (preOutputGain) {
    document.querySelector('#delay').onclick = event => {
      if (this.audioContext.state === 'running' && this.on) {
        this.delayMix.disconnect(preOutputGain)
        document.querySelector('#delonoff').className = 'circle'
      }
      this.on = false
    }
    document.querySelector('#delayon').onclick = event => {
      if (this.audioContext.state === 'running' && !this.on) {
        this.delayMix.connect(preOutputGain)
        document.querySelector('#delonoff').className = 'circleactive'
      }
      this.on = true
    }
  }

  /**
  * Makes knobs rotatable
  * @param {string} id - The knob div id
  * @param {string} settingId - The setting id
  * @param {number} minValue - Minimum base value of the knob
  * @param {number} maxValue - Maximum base value of the knob
  * @param {number} multiplier - Value multiplier
  * @param {number} increment  - Value increment per step
  * @param {object} heldDownObj - Knob object
  * @param {string} knobId - The knobs id
  */
  knobTurn (id, settingId, minValue, maxValue, multiplier, increment, heldDownObj, knobId) {
    let upOrdown = 0
    let value = 0
    if (heldDownObj.down === false) {

    }
    document.querySelector(id).onmousedown = event => {
      heldDownObj.down = true
      document.querySelector(id).style.height = 200 + 'px'
      document.querySelector(id).style.top = 0 + 'px'
      let currentPos = window.event.clientX
      document.querySelector(id).onmousemove = event => {
        // event.stopPropagation()
        let plusOrMinus
        if (event.pageY < upOrdown) {
          if (value < maxValue) {
            value = value + increment
          }
        }
        if (event.pageY > upOrdown) {
          if (value > minValue) {
            value = value - increment
          }
        }

        upOrdown = event.pageY
        let cssProp = window.getComputedStyle(document.querySelector(id))

        let rotDeg = window.event.clientY

        if (value === 0) {
          value += 0.01
        }

        if (settingId === 'time') {
          this.delayNode.delayTime.value = value + 1.1

          if (value > 1) {

          }
        } else if (settingId === 'decay') {
          this.delayGain.gain.value = (value + 1) / 2
        } else if (settingId === 'gain') {
          this.delayMix.gain.value = value + 1
        }

        if (value > minValue && value < maxValue) {
          document.querySelector(knobId).style.transform = `rotate(${value * multiplier}deg)`
        }
      }
    }
    // Resets the knob div area
    document.querySelector('#deldiv').onmouseup = event => {
      document.querySelector('#delcoverleft').style.height = 70 + 'px'
      document.querySelector('#delcoverleft').style.top = 68 + 'px'
      document.querySelector('#delcovermiddle').style.height = 70 + 'px'
      document.querySelector('#delcovermiddle').style.top = 68 + 'px'
      document.querySelector('#delcoverright').style.height = 70 + 'px'
      document.querySelector('#delcoverright').style.top = 68 + 'px'
      document.querySelector('#delright').onmousemove = null
      document.querySelector('#delmiddle').onmousemove = null
      document.querySelector('#delcoverleft').onmousemove = null
      document.querySelector('#delcovermiddle').onmousemove = null
      document.querySelector('#delcoverright').onmousemove = null
      heldDownObj.down = false
    }
    // Resets the knob div area
    document.querySelector('#deldiv').onmouseleave = event => {
      event.stopPropagation()
      document.querySelector('#delcoverleft').style.height = 70 + 'px'
      document.querySelector('#delcoverleft').style.top = 68 + 'px'
      document.querySelector('#delcovermiddle').style.height = 70 + 'px'
      document.querySelector('#delcovermiddle').style.top = 68 + 'px'
      document.querySelector('#delcoverright').style.height = 70 + 'px'
      document.querySelector('#delcoverright').style.top = 68 + 'px'
      document.querySelector('#delright').onmousemove = null
      document.querySelector('#delmiddle').onmousemove = null
      document.querySelector('#delcoverleft').onmousemove = null
      document.querySelector('#delcovermiddle').onmousemove = null
      document.querySelector('#delcoverright').onmousemove = null
      heldDownObj.down = false
    }

    return value
  }
}
