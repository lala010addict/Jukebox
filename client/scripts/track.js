var TrackShape = {
  title: React.PropTypes.string.isRequired,
  artwork_url: React.PropTypes.string
};

var Track = React.createClass({
  propTypes: {
    track: React.PropTypes.shape(TrackShape).isRequired
  },

  render: function() {
    return (
      <div className="track">
        <img src={ this.props.track.artwork_url } className="img-thumbnail artwork" />
        <div className="title">{ this.props.track.title }</div>
      </div>
    );
  }
});
