const root = document.getElementById("root");

function renderRoot() {
  ReactDOM.render(
    <React.Fragment>
      <div className="col-lg-4 d-none d-lg-block col-sm-12 pt-5">
        <SideNav />
      </div>

      <div className="col-lg-7 p-3 col-sm-12 pt-5">
        <MainRoot category={"Announcements"} />
        <BotNav/>
      </div>
    </React.Fragment>,
    root
  );
}
class SideNav extends React.Component {
  componentDidMount() {
    ref
      .collection("announcementCategory")
      
      .orderBy("timestamp")
      .onSnapshot(function(querySnapshot) {
        let categoryObjects = [];
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          categoryObjects.push(doc.data());
        });

        var listItem = categoryObjects.map(object => (
          <SideNavMenuItem
            key={object.key}
            id={object.key}
            categoryName={object.categoryName}
          />
        ));
        ReactDOM.render(
          <React.Fragment>{listItem}</React.Fragment>,
          document.querySelector("#sideMenus")
        );
      });
  }
  render() {
    return (
      <div className = "h-100 d-none d-lg-block bg-white p-5 position-fixed">
        <div class="list-group" id="sideMenus" role="tablist" />
      </div>
    
    );
  }
}
class BotNav extends React.Component {
    componentDidMount() {
      ref
        .collection("announcementCategory")
        .orderBy("timestamp")
        .onSnapshot(function(querySnapshot) {
          let categoryObjects = [];
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            categoryObjects.push(doc.data());
          });
  
          var listItem = categoryObjects.map(object => (
            <BotMenuItems
              key={object.key}
              id={object.key}
              categoryName={object.categoryName}
            />
          ));
          ReactDOM.render(
            <React.Fragment>{listItem}</React.Fragment>,
            document.querySelector("#botMenus")
          );
        });
    }
    state ={
        botMenuExtend:"d-none",
        menu: "Menu"
    }
    botMenuExtend(){
        this.setState({
            botMenuExtend: this.state.botMenuExtend == "d-none"? "visible":"d-none",
            menu: this.state.menu == "Menu"? "Close":"Menu"
        })
    }
    getAnnouncements() {
      ReactDOM.render(
      <React.Fragment>Announcements</React.Fragment>,
      document.querySelector("#AnnouncementsCategoryName")
       );
      ReactDOM.render(
        <React.Fragment>No Announcements</React.Fragment>,
        document.querySelector("#annoucementsList")
      );
      ref.collection("announcements").orderBy("timestamp").onSnapshot(function(querySnapshot) {
        let categoryObjects = [];
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
  
          var details = doc.data().announcementDetails;
          console.log(details);
          let repdetails = details;
          let obj = {
            key: doc.data().key,
            announcementCaption: doc.data().announcementCaption,
            announcementDetails: repdetails,
            imagePath:doc.data().imagePath
          };
          categoryObjects.push(obj);
        });
        categoryObjects.reverse();
        var listItem = categoryObjects.map(object => (
          <AnnouncementItem
            key={object.key}
            id={object.key}
            caption={object.announcementCaption}
            des={object.announcementDetails}
            imagePath = {object.imagePath}
          />
        ));
        ReactDOM.render(
          <React.Fragment>{listItem}</React.Fragment>,
          document.querySelector("#annoucementsList")
        );
      });
    }
    render() {
      return (
        <div className = "w-100 d-lg-none fixed-bottom bg-dark p-2">
            <div className = "row text-white ml-2 mb-2" onClick = {this.botMenuExtend.bind(this)}>
           <div className = "align-middle">{this.state.menu}</div>
            </div>
          <div className = {"pl-1 "+this.state.botMenuExtend}>
          <div className = "row text-white ml-2 mb-2" onClick ={this.getAnnouncements.bind(this)}>
             <div className = "align-middle">Announcements</div>
          </div>
            <div className = "row" id = "botMenus">
                <div className = "col pl-4 mt-3 text-white">
                Loading . . .
                </div>
            </div>
          </div>
        </div>
      );
    }
  }
class SideNavMenuItem extends React.Component {
  state = {};
  getAnnouncementsBasedCat(){
    getAnnouncements(this.props.id,this.props.categoryName);
  }
  render() {
    return (
      <a onClick = {this.getAnnouncementsBasedCat.bind(this)}
        className="list-group-item border-0 rounded-0 list-group-item-action"
        href="#"
        data-toggle="list"
      >
        {this.props.categoryName}
      </a>
    );
  }
}
class BotMenuItems extends React.Component {
    state = {};
    getAnnouncementsBasedCat(){
      getAnnouncements(this.props.id,this.props.categoryName);
    }
    render() {
      return (
        <a onClick = {this.getAnnouncementsBasedCat.bind(this)}
          className="list-group-item text-white bg-dark border-0 rounded-0 list-group-item-action"
          href="#"
          data-toggle="list"
        >
          {this.props.categoryName}
        </a>
      );
    }
  }

class MainRoot extends React.Component {
  state = {};
  getAnnouncements() {
    ReactDOM.render(
      <React.Fragment>No Announcements</React.Fragment>,
      document.querySelector("#annoucementsList")
    );
    ref.collection("announcements")
    .where("announcementType", "==", "announcement")
    .orderBy("timestamp").onSnapshot(function(querySnapshot) {
      let categoryObjects = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        var details = doc.data().announcementDetails;
        console.log(details);
        let repdetails = details;
        let obj = {
          key: doc.data().key,
          announcementCaption: doc.data().announcementCaption,
          announcementDetails: repdetails,
          imagePath:doc.data().imagePath
        };
        categoryObjects.push(obj);
      });
      categoryObjects.reverse();
      var listItem = categoryObjects.map(object => (
        <AnnouncementItem
          key={object.key}
          id={object.key}
          caption={object.announcementCaption}
          des={object.announcementDetails}
          imagePath = {object.imagePath}
        />
      ));
      ReactDOM.render(
        <React.Fragment>{listItem}</React.Fragment>,
        document.querySelector("#annoucementsList")
      );
    });
  }
  componentDidMount() {
    this.getAnnouncements();
  }
  render() {
    return (
      <React.Fragment>
        <div className="row">
        <h1 className = "text-dark font-weight-light pl-3" id = "AnnouncementsCategoryName">{this.props.category}</h1>
        </div>
        <div className="row pb-5">
          <div class="list-group" id="annoucementsList" role="tablist" />
        </div>
      </React.Fragment>
    );
  }
}



class AnnouncementItem extends React.Component {
  state = {};
  render() {
    return (
      <React.Fragment>
    
      <div className="list-group-item-action list-group-item text-dark w-100 bg-white shadow-sm border-0 mt-3 flex-column align-items-start">
        <div className="font-weight-bold text-info pl-3">
          <div className="row">
            <small></small>
          </div>
          <div className="row text-info text-capitalize">
            <h5>{this.props.caption}</h5>
          </div>
        </div>
        
        <img className = "w-100 rounded shadow-sm mt-2 mb-2" style = {{height:'auto'}} src = {this.props.imagePath} />
    
        <div className="text-dark pl-3 pr-3">
          <div className="row">
            <small className="text-info"></small>
          </div>
          <div className="row">
            <div className = "text-justify">
            {this.props.des}
            </div>
          </div>
        </div>
      </div>
      </React.Fragment>
    );
  }
}

renderRoot();

function getAnnouncements(categoryid,categoryName){
  AnnouncementsCategoryName
  ReactDOM.render(
    <React.Fragment>No Announcements</React.Fragment>,
    document.querySelector("#annoucementsList")
     );
     ReactDOM.render(
      <React.Fragment>{categoryName}</React.Fragment>,
      document.querySelector("#AnnouncementsCategoryName")
       );
    ref.collection("announcements")
    .where("categoryOptions", "==", categoryid)
    .where("announcementType", "==", "announcement")
    .orderBy("timestamp").onSnapshot(function(querySnapshot) {
      let categoryObjects = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        var details = doc.data().announcementDetails;
        console.log(details);
        let repdetails = details;
        let obj = {
          key: doc.data().key,
          announcementCaption: doc.data().announcementCaption,
          announcementDetails: repdetails,
          imagePath:doc.data().imagePath
        };
        categoryObjects.push(obj);
      });
      categoryObjects.reverse();
      var listItem = categoryObjects.map(object => (
        <AnnouncementItem
          key={object.key}
          id={object.key}
          caption={object.announcementCaption}
          des={object.announcementDetails}
          imagePath = {object.imagePath}
        />
      ));
      ReactDOM.render(
        <React.Fragment>{listItem}</React.Fragment>,
        document.querySelector("#annoucementsList")
      );
    });
}
