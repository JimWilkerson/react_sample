import React from 'react';
import PageNav from './PageNav.js';
import SearchPanel from './SearchPanel.js';

class Finder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      currentPage: 1,
      maxItems: 10
    };
  }

  render() {
    var content = this.state.data;
    var currentPage = this.state.currentPage;
    var maxItems = this.state.maxItems;
    var callback = this.setPage.bind(this);
    var pageOffset = currentPage - 1;
    var pageStart = (pageOffset * maxItems) + 1;

    if (content !== undefined && content.data.length > 0) {

      var items =
        this.sortData(content.data).slice(pageStart, pageStart + maxItems);

      var itemCount = content.data.length;
      var pageCount = Math.ceil(itemCount / maxItems);

      return (
        <div>
          <img src="Fork-Knife-icon.png" alt="" />
          <h1>Jim's Restaurant Finder</h1>

          <div class="panel panel-default">
            <div class="panel-heading">
              <SearchPanel />
            </div>
            <div class="panel-body">
              <table class="table">
                <thead>
                  <tr>
                    <th align="left">Name</th>
                    <th align="left">City</th>
                    <th align="left">
                      <label for="state" style={{display:'inline'}}>State</label>
                      <select name="state" id="stateDropdown" style={{marginLeft:'5px'}}>
                        <option value="AZ">AZ</option>
                        <option value="CO">CO</option>
                      </select>
                    </th>
                    <th align="left">Phone</th>
                    <th align="left">
                      <label for="genre" style={{display:'inline'}}>Genre</label>
                      <select name="genre" id="genreDropdown" style={{marginLeft:'5px'}}>
                        <option value="">American,Contemporary</option>
                        <option value="">Cafe,Italian,Bistro,Contemporary,Vegetarian</option>
                      </select>
                    </th>
                  </tr>
                </thead>
                {items}
                <tfoot>
                  <tr>
                    <td colspan="5">
                      <div align="right">Page {currentPage} of {pageCount} </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <PageNav
            itemCount={content.data.length}
            currentPage={currentPage}
            maxItems={maxItems}
            pageCount={pageCount}
            setPage={callback}
          />
        </div>
      );
    }
    else {
      return (
        <div />
      );

    }
  }


  setPage(event) {

    var selected = event.target.innerText;
    var content = this.state.data;
    var itemCount = content.data.length;
    var currentPage = this.state.currentPage;
    var maxItems = this.state.maxItems;
    var pageCount = Math.ceil(itemCount / maxItems);

    switch (selected) {
      case 'Previous':
        if (currentPage > 1) {
          this.setState({ currentPage: currentPage - 1 });
        }
        break;
      case 'Next':
        if (currentPage < pageCount) {
          this.setState({ currentPage: currentPage + 1 });
        }
        break;
      default:
        var newPage = parseInt(selected);
        this.setState({ currentPage: newPage });
    }

    this.forceUpdate();

  }


  componentDidMount() {
    fetch('/restaurantData.json')
      .then(res => res.json())
      .then((data) => {
        this.setState({ data })
      })
      .catch(console.log)
  }

  sortData(items) {

    return items
      .sort((a, b) => a.name + a.city + a.state > b.name + b.city + b.state ? 1 : -1)
      .map((item, index) =>
        <tbody>
          <tr>
            <td>{item.name}</td>
            <td>{item.city}</td>
            <td>{item.state}</td>
            <td>{item.telephone}</td>
            <td>{item.genre}</td>
          </tr>
        </tbody>
      );

  }

}

export default Finder;