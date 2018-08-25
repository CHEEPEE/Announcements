function manageAnnouncements() {
  ReactDOM.render(
    <div className = "row m-3">
      <div className="col-sm-7 mt-3">
        <div className="row">
          <h3 className="text-dark">Announcements</h3>
        </div>
        <AnnouncementsComtainer/>
      </div>
      <div className="col-sm-5 mt-3" id = "funtionContainer">
        <AddAnnouncements/>
      
      </div>
    </div>,
    document.querySelector("#mainContainer")
  );
}

class AnnouncementsComtainer extends React.Component {
    state = {  }
    getAnnouncements(){
        ref.collection("announcements").onSnapshot(function(querySnapshot) {
            let categoryObjects = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
               
                var details = doc.data().announcementDetails;
                console.log(details);
                let repdetails = details;
                let obj = {key:doc.data().key, announcementCaption:doc.data().announcementCaption, announcementDetails: repdetails};
                categoryObjects.push(obj);
            });

            var listItem = categoryObjects.map((object)=>
            <AnnouncementItem key = {object.key} id={object.key} caption = {object.announcementCaption} des = {object.announcementDetails}/>
            );
            ReactDOM.render(
              <React.Fragment>{listItem}</React.Fragment>,document.querySelector("#announcementsList")
            );
        });
    }
    componentDidMount(){
        this.getAnnouncements();
    }
    render() { 
        return (  
            <div className = "row">
                <div className="list-group w-100 mr-4" id = "announcementsList">

                </div>
           </div>
        );
    }
}

class AnnouncementItem extends React.Component {
    state = {  }
    render() { 
        return ( 
        <div className="list-group-item p-3 text-dark w-100 bg-white shadow-sm border-0 mt-3 list-group-item-action flex-column align-items-start">
            <div className = "row font-weight-bold text-info pl-3">
               <div className = "col-sm-12">
                <small>Caption</small>
               </div>
               <div className = "col-sm-12">
               <h5>{this.props.caption}</h5>
               </div>
            </div>
            <div className = "row pl-3">
              <div className = "col-sm-12">
                <small className = "text-info">Announcement</small>
              </div>
              <div className = "col-sm-12">
              
                {this.props.des}
              
              </div>
            </div>
        </div>
         );
    }
}
 


class AddAnnouncements extends React.Component {
    getCategories(){
        ref.collection("announcementCategory").onSnapshot(function(querySnapshot) {
            let categoryObjects = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                categoryObjects.push(doc.data());
            });

            var listItem = categoryObjects.map((object)=>
            <OptionItem key = {object.key} id={object.key} value = {object.key} name = {object.categoryName}/>
            );
            ReactDOM.render(
              <React.Fragment>{listItem}</React.Fragment>,document.querySelector("#categoryOptions")
            );
        });
    }
    saveAnnouncements(){
        let announcementCaption = $("#announcementCaption").val();
        let announcementDetails = $("#announcementDetails").val();
        let details = announcementDetails;
        let categoryOptions = $("#categoryOptions").val();
        let pushKey = ref.collection("announcements").doc().id;
        ref.collection("announcements").doc(pushKey).set({
            key: pushKey,
            announcementCaption: announcementCaption,
            announcementDetails: details,
            categoryOptions:categoryOptions,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
            $("#announcementCaption").val("");
            $("#announcementDetails").val("");
        
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });


    }
    componentDidMount() {
      this.getCategories();
    }
    render() { 
        return (
            <React.Fragment>
                <div className="row pr-5">
                <h3 className="text-dark">Add Announcements</h3>
                </div>
                <div className="row pr-5  mt-3">
                <div className="form-group w-100">
                    <label className = "text-secondary" for="exampleInputEmail1">Annoucement Caption</label>
                    <input
                    type="email"
                    className="form-control border-0 bg-light"
                    id="announcementCaption"
                    aria-describedby="emailHelp"
                    placeholder="Caption"
                    />
                </div>
                </div>
                <div className="row pr-5  mt-3">
                <div className="form-group w-100">
                    <label className = "text-secondary" for="exampleInputEmail1">Annoucement Description</label>
                    <textarea
                    className="form-control border-0 bg-light"
                    id="announcementDetails"
                    placeholder="Description"
                    rows="7"
                    />
                </div>
                </div>
                <div className = "row pr-5  mt-3">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
                    </div>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
                        <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                    </div>
                    </div>
                </div>
                <div className = "row pr-5  mt-3">
                    <img id = "imageToUpload"/>
                </div>
                <div className="row pr-5 mt-3">
                <div class="form-group w-100">
                    <label for="exampleFormControlSelect1">Category Select</label>
                    <select class="form-control w-100" id="categoryOptions">
                    </select>
                </div>
                </div>
                
                <div className="row pr-5">
                <button type="submit" onClick = {this.saveAnnouncements.bind(this)} class="btn btn-dark w-100">Add Annoucement</button>
                </div>

            </React.Fragment>
         );
    }
}
manageAnnouncements();

class OptionItem extends React.Component {
    state = {  }
    render() { 
        return ( 
        <option value = {this.props.value}>
            {this.props.name}
        </option>
         );
    }
}
