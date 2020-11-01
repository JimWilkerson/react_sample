import React from 'react';

class SearchPanel extends React.Component {

    render() {
        return (
            <div class="float-right" style={{padding:'10px'}}>
                <input />
                <i 
                class="fa fa-search fa-lg" 
                style={{margin:'5px'}}
                aria-hidden="true">
                </i>
            </div>
            );
    }
}

export default SearchPanel;
