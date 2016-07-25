'use strict';

var Levels = React.createClass({
	displayName: 'Levels',

	getInitialState: function getInitialState() {
		return {
			audioElms: null,
			container: null,
			ac: new window.AudioContext(),
			analyzer: null,
			filters: null,
			width: 800,
			height: 300,
			presets: [],
			initialized: false
		};
	},

	startLevels: function startLevels() {
		if (!this.state.initialized) {
			$.get(window.location.href + "presets", function (result) {
				this.setState({
					audioElms: $('audio'),
					container: $('canvas')[0].getContext('2d'),
					analyzer: this.state.ac.createAnalyser(),
					presets: result,
					initialized: true
				}, this.checkLevels);
			}.bind(this));
		}
	},

	checkLevels: function checkLevels() {
		var merge = this.state.ac.createChannelMerger(this.state.audioElms.length);
		var tempArray = [];

		for (var i = 0; i < 10; i++) {
			var temp = this.state.ac.createBiquadFilter();
			temp.frequency.value = freq[i];
			i !== 0 && i !== 9 ? temp.type = "peaking" : i === 0 ? temp.type = "lowshelf" : temp.type = "highshelf";
			i !== 0 && i !== 9 ? temp.Q.value = qValues[i - 1] : null;
			temp.gain.value = this.state.presets[0][i + 1];
			tempArray.push(temp);
		}

		for (var i = 0; i < this.state.audioElms.length; i++) {
			var temp = this.state.ac.createMediaElementSource(this.state.audioElms[i]);
			temp.connect(merge, 0, 0);
			temp.connect(merge, 0, 1);
		}

		this.setState({ filters: tempArray }, function () {
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

	updateLevels: function updateLevels() {
		var len = this.state.analyzer.frequencyBinCount;
		var data = new Uint8Array(len);

		this.state.analyzer.getByteFrequencyData(data);
		this.state.container.clearRect(0, 0, this.state.width, this.state.height);

		var width = this.state.width / len;
		var coefficient = 255 / len;

		var gradient = this.state.container.createLinearGradient(0, 0, this.state.width, 0);
		gradient.addColorStop(0, "#DB36A4");
		gradient.addColorStop(1, "#F7FF00");

		for (var i = 0; i < data.length; i++) {
			var magnitude = data[i] / 128.0;
			this.state.container.fillStyle = gradient;
			this.state.container.fillRect(i * width, this.state.height - magnitude * .5 * this.state.height, 1, this.state.height);
		}
	},

	changePreset: function changePreset() {
		for (var i = 0; i < 10; i++) {
			this.state.filters[i].gain.value = this.state.presets[$('select').val()][i + 1];
			console.log(i, this.state.filters[i].gain.value);
		}
	},

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: 'levels' },
				React.createElement('canvas', { width: this.state.width, height: this.state.height })
			),
			React.createElement(
				'div',
				null,
				React.createElement(
					'button',
					{ type: 'button', onClick: this.startLevels },
					'Click to initiliaze levels and equalizer'
				),
				React.createElement(
					'select',
					{ onChange: this.changePreset },
					this.state.presets.map(function (preset, index) {
						return React.createElement(
							'option',
							{ value: index, key: index },
							preset[0]
						);
					})
				)
			)
		);
	}
});

window.Levels = Levels;