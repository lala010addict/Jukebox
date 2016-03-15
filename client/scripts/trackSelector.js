var TrackSelector = React.createClass({
  propTypes: {
    tracks: React.PropTypes.array.isRequired,
    onTrackSelected: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      selectedTrack: null
    };
  },

  handleTrackSelection: function(track) {
    if( this.props.onTrackSelected ) {
      this.props.onTrackSelected(track);
    }

    this.setState({
      selectedTrack: track
    });
  },

  render: function() {
    var trackComponents = [];

    var i = 0;
    var len = this.props.tracks.length;
    for( ; i < len; i++ ) {
      trackComponents.push(
        <div key={this.props.tracks[i].id} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
          <div className="clickable" onClick={ this.handleTrackSelection.bind(this, this.props.tracks[i]) }>
            <Track track={this.props.tracks[i]} />
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        { trackComponents }
      </div>
    );
  }
});
