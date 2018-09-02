function manageTVAnnouncements(){
    ReactDOM.render(
        <React.Fragment>
        <div className = "row m-2 mt-3 text-dark">
           <h3>
               TV Announcements
            </h3> 
        </div>
        <div className = "row m-2">
            <div className = "col">
            
            </div>
            <div className = "col" id = "featuresColumn">
                <TVAnnouncementContainer/>
            </div>
            
        </div>
    
        </React.Fragment>
        ,document.querySelector("#mainContainer")
    );
}


class TVAnnouncementContainer extends React.Component {
    state = {  }
 
    render() {
        return (
            <React.Fragment>
                <div className = "row">
                    TV Announcements
                </div>
                <div className = "row">
                    
                </div>
            </React.Fragment>
         );
    }
}
