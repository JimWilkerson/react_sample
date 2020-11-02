import React from 'react';

class SearchPanel extends React.Component {

    render() {
        return (
            <div class="float-right" style={{ padding: '10px' }}>
                <input
                    type="text"
                    id="searchBox"
                    onBlur={this.search.bind(this)}
                    onKeyUp={this.onKeyUpValue.bind(this)}
                />
                <i
                    onClick={this.search.bind(this)}
                    class="fa fa-search fa-lg"
                    style={{ margin: '5px' }}
                    aria-hidden="true">
                </i>
            </div>
        );
    }

    onKeyUpValue(event) {
        if (event.code === 'Enter') {
            this.search();
        }
    }

    search() {
        var text = document.getElementById("searchBox").value;
        this.props.search(text);
    }
}

export default SearchPanel;
