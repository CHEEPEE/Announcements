function manageTVAnnouncements() {
  ReactDOM.render(
    <React.Fragment>
      <div className="row m-2 mt-3 text-dark">
        <h3>TV Announcements</h3>
      </div>

      <div className="row m-2">
        <div className="col-8">
          <TVAnnouncementContainer />
        </div>
        <div className = "col-4">
        <div className="p-3 shadow mr-3" id="featuresColumn" />
        </div>
      </div>
    </React.Fragment>,
    document.querySelector("#mainContainer")
  );
}

class TVAnnouncementContainer extends React.Component {
  state = {};
  getCategory() {
    ref.collection("announcementCategory").onSnapshot(function(querySnapshot) {
      console.log(querySnapshot);
      let categoryObjects = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        categoryObjects.push(doc.data());
      });
      var listItem = categoryObjects.map(object => (
        <CategryContainer
          key={object.key}
          id={object.key}
          categegoryName={object.categoryName}
        />
      ));
      ReactDOM.render(
        <React.Fragment>{listItem}</React.Fragment>,
        document.querySelector("#TVCategory")
      );
    });
  }
  componentDidMount() {
    this.getCategory();
  }

  render() {
    return (
      <React.Fragment>
        <div className="row p-4" id="TVCategory" />
      </React.Fragment>
    );
  }
}

class CategryContainer extends React.Component {
  state = {};

  getTvAnnouncement() {
    let sup = this;
    ref
      .collection("announcements")
      .where("categoryOptions", "==", this.props.id)
      .where("announcementType", "==", "TVannouncement")
      .orderBy("timestamp")
      .onSnapshot(function(querySnapshot) {
        let categoryObjects = [];
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots

          var details = doc.data().announcementDetails;

          let repdetails = details;
          let obj = {
            key: doc.data().key,
            announcementCaption: doc.data().announcementCaption,
            announcementDetails: repdetails,
            imagePath: doc.data().imagePath
          };
          categoryObjects.push(obj);
        });

        // for each end
        categoryObjects.reverse();
        var listItem = categoryObjects.map(function(object, index) {
          let active = "";
          if (index == 0) {
            active = "active";
          }

          return (
            <CategoryItemSlider
              key={object.key}
              id={object.key}
              caption={object.announcementCaption}
              des={object.announcementDetails}
              imagePath={object.imagePath}
              active={active}
            />
          );
        });

        ReactDOM.render(
          <React.Fragment>{listItem}</React.Fragment>,
          document.querySelector("#sliderItems" + sup.props.id)
        );
        $(".carousel").carousel({
          interval: 2000
        });
      });
  }

  manageSlider() {
    ReactDOM.render(
      <ManageSlider key={this.props.id} categoryProperties={this.props} />,
      document.querySelector("#featuresColumn")
    );
  }

  componentDidMount() {
    this.getTvAnnouncement();
  }

  render() {
    return (
      <div className="container-fluid mb-3">
        <div className="row text-info ml-1 mb-1">
          {this.props.categegoryName}
        </div>
        <div className="row ml-1 mb-1">
          <button
            type="button"
            class="btn btn-info "
            onClick={this.manageSlider.bind(this)}
          >
            Manage Slider
          </button>
        </div>

        <div
          id="carouselExampleFade"
          class="carousel slide"
          data-ride="carousel"
        >
          {/* put slider items here */}
          <div
            class="carousel-inner shadow rounded "
            id={"sliderItems" + this.props.id}
          />
        </div>
      </div>
    );
  }
}
class CategoryItemSlider extends React.Component {
  state = {
    active: this.props.active
  };
  render() {
    return (
      <div class={"carousel-item " + this.state.active}>
        <div
          className="d-block height300"
          alt="First slide"
          style={{
            backgroundImage: "url(" + this.props.imagePath + ")",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
    );
  }
}

class ManageSlider extends React.Component {
  state = {};
  getSliderItems() {
    ref
      .collection("announcements")
      .where("categoryOptions", "==", this.props.categoryProperties.id)
      .where("announcementType", "==", "TVannouncement")
      .orderBy("timestamp")
      .onSnapshot(function(querySnapshot) {
        let categoryObjects = [];
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          categoryObjects.push(doc.data());
        });

        // for each end
        categoryObjects.reverse();
        var listItem = categoryObjects.map(function(object, index) {
          return (
          
            <TVSliderItem
              key={object.key}
              id={object.key}
              caption={object.announcementCaption}
              des={object.announcementDetails}
              imagePath={object.imagePath}
            />
        
          );
        });

        ReactDOM.render(
          <React.Fragment>{listItem}</React.Fragment>,
          document.querySelector("#sliderItemsList")
        );
      });
  }
  componentDidMount(){
      this.getSliderItems();
  }
  render() {
    return (
      <div className = "w-100 p-3">
        <div className="row">
          <h3>{this.props.categoryProperties.categegoryName}</h3>
        </div>
        <div className="row">
          <button type="button" class="btn btn-info">
            Add Slider
          </button>
        </div>
        <div className="container-fluid" id="sliderItemsList" />
      </div>
    );
  }
}

class AddSlider extends React.Component {
    state = {  }
    render() { 
        return ( 
            <React.Fragment>
                <div className = "row">
                <h3 className = "text-info">
                    Add Slider
                </h3>
                </div>
                <div className = "row">
                
                </div>
            </React.Fragment>
         );
    }
}
class TVSliderItem extends React.Component {
    state = {
      active: this.props.active,
      deleteEx: "d-none"
    };
  
    extendDelete() {
      this.setState({
        deleteEx: this.state.deleteEx == "d-none" ? "visible" : "d-none"
      });
    }
    deleteAnnouncement() {
      ref
        .collection("announcements")
        .doc(this.props.id)
        .delete();
    }
    render() {
      return (
        <div className="row mt-3">
          <div
            className="d-block height200 w-100"
            alt="First slide"
            style={{
              backgroundImage: "url(" + this.props.imagePath + ")",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  class="btn btn-danger m-3"
                  onClick={this.extendDelete.bind(this)}
                >
                  Delete
                </button>
              </div>
              <div className="col">
                <div
                  class={"alert alert-danger m-3 " + this.state.deleteEx}
                  role="alert"
                >
                  <div className="row ">
                    <div className="col">Delete Slider Item?</div>
                    <div
                      className="col text-right text-primary"
                      onClick={this.deleteAnnouncement.bind(this)}
                    >
                      Yes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

