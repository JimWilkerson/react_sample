import React from 'react';

class PageNav extends React.Component {
    render() {
        var pageCount = this.props.pageCount;
        var listElements = [];

        for (var lp = 0; lp < pageCount; lp++) {
            listElements = listElements.concat(
                <li onClick={this.props.setPage} class="page-item"><button class="page-link" href="#">{lp + 1}</button></li>
            );
        }

        return (
            <nav>
                <ul class="pagination justify-content-center">
                    <li onClick={this.props.setPage} class="page-item"><button class="page-link" href="#">Previous</button></li>
                    {listElements}
                    <li onClick={this.props.setPage} class="page-item"><button class="page-link" href="#">Next</button></li>
                </ul>
            </nav>);
    }

}

export default PageNav;