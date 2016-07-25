class SearchResultItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleClick(item) {

  }

  render() {
    return (
      <div className="" onClick={() => this.handleClick(this.props.searchItem)}>
        { this.props.searchItem.name }
      </div>
    )
  }
}

window.SearchResultItem = SearchResultItem;
