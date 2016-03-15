var SearchSoundCloud = React.createClass({
  propTypes: {
    onSearchResults: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      query: ''
    };
  },

  performQuery: _.debounce(
    function() {
      SC.get('/tracks', { q: this.state.query }, this.updateResults);
    },
    300
  ),

  updateResults: function(results) {
    this.setState({
      currentResults: results
    });

    if( this.props.onSearchResults ) {
      this.props.onSearchResults(results);
    }
  },

  updateQuery: function(event) {
    this.setState({
      query: event.target.value
    });

    this.performQuery();
  },

  clearSearch: function() {
    this.setState({
      query: ''
    });

    this.updateResults([]);
  },

  render: function() {
    var clearIconClasses = 'glyphicon glyphicon-remove form-control-feedback clickable';
    if( this.state.query === '' ) {
      clearIconClasses += ' hidden';
    }

    return (
      <div className="row">
          <div className="form-group has-feedback">
            <input name="query"
                   type="text"
                   placeholder="Find Albums"
                   value={ this.state.query }
                   onChange={ this.updateQuery }
                   className="form-control"
                   autoComplete="false" />
            <span onClick={ this.clearSearch } className={ clearIconClasses }></span>
          </div>
      </div>
    );
  }
});
