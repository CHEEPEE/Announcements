class OptionItem extends React.Component {
    state = {};
    render() {
      return <option value={this.props.value}>{this.props.name}</option>;
    }
}

class SliderOptions extends React.Component {
  state = {};
  componentDidMount() {
      this.getCategories();
    $("#SliderOptions").modal("toggle");
    document.body.onkeyup = function(e) {
      if (e.keyCode == 32) {
        //your code
        $("#SliderOptions").modal("toggle");
      }
    };
  }
  getTVAnnouncements(){
      let categoryOptions = $("#categoryOptions").val();
      let interval = $("#sliderInterval").val();
      $("#SliderOptions").modal("toggle");
      ReactDOM.render(<Carousel key = {categoryOptions+interval} interval = {interval*1000} categoryId = {categoryOptions} />, document.querySelector("#app"));
  }

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
  render() {
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="SliderOptions"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Slider Options
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row p-3">
                  <select class="form-control" id = "categoryOptions">
                    <option>Select Slider Category</option>
                  </select>
                </div>
                <div className = "row p-3">
                  <label for="exampleInputEmail1">Slider Interval (Seconds)</label>
                  <input type="number" defaultValue = {60} class="form-control" id="sliderInterval" aria-describedby="emailHelp" placeholder="Slider Interval (Seconds)"/>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" onClick = {this.getTVAnnouncements.bind(this)} className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<SliderOptions />, document.querySelector("#options"));
class Carousel extends React.Component {
  state = {
    interval:this.props.interval
  };

  announcementGet(){
    let sup = this;
    ref
      .collection("announcements")
      .where("announcementType", "==", "TVannouncement")
      .where("categoryOptions","==",this.props.categoryId)
      .orderBy("timestamp")
      .get().then(function(querySnapshot) {
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
            imagePath: doc.data().imagePath
          };
          categoryObjects.push(obj);
        });
        categoryObjects.reverse();
        var listItem = categoryObjects.map(function(object, index) {
          let active = "";
          if (index == 0) {
            active = "active";
          }
          return (
            <CarouselItem
              key={object.key+index}
              id={object.key}
              caption={object.announcementCaption}
              des={object.announcementDetails}
              imagePath={object.imagePath}
              active={active}
              indx = {index}
            />
          );
        });
        ReactDOM.render(
          <React.Fragment>{listItem}</React.Fragment>,
          document.querySelector("#carItems")
        );
       
        $(".carousel").carousel({
          interval: sup.state.interval,
          keyboard:true,
          pause:false
        });
      });

  }

  getTVAnnouncements() {
    let sup = this;
    ref
      .collection("announcements")
      .where("announcementType", "==", "TVannouncement")
      .where("categoryOptions","==",this.props.categoryId)
      .orderBy("timestamp")
      .onSnapshot(function(querySnapshot) {
        sup.announcementGet();
      });
  }

  componentDidMount() {
    this.getTVAnnouncements();
  }
  render() {
    return (
      <React.Fragment>
        <div
          id="carouselExampleFade"
          className="carousel slide h-100 w-100"
          data-ride="carousel"
        >
          <div className="carousel-inner h-100 w-100" id="carItems" />
        </div>
      </React.Fragment>
    );
  }
}

class CarouselItem extends React.Component {
  state = {
    active: this.props.indx == 0?"h-100 w-100 bg-white carousel-item active":"h-100 w-100 bg-white carousel-item "
  };
  render() {
    return (
      <div
        className={this.state.active}
        style={{
          backgroundImage: "url(" + this.props.imagePath + ")",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="container-fluid p-5 ">
          <div className="row">
            <h1 className="text-dark text-capitalize font-weight-bold announcement-title">
              {this.props.caption}
            </h1>
          </div>
          <div className="row">
            {/* <div className="announcement-des">{this.props.des}</div> */}
            <textarea
              className="form-control announcement-des border-0 bg-transparent"
              disabled
              defaultValue = {this.props.des}
              rows="22"
            />
          </div>
        </div>
      </div>
    );
  }
}

setInterval(function(){
    console.log(getDateTime());
    var dt = getDateTime();
    ref
      .collection("announcements")
      .where("announcementType", "==", "TVannouncement")
      .where("expiresAt", "<=", dt)
      .get().then(function(querySnapshot){
       
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
          console.log("delete "+doc.data().announcementCaption);
  
        });
      });
  }, 1000)
  
  function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   
    var dateTime = year+month+day+hour+minute;
     return parseInt(dateTime);
  }


