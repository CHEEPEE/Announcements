firebaseApp.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    ref
      .collection("accounts")
      .doc(user.uid)
      .onSnapshot(function(querySnapshot) {
        ref
          .collection("announcementCategory")
          .doc(querySnapshot.data().categoryId)
          .onSnapshot(function(snap) {
            ReactDOM.render(
              <React.Fragment>{snap.data().categoryName}</React.Fragment>,
              document.querySelector("#departmentName")
            );
          });
        console.log(querySnapshot.data());
        ReactDOM.render(
          <AnnouncementsComtainer
            categoryId={querySnapshot.data().categoryId}
          />,
          document.querySelector("#mainContainer")
        );
      });
  } else {
  }
});

//****************************************************************************************************************/
class AnnouncementsComtainer extends React.Component {
  state = {
    announcementStatus: "text-info border-bottom p-2 border-info",
    tvAnnouncementStats: "text-black-50 p-2"
  };
  getAnnouncements() {
    ReactDOM.render(
      <AddAnnouncements
        categoryId={this.props.categoryId}
        type={"announcement"}
      />,
      document.querySelector("#funtionContainer")
    );
    ref
      .collection("announcements")
      .where("announcementType", "==", "announcement")
      .where("categoryOptions", "==", this.props.categoryId)
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
            imagePath: doc.data().imagePath,
            categoryOptions: doc.data().categoryOptions
          };
          categoryObjects.push(obj);
        });
        categoryObjects.reverse();
        var listItem = categoryObjects.map(object => (
          <AnnouncementItem
            key={object.key}
            id={object.key}
            categoryId={object.categoryOptions}
            caption={object.announcementCaption}
            des={object.announcementDetails}
            imagePath={object.imagePath}
          />
        ));
        ReactDOM.render(
          <React.Fragment>{listItem}</React.Fragment>,
          document.querySelector("#announcementsList")
        );
      });
  }
  getTVAnnouncements() {
    ReactDOM.render(
      <AddAnnouncements
        categoryId={this.props.categoryId}
        type={"TVannouncement"}
      />,
      document.querySelector("#funtionContainer")
    );
    ref
      .collection("announcements")
      .where("announcementType", "==", "TVannouncement")
      .where("categoryOptions", "==", this.props.categoryId)
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
        categoryObjects.reverse();
        var listItem = categoryObjects.map(function(object, index) {
          if (index != 0) {
            return (
              <TVitem
                key={object.key}
                id={object.key}
                caption={object.announcementCaption}
                des={object.announcementDetails}
                imagePath={object.imagePath}
              />
            );
          }
        });
        var listActive = categoryObjects.map(function(object, index) {
          if (index == 0) {
            return (
              <TVitem
                key={object.key}
                id={object.key}
                caption={object.announcementCaption}
                des={object.announcementDetails}
                imagePath={object.imagePath}
                active={"active"}
              />
            );
          }
        });
        var picItem = categoryObjects.map(function(object, index) {
          let active = "";
          if (index == 0) {
            active = "active";
          } else {
            active = "notactive";
          }

          return (
            <PictureItem
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
          <React.Fragment>
            <div
              id="carouselExampleControls"
              className="carousel slide height300"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                {listActive}
                {listItem}
              </div>
              <a
                className="carousel-control-prev text-info"
                href="#carouselExampleControls"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next text-info"
                href="#carouselExampleControls"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Next</span>
              </a>
            </div>

            <div className="row mt-3 pl-3 ">
              <h3 className="text-muted">Slider Items</h3>
            </div>
            <div className="container-fluid" id="picItemsContainer" />
          </React.Fragment>,
          document.querySelector("#announcementsList")
        );

        ReactDOM.render(
          <React.Fragment>{picItem}</React.Fragment>,
          document.querySelector("#picItemsContainer")
        );
        $(".carousel").carousel({
          interval: 2000,
          keyboard: true,
          pause: false
        });
      });
  }
  setAnnouncementActive() {
    this.setState({
      announcementStatus: "text-info border-bottom p-2 border-info",
      tvAnnouncementStats: "text-black-50 p-2"
    });
    this.getAnnouncements();
  }
  setTVAnnouncementActive() {
    this.setState({
      tvAnnouncementStats: "text-info border-bottom p-2 border-info",
      announcementStatus: "text-black-50 p-2"
    });
    this.getTVAnnouncements();
  }
  componentDidMount() {
    this.getAnnouncements();
  }
  render() {
    return (
      <div className="row m-3">
        <div className="col-sm-7 mt-3">
          <div className="row">
            <div className="col">
              <h3
                onClick={this.setAnnouncementActive.bind(this)}
                className={this.state.announcementStatus}
              >
                Announcements
              </h3>
            </div>
            <div className="col">
              <h3
                onClick={this.setTVAnnouncementActive.bind(this)}
                className={this.state.tvAnnouncementStats}
              >
                TV Annoucement
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="list-group w-100 mr-4" id="announcementsList" />
          </div>
        </div>
        <div className="col-sm-5 mt-3" id="funtionContainer">
          <AddAnnouncements type={"announcement"} key={"announcement"} />
        </div>
      </div>
    );
  }
}
//****************************************************************************************************************/
class AnnouncementItem extends React.Component {
  state = {
    deleteEx: "d-none",
    departmentName: "",
    announcementCredentials: ""
  };
  getCategoryName() {
    let sup = this;

    ref
      .collection("announcementCategory")
      .doc(this.props.categoryId)
      .onSnapshot(function(querySnapshot) {
        console.log(querySnapshot.data().categoryName);
        sup.setState({
          departmentName: querySnapshot.data().categoryName
        });
      });
  }

  renderUpdate() {
    ReactDOM.render(
      <UpdateAnnouncement
        key={this.state.announcementCredentials.key}
        credentials={this.state.announcementCredentials}
      />,

      document.querySelector("#funtionContainer")
    );
  }
  UpdateAnnouncement() {
    let sup = this;
    console.log(this.props.id);
    let id = this.props.id;
    ref
      .collection("announcements")
      .doc(id)
      .onSnapshot(function(querySnapshot) {
        console.log(querySnapshot.data());
        sup.setState({
          announcementCredentials: querySnapshot.data()
        });
        sup.renderUpdate();
      });
  }

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
  componentDidMount() {
    this.getCategoryName();
  }
  render() {
    return (
      <div className="list-group-item text-dark w-100 bg-white shadow-sm border-0 mt-3 list-group-item-action flex-column align-items-start">
        <div className="row font-weight-bold text-info pl-3">
          <div className="col-sm-12">
            <small>Caption</small>
          </div>
          <div className="col-sm-12">
            <h5>{this.props.caption}</h5>
          </div>
        </div>

        <div className="col">
          <img
            className="img-fluid w-100"
            style={{ height: "auto" }}
            src={this.props.imagePath}
          />
        </div>

        <div className="row pl-3">
          <div className="col-sm-12">
            <small className="text-muted">
              Announcement / {this.state.departmentName}{" "}
            </small>
          </div>
          <textarea
              className="form-control bg-transparent border-0"
              defaultValue={this.props.des}
              rows="7"
              disabled
            />
        </div>
        <div className="row pl-3">
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
            onClick={this.UpdateAnnouncement.bind(this)}
          >
            Update
          </button>
        </div>
        <div className="row pl-3 w-100 mt-1">
          <div
            class={"alert alert-danger w-100 " + this.state.deleteEx}
            role="alert"
          >
            <div className="row">
              <div className="col">Are you sure you want to delete this?</div>{" "}
              <div
                className
                onClick={this.deleteAnnouncement.bind(this)}
                className="col text-right  text-primary"
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//****************************************************************************************************************/
class AddAnnouncements extends React.Component {
  state = {
    imagePath: "",
    loadingState: "",
    type: this.props.type,
    expireVisibility:this.props.type == "TVannouncement" ? "visible":"d-none"
    
  };
  getCategories() {
    ref.collection("announcementCategory").onSnapshot(function(querySnapshot) {
      let categoryObjects = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        categoryObjects.push(doc.data());
      });

      var listItem = categoryObjects.map(object => (
        <OptionItem
          key={object.key}
          id={object.key}
          value={object.key}
          name={object.categoryName}
        />
      ));
      ReactDOM.render(
        <React.Fragment>{listItem}</React.Fragment>,
        document.querySelector("#categoryOptions")
      );
    });
  }
  saveAnnouncements() {
    let imagePath = this.state.imagePath;
    let sup = this;
    let announcementCaption = $("#announcementCaption").val();
    let announcementDetails = $("#announcementDetails").val();
    let details = announcementDetails;
    let categoryOptions = this.props.categoryId;
    let announcementType = this.props.type;
    let pushKey = ref.collection("announcements").doc().id;
    let exDate = $("#announcementDate").val();
    let exTime = $("#announcementTime").val();
    let expiresAt = dateAndTimeVal(exDate,exTime);
    if(exTime !="" && exDate == ""){
      alert("Input Date");
    }
    else if(announcementCaption.split(" ").join("")=="" && announcementCaption.split(" ").join("")=="" && imagePath == ""){
      alert("Announcement Caption or Announcement Description");
    }
    else{  
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
        exDate:exDate,
        exTime:exTime,
        expiresAt:expiresAt,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(function(docRef) {
        $("#announcementCaption").val("");
        $("#announcementDetails").val("");
        $("#announcementDate").val("");
        $("#announcementTime").val("");
        sup.setState({
          imagePath: "",
          loadingState: ""
        });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }
  }
  componentDidMount() {
    this.getCategories();
    console.log(this.props.type)
    let sup = this;
    setInterval(function(){
      sup.setState({
        expireVisibility:sup.props.type == "TVannouncement" ? "visible":"d-none"
      })
    },1000)
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
          <h3 className="text-dark">Add {this.props.type}</h3>
        </div>
        {/* <div className="row pr-5 mt-3">
            <div class="form-group w-100">
              <label for="exampleFormControlSelect1">Announcement Type</label>
              <select class="form-control w-100" id="announcementType">
                <option value="announcement">Announcement</option>
                <option value="TVannouncement">TV Announcement</option>
              </select>
            </div>
          </div> */}
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
        <div className={"row pr-5  mt-3 "+this.state.expireVisibility}>
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Set Expiration Date and Time
            </label>
            <div className="row">
              <div className="col">
                <input
                  type="date"
                  className="form-control border-0 bg-light"
                  id="announcementDate"
                  
                  aria-describedby="emailHelp"
                  placeholder="Caption"
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  
                  className="form-control border-0 bg-light"
                  id="announcementTime"
                  aria-describedby="emailHelp"
                  placeholder="Caption"
                />
              </div>
            </div>
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
        {/* <div className="row pr-5 mt-3">
            <div class="form-group w-100">
              <label for="exampleFormControlSelect1">Category Select</label>
              <select class="form-control w-100" id="categoryOptions" />
            </div>
          </div> */}

        <div className="row mt-3 pr-5">
          <button
            type="submit"
            onClick={this.saveAnnouncements.bind(this)}
            class="btn btn-dark w-100"
          >
            Add Announcement
          </button>
        </div>
      </React.Fragment>
    );
  }
}

//****************************************************************************************************************/
class OptionItem extends React.Component {
  state = {};
  render() {
    return <option value={this.props.value}>{this.props.name}</option>;
  }
}
//****************************************************************************************************************/
class TVitem extends React.Component {
  state = {
    active: this.props.active,
    backgroundColor: this.props.bg
  };
  render() {
    return (
      <div class={"carousel-item " + this.state.active}>
        <div
          className="d-block bg-white p-3 height300 w-100"
          alt="First slide"
          style={{
            backgroundImage: "url(" + this.props.imagePath + ")",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <h3 className="text-info pl-2">{this.props.caption}</h3>
           <textarea
                className="form-control h-100 text-dark bg-transparent border-0"
                placeholder="Description"
                disabled
                value={this.props.des}
              />
        
        </div>
      </div>
    );
  }
}
//****************************************************************************************************************/
class PictureItem extends React.Component {
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
  renderUpdate() {
    ReactDOM.render(
      <UpdateAnnouncement
        key={this.state.announcementCredentials.key}
        credentials={this.state.announcementCredentials}
      />,

      document.querySelector("#funtionContainer")
    );
  }
  UpdateAnnouncement() {
    let sup = this;
    console.log(this.props.id);
    let id = this.props.id;
    ref
      .collection("announcements")
      .doc(id)
      .onSnapshot(function(querySnapshot) {
        console.log(querySnapshot.data());
        sup.setState({
          announcementCredentials: querySnapshot.data()
        });
        sup.renderUpdate();
      });
  }
  render() {
    return (
      <div className="row mt-5">
        <div
          className="d-block shadow bg-transparent rounded height300 w-100"
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
                onClick={this.UpdateAnnouncement.bind(this)}
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
          <div className="contianer-fluid h-100 p-3">
            <div className="ml-1 row">
              <h3 className="text-info">{this.props.caption}</h3>
            </div>
            <div className="row h-75">
              <textarea
                className="form-control ml-2 h-100 text-dark bg-transparent border-0"
                id="itemannouncementDetails"
                placeholder="Description"
                disabled
                value={this.props.des}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//****************************************************************************************************************/
class UpdateAnnouncement extends React.Component {
  state = {
    loadingState: " ",
    announcementObj: " ",
    emailValue: this.props.credentials.announcementCaption,
    imagePath: this.props.credentials.imagePath,
    categoryId: this.props.credentials.categoryId,
    expireVisibility:this.props.credentials.announcementType == "TVannouncement"?"visible":"d-none",

    filename: name
  };
  componentDidMount() {
    this.setState({
      announcementId: this.props.credentials.key,
      emailValue: this.props.credentials.announcementCaption
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

  saveAnnouncements() {
    let announcementCaption = $("#announcementCaption").val();
    let announcementDetails = $("#announcementDetails").val();
    let sup = this;
    let exDate = $("#announcementDate").val();
    let exTime = $("#announcementTime").val();
    let expiresAt = dateAndTimeVal(exDate,exTime);
   
    if(exTime !="" && exDate == ""){
      alert("Input Date");
    }
    else{    
    ref
      .collection("announcements")
      .doc(this.props.credentials.key)
      .update({
        announcementCaption: announcementCaption,
        announcementDetails: announcementDetails,
        exDate:exDate,
        exTime:exTime,
        expiresAt:expiresAt,
        imagePath: this.state.imagePath
      })
      .then(function() {
        ReactDOM.render(
          <React.Fragment>
            <div className="row">
              <div class="alert alert-success w-100" role="alert">
                Updated successfully
              </div>
            </div>
            <AddAnnouncements
              categoryId={sup.props.credentials.categoryOptions}
              type={sup.props.credentials.announcementType}
            />
          </React.Fragment>,
          document.querySelector("#funtionContainer")
        );
      });
    }
  }

  componentDidMount() {
    console.log(this.props);
  }
  render() {
    return (
      <React.Fragment>
        <div className="row pr-5">
          <h3 className="text-dark">
            Update {this.props.credentials.announcementType}
          </h3>
        </div>

        <div className="row pr-5  mt-3">
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Annoucement Caption
            </label>
            <input
              type="text"
              defaultValue={this.state.emailValue}
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
              defaultValue={this.props.credentials.announcementDetails}
            />
          </div>
        </div>
        <div className={"row pr-5  mt-3 "+this.state.expireVisibility}>
          <div className="form-group w-100">
            <label className="text-secondary" for="exampleInputEmail1">
              Set Expiration Date and Time
            </label>
            <div className="row">
              <div className="col">
                <input
                  type="date"
                  className="form-control border-0 bg-light"
                  id="announcementDate"
                  defaultValue={this.props.credentials.exDate}
                  aria-describedby="emailHelp"
                  placeholder="Caption"
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  defaultValue={this.props.credentials.exTime}
                  className="form-control border-0 bg-light"
                  id="announcementTime"
                  aria-describedby="emailHelp"
                  placeholder="Caption"
                />
              </div>
            </div>
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
//****************************************************************************************************************/

setInterval(function() {
  console.log(getDateTime());
  var dt = getDateTime();
  ref
    .collection("announcements")
    .where("announcementType", "==", "TVannouncement")
    .where("expiresAt", "<=", dt)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
        console.log("delete " + doc.data().announcementCaption);
      });
    });
}, 1000);

function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (month.toString().length == 1) {
    month = "0" + month;
  }
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  if (hour.toString().length == 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length == 1) {
    minute = "0" + minute;
  }
  if (second.toString().length == 1) {
    second = "0" + second;
  }
  var dateTime = year + month + day + hour + minute;
  return parseInt(dateTime);
}

function dateAndTimeVal(date, time) {
  var fTime = time != "" ? time : "0000";

  if (date == "" && time == "") {
    return "NaN";
  } else {
    return parseInt(date.split("-").join("") + time.replace(":", ""));
  }
}
