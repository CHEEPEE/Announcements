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
        ref.collection("announcements").orderBy("timestamp").onSnapshot(function(querySnapshot) {
            let categoryObjects = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
               
                var details = doc.data().announcementDetails;
                console.log(details);
                let repdetails = details;
                let obj = {key:doc.data().key, announcementCaption:doc.data().announcementCaption, announcementDetails: repdetails , imagePath:doc.data().imagePath};
                categoryObjects.push(obj);
            });
            categoryObjects.reverse();
            var listItem = categoryObjects.map((object)=>
            <AnnouncementItem key = {object.key} id={object.key} caption = {object.announcementCaption} des = {object.announcementDetails} imagePath = {object.imagePath}/>
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
        <div className="list-group-item text-dark w-100 bg-white shadow-sm border-0 mt-3 list-group-item-action flex-column align-items-start">
            <div className = "row font-weight-bold text-info pl-3">
               <div className = "col-sm-12">
                <small>Caption</small>
               </div>
               <div className = "col-sm-12">
               <h5>{this.props.caption}</h5>
               </div>
            </div>
         
                <div className = "col">
                <img className = "img-fluid w-100" style = {{height:'auto'}} src = {this.props.imagePath} />
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
    state = {
        imagePath:"",
        loadingState:""
    }
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
        let imagePath = this.state.imagePath;
        let sup = this;
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
            imagePath:imagePath,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
            $("#announcementCaption").val("");
            $("#announcementDetails").val("");
            sup.setState({
                imagePath:"",
                loadingState:""
            })    
        
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });


    }
    componentDidMount() {
      this.getCategories();
    }
    onfileSelect(){
        const superb = this;
        const storageRef = firebase.storage().ref();
        const file = $('#inputGroupFileUpdate').get(0).files[0];
        const name = (+new Date()) + '-' + file.name;
        const metadata = { contentType: file.type };
        const task = storageRef.child("announcementsImages").child(name).put(file, metadata);
        task.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            superb.setState({
                loadingState:'Upload is ' + progress + '% done'
            })
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                superb.setState({
                    imagePath:downloadURL,
                    filename:name
                });
              console.log('File available at', downloadURL);
            });
          });
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
                        <input type="file" class="custom-file-input" id="inputGroupFileUpdate" onChange = {this
                        .onfileSelect.bind(this)} aria-describedby="inputGroupFileAddon01"/>
                        <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                    </div>
                    </div>
                </div>
                <div className = "row pr-5  mt-3">
                  <div className = "col-sm-12">
                  <img className = "w-100" id = "imageToUpload" src ={this.state.imagePath} />
                  </div>
                </div>
                <div className = "row">
                    {this.state.loadingState}
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
