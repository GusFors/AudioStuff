// Using Tonejs scheduleRepeat to the repeat the pattern
// https://tonejs.github.io/

/**
 * Sequencer module.
 * @author Gustav Forselius
 * @version 1.0
 */

/**
 * Class for Sequencer.
 * @class Sequencer
 */

export class Sequencer {
  constructor (audioContext, activeApplication) {
    this.audioContext = audioContext
    this.activeSequence = undefined
    this.activeApplication = activeApplication
    this.heldDownObj = undefined
    this.memory = false
    this.kick = undefined
  }

  /**
   * Sets up variables, sound files and listeners
   */
  seqSetup () {
    try {
      let kick
      let snare
      let hihat
      let prevSnare
      let prevKick
      let prevHihat
      let crash
      let prevCrash
      let ride
      let prevRide
      let activeSequence = false
      this.activeSequence = activeSequence

      document.querySelector('#drumdiv').addEventListener('click', (event) => {
        for (let i = 0; i < document.querySelectorAll('.dropdown-content2').length; i++) {
          document.querySelectorAll('.dropdown-content2')[i].style.display = 'none'
        }

        // document.querySelector('.dropdown-content2').style.display = 'none'
      })

      // Dropdowns for changing drum sample
      document.querySelector('#kickbutton').onclick = function (event) {
        event.stopPropagation()
        this.querySelector('.dropdown-content2').style.display = 'block'
        this.querySelector('.dropdown-content2').onclick = event => {
          event.stopPropagation()
          this.querySelector('.dropdown-content2').style.display = 'none'
        }
      }
      document.querySelector('#snarebutton').onclick = function (event) {
        event.stopPropagation()
        this.querySelector('.dropdown-content2').style.display = 'block'
        this.querySelector('.dropdown-content2').onclick = event => {
          event.stopPropagation()
          this.querySelector('.dropdown-content2').style.display = 'none'
        }
        this.querySelector('.dropdown-content2').onclick = event => {
          event.stopPropagation()
          this.querySelector('.dropdown-content2').style.display = 'none'
        }
      }
      document.querySelector('#hihatbutton').onclick = function (event) {
        event.stopPropagation()
        this.querySelector('.dropdown-content2').style.display = 'block'
        this.querySelector('.dropdown-content2').onclick = event => {
          event.stopPropagation()
          this.querySelector('.dropdown-content2').style.display = 'none'
        }
      }
      document.querySelector('#crashbutton').onclick = function (event) {
        event.stopPropagation()
        this.querySelector('.dropdown-content2').style.display = 'block'
        this.querySelector('.dropdown-content2').onclick = event => {
          event.stopPropagation()
          this.querySelector('.dropdown-content2').style.display = 'none'
        }
      }
      document.querySelector('#ridebutton').onclick = function (event) {
        event.stopPropagation()
        this.querySelector('.dropdown-content2').style.display = 'block'
        this.querySelector('.dropdown-content2').onclick = event => {
          event.stopPropagation()
          this.querySelector('.dropdown-content2').style.display = 'none'
        }
      }
      document.querySelector('#seqbpm').onmousedown = function (event) {
        event.stopPropagation()
        this.focus()
      }
      document.querySelector('#seqbpm').addEventListener('input', function (event) {
        document.querySelector('#bpmspan').innerText = `BPM: ${this.value}`
      })

      // Starts the loop
      document.querySelector('#startseq').onclick = event => {
        if (this.activeApplication) {
          document.querySelector('#seqstart').className = 'material-icons recordpulse'

          if (!this.activeSequence) {
            this.activeSequence = true
            this.drumSequencer(kick, snare, hihat, crash, ride, prevKick, prevSnare, prevHihat, prevCrash, prevRide)
          } else {
            window.Tone.Buffer.on('load', function () {
              window.Tone.Transport.start()
            })
          }
        } else {
          document.querySelector('#helptext').innerText = 'Start the application before sequencing!'
        }
      }

      // Stops the loop
      document.querySelector('#stopseq').onclick = event => {
        document.querySelector('#seqstart').className = 'material-icons'

        for (let i = 0; i < document.querySelectorAll('.checkcontainer').length; i++) {
          document.querySelectorAll('.checkcontainer')[i].style.filter = ''
        }
        window.Tone.Transport.cancel()
        this.activeSequence = false
        // window.Tone.Transport.clear()
      }
      document.querySelector('#seqvolume').addEventListener('mousedown', (event) => {
        event.stopPropagation()
      })
      document.querySelector('#seqbpm').addEventListener('input', function (event) {
        document.querySelector('#bpmspan').innerText = `BPM: ${this.value}`
      })
      document.querySelector('#seqvolume').addEventListener('mouseup', (event) => {
        event.stopPropagation()

        event.cancelBubble = true
      }, false)
    } catch (error) {
      console.log(error)
    }
  }

  // Using tonejs for loading samples and repeating the pattern every 8 bars
  drumSequencer (kick, snare, hihat, crash, ride, prevKick, prevSnare, prevHihat, prevCrash, prevRide) {
    // Se till att laddade ljudfiler är högst 16-bit då firefox annars inte kan läsa dem
    if (!this.memory) {
      kick = new window.Tone.Player({ url: './audio/drums/kick1.wav', autostart: false }).toMaster()
      snare = new window.Tone.Player('./audio/drums/snare1.wav').toMaster()
      hihat = new window.Tone.Player('./audio/drums/hihat3.wav').toMaster()
      crash = new window.Tone.Player('./audio/drums/crash1.wav').toMaster()
      ride = new window.Tone.Player('./audio/drums/ride1.wav').toMaster()
      // this.memory = true
    }
    kick.volume.value = parseInt(document.querySelector('#seqvolume').value)
    snare.volume.value = parseInt(document.querySelector('#seqvolume').value)
    hihat.volume.value = parseInt(document.querySelector('#seqvolume').value)
    crash.volume.value = parseInt(document.querySelector('#seqvolume').value)
    ride.volume.value = parseInt(document.querySelector('#seqvolume').value)
    let index = 0

    // Kicks
    document.querySelector('#kick1sel').onclick = event => {
      kick = new window.Tone.Player('./audio/drums/kick1.wav').toMaster()
    }
    document.querySelector('#kick2sel').onclick = event => {
      kick = new window.Tone.Player('./audio/drums/kick2.wav').toMaster()
    }
    document.querySelector('#kick3sel').onclick = event => {
      kick = new window.Tone.Player('./audio/drums/kick3.wav').toMaster()
    }

    // Hihats
    document.querySelector('#hihat1sel').onclick = event => {
      hihat = new window.Tone.Player('./audio/drums/hihat1.wav').toMaster()
    }
    document.querySelector('#hihat2sel').onclick = event => {
      hihat = new window.Tone.Player('./audio/drums/hihat2.wav').toMaster()
    }
    document.querySelector('#hihat3sel').onclick = event => {
      hihat = new window.Tone.Player('./audio/drums/hihat3.wav').toMaster()
    }

    // Snares
    document.querySelector('#snare1sel').onclick = event => {
      snare = new window.Tone.Player('./audio/drums/snare1.wav').toMaster()
    }
    document.querySelector('#snare2sel').onclick = event => {
      snare = new window.Tone.Player('./audio/drums/snare2.wav').toMaster()
    }
    document.querySelector('#snare3sel').onclick = event => {
      snare = new window.Tone.Player('./audio/drums/snare3.wav').toMaster()
    }

    // Crash
    document.querySelector('#crash1sel').onclick = event => {
      crash = new window.Tone.Player('./audio/drums/crash1.wav').toMaster()
    }
    document.querySelector('#crash2sel').onclick = event => {
      crash = new window.Tone.Player('./audio/drums/crash2.wav').toMaster()
    }
    document.querySelector('#crash3sel').onclick = event => {
      crash = new window.Tone.Player('./audio/drums/crash3.wav').toMaster()
    }

    // Rides
    document.querySelector('#ride1sel').onclick = event => {
      ride = new window.Tone.Player('./audio/drums/ride1.wav').toMaster()
    }
    document.querySelector('#ride2sel').onclick = event => {
      ride = new window.Tone.Player('./audio/drums/ride2.wav').toMaster()
    }
    document.querySelector('#ride3sel').onclick = event => {
      ride = new window.Tone.Player('./audio/drums/ride3.wav').toMaster()
    }

    // Schedules the repeat function and its tempo
    window.Tone.Transport.scheduleRepeat(repeat, '8n')
    window.Tone.Transport.bpm.value = document.querySelector('#seqbpm').value
    window.Tone.Buffer.on('load', function () {
      window.Tone.Transport.start()
    })

    // Adjusts sample volume
    document.querySelector('#seqvolume').addEventListener('mousedown', (event) => {
      event.stopPropagation()
      kick.volume.value = parseInt(document.querySelector('#seqvolume').value)
      snare.volume.value = parseInt(document.querySelector('#seqvolume').value)
      hihat.volume.value = parseInt(document.querySelector('#seqvolume').value)
      crash.volume.value = parseInt(document.querySelector('#seqvolume').value)
      ride.volume.value = parseInt(document.querySelector('#seqvolume').value)
    })
    document.querySelector('#seqbpm').addEventListener('input', function (event) {
      document.querySelector('#bpmspan').innerText = `BPM: ${this.value}`
      window.Tone.Transport.bpm.value = this.value
    })
    document.querySelector('#seqvolume').addEventListener('mouseup', (event) => {
      event.stopPropagation()
      kick.volume.value = parseInt(document.querySelector('#seqvolume').value)
      snare.volume.value = parseInt(document.querySelector('#seqvolume').value)
      hihat.volume.value = parseInt(document.querySelector('#seqvolume').value)
      crash.volume.value = parseInt(document.querySelector('#seqvolume').value)
      ride.volume.value = parseInt(document.querySelector('#seqvolume').value)
      event.cancelBubble = true
    }, false)

    // The pattern to repeat
    async function repeat () {
      let step = index % 16
      let kickInputs = document.querySelector(`#kick${step + 1}`)
      prevKick = document.querySelector(`#kick${step + 1 - 1}`)
      prevSnare = document.querySelector(`#snare${step + 1 - 1}`)
      prevHihat = document.querySelector(`#hi${step + 1 - 1}`)
      prevCrash = document.querySelector(`#crash${step + 1 - 1}`)
      prevRide = document.querySelector(`#ride${step + 1 - 1}`)
      if (step === 0) {
        prevKick = document.querySelector(`#kick${16}`)
        prevSnare = document.querySelector(`#snare${16}`)
        prevHihat = document.querySelector(`#hi${16}`)
        prevCrash = document.querySelector(`#crash${16}`)
        prevRide = document.querySelector(`#ride${16}`)
      }
      let hihatInputs = document.querySelector(`#hi${step + 1}`)
      let snareInputs = document.querySelector(`#snare${step + 1}`)
      let crashInputs = document.querySelector(`#crash${step + 1}`)
      let rideInputs = document.querySelector(`#ride${step + 1}`)

      // Highlights the the current sample box
      kickInputs.parentElement.style.filter = 'brightness(255%)'
      prevKick.parentElement.style.filter = ''
      snareInputs.parentElement.style.filter = 'brightness(255%)'
      prevSnare.parentElement.style.filter = ''
      hihatInputs.parentElement.style.filter = 'brightness(255%)'
      prevHihat.parentElement.style.filter = ''
      crashInputs.parentElement.style.filter = 'brightness(255%)'
      prevCrash.parentElement.style.filter = ''
      rideInputs.parentElement.style.filter = 'brightness(255%)'
      prevRide.parentElement.style.filter = ''

      if (kickInputs.checked) {
        kick.start()
      }

      if (snareInputs.checked) {
        snare.start()
      }
      if (hihatInputs.checked) {
        hihat.start()
      }
      if (crashInputs.checked) {
        crash.start()
      }
      if (rideInputs.checked) {
        ride.start()
      }
      index++
    }
  }
}

// Experimental

/*
      document.querySelector('#drumdiv').addEventListener('mousedown', function (event) {
        let checkBox = event.target.previousElementSibling
        if (checkBox.checked === false) {
          setTimeout(() => {
            checkBox.checked = true
          }, 1000)

          event.stopPropagation()
        }
        console.log(event.target.previousElementSibling.checked)
      }) */
