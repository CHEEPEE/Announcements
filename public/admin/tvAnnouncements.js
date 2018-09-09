function manageTVAnnouncements() {
  ReactDOM.render(
    <React.Fragment>
      <div className="row m-2 mt-3 text-dark">
        <h3>TV Announcements</h3>
      </div>

      <div className="row m-2">
        <div className="col-7" id = "TVAnnouncementContainer">
          <TVAnnouncementContainer />
        </div>
        <div className="col-5">
          <div className="p-3 shadow mr-3" id="featuresColumn">
          <h3 className = "text-info">Select Slider to Manage</h3>
          </div>
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
          interval: 2000,
          keyboard:true,
          pause:false
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
          className="d-block bg-white height300"
          alt="First slide"
          style={{
            backgroundImage: "url(" + this.props.imagePath + ")",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
        <div className = "row m-3  text-capitalized text-dark p-1">
          <h1>{this.props.caption}</h1>

          <textarea
          className = "form-control bg-transparent border-0"
          defaultValue = {this.props.des}
          rows = "15"
          disabled
          />

        </div>
        </div>
        
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
  componentDidMount() {
    this.getSliderItems();
  }
  render() {
    return (
      <div className="w-100 p-3">
        <div className="row">
          <h3>{this.props.categoryProperties.categegoryName}</h3>
        </div>
        <div className="container" id = "manageSliderContainer">
          <AddSlider key = {this.props.categoryProperties.id} categoryProperties = {this.props.categoryProperties} />
        </div>
        <div className="container-fluid" id="sliderItemsList" />
      </div>
    );
  }
}

class AddSlider extends React.Component {
    state = {
        imagePath: "",
        loadingState: "",
        type:"TVannouncement"
      };
  onfileSelect() {
    const superb = this;
    const storageRef = firebase.storage().ref();
    const file = $("#inputGroupFileUpdate").get(0).files[0];
    const name = +new Date() + "-" + file.name;
    const metadata = { contentType: file.type };
    const task = storageRef
      .child("announcementsImages")
      .child(name)
      .put(file, metadata);
    task.on(
      "state_changed",
      function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        superb.setState({
          loadingState: "Upload is " + progress + "% done"
        });
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function(error) {
        // Handle unsuccessful uploads
      },
      function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          superb.setState({
            imagePath: downloadURL,
            filename: name
          });
          console.log("File available at", downloadURL);
        });
      }
    );
  }
  saveAnnouncements() {
    let imagePath = this.state.imagePath;
    let sup = this;
    let announcementCaption = $("#announcementCaption").val();
    let announcementDetails = $("#announcementDetails").val();
    let details = announcementDetails;
    let categoryOptions = this.props.categoryProperties.id;
    let announcementType = this.state.type;
    let pushKey = ref.collection("announcements").doc().id;
    ref
      .collection("announcements")
      .doc(pushKey)
      .set({
        key: pushKey,
        announcementCaption: announcementCaption,
        announcementDetails: details,
        categoryOptions: categoryOptions,
        imagePath: imagePath,
        announcementType: announcementType,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function(docRef) {
        $("#announcementCaption").val("");
        $("#announcementDetails").val("");
        sup.setState({
          imagePath: "",
          loadingState: ""
        });

        ReactDOM.render(
          <TVAnnouncementContainer />,
          document.querySelector("#TVAnnouncementContainer")
        )
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <h3 className="text-info">Add Slider</h3>
        </div>
        <div className="row pr-5  mt-3">
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Annoucement Title
            </label>
            <input
              type="email"
              className="form-control border-0 bg-light"
              id="announcementCaption"
              aria-describedby="emailHelp"
              placeholder="Title"
            />
          </div>
        </div>
        <div className="row pr-5  mt-3">
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Annoucement Description
            </label>
            <textarea
              className="form-control border-0 bg-light"
              id="announcementDetails"
              placeholder="Description"
              rows="7"
            />
          </div>
        </div>
        <div className="row pr-5  mt-3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroupFileAddon01">
                Upload
              </span>
            </div>
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="inputGroupFileUpdate"
                onChange={this.onfileSelect.bind(this)}
                aria-describedby="inputGroupFileAddon01"
              />
              <label class="custom-file-label" for="inputGroupFile01">
                Choose file
              </label>
            </div>
          </div>
        </div>
        <div className="row pr-5  mt-3">
          <div className="col-sm-12">
            <img
              className="w-100"
              id="imageToUpload"
              src={this.state.imagePath}
            />
          </div>
        </div>
        <div className="row">{this.state.loadingState}</div>
       
        <div className="row mt-3 pr-5">
          <button
            type="submit"
            onClick={this.saveAnnouncements.bind(this)}
            class="btn btn-dark w-100"
          >
            Add Annoucement
          </button>
        </div>
      </div>
    );
  }
}
class TVSliderItem extends React.Component {
  state = {
    active: this.props.active,
    deleteEx: "d-none",
    imagePath: "",
    loadingState: "",
    type:"TVannouncement"
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
  updateAnnouncement() {
    ReactDOM.render(
      <UpdateTVAnnouncement key = {this.props.id} credentials={this.props} />,
      document.querySelector("#manageSliderContainer")
    );
  }
  render() {
    return (
      <div className="row mt-3">
        <div
          className="d-block bg-white height200 w-100"
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
              <button
                type="button"
                class="btn btn-info m-3"
                onClick = {this.updateAnnouncement.bind(this)}
              >
                Update
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
          <div className = "row text-dark text-capitalized font-weight-bold ml-1 p-3">
            <h5 className = "text-capitalized ml-1">
            {this.props.caption}
            </h5>
          </div>
        </div>
      </div>
    );
  }
}
class UpdateTVAnnouncement extends React.Component {
  state = {
    imagePath: this.props.credentials.imagePath
  };

  saveAnnouncements() {
    let announcementCaption = $("#announcementCaption").val();
    let announcementDetails = $("#announcementDetails").val();
    let sup = this;
    ref
      .collection("announcements")
      .doc(this.props.credentials.id)
      .update({
        announcementCaption: announcementCaption,
        announcementDetails: announcementDetails,
        imagePath: this.state.imagePath
      })
      .then(function() {
        ReactDOM.render(
          <React.Fragment>
            <div class="alert alert-success" role="alert">
              A simple success alert—check it out!
            </div>
            <ManageSlider key={sup.props.credentials.id} categoryProperties={sup.props.credentials} />,
          </React.Fragment>,
          document.querySelector("#manageSliderContainer")
        );
      });
  }
  onfileSelect() {
    const superb = this;
    const storageRef = firebase.storage().ref();
    const file = $("#inputGroupFileUpdate").get(0).files[0];
    const name = +new Date() + "-" + file.name;
    const metadata = { contentType: file.type };
    const task = storageRef
      .child("announcementsImages")
      .child(name)
      .put(file, metadata);
    task.on(
      "state_changed",
      function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        superb.setState({
          loadingState: "Upload is " + progress + "% done"
        });
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function(error) {
        // Handle unsuccessful uploads
      },
      function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          superb.setState({
            imagePath: downloadURL,
            filename: name
          });
          console.log("File available at", downloadURL);
        });
      }
    );
  }
  render() {
    return (
      <React.Fragment>
        <div className="row pr-5">
          <h3 className="text-dark">Update</h3>
        </div>

        <div className="row pr-5  mt-3">
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Annoucement Caption
            </label>
            <input
              type="text"
              defaultValue={this.props.credentials.caption}
              className="form-control border-0 bg-light"
              id="announcementCaption"
              aria-describedby="emailHelp"
              placeholder="Caption"
            />
          </div>
        </div>
        <div className="row pr-5  mt-3">
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Annoucement Description
            </label>
            <textarea
              className="form-control border-0 bg-light"
              id="announcementDetails"
              placeholder="Description"
              rows="7"
              defaultValue={this.props.credentials.des}
            />
          </div>
        </div>
        <div className="row pr-5  mt-3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroupFileAddon01">
                Upload
              </span>
            </div>
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="inputGroupFileUpdate"
                onChange={this.onfileSelect.bind(this)}
                aria-describedby="inputGroupFileAddon01"
              />
              <label class="custom-file-label" for="inputGroupFile01">
                Choose file
              </label>
            </div>
          </div>
        </div>
        <div className="row pr-5  mt-3">
          <div className="col-sm-12">
            <img
              className="w-100"
              id="imageToUpload"
              src={this.state.imagePath}
            />
          </div>
        </div>
        <div className="row">{this.state.loadingState}</div>

        <div className="row mt-3 pr-5">
          <button
            type="submit"
            onClick={this.saveAnnouncements.bind(this)}
            class="btn btn-dark w-100"
          >
            Save changes
          </button>
        </div>
      </React.Fragment>
    );
  }
}