var PlaybackControls = React.createClass({
  propTypes: {
    trackName: React.PropTypes.string,
    isPlaying: React.PropTypes.bool,
    duration: React.PropTypes.number,
    position: React.PropTypes.number,
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func
  },

  handlePlayPause: function() {
    this.props.isPlaying ? this.props.onPause() : this.props.onPlay();
  },

  render: function() {
    var progress = (this.props.position / this.props.duration) * 100;
    var playbackClasses = ['glyphicon'];
    var progressStyle = { width: progress + '%' };

    playbackClasses.push(this.props.isPlaying ? 'glyphicon-pause' : 'glyphicon-play');

    return (
      <div className="playback-controls">
        <button className="btn btn-default play-pause" onClick={ this.handlePlayPause }>
          <div className={ playbackClasses.join(' ') }></div>
        </button>

        <div className="playback-data">
          <div className="title">{ this.props.trackName }</div>

          <div className="progress">
            <div className="progress-bar" style={ progressStyle }></div>
          </div>
        </div>
      </div>
    );
  }
});
