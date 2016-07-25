/**
 *   This file creates a levels display and equalizer for the app using the web audio api. All audio elements of the page are 
 *   merged into one audio node, which then passes through a 10 channel equalizer implemented with 10 biquadfilters. From there
 *   it is passed to an analyzer node which collects the data for the levels visualization
 **/


//  creates our state, most of the properties are initialized when the button created by this file is clicked
var Levels = React.createClass({
	getInitialState: function() {
		return {
			audioElms: [],
			container: null,
			ac: new window.AudioContext(),
			analyzer: null,
			filters: null,
			width: 800,				//  for the canvas element holding the levels display
			height: 300,
			presets: []
		}
	},

	//  called when the button is clicked, starts off the rest of this code to create the levels display/eq
	startLevels: function() {
			$.get(window.location.href + "presets", function(result) {			//  loads the equalizer presets from the server
				
				
				for (var i = 0; i < this.state.audioElms.length; i++) {
					this.state.audioElms[i].disconnect();
				}

				var elms = $('audio');
				var tempArray = [];
				
				for (var i = 0; i < elms.length; i++) {
					var temp = this.state.ac.createMediaElementSource(elms[i]);
					tempArray.push(temp);
				}

				this.setState({
					audioElms: tempArray,
					container: $('canvas')[0].getContext('2d'),
					analyzer: this.state.ac.createAnalyser(),
					presets: result
				}, this.checkLevels);			//  calls next function in the chain
			}.bind(this));

	}, 

	//  sets up the audio node chain that implements the equalizer and levels display
	checkLevels: function() {
		var merge = this.state.ac.createChannelMerger(this.state.audioElms.length);
		var tempArray = [];

		//  here we create our ten biquad filters for the equalizer. filters are given frequencies/q values held by arrays in helpers.jsx
		for (var i = 0; i < 10; i++) {
			var temp = this.state.ac.createBiquadFilter();
			temp.frequency.value = freq[i];
			i !== 0 && i !== 9 ? temp.type = "peaking" : i === 0 ? temp.type = "lowshelf" : temp.type = "highshelf";
			i !== 0 && i !== 9 ? temp.Q.value = qValues[i - 1]: null;
			temp.gain.value = this.state.presets[0][i + 1];
			tempArray.push(temp);
		}

		//  merges all current audio elements into one node
		for (var i = 0; i < this.state.audioElms.length; i++) {
			this.state.audioElms[i].connect(merge, 0, 0);
			this.state.audioElms[i].connect(merge, 0, 1);
		}

		//  runs the audio through the equalizer and the filter
		this.setState({filters: tempArray}, function() {
			merge.connect(this.state.filters[0]);
			
			for (var i = 1; i < 10; i++) {
				this.state.filters[i - 1].connect(this.state.filters[i]);
			}

			this.state.filters[9].connect(this.state.analyzer);
			this.state.analyzer.connect(this.state.ac.destination);
			this.state.analyzer.fftSize = 2048;
			setInterval(this.updateLevels, 33);
		});
	},

	//  runs ever 33 ms to update the display of the current audio
	updateLevels: function() {
		var len = this.state.analyzer.frequencyBinCount;
		var data = new Uint8Array(len);
		
		this.state.analyzer.getByteFrequencyData(data);
		this.state.container.clearRect(0, 0, this.state.width, this.state.height);
		
		var width = this.state.width / len;
		var coefficient = 255 / len;
    
    var gradient = this.state.container.createLinearGradient(0,0, this.state.width, 0);
    gradient.addColorStop(0, "#DB36A4");
    gradient.addColorStop(1, "#F7FF00");

    for (var i = 0; i < data.length; i++ ) {
      var magnitude = data[i] / 128.0;
      this.state.container.fillStyle = gradient;
      this.state.container.fillRect(i * width, this.state.height - magnitude * .5 * this.state.height, 1, this.state.height);
    }
	},

	//  allows user to change the equalizer filter values
	changePreset: function() {
		for (var i = 0; i < 10; i++) {
			this.state.filters[i].gain.value = this.state.presets[$('select').val()][i + 1];
		}
	},

	render: function() {
		return (
			<div>
				<div className="levels">	
					<canvas width={this.state.width} height={this.state.height}></canvas>
				</div>
				<div>
					<button type="button" onClick={this.startLevels}>Click to initiliaze levels and equalizer</button>
					<select onChange={this.changePreset}>
						{
							this.state.presets.map(function(preset, index) {
								return (
									<option value={index} key={index}>{preset[0]}</option>
								)
							})
						}
					</select>
				</div>
			</div>
		)
	}
})

window.Levels = Levels;