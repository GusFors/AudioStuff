/**
 * Visualizer module
 * @author Gustav Forselius
 * @version 1.0
 *
 */

/**
 *Class for Visualizer.
 * @class Visualizer
 */
export class Visualizer {
  constructor () {
    this.id = 'visu'
    this.inputContext = undefined
    this.rawInput = undefined
    this.inputContext = undefined
    this.inputAnalyser = undefined
  }

  /**
  * Gets user input, sets up the visualizer variables and canvas for input visualisation
  * @param {object} masterInputGain - Master input gain node
  * @param {object} gateGain - The gain node to use as a noise gate
  */
  visualizerSetup (masterInputGain, gateGain) {
    let inputAnalyser
    let inputContext
    let rawInput
    let gate
    let threshholdObj = {
      gateThreshhold: 3
    }
    const audioInputSelect = document.querySelector('select#audioSource')

    // Get input
    navigator.mediaDevices.getUserMedia({ audio: { audio: true, deviceId: audioInputSelect.value } }).then(stream => {
      inputContext = new window.AudioContext()
      onInputStream(stream)
    }, error => {
      console.log(error)
    })

    /**
     * Starts visualizers and noise gate upon receiving user input
     * @param {object} stream - The media stream
     */
    function onInputStream (stream) {
      // Input gate
      let gateSlider = document.querySelector('#gateslider')
      threshholdObj.gateThreshhold = gateSlider.value
      gateSlider.onchange = function () {
        threshholdObj.gateThreshhold = this.value
      }

      stream.onended = function () {
        console.log('Stream ended')
      }

      // Create input stream and analyzer
      rawInput = inputContext.createMediaStreamSource(stream)
      inputAnalyser = inputContext.createAnalyser()
      let inputGainNode = inputContext.createGain()

      inputGainNode.gain.value = 0
      rawInput.connect(inputAnalyser)
      inputAnalyser.connect(inputGainNode)

      inputGainNode.connect(inputContext.destination)
      inputAnalyser.fftSize = 2048

      // Store analyzer data
      let inputArray = new Uint8Array(inputAnalyser.frequencyBinCount)

      /**
       * Lets input through if volume is above threshold
       * @param {array} inputArray
       */
      function gateVolume (inputArray) {
        let vol = 0
        let adjusted

        for (let i = 0; i < inputArray.length; i++) {
          vol += inputArray[i]
        }

        // Check volume level and set gate gain threshold depending on setting
        adjusted = vol / inputArray.length
        if (adjusted < threshholdObj.gateThreshhold) {
          gateGain.gain.value = 0
        } else {
          gateGain.gain.value = 1
        }

        // Fill the canvas with the data and color stops depending on level
        let canvas = document.getElementById('inputCanvas')
        let canvasContext = canvas.getContext('2d')
        // adjusted < 10 ? adjusted += 10 : adjusted += 0
        let gradient = canvasContext.createLinearGradient(0, 0, (adjusted) * 4/* < 10 ? (adjusted + 40) : adjusted * 3 */, 0)
        gradient.addColorStop(0, 'rgb(164, 255, 124)')
        gradient.addColorStop(0.5, 'rgb(184, 255, 104)')
        gradient.addColorStop(0.65, 'rgb(255, 255, 0)')
        if (adjusted > 20) {
          gradient.addColorStop(0.78, 'orange')
          gradient.addColorStop(0.98, 'rgb(70, 20, 20)')
        }
        gradient.addColorStop(1, 'rgb(48, 48, 59)')
        canvasContext.fillStyle = gradient
        canvasContext.fillRect(0, 0, 150, 50)
      }

      // Animation req
      function inputAndGate () {
        window.requestAnimationFrame(inputAndGate)
        inputAnalyser.getByteFrequencyData(inputArray)
        gate = gateVolume(inputArray)
      }
      inputAndGate()
    }
  }

  /**
   * Visualizer inspired by zapplebee https://codepen.io/zapplebee/pen/gbNbZE
   *
   * Visualises the master output with data from the analyzer node
   * @param {object} analyser - The analyzer node to use
   */
  drawMaster (analyser) {
    let paths = document.getElementsByTagName('path')
    let visualizer = document.getElementById('visualizer')
    let mask = visualizer.getElementById('mask')
    let path
    let frequencyLength = 255
    analyser.fftSize = 4096

    let frequencyArray = new Uint8Array(analyser.frequencyBinCount)

    // Creates the paths for the data
    for (let i = 0; i < 255; i++) {
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('stroke-dasharray', '1,1')
      mask.appendChild(path)
    }
    // Draws the paths with data from the analyzerNodes frequency data
    function draw () {
      window.requestAnimationFrame(draw)
      analyser.getByteFrequencyData(frequencyArray)
      for (let i = 0; i < 255; i++) {
        paths[i].setAttribute('d', 'm ' + (i) + ',255 l 0,-' + (frequencyArray[i] + 10) / 1.3)
      }
    }
    draw()
  }
}
