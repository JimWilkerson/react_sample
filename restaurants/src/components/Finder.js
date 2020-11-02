import React from 'react';
import PageNav from './PageNav.js';
import SearchPanel from './SearchPanel.js';

class Finder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      currentPage: 1,
      maxItems: 10,
      searchText:"",
      selectedState:"All",
      selectedGenre:"All"
    };
  }

  render() {

    var content = this.state.data;
    var currentPage = this.state.currentPage;
    var maxItems = this.state.maxItems;
    var pageOffset = currentPage - 1;
    var pageStart = (pageOffset * maxItems);

    var setPageCallback = this.setPage.bind(this);
    var searchCallback = this.search.bind(this);

    if (content !== undefined && content.data.length > 0) {

      var stateOptionsList = this.getStates(content.data);
      var genreOptionsList = this.getGenres(content.data);

      var items = this.sortAndFilterItems(content.data);
      var itemCount = items.length;
      var pageCount = Math.ceil(itemCount / maxItems);
      items = items.slice(pageStart, pageStart +maxItems);

      return (
        <div>
          <img src="Fork-Knife-icon.png" alt="" />
          <h1>Jim's Restaurant Finder</h1>

          <div class="panel panel-default">
            <div class="panel-heading">
              <SearchPanel search={searchCallback}/>
            </div>
            <div class="panel-body">
              <h3 class="text-danger">{itemCount <1  ? "No Results Found":""}</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th align="left">Name</th>
                    <th align="left">City</th>
                    <th align="left">
                      <label for="state" style={{ display: 'inline' }}>State</label>
                      <select 
                        id="stateDropdown" 
                        dir="ltl" 
                        name="state" 
                        onChange={this.stateChanged.bind(this)}
                        style={{ marginLeft: '5px' }}>
                          <option style={{textAlign:'right'}} value="All">All</option>
                          {stateOptionsList}
                      </select>
                    </th>
                    <th align="left">Phone</th>
                    <th align="left">
                      <label for="genre" style={{ display: 'inline' }}>Genre</label>
                      <select 
                        id="genreDropdown" 
                        onChange={this.genreChanged.bind(this)}
                        name="genre" 
                        style={{ marginLeft: '5px' }} >
                        <option style={{textAlign:'right'}} value="">All</option>
                        {genreOptionsList}
                      </select>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items}
                </tbody>
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
            setPage={setPageCallback}
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

  search(text) {
    this.setState({searchText:text});
    this.forceUpdate();
  }
  
  stateChanged(event){
    var currentState = event.target.value;
    this.setState({selectedState: currentState});
    this.setState({currentPage:1});
  }

  genreChanged(event){
    var currentGenre = event.target.value;
    this.setState({selectedGenre: currentGenre});
    this.setState({currentPage:1});
  }


  setPage(event) {

    var selected = event.target.innerText;
    var content = this.state.data.data;
    content = this.sortAndFilterItems(content);

    var itemCount = content.length;
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
    this.refreshData();
  }

  refreshData(){
    fetch('/restaurantData.json')
      .then(res => res.json())
      .then((data) => {
        this.setState({ data })
      })
      .catch(console.log)

  }

  sortAndFilterItems(items) {

    var searchText = this.state.searchText;
    var stateSelected = this.state.selectedState;
    var genreSelected = this.state.selectedGenre;

    //Sort by name, then city, then state
    items.sort((a, b) => a.name + a.city + a.state > b.name + b.city + b.state ? 1 : -1)

    var filteredItems = items;

    //filter for search box
    if(searchText !== ""){
      filteredItems = filteredItems.filter((item) => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.city.toLowerCase().includes(searchText.toLowerCase) ||
        item.genre.toLowerCase().includes(searchText.toLowerCase()));
    }

    //filter for selected State.
    if(stateSelected !== undefined && stateSelected !=="All"){
      filteredItems = filteredItems.filter((item) => item.state == stateSelected);
    }

    //filter for genre
    if(genreSelected !== undefined && genreSelected !== "All") {
      filteredItems = filteredItems.filter((item) => item.genre.includes(genreSelected));
    }


    return filteredItems
      .map((item) =>
        <tr>
          <td>{item.name}</td>
          <td>{item.city}</td>
          <td>{item.state}</td>
          <td><a href={'tel:' + item.telephone}>{item.telephone}</a></td>
          <td>{item.genre}</td>
        </tr>
      );

  }

  getStates(items) {
    var filteredStates = this.filterStates(items);
    return filteredStates
      .sort((a, b) => a.state > b.state ? 1 : -1)
      .map((item) =>
        <option value={item.state}>{item.state}</option>
      );
  }



  filterStates(items) {
    var newList = [];
    // eslint-disable-next-line
    items.map(item => {
      var currentState = item.state;
      if (!newList.some(item => item.state === currentState )) {
        newList = newList.concat(item);
      }
    })

    return newList;
  }

  getGenres(items) {
    var newList = [];
    var tokenList = [];

    //Build tokens
    // eslint-disable-next-line
    items.map(item => {
      var genre = item.genre;
      var tokens = genre.split(",");
    // eslint-disable-next-line
      tokens.map((token) =>{
        if(!tokenList.includes(token)){
          tokenList = tokenList.concat(token);
        }
      })
    });

    tokenList.sort();

    // eslint-disable-next-line
    tokenList.map(token => {
      newList = newList.concat(
        <option>{token}</option>
      )
    });

    return newList;
  }

}

export default Finder;