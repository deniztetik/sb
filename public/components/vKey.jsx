//VKey React class.  Represents one key on our virtual keyboard.
var VKey = React.createClass ({
  //method for removing styling from key after its audio element has stopped playing.
  handleAudioEnd: function (event) {
    var $vKey = $('#' + this.props.keyId).parent();

    $vKey.removeClass('green red pressed');
    event.preventDefault();
    this.render();
  },

  render: function() {
    return (
      <div className="key">
        <p className="keyLabel">{keyCodes[this.props.keyId]}</p>
        <p className="filename">{ this.props.path.split('/')[2].slice(0, -4).split("-").join(" ")}</p>
        <audio id={this.props.keyId} src={ this.props.path } onEnded={ this.handleAudioEnd } preload="auto"></audio>
      </div>
    )
  }
});
