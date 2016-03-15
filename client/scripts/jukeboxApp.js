// TODO: Handle async stream loading vs play/pause/stop state
// TODO: Implement the state pattern
var JukeboxApp = React.createClass({
  propTypes: {
    soundCloudKey: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    // TODO: Inject dependencies, don't rely on globals
    SC.initialize({
      client_id: this.props.soundCloudKey
    });

    return {
      queriedTracks: [],
      playlist: [],
      currentTrack: {
        position: -1,
        stream: null,
        timer: null
      },
      isJukeboxPlaying: false
    };
  },

  addToPlaylist: function(track) {
    var trackIndex = this.findTrackInPlaylist(track);

    if( trackIndex === -1 ) {
      this.state.playlist.push(track);
      this.forceUpdate();
    }
  },

  removeFromPlaylist: function(track) {
    var trackIndex = this.findTrackInPlaylist(track);

    if( trackIndex !== - 1 ) {
      this.state.playlist.splice(trackIndex, 1);
      this.forceUpdate();
    }
  },

  findTrackInPlaylist: function(track) {
    return _.findIndex(
      this.state.playlist,
      function(t) {
        return track.id === t.id;
      }
    );
  },

  getCurrentTrack: function() {
    if( this.state.currentTrack.position === -1 || this.state.currentTrack.position >= this.state.playlist.length ) {
      return null;
    }

    return this.state.playlist[this.state.currentTrack.position];
  },

  pausePlaying: function() {
    if( !this.state.jukeboxPlaying ) {
      return;
    }

    this.state.currentTrack.stream.pause();
  },

  resumePlaying: function() {
    if( this.state.jukeboxPlaying ) {
      return;
    }

    this.state.currentTrack.stream.play();
  },

  stopPlaying: function() {
    if( !this.state.jukeboxPlaying ) {
      return;
    }

    clearInterval(this.state.currentTrack.timer);

    this.state.currentTrack.stream.stop();
    this.state.currentTrack.stream = null;
    this.state.currentTrack.timer = null;
    this.setState({
      jukeboxPlaying: false
    });
    this.forceUpdate();
  },

  handleSearchResults: function(results) {
    this.setState({
      queriedTracks: results
    });
  },

  playTrack: function(track) {
    var trackIndex = this.findTrackInPlaylist(track);

    // If we're asked to play the track we are already on
    if( this.state.currentTrack.position === trackIndex ) {
      // And that track is playing, then pause it
      if( this.state.jukeboxPlaying ) {
        this.pausePlaying();
        this.setState({
          jukeboxPlaying: false
        });
      }
      // Otherwise resume playing it
      else {
        this.resumePlaying();
        this.setState({
          jukeboxPlaying: true
        })
      }

      return;
    }

    // Make sure nothing is playing
    this.stopPlaying();

    // If the track isn't on the playlist, it's a one-off play
    this.state.currentTrack.position = trackIndex;
    this.forceUpdate();

    SC.stream('/tracks/' + this.getCurrentTrack().id, function(stream) {
      this.state.currentTrack.stream = stream;
      this.state.currentTrack.stream.play();
      this.state.currentTrack.timer = setInterval(this.forceUpdate.bind(this), 500);
      this.forceUpdate();
    }.bind(this));

    this.setState({
      jukeboxPlaying: true
    });
  },

  render: function() {
    var playbackControls = null;
    var currentTrack = this.getCurrentTrack();
    var currentStream;

    if( currentTrack != null ) {
      currentStream = this.state.currentTrack.stream;
      playbackControls = <PlaybackControls trackName={ currentTrack.title }
                                           isPlaying={ this.state.jukeboxPlaying }
                                           duration={ currentTrack.duration }
                                           position={ currentStream && currentStream.getCurrentPosition() || 0 }
                                           onPlay={ this.playTrack.bind(this, currentTrack) }
                                           onPause={ this.playTrack.bind(this, currentTrack) } />;
    }

    return (
      <section className="has-footer">
        <header>
          <div className="container text-center">
            <h1>Jukebox</h1>
          </div>
        </header>

        <article>
          <div className="container text-center">
            <AudioVisualizer />

            <SearchSoundCloud onSearchResults={ this.handleSearchResults } />

            <TrackSelector tracks={ this.state.queriedTracks } onTrackSelected={ this.addToPlaylist } />
          </div>
        </article>

        <footer className="fixed-footer">
          { playbackControls }
          <Playlist tracks={ this.state.playlist } currentTrack={ currentTrack } onTrackSelected={ this.playTrack } />
        </footer>
      </section>
    );
  }
});
