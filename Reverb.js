/**
 * Reverb module.
 * @author Gustav Forselius
 * @version 1.0
 */

/**
 * Class for ReverbPedal.
 * @class ReverbPedal
 */

export class ReverbPedal {
  constructor (audioContext, revWetBalanceGain, masterGain) {
    this.audioContext = audioContext
    this.reverbNode = this.audioContext.createConvolver()
    this.revWetBalanceGain = revWetBalanceGain
    this.reverbNode.buffer = this.calcReverb(2, 2)
    this.masterGain = masterGain
    this.value = 2
    this.reverse = false
    this.up = false
    this.on = false
  }

  /**
 * Calculates the room characteristics
 * @param {number} duration - reverb duration
 * @param {number} decay - reverb decay
 * @param {any} reverse - reverses reverb if !== false
 */
  calcReverb (duration, decay, reverse) {
    let sampleRate = this.audioContext.sampleRate

    let length = sampleRate * duration

    let impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate)
    let impulseLeft = impulse.getChannelData(0)
    let impulseRight = impulse.getChannelData(1)

    if (!decay) {
      decay = 2.0
    }
    for (let i = 0; i < length; i++) {
      let n = reverse ? length - i : i
      impulseLeft[i] = (Math.random() * 2) * Math.pow(1 - n / length, decay)
      impulseRight[i] = (Math.random() * 2) * Math.pow(1 - n / length, decay)
    }
    return impulse
  }

  /**
  * Handles click events for on/off and reverse option
  */
  reverbSetup () {
    document.querySelector('#revon').onclick = event => {
      if (this.audioContext.state === 'running' && !this.on) {
        this.reverbNode.connect(this.masterGain)

        document.querySelector('#revonoff').className = 'circlerevactive'
      }
      this.on = true
    }

    document.querySelector('#revoff').onclick = event => {
      if (this.audioContext.state === 'running' && this.on) {
        this.reverbNode.disconnect(this.masterGain)

        document.querySelector('#revonoff').className = 'circlerev'
      }
      this.on = false
    }
    document.querySelector('#revrev').onclick = event => {
      if (!this.reverse) {
        this.reverbNode.buffer = this.calcReverb(this.value, this.value, true)
        this.reverse = true
        document.querySelector('#revrev').style.backgroundColor = 'rgb(52, 196, 52)'
      } else {
        this.reverbNode.buffer = this.calcReverb(this.value, this.value)
        this.reverse = false
        document.querySelector('#revrev').style.backgroundColor = 'rgb(0, 0, 0)'
      }
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
      let currentPos = window.event.clientX
      document.querySelector(id).style.height = 200 + 'px'
      document.querySelector(id).style.top = 0 + 'px'
      document.querySelector(id).onmousemove = event => {
        event.stopPropagation()
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
        if (settingId === 'wet') {
          this.revWetBalanceGain.gain.value = value + 4
          if (value > 1) {
            this.revWetBalanceGain.gain.value++
          }
        } else if (settingId === 'decay') {
          if (this.up) {
            if (!this.reverse) {
              // this.reverbNode.buffer = this.calcReverb(value + 2.1, value + 2.1)

            } else {
              // this.reverbNode.buffer = this.calcReverb(value + 2.1, value + 2.1, true)
            }

            this.value = value + 2.1
          }
        }

        if (value > minValue && value < maxValue) {
          document.querySelector(knobId).style.transform = `rotate(${value * multiplier}deg)`
        }
      }
    }

    // Resets the knob div area and applies buffer function
    document.querySelector('#revdiv').onmouseup = event => {
      this.up = true
      document.querySelector('#revcoverleft').style.height = 70 + 'px'
      document.querySelector('#revcoverleft').style.top = 68 + 'px'
      document.querySelector('#revcoverright').style.height = 70 + 'px'
      document.querySelector('#revcoverright').style.top = 68 + 'px'
      if (!this.reverse) {
        this.reverbNode.buffer = this.calcReverb(value + 2.1, value + 2.1)
      } else {
        this.reverbNode.buffer = this.calcReverb(value + 2.1, value + 2.1, true)
      }
      if (settingId === 'decay') {
        //
      }
      document.querySelector('#revcoverright').onmousemove = null
      document.querySelector('#revcoverleft').onmousemove = null
      heldDownObj.down = false
    }

    // Resets the knob div area
    document.querySelector('#revdiv').onmouseleave = event => {
      event.stopPropagation()
      document.querySelector('#revcoverleft').style.height = 70 + 'px'
      document.querySelector('#revcoverleft').style.top = 68 + 'px'
      document.querySelector('#revcoverright').style.height = 70 + 'px'
      document.querySelector('#revcoverright').style.top = 68 + 'px'
      document.querySelector('#revcoverright').onmousemove = null
      document.querySelector('#revcoverleft').onmousemove = null
      heldDownObj.down = false
    }

    return value
  }
}
