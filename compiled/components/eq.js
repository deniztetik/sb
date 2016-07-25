"use strict";

var Eq = React.createClass({
	displayName: "Eq",

	getInitialState: function getInitialState() {
		return {
			filters: this.props.filters,
			presets: this.props.presets
		};
	},

	render: function render() {
		return React.createElement(
			"select",
			null,
			this.state.presets.map(function (preset, index) {
				return React.createElement(
					"option",
					{ value: index, key: index },
					preset[0]
				);
			})
		);
	}
});

window.Eq = Eq;